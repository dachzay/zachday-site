# Google Sheets Lead Webhook

Use this to push each lead from `/api/leads` into your sheet.

Target sheet:
- `https://docs.google.com/spreadsheets/d/1H-F6fqrgkGkhxOBK8Hm0rW5jCOVEHUqEGJiPaT6O6Ig/edit?gid=0#gid=0`

## 1) Add Apps Script to the Sheet

1. Open the sheet.
2. Go to `Extensions -> Apps Script`.
3. Replace code with:

```javascript
const SPREADSHEET_ID = "1H-F6fqrgkGkhxOBK8Hm0rW5jCOVEHUqEGJiPaT6O6Ig";
const SHEET_NAME = "Sheet1";
const SECRET_KEY = "LEADS_WEBHOOK_SECRET";
const DIGEST_RECIPIENT_KEY = "LEAD_DIGEST_EMAIL";
const STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  WON: "Won",
  LOST: "Lost"
};

const COL = {
  receivedAt: 1,
  leadId: 2,
  name: 3,
  email: 4,
  employeeBand: 5,
  sourcePath: 6,
  status: 7,
  owner: 8,
  nextAction: 9,
  notes: 10,
  firstResponseAt: 11,
  updatedAt: 12
};

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty(SECRET_KEY);

    if (!expectedSecret || payload.webhook_secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "Sheet not found" });
    }

    const nowIso = new Date().toISOString();
    // 12 columns (A-L) with workflow fields included.
    sheet.appendRow([
      nowIso,
      payload.lead_id || "",
      payload.name || "",
      payload.email || "",
      payload.employee_band || "",
      payload.source_path || "",
      STATUS.NEW,
      "",
      "",
      "",
      "",
      nowIso
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: "Bad request" });
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function onEdit(e) {
  if (!e || !e.range) {
    return;
  }

  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME || e.range.getRow() === 1) {
    return;
  }

  const row = e.range.getRow();
  const col = e.range.getColumn();
  const nowIso = new Date().toISOString();

  if (col === COL.status) {
    const currentStatus = String(e.value || "").trim();
    const firstResponseCell = sheet.getRange(row, COL.firstResponseAt);
    if (currentStatus === STATUS.CONTACTED && !firstResponseCell.getValue()) {
      firstResponseCell.setValue(nowIso);
    }
  }

  if (col >= COL.status && col <= COL.notes) {
    sheet.getRange(row, COL.updatedAt).setValue(nowIso);
  }
}

function sendDailyLeadDigest() {
  const recipient = PropertiesService.getScriptProperties().getProperty(DIGEST_RECIPIENT_KEY);
  if (!recipient) {
    return;
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    return;
  }

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return;
  }

  const actionable = values
    .slice(1)
    .filter((row) => {
      const status = String(row[COL.status - 1] || "").trim();
      return status === STATUS.NEW || status === STATUS.CONTACTED || status === STATUS.QUALIFIED;
    });

  if (actionable.length === 0) {
    return;
  }

  const lines = actionable.slice(0, 25).map((row) => {
    return [
      `Lead: ${row[COL.name - 1] || "(no name)"}`,
      `Email: ${row[COL.email - 1] || "(no email)"}`,
      `Employees: ${row[COL.employeeBand - 1] || "(n/a)"}`,
      `Status: ${row[COL.status - 1] || "(none)"}`,
      `Owner: ${row[COL.owner - 1] || "(unassigned)"}`,
      `Next Action: ${row[COL.nextAction - 1] || "(none)"}`,
      `Notes: ${row[COL.notes - 1] || "(none)"}`,
      `Received: ${row[COL.receivedAt - 1] || "(unknown)"}`,
      "---"
    ].join("\n");
  });

  const subject = `[Lead Digest] ${actionable.length} actionable lead(s)`;
  const body = [
    `Total actionable leads: ${actionable.length}`,
    "",
    lines.join("\n"),
    "",
    `Sheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`
  ].join("\n");

  MailApp.sendEmail(recipient, subject, body);
}
```

## 2) Set Script Secret

1. In Apps Script: `Project Settings -> Script properties`.
2. Add:
- Key: `LEADS_WEBHOOK_SECRET`
- Value: a long random string.
- Key: `LEAD_DIGEST_EMAIL`
- Value: the email that should receive daily lead summaries.

## 3) Deploy as Web App

1. Click `Deploy -> New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and copy the `Web app URL`.

## 4) Configure Triggers

1. In Apps Script click `Triggers` (clock icon).
2. Add trigger for `onEdit`:
- Event source: `From spreadsheet`
- Event type: `On edit`
3. Add trigger for `sendDailyLeadDigest`:
- Event source: `Time-driven`
- Type: `Day timer`
- Time: pick a local morning hour.

## 5) Configure Cloudflare Pages Variables

In your Pages project environment variables/secrets:
- `GOOGLE_SHEETS_WEBHOOK_URL` = Apps Script web app URL
- `LEADS_WEBHOOK_SECRET` = same value as Script property

## 6) Sheet Columns (recommended)

Use row 1 headers (A-L):
- `received_at`
- `lead_id`
- `name`
- `email`
- `employee_band`
- `source_path`
- `status`
- `owner`
- `next_action`
- `notes`
- `first_response_at`
- `updated_at`

## 7) Verify

Submit a lead form on your site and confirm a new row appears in the sheet.
