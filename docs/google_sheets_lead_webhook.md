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

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("LEADS_WEBHOOK_SECRET");

    if (!expectedSecret || payload.webhook_secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "Sheet not found" });
    }

    const now = new Date();
    sheet.appendRow([
      now.toISOString(),
      payload.lead_id || "",
      payload.name || "",
      payload.email || "",
      payload.employee_band || "",
      payload.source_path || "",
      "New",
      "",
      "",
      ""
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
```

## 2) Set Script Secret

1. In Apps Script: `Project Settings -> Script properties`.
2. Add:
- Key: `LEADS_WEBHOOK_SECRET`
- Value: a long random string.

## 3) Deploy as Web App

1. Click `Deploy -> New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and copy the `Web app URL`.

## 4) Configure Cloudflare Pages Variables

In your Pages project environment variables/secrets:
- `GOOGLE_SHEETS_WEBHOOK_URL` = Apps Script web app URL
- `LEADS_WEBHOOK_SECRET` = same value as Script property

## 5) Sheet Columns (recommended)

Use row 1 headers:
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

## 6) Verify

Submit a lead form on your site and confirm a new row appears in the sheet.
