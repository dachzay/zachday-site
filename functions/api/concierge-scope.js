const ALLOWED_EMPLOYEE_BANDS = new Set([
  "0-5",
  "5-10",
  "11-25",
  "26-50",
  "51-100",
  "101-250",
  "251+",
]);

const ALLOWED_TRANSCRIPT_ROLES = new Set(["user", "assistant"]);
const MAX_BODY_BYTES = 16384;
const MAX_SESSION_ID_LENGTH = 64;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_PATH_LENGTH = 120;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function normalizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeText(value, MAX_EMAIL_LENGTH).toLowerCase();
}

function getClientIp(request) {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) {
    return cfIp;
  }

  const xff = request.headers.get("x-forwarded-for");
  if (!xff) {
    return "";
  }
  return xff.split(",")[0].trim();
}

function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const requestUrl = new URL(request.url);
    return new URL(origin).origin === requestUrl.origin;
  } catch {
    return false;
  }
}

function getUtf8Size(value) {
  return new TextEncoder().encode(value).length;
}

function isValidEmail(email) {
  if (email.length < 5 || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSourcePath(value) {
  if (!value) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  if (value.length > MAX_SOURCE_PATH_LENGTH) {
    return false;
  }

  return value.startsWith("/");
}

function normalizeTranscript(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 40)
    .map((line) => {
      const role = normalizeText(line && line.role, 20);
      const text = normalizeText(line && line.text, 500);
      return { role, text };
    })
    .filter((line) => ALLOWED_TRANSCRIPT_ROLES.has(line.role) && line.text.length > 0);
}

async function verifyTurnstile(context, token, clientIp) {
  const secret = context.env.TURNSTILE_SECRET;
  if (!secret) {
    return true;
  }

  if (!token || typeof token !== "string") {
    return false;
  }

  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (clientIp) {
      form.set("remoteip", clientIp);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data && data.success === true;
  } catch {
    return false;
  }
}

async function checkRateLimit(context, clientIp) {
  const limiter = context.env.CONCIERGE_RATE_LIMITER || context.env.LEADS_RATE_LIMITER;
  if (!limiter || typeof limiter.limit !== "function") {
    return true;
  }

  const key = clientIp || "unknown";
  try {
    const result = await limiter.limit({ key: `concierge:${key}` });
    return result && result.success !== false;
  } catch {
    return true;
  }
}

async function insertScope(context, payload) {
  if (!context.env.LEADS_DB) {
    return { ok: false, id: null };
  }

  const statement = context.env.LEADS_DB.prepare(
    `INSERT INTO concierge_scopes (
      session_id,
      name,
      email,
      employee_band,
      business_type,
      primary_bottleneck,
      current_tools,
      timeline,
      budget_band,
      notes,
      transcript_json,
      source_path,
      created_at
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, datetime('now'))`
  );

  const result = await statement
    .bind(
      payload.sessionId,
      payload.name,
      payload.email,
      payload.employeeBand,
      payload.businessType,
      payload.primaryBottleneck,
      payload.currentTools,
      payload.timeline,
      payload.budgetBand,
      payload.notes,
      payload.transcriptJson,
      payload.sourcePath
    )
    .run();

  const scopeId = result && result.meta && result.meta.last_row_id ? result.meta.last_row_id : null;
  return { ok: true, id: scopeId };
}

async function forwardScope(context, payload, scopeId) {
  const webhookUrl = context.env.GOOGLE_SHEETS_WEBHOOK_URL || context.env.LEADS_WEBHOOK_URL || "";
  if (!webhookUrl) {
    return { attempted: false, ok: false, status: 0 };
  }

  const secret = context.env.LEADS_WEBHOOK_SECRET || "";
  const body = {
    event_type: "concierge_scope",
    webhook_secret: secret,
    scope_id: scopeId,
    session_id: payload.sessionId,
    source_path: payload.sourcePath,
    name: payload.name,
    email: payload.email,
    employee_band: payload.employeeBand,
    business_type: payload.businessType,
    primary_bottleneck: payload.primaryBottleneck,
    current_tools: payload.currentTools,
    timeline: payload.timeline,
    budget_band: payload.budgetBand,
    notes: payload.notes,
    transcript_json: payload.transcriptJson,
    received_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return { attempted: true, ok: false, status: response.status };
    }

    try {
      const parsed = await response.json();
      if (parsed && parsed.ok === false) {
        return { attempted: true, ok: false, status: response.status };
      }
    } catch {
      // Non-JSON responses are allowed when HTTP status is OK.
    }

    return { attempted: true, ok: true, status: response.status };
  } catch {
    return { attempted: true, ok: false, status: 0 };
  }
}

