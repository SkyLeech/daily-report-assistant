"use client";

import { Button, Chip, Input, Label, Tabs, TextField, toast } from "@heroui/react";
import { Info, ListTodo, Plus, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { addItemAction } from "@/app/daily-report/actions";
import { ReportItemRow } from "@/components/daily-report/report-item-row";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { addDays, formatMonthDay } from "@/lib/date";
import type { ReportItem, ReportItemKind } from "@/lib/daily-report";

type QuickRecordProps = {
  date: string;
  completedItems: ReportItem[];
  plannedItems: ReportItem[];
};

export function QuickRecord({ date, completedItems, plannedItems }: QuickRecordProps) {
  const [kind, setKind] = useState<ReportItemKind>("completed");
  const [isPending, startTransition] = useTransition();

  const items = kind === "completed" ? completedItems : plannedItems;

  function changeKind(nextKind: string | number) {
    if (nextKind !== "completed" && nextKind !== "planned") {
      return;
    }

    setKind(nextKind);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const state = await addItemAction(INITIAL_ACTION_STATE, formData);

      if (state.status === "success") {
        form.reset();
        toast.success("已记录", { description: state.message });
      } else if (state.status === "error") {
        toast.danger("没有保存", { description: state.message });
      }
    });
  }

  return (
    <section className="animate-rise stagger-2 overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-surface">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-soft-foreground">
              <ListTodo className="size-[18px]" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight">快速记录</h2>
              <p className="mt-0.5 text-xs text-muted">
                {formatMonthDay(date)} · 一条一条积累
              </p>
            </div>
          </div>
          <Chip color="accent" size="sm" variant="soft">
            {items.length} 条
          </Chip>
        </div>

        <Tabs className="mt-5 w-full" selectedKey={kind} onSelectionChange={changeKind}>
          <Tabs.ListContainer className="rounded-none bg-transparent">
            <Tabs.List
              aria-label="记录类型"
              className="w-full rounded-xl border border-border/70 bg-background-secondary p-1"
            >
              <Tabs.Tab className="flex-1 rounded-lg text-xs font-medium" id="completed">
                完成事项
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab className="flex-1 rounded-lg text-xs font-medium" id="planned">
                计划事项
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-muted">
          {kind === "completed" ? (
            <>
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
              今天完成的事，会自动进入明天日报的「昨日已完成」。
            </>
          ) : (
            <>
              <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
              今天计划的事，会直接出现在今天日报的「今日计划」。
            </>
          )}
        </p>

        <form className="mt-3 flex items-start gap-2" onSubmit={handleSubmit}>
          <input name="date" type="hidden" value={date} />
          <input name="kind" type="hidden" value={kind} />
          <TextField key={kind} className="min-w-0 flex-1" name="content">
            <Label className="sr-only">记录内容</Label>
            <Input
              aria-label="记录内容"
              autoComplete="off"
              maxLength={300}
              placeholder={kind === "completed" ? "例如：完成日报助手页面开发" : "例如：补齐单元测试"}
            />
          </TextField>
          <Button
            className="h-10 shrink-0 rounded-xl px-4"
            isDisabled={isPending}
            isPending={isPending}
            type="submit"
          >
            <Plus className="size-4" />
            添加
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            {kind === "completed" ? "当日完成" : "当日计划"}
          </p>
          <span className="text-[11px] text-muted">{items.length} 条</span>
        </div>

        {items.length > 0 ? (
          <ul className="mt-1 space-y-0.5">
            {items.map((item, index) => (
              <ReportItemRow key={item.id} index={index} item={item} />
            ))}
          </ul>
        ) : (
          <div className="mt-2 rounded-2xl border border-dashed border-border/80 bg-background-secondary/45 px-4 py-7 text-center">
            <p className="text-sm font-medium text-foreground/75">
              {kind === "completed" ? "今天完成了什么？" : "今天打算做什么？"}
            </p>
            <p className="mt-1 text-xs text-muted">在上面记一条，之后就能一键生成。</p>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 border-t border-border/60 bg-background-secondary/55 px-5 py-3 text-[11px] leading-5 text-muted sm:px-6">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        {kind === "completed"
          ? `${formatMonthDay(addDays(date, 1))} 的日报会自动带上这些完成事项。`
          : `${formatMonthDay(date)} 的日报预览已经包含这些计划。`}
      </div>
    </section>
  );
}
