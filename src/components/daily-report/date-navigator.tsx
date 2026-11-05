"use client";

import { Button, Tooltip } from "@heroui/react";
import { CalendarDays, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { addDays, formatWeekday, isValidDateString } from "@/lib/date";

type DateNavigatorProps = {
  date: string;
  today: string;
};

export function DateNavigator({ date, today }: DateNavigatorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isToday = date === today;

  function navigate(nextDate: string) {
    if (!isValidDateString(nextDate) || nextDate === date) {
      return;
    }

    startTransition(() => {
      router.push(`/daily-report?date=${nextDate}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
      <div className="flex items-center gap-1 rounded-2xl border border-border/80 bg-surface p-1.5 shadow-surface">
        <Tooltip delay={300}>
          <Button
            isIconOnly
            aria-label="前一天"
            className="size-9 rounded-xl"
            variant="tertiary"
            onPress={() => navigate(addDays(date, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Tooltip.Content>前一天</Tooltip.Content>
        </Tooltip>

        <label className="flex items-center gap-2 px-1.5">
          <CalendarDays className="size-4 shrink-0 text-muted" />
          <input
            aria-label="选择日报日期"
            className="w-[118px] cursor-pointer bg-transparent text-sm font-semibold tracking-tight outline-none"
            type="date"
            value={date}
            onChange={(event) => navigate(event.target.value)}
          />
          <span className="hidden min-w-8 text-xs text-muted sm:inline">
            {isPending ? <LoaderCircle className="size-3.5 animate-spin" /> : formatWeekday(date)}
          </span>
        </label>

        <Tooltip delay={300}>
          <Button
            isIconOnly
            aria-label="后一天"
            className="size-9 rounded-xl"
            variant="tertiary"
            onPress={() => navigate(addDays(date, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Tooltip.Content>后一天</Tooltip.Content>
        </Tooltip>
      </div>

      {!isToday ? (
        <Button
          className="rounded-full"
          size="sm"
          variant="tertiary"
          onPress={() => navigate(today)}
        >
          回到今天
        </Button>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-soft px-3 py-1.5 text-[11px] font-medium text-success-soft-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          今天
        </span>
      )}
    </div>
  );
}
