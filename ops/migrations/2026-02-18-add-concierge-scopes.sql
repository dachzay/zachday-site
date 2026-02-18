CREATE TABLE IF NOT EXISTS concierge_scopes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  employee_band TEXT NOT NULL,
  business_type TEXT NOT NULL,
  primary_bottleneck TEXT NOT NULL,
  current_tools TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget_band TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  transcript_json TEXT NOT NULL,
  source_path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_concierge_scopes_created_at ON concierge_scopes(created_at);
CREATE INDEX IF NOT EXISTS idx_concierge_scopes_source_path ON concierge_scopes(source_path);
CREATE INDEX IF NOT EXISTS idx_concierge_scopes_email ON concierge_scopes(email);