async function handlePost(context) {
  const request = context.request;

  const rawContentLength = request.headers.get("content-length");
  const contentLength = Number(rawContentLength || "0");
  if (rawContentLength && Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: "Request too large." }, 413);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "Unsupported content type." }, 415);
  }

  if (!isSameOrigin(request)) {
    return json({ error: "Invalid origin." }, 403);
  }

  const clientIp = getClientIp(request);
  const withinRateLimit = await checkRateLimit(context, clientIp);
  if (!withinRateLimit) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  let rawBody;
  try {
    rawBody = await request.text();
  } catch {
    return json({ error: "Invalid request payload." }, 400);
  }

  if (getUtf8Size(rawBody) > MAX_BODY_BYTES) {
    return json({ error: "Request too large." }, 413);
  }

  let requestBody;
  try {
    requestBody = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  const payload = {
    sessionId: normalizeText(requestBody.session_id, MAX_SESSION_ID_LENGTH),
    sourcePath: normalizeText(requestBody.source_path || "/", MAX_SOURCE_PATH_LENGTH),
    name: normalizeText(requestBody.name, MAX_NAME_LENGTH),
    email: normalizeEmail(requestBody.email),
    employeeBand: normalizeText(requestBody.employee_band, 20),
    businessType: normalizeText(requestBody.business_type, 80),
    primaryBottleneck: normalizeText(requestBody.primary_bottleneck, 160),
    currentTools: normalizeText(requestBody.current_tools, 240),
    timeline: normalizeText(requestBody.timeline, 40),
    budgetBand: normalizeText(requestBody.budget_band, 40),
    notes: normalizeText(requestBody.notes, 1000),
    transcriptJson: JSON.stringify(normalizeTranscript(requestBody.transcript)),
    turnstileToken: normalizeText(requestBody.turnstile_token || "", 4096),
  };

  if (
    !payload.sessionId ||
    !payload.name ||
    !isValidEmail(payload.email) ||
    !ALLOWED_EMPLOYEE_BANDS.has(payload.employeeBand) ||
    !payload.businessType ||
    !payload.primaryBottleneck ||
    !payload.currentTools ||
    !payload.timeline ||
    !payload.budgetBand ||
    !isValidSourcePath(payload.sourcePath)
  ) {
    return json({ error: "Invalid form fields." }, 422);
  }

  const transcript = JSON.parse(payload.transcriptJson);
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return json({ error: "Transcript is required." }, 422);
  }

  const turnstileOk = await verifyTurnstile(context, payload.turnstileToken, clientIp);
  if (!turnstileOk) {
    return json({ error: "Verification failed." }, 403);
  }

  const inserted = await insertScope(context, payload);
  if (!inserted.ok) {
    if (context.env.ALLOW_SIMULATED_LEADS === "true") {
      return json({ ok: true, scope_id: null, simulated: true, forwarded: false }, 200);
    }
    return json({ error: "Scope capture is unavailable." }, 503);
  }

  const forwarded = await forwardScope(context, payload, inserted.id);
  if (forwarded.attempted && !forwarded.ok) {
    console.error(`Concierge scope webhook forward failed with status ${forwarded.status}`);
  }

  return json({ ok: true, scope_id: inserted.id, forwarded: forwarded.ok === true }, 200);
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return handlePost(context);
  }

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "POST, OPTIONS",
      },
    });
  }

  return json({ error: "Method not allowed." }, 405, {
    Allow: "POST, OPTIONS",
  });
}
