const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { execSync } = require("child_process");

const DB_NAME = process.env.LEADS_DB_NAME || "LEADS-DB";
const BACKUP_DIR = process.env.LEADS_BACKUP_DIR || path.join("ops", "backups");
const RETENTION_DAYS = Number(process.env.LEADS_BACKUP_RETENTION_DAYS || "14");
const DRY_RUN =
  process.argv.includes("--dry-run") || process.env.LEADS_BACKUP_DRY_RUN === "true";

if (!Number.isFinite(RETENTION_DAYS) || RETENTION_DAYS < 1) {
  console.error("LEADS_BACKUP_RETENTION_DAYS must be a number >= 1.");
  process.exit(1);
}

function timestampForFile(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function runWranglerExport(outputPath) {
  if (DRY_RUN) {
    fs.writeFileSync(
      outputPath,
      `-- dry-run backup for ${DB_NAME} at ${new Date().toISOString()}\n`
    );
    return;
  }

  const command = `npx wrangler d1 export "${DB_NAME}" --remote --output "${outputPath}"`;
  try {
    execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    const stderr = String((err && err.stderr) || "").trim();
    const stdout = String((err && err.stdout) || "").trim();
    const errorText = stderr || stdout || "unknown error";
    throw new Error(`Wrangler export failed: ${errorText}`);
  }
}

function gzipFile(inputPath, outputPath) {
  const raw = fs.readFileSync(inputPath);
  const gz = zlib.gzipSync(raw, { level: zlib.constants.Z_BEST_COMPRESSION });
  fs.writeFileSync(outputPath, gz);
}

function writeMetadata(filePath, bytes) {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  const metaPath = `${filePath}.meta.json`;
  const metadata = {
    db: DB_NAME,
    backup_file: path.basename(filePath),
    bytes,
    sha256: hash,
    created_at: new Date().toISOString(),
    retention_days: RETENTION_DAYS,
  };
  fs.writeFileSync(metaPath, `${JSON.stringify(metadata, null, 2)}\n`);
}

function pruneBackups(nowMs) {
  const cutoffMs = nowMs - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });

  let pruned = 0;
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const fullPath = path.join(BACKUP_DIR, entry.name);
    const stat = fs.statSync(fullPath);
    if (stat.mtimeMs >= cutoffMs) {
      continue;
    }

    fs.rmSync(fullPath, { force: true });
    pruned += 1;
  }

  return pruned;
}

function main() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const now = new Date();
  const stamp = timestampForFile(now);
  const sqlPath = path.join(BACKUP_DIR, `${DB_NAME}-${stamp}.sql`);
  const gzPath = `${sqlPath}.gz`;

  console.log(`[ops:backup] exporting ${DB_NAME} to ${sqlPath}`);
  runWranglerExport(sqlPath);

  gzipFile(sqlPath, gzPath);
  fs.rmSync(sqlPath, { force: true });

  const size = fs.statSync(gzPath).size;
  writeMetadata(gzPath, size);
  const pruned = pruneBackups(now.getTime());

  console.log(`[ops:backup] wrote ${gzPath} (${size} bytes)`);
  console.log(`[ops:backup] pruned ${pruned} old backup file(s)`);
}

try {
  main();
} catch (err) {
  console.error(`[ops:backup] failed: ${err.message}`);
  process.exit(1);
}
