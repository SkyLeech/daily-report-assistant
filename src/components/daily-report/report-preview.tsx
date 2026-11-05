import { Chip, Link } from "@heroui/react";
import { ArrowUpRight, FileText, Sparkles } from "lucide-react";

import { CopyReportButton } from "@/components/daily-report/copy-report-button";
import { formatDateWithWeekday, formatMonthDay } from "@/lib/date";
import type { DailyReportData } from "@/lib/daily-report";

export function ReportPreview({ data }: { data: DailyReportData }) {
  const total = data.sourceCompleted.length + data.plannedToday.length;

  return (
    <section className="animate-rise overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-surface">
      <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
              <FileText className="size-4" />
            </span>
            <h2 className="text-base font-semibold tracking-tight">日报预览</h2>
            <Chip color="accent" size="sm" variant="soft">
              <Sparkles className="size-3" />
              自动生成
            </Chip>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            发送日期 {formatDateWithWeekday(data.date)} · 完成事项来自{" "}
            {formatMonthDay(data.sourceDate)}
          </p>
        </div>
        <CopyReportButton compact content={data.content} />
      </div>

      <div className="p-3 sm:p-5">
        <div className="report-paper relative overflow-hidden rounded-2xl border border-border/65 px-5 py-5 sm:px-7 sm:py-6">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,var(--accent),color-mix(in_oklch,var(--accent)_30%,transparent))]" />
          <div className="mb-4 flex items-center justify-between gap-3 text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
            <span>Work Report</span>
            <span className="tracking-normal">{formatDateWithWeekday(data.date)}</span>
          </div>
          <pre className="min-h-[220px] whitespace-pre-wrap break-words font-sans text-[15px] leading-8 text-foreground/90">
            {data.content}
          </pre>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-[11px] text-muted">
            <span>共 {total} 条内容</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              Toolbox
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pb-5 text-[11px] text-muted sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" />
          昨日已完成 {data.sourceCompleted.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent" />
          今日计划 {data.plannedToday.length}
        </span>
        <Link
          className="ms-auto inline-flex items-center gap-0.5 text-[11px] font-medium text-accent-soft-foreground hover:underline"
          href={`/daily-report?date=${data.sourceDate}`}
        >
          查看来源
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </section>
  );
}
