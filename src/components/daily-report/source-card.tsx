import { Link } from "@heroui/react";
import { ArrowUpRight, CheckCircle2, History, PenLine } from "lucide-react";

import { formatDateWithWeekday, formatMonthDay } from "@/lib/date";
import type { DailyReportData } from "@/lib/daily-report";

export function SourceCard({ data }: { data: DailyReportData }) {
  const hasItems = data.sourceCompleted.length > 0;

  return (
    <section className="animate-rise stagger-3 rounded-3xl border border-border/70 bg-surface p-5 shadow-surface sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success-soft-foreground">
          <History className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight">昨日已完成</h2>
            <Link
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent-soft-foreground hover:underline"
              href={`/daily-report?date=${data.sourceDate}`}
            >
              去编辑
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            来自 {formatDateWithWeekday(data.sourceDate)}
            {data.sourceIsRecent ? " · 最近有记录的日期" : ""}
          </p>
        </div>
      </div>

      {data.sourceIsRecent ? (
        <p className="mt-3 rounded-xl border border-warning/20 bg-warning-soft px-3 py-2 text-[11px] leading-5 text-warning-soft-foreground">
          昨天没有完成记录，已自动向前找到最近一次有记录的工作日。
        </p>
      ) : null}

      {hasItems ? (
        <ol className="mt-4 space-y-1">
          {data.sourceCompleted.map((item, index) => (
            <li
              key={item.id}
              className="flex items-start gap-2.5 rounded-xl px-1 py-2 text-sm leading-6"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-[11px] font-semibold text-success-soft-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 break-words text-foreground/85">{item.content}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-background-secondary/45 px-4 py-6 text-center">
          <CheckCircle2 className="mx-auto size-5 text-muted" />
          <p className="mt-2 text-sm font-medium text-foreground/75">这一天还没有完成记录</p>
          <p className="mt-1 text-xs text-muted">
            去 {formatMonthDay(data.sourceDate)} 补一条，日报会自动更新。
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1.5 text-[11px] font-medium text-accent-soft-foreground transition-colors hover:bg-accent-soft-hover"
            href={`/daily-report?date=${data.sourceDate}`}
          >
            <PenLine className="size-3" />
            去记录
          </Link>
        </div>
      )}

      <p className="mt-4 border-t border-border/60 pt-3 text-[11px] leading-5 text-muted">
        这些完成事项会作为「昨日已完成」进入上面的日报预览。
      </p>
    </section>
  );
}
