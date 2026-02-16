const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const PROJECT_NAME = process.env.CF_PAGES_PROJECT_NAME || "zachday-site";
const LOG_PATH = process.env.LEADS_ROTATION_LOG || path.join("ops", "secret-rotation.log");

function quoteCmdArg(value) {
  if (/^[A-Za-z0-9_./:=-]+$/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

function spawnNpx(args, extra = {}) {
  const base = {
    encoding: "utf8",
    cwd: process.cwd(),
    ...extra,
  };

  if (process.platform === "win32") {
    const command = `npx ${args.map(quoteCmdArg).join(" ")}`;
    return spawnSync("cmd.exe", ["/d", "/s", "/c", command], base);
  }

  return spawnSync("npx", args, base);
}

function parseArgs(argv) {
  const out = {
    apply: false,
    secret: "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--apply") {
      out.apply = true;
      continue;
    }

    if (token === "--secret") {
      const maybeValue = argv[i + 1] || "";
      if (!maybeValue) {
        throw new Error("--secret requires a value");
      }
      out.secret = maybeValue;
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return out;
}

function generateSecret() {
  return crypto.randomBytes(48).toString("base64url");
}

function upsertPagesSecret(secret) {
  const args = [
    "wrangler",
    "pages",
    "secret",
    "put",
    "LEADS_WEBHOOK_SECRET",
    "--project-name",
    PROJECT_NAME,
  ];

  const result = spawnNpx(args, {
    input: `${secret}\n`,
  });

  if (result.error) {
    throw new Error(`Unable to run Wrangler secret update: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    const stdout = (result.stdout || "").trim();
    const errorText = stderr || stdout || "unknown error";
    throw new Error(`Cloudflare secret update failed: ${errorText}`);
  }
}

function appendRotationLog(projectName, secret) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    project: projectName,
    key: "LEADS_WEBHOOK_SECRET",
    secret_sha256: crypto.createHash("sha256").update(secret).digest("hex"),
  });

  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, `${line}\n`);
}

function main() {
  const args = parseArgs(process.argv);
  const secret = args.secret || generateSecret();

  if (args.apply) {
    upsertPagesSecret(secret);
    appendRotationLog(PROJECT_NAME, secret);
    console.log(`[ops:rotate:webhook] updated LEADS_WEBHOOK_SECRET in Pages project "${PROJECT_NAME}"`);
  } else {
    console.log("[ops:rotate:webhook] dry-run only (use --apply to update Cloudflare)");
  }

  console.log("[ops:rotate:webhook] copy this value into Apps Script property LEADS_WEBHOOK_SECRET:");
  console.log(secret);
}

try {
  main();
} catch (err) {
  console.error(`[ops:rotate:webhook] failed: ${err.message}`);
  process.exit(1);
}
