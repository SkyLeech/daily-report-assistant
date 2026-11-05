"use client";

import { Button, Chip, TextArea, toast } from "@heroui/react";
import { Braces, ChevronDown, RotateCcw, Settings2, Sparkles } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { saveTemplateAction } from "@/app/daily-report/actions";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { cn } from "@/lib/cn";
import {
  DEFAULT_REPORT_TEMPLATE,
  TEMPLATE_VARIABLES,
} from "@/lib/report-template";

type TemplateEditorProps = {
  template: string;
};

export function TemplateEditor({ template }: TemplateEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(template);
  const [selection, setSelection] = useState({ start: template.length, end: template.length });
  const [state, formAction, isPending] = useActionState(
    saveTemplateAction,
    INITIAL_ACTION_STATE,
  );
  const handledState = useRef(0);

  useEffect(() => {
    if (!state.at || state.at === handledState.current) {
      return;
    }

    handledState.current = state.at;

    if (state.status === "success") {
      toast.success("模板已保存", { description: state.message });
    } else if (state.status === "error") {
      toast.danger("模板保存失败", { description: state.message });
    }
  }, [state]);

  function insertVariable(token: string) {
    const start = Math.min(selection.start, value.length);
    const end = Math.min(selection.end, value.length);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const prefix = before && !/\s$/.test(before) ? " " : "";
    const nextValue = `${before}${prefix}${token}${after}`;
    const nextCursor = start + prefix.length + token.length;

    setValue(nextValue);
    setSelection({ start: nextCursor, end: nextCursor });

    window.requestAnimationFrame(() => {
      const textarea = document.getElementById("report-template") as HTMLTextAreaElement | null;
      textarea?.focus();
      textarea?.setSelectionRange(nextCursor, nextCursor);
    });
  }

  const isDefault = value.trim() === DEFAULT_REPORT_TEMPLATE.trim();

  return (
    <section className="animate-rise stagger-3 overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-surface">
      <button
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-secondary/40 sm:px-6"
        type="button"
        onClick={() => setExpanded((open) => !open)}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-default-soft text-foreground/70">
          <Settings2 className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold tracking-tight">日报模板</span>
            <Chip color={isDefault ? "default" : "accent"} size="sm" variant="soft">
              {isDefault ? "默认格式" : "已自定义"}
            </Chip>
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            支持变量替换，改成你习惯的格式
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded ? (
        <div className="border-t border-border/60 px-5 py-5 sm:px-6">
          <form action={formAction} className="space-y-4">
            <TextArea
              aria-label="日报模板"
              className="min-h-[230px] w-full font-mono text-[13px] leading-6"
              id="report-template"
              name="template"
              rows={10}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onSelect={(event) => {
                const target = event.currentTarget;
                setSelection({
                  start: target.selectionStart ?? 0,
                  end: target.selectionEnd ?? 0,
                });
              }}
            />

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted">
                <Braces className="size-3.5" />
                点击插入变量
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_VARIABLES.map((variable) => (
                  <button
                    key={variable.token}
                    className="rounded-lg border border-border/70 bg-background-secondary px-2 py-1 font-mono text-[10px] text-foreground/70 transition-colors hover:border-accent/30 hover:bg-accent-soft hover:text-accent-soft-foreground"
                    title={variable.hint}
                    type="button"
                    onClick={() => insertVariable(variable.token)}
                  >
                    {variable.token}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background-secondary/60 px-3 py-2.5 text-[11px] leading-5 text-muted">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <p>
                列表变量会自动编号；没有内容时会显示「（暂无）」。未知变量会原样保留，方便你慢慢调整。
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
              <Button
                className="rounded-xl"
                size="sm"
                type="button"
                variant="tertiary"
                onPress={() => {
                  setValue(DEFAULT_REPORT_TEMPLATE);
                  setSelection({
                    start: DEFAULT_REPORT_TEMPLATE.length,
                    end: DEFAULT_REPORT_TEMPLATE.length,
                  });
                }}
              >
                <RotateCcw className="size-3.5" />
                恢复默认
              </Button>
              <Button
                className="rounded-xl px-4"
                isDisabled={!value.trim()}
                isPending={isPending}
                size="sm"
                type="submit"
              >
                保存模板
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
