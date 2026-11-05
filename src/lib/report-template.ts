import { formatDateCN, formatWeekday } from "@/lib/date";

export const DEFAULT_REPORT_TEMPLATE = `昨日已完成：
{{completed}}

今日计划：
{{planned}}`;

export const TEMPLATE_VARIABLES = [
  { token: "{{completed}}", label: "已完成列表", hint: "自动编号的完成事项" },
  { token: "{{planned}}", label: "计划列表", hint: "自动编号的计划事项" },
  { token: "{{completed_plain}}", label: "已完成（短横线）", hint: "用 - 开头的列表" },
  { token: "{{planned_plain}}", label: "计划（短横线）", hint: "用 - 开头的列表" },
  { token: "{{date}}", label: "日期", hint: "例如 2026-11-05" },
  { token: "{{date_cn}}", label: "中文日期", hint: "例如 2026年11月5日" },
  { token: "{{weekday}}", label: "星期", hint: "例如 周四" },
  { token: "{{source_date}}", label: "完成事项来源日期", hint: "通常是昨天" },
  { token: "{{completed_count}}", label: "完成数量", hint: "完成事项的条数" },
  { token: "{{planned_count}}", label: "计划数量", hint: "计划事项的条数" },
] as const;

export type ReportTemplateContext = {
  date: string;
  sourceDate: string;
  completed: string[];
  planned: string[];
};

function renderNumbered(items: string[]): string {
  if (items.length === 0) {
    return "（暂无）";
  }

  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function renderBulleted(items: string[]): string {
  if (items.length === 0) {
    return "（暂无）";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function renderReportTemplate(template: string, context: ReportTemplateContext): string {
  const replacements: Record<string, string> = {
    date: context.date,
    date_cn: formatDateCN(context.date),
    weekday: formatWeekday(context.date),
    source_date: context.sourceDate,
    completed: renderNumbered(context.completed),
    planned: renderNumbered(context.planned),
    completed_plain: renderBulleted(context.completed),
    planned_plain: renderBulleted(context.planned),
    completed_count: String(context.completed.length),
    planned_count: String(context.planned.length),
  };

  return template
    .replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, token: string) => replacements[token] ?? match)
    .trim();
}
