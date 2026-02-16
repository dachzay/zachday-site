const http = require("http");
const https = require("https");
const { execSync } = require("child_process");

const HEALTHCHECK_URL = process.env.LEADS_HEALTHCHECK_URL || "https://zachday.xyz/api/leads";
const DB_NAME = process.env.LEADS_DB_NAME || "LEADS-DB";
const TIMEOUT_MS = Number(process.env.LEADS_HEALTH_TIMEOUT_MS || "10000");
const SKIP_HTTP = process.env.LEADS_HEALTH_SKIP_HTTP === "true";
const SKIP_DB = process.env.LEADS_HEALTH_SKIP_DB === "true";
const SKIP_TLS_VERIFY = process.env.LEADS_HEALTH_SKIP_TLS_VERIFY === "true";

if (!Number.isFinite(TIMEOUT_MS) || TIMEOUT_MS < 1000) {
  console.error("LEADS_HEALTH_TIMEOUT_MS must be a number >= 1000.");
  process.exit(1);
}

function requestOptions(urlString) {
  const url = new URL(urlString);
  const client = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "OPTIONS",
        headers: {
          "user-agent": "website-ops-healthcheck/1.0",
        },
        rejectUnauthorized: !SKIP_TLS_VERIFY,
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode || 0,
            allow: String(res.headers.allow || ""),
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      }
    );

    req.on("timeout", () => req.destroy(new Error("HTTP timeout")));
    req.on("error", reject);
    req.end();
  });
}

function runDbCheck() {
  const command = `npx wrangler d1 execute "${DB_NAME}" --remote --command "SELECT COUNT(*) AS lead_count FROM leads;" --json`;
  let output = "";

  try {
    output = execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    const stderr = String((err && err.stderr) || "").trim();
    const stdout = String((err && err.stdout) || "").trim();
    const errorText = stderr || stdout || "unknown error";
    throw new Error(`D1 query failed: ${errorText}`);
  }

  const trimmed = output.trim();
  if (!trimmed) {
    return { leadCount: null };
  }

  let leadCount = null;
  try {
    const parsed = JSON.parse(trimmed);
    const firstRow =
      Array.isArray(parsed) &&
      parsed[0] &&
      Array.isArray(parsed[0].results) &&
      parsed[0].results[0]
        ? parsed[0].results[0]
        : null;

    if (firstRow && Object.prototype.hasOwnProperty.call(firstRow, "lead_count")) {
      const numeric = Number(firstRow.lead_count);
      leadCount = Number.isFinite(numeric) ? numeric : null;
    }
  } catch {
    // Keep health checks resilient across Wrangler JSON shape changes.
  }

  return { leadCount };
}

async function main() {
  console.log("[ops:health] running checks...");

  if (!SKIP_HTTP) {
    const httpResult = await requestOptions(HEALTHCHECK_URL);
    const allowHasPost = httpResult.allow.toUpperCase().includes("POST");
    const httpOk = httpResult.statusCode === 204 && allowHasPost;

    if (!httpOk) {
      throw new Error(
        `HTTP check failed for ${HEALTHCHECK_URL} (status=${httpResult.statusCode}, allow="${httpResult.allow}")`
      );
    }

    console.log(`[ops:health] HTTP ok (${HEALTHCHECK_URL})`);
  } else {
    console.log("[ops:health] HTTP check skipped");
  }

  if (!SKIP_DB) {
    const dbResult = runDbCheck();
    if (dbResult.leadCount === null) {
      console.log(`[ops:health] D1 query ok (${DB_NAME})`);
    } else {
      console.log(`[ops:health] D1 query ok (${DB_NAME}), lead_count=${dbResult.leadCount}`);
    }
  } else {
    console.log("[ops:health] DB check skipped");
  }

  console.log("[ops:health] all checks passed");
}

main().catch((err) => {
  console.error(`[ops:health] failed: ${err.message}`);
  process.exit(1);
});
