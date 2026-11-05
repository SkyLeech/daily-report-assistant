import { addDays } from "@/lib/date";
import { getDb } from "@/lib/db";
import {
  DEFAULT_REPORT_TEMPLATE,
  renderReportTemplate,
} from "@/lib/report-template";

export type ReportItemKind = "completed" | "planned";

export type ReportItem = {
  id: string;
  date: string;
  kind: ReportItemKind;
  content: string;
  createdAt: string;
};

export type DailyReportData = {
  date: string;
  sourceDate: string;
  sourceIsRecent: boolean;
  template: string;
  completedToday: ReportItem[];
  plannedToday: ReportItem[];
  sourceCompleted: ReportItem[];
  content: string;
};

type ReportItemRow = {
  id: string;
  item_date: string;
  kind: string;
  content: string;
  created_at: string;
};

type SourceDateRow = {
  item_date: string;
};

type SettingRow = {
  value: string;
};

function isItemKind(value: string): value is ReportItemKind {
  return value === "completed" || value === "planned";
}

function mapItem(row: ReportItemRow): ReportItem | null {
  if (!isItemKind(row.kind)) {
    return null;
  }

  return {
    id: row.id,
    date: row.item_date,
    kind: row.kind,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function getDailyReportData(date: string): Promise<DailyReportData> {
  const db = await getDb();

  const [dayRowsResult, sourceDateRow, templateRow] = await Promise.all([
    db
      .prepare(
        `SELECT id, item_date, kind, content, created_at
         FROM report_items
         WHERE item_date = ?
         ORDER BY CASE kind WHEN 'completed' THEN 0 ELSE 1 END, sort_order, created_at`,
      )
      .bind(date)
      .all<ReportItemRow>(),
    db
      .prepare(
        `SELECT item_date
         FROM report_items
         WHERE kind = 'completed' AND item_date < ?
         GROUP BY item_date
         ORDER BY item_date DESC
         LIMIT 1`,
      )
      .bind(date)
      .first<SourceDateRow>(),
    db
      .prepare("SELECT value FROM app_settings WHERE key = 'report_template'")
      .first<SettingRow>(),
  ]);

  const sourceDate = sourceDateRow?.item_date ?? addDays(date, -1);

  const sourceRowsResult = await db
    .prepare(
      `SELECT id, item_date, kind, content, created_at
       FROM report_items
       WHERE item_date = ? AND kind = 'completed'
       ORDER BY sort_order, created_at`,
    )
    .bind(sourceDate)
    .all<ReportItemRow>();

  const dayItems = dayRowsResult.results
    .map(mapItem)
    .filter((item): item is ReportItem => item !== null);

  const sourceCompleted = sourceRowsResult.results
    .map(mapItem)
    .filter((item): item is ReportItem => item !== null);

  const completedToday = dayItems.filter((item) => item.kind === "completed");
  const plannedToday = dayItems.filter((item) => item.kind === "planned");
  const template = templateRow?.value || DEFAULT_REPORT_TEMPLATE;

  return {
    date,
    sourceDate,
    sourceIsRecent: sourceDate !== addDays(date, -1),
    template,
    completedToday,
    plannedToday,
    sourceCompleted,
    content: renderReportTemplate(template, {
      date,
      sourceDate,
      completed: sourceCompleted.map((item) => item.content),
      planned: plannedToday.map((item) => item.content),
    }),
  };
}
