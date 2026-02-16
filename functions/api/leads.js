const ALLOWED_EMPLOYEE_BANDS = new Set([
  "0-5",
  "5-10",
  "11-25",
  "26-50",
  "51-100",
  "101-250",
  "251+",
]);

const MAX_BODY_BYTES = 4096;
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

function normalizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeText(value, MAX_EMAIL_LENGTH).toLowerCase();
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
  const limiter = context.env.LEADS_RATE_LIMITER;
  if (!limiter || typeof limiter.limit !== "function") {
    return true;
  }

  const key = clientIp || "unknown";
  try {
    const result = await limiter.limit({ key: `lead:${key}` });
    return result && result.success !== false;
  } catch {
    return true;
  }
}

async function insertLead(context, lead) {
  if (!context.env.LEADS_DB) {
    return { ok: false, id: null };
  }

  const statement = context.env.LEADS_DB.prepare(
    "INSERT INTO leads (name, email, employee_band, source_path, created_at) VALUES (?1, ?2, ?3, ?4, datetime('now'))"
  );

  const result = await statement
    .bind(lead.name, lead.email, lead.employeeBand, lead.sourcePath)
    .run();
  const leadId = result && result.meta && result.meta.last_row_id ? result.meta.last_row_id : null;
  return { ok: true, id: leadId };
}

async function forwardLead(context, lead, leadId) {
  const webhookUrl = context.env.GOOGLE_SHEETS_WEBHOOK_URL || context.env.LEADS_WEBHOOK_URL || "";
  if (!webhookUrl) {
    return { attempted: false, ok: false, status: 0 };
  }

  const secret = context.env.LEADS_WEBHOOK_SECRET || "";
  const payload = {
    webhook_secret: secret,
    lead_id: leadId,
    name: lead.name,
    email: lead.email,
    employee_band: lead.employeeBand,
    source_path: lead.sourcePath,
    received_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify(payload),
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
      // Non-JSON responses are treated as successful if HTTP status is OK.
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

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  const honeypot = normalizeText(payload.website, 120);
  if (honeypot) {
    return json({ ok: true }, 202);
  }

  const name = normalizeText(payload.name, MAX_NAME_LENGTH);
  const email = normalizeEmail(payload.email);
  const employeeBand = normalizeText(payload.employee_band, 20);
  const sourcePath = normalizeText(payload.source_path || "/", MAX_SOURCE_PATH_LENGTH);
  const turnstileToken = normalizeText(payload.turnstile_token || "", 4096);

  if (!name || !isValidEmail(email) || !ALLOWED_EMPLOYEE_BANDS.has(employeeBand) || !isValidSourcePath(sourcePath)) {
    return json({ error: "Invalid form fields." }, 422);
  }

  const turnstileOk = await verifyTurnstile(context, turnstileToken, clientIp);
  if (!turnstileOk) {
    return json({ error: "Verification failed." }, 403);
  }

  const leadPayload = { name, email, employeeBand, sourcePath };
  const inserted = await insertLead(context, leadPayload);
  if (!inserted.ok) {
    const forwardedWithoutDb = await forwardLead(context, leadPayload, null);
    if (forwardedWithoutDb.ok) {
      return json({ ok: true, forwarded: true }, 200);
    }

    if (context.env.ALLOW_SIMULATED_LEADS === "true") {
      return json({ ok: true, simulated: true }, 200);
    }

    return json({ error: "Lead capture is unavailable." }, 503);
  }

  const forwarded = await forwardLead(context, leadPayload, inserted.id);
  if (forwarded.attempted && !forwarded.ok) {
    console.error(`Lead webhook forward failed with status ${forwarded.status}`);
  }

  return json({ ok: true }, 200);
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
