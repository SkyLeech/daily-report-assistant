import { CalendarCheck2, ClipboardList, ListTodo, PenLine } from "lucide-react";

import { CopyReportButton } from "@/components/daily-report/copy-report-button";
import { DateNavigator } from "@/components/daily-report/date-navigator";
import { QuickRecord } from "@/components/daily-report/quick-record";
import { ReportPreview } from "@/components/daily-report/report-preview";
import { SourceCard } from "@/components/daily-report/source-card";
import { TemplateEditor } from "@/components/daily-report/template-editor";
import { cn } from "@/lib/cn";
import { formatMonthDay, todayInShanghai } from "@/lib/date";
import type { DailyReportData } from "@/lib/daily-report";

type StatCardProps = {
  label: string;
  value: number;
  detail: string;
  tone: "accent" | "success" | "warning";
  icon: typeof CalendarCheck2;
  delay?: string;
};

const toneStyles = {
  accent: {
    icon: "bg-accent-soft text-accent-soft-foreground",
    value: "text-foreground",
    dot: "bg-accent",
  },
  success: {
    icon: "bg-success-soft text-success-soft-foreground",
    value: "text-foreground",
    dot: "bg-success",
  },
  warning: {
    icon: "bg-warning-soft text-warning-soft-foreground",
    value: "text-foreground",
    dot: "bg-warning",
  },
} as const;

function StatCard({ label, value, detail, tone, icon: Icon, delay }: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "animate-rise flex items-center gap-3 rounded-2xl border border-border/65 bg-surface/85 px-4 py-3 backdrop-blur-sm",
        delay,
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", styles.icon)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted uppercase">
          <span className={cn("size-1.5 rounded-full", styles.dot)} />
          {label}
        </p>
        <p className={cn("mt-0.5 text-lg leading-6 font-semibold tracking-tight", styles.value)}>
          {value}
          <span className="ms-1 text-[11px] font-normal text-muted">条</span>
        </p>
      </div>
      <span className="ms-auto hidden text-right text-[10px] leading-4 text-muted sm:block">
        {detail}
      </span>
    </div>
  );
}

export function DailyReportView({ data }: { data: DailyReportData }) {
  const today = todayInShanghai();
  const isToday = data.date === today;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <header className="animate-rise">
        <div className="flex flex-col gap-6 min-[1360px]:flex-row min-[1360px]:items-end min-[1360px]:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-muted uppercase">
              <span className="brand-gradient size-2 rounded-full" />
              Daily Report
            </div>
            <h1 className="mt-3 text-[31px] leading-tight font-semibold tracking-[-0.035em] sm:text-[38px]">
              日报助手
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              记录今天完成的事，明天一键复制。今日计划会直接进入今天的日报。
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <DateNavigator date={data.date} today={today} />
            <CopyReportButton content={data.content} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/70 px-2.5 py-1">
            <CalendarCheck2 className="size-3" />
            {isToday ? "今天" : "历史日期"} · {formatMonthDay(data.date)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/70 px-2.5 py-1">
            <PenLine className="size-3" />
            完成事项会自动滚入明日日报
          </span>
        </div>
      </header>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <StatCard
          delay="stagger-1"
          detail={formatMonthDay(data.sourceDate)}
          icon={CalendarCheck2}
          label="昨日已完成"
          tone="success"
          value={data.sourceCompleted.length}
        />
        <StatCard
          delay="stagger-2"
          detail={formatMonthDay(data.date)}
          icon={ListTodo}
          label="当日计划"
          tone="accent"
          value={data.plannedToday.length}
        />
        <StatCard
          delay="stagger-3"
          detail="明天自动带入"
          icon={ClipboardList}
          label="当日完成"
          tone="warning"
          value={data.completedToday.length}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,1fr)]">
        <div className="space-y-6">
          <ReportPreview data={data} />
          <TemplateEditor template={data.template} />
        </div>
        <div className="space-y-6">
          <QuickRecord
            completedItems={data.completedToday}
            date={data.date}
            plannedItems={data.plannedToday}
          />
          <SourceCard data={data} />
        </div>
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-[10px] text-muted">
        <span>Toolbox · 个人效率工具集</span>
        <span>数据存储在 Cloudflare D1 · 仅自己使用</span>
      </footer>
    </div>
  );
}
