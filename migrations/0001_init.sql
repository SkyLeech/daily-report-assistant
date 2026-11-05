-- 日报条目：按日期 + 类型存储
-- completed: 该日期完成的事项（会出现在下一天的「昨日已完成」）
-- planned:   该日期的计划事项（会出现在当天的「今日计划」）
CREATE TABLE IF NOT EXISTS report_items (
  id TEXT PRIMARY KEY,
  item_date TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('completed', 'planned')),
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_report_items_date_kind
  ON report_items (item_date, kind, sort_order);

CREATE INDEX IF NOT EXISTS idx_report_items_completed_dates
  ON report_items (kind, item_date DESC);

-- 轻量键值设置，例如日报模板
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
