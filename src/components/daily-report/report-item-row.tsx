"use client";

import { Button, Input, toast } from "@heroui/react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";

import { deleteItemAction, updateItemAction } from "@/app/daily-report/actions";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import type { ReportItem } from "@/lib/daily-report";

type ReportItemRowProps = {
  item: ReportItem;
  index: number;
};

export function ReportItemRow({ item, index }: ReportItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const state = await updateItemAction(INITIAL_ACTION_STATE, formData);

      if (state.status === "success") {
        setIsEditing(false);
        toast.success("已更新", { description: state.message });
      } else if (state.status === "error") {
        toast.danger("更新失败", { description: state.message });
      }
    });
  }

  if (isEditing) {
    return (
      <li className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent-soft/35 px-2 py-2">
        <span className="mt-2 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent-soft-foreground">
          {index + 1}
        </span>
        <form className="flex min-w-0 flex-1 items-start gap-1.5" onSubmit={handleUpdate}>
          <input name="id" type="hidden" value={item.id} />
          <Input
            autoFocus
            aria-label="编辑事项"
            className="min-w-0 flex-1"
            defaultValue={item.content}
            maxLength={300}
            name="content"
          />
          <Button
            isIconOnly
            aria-label="保存修改"
            className="size-9 shrink-0 rounded-xl"
            isPending={isPending}
            type="submit"
          >
            <Check className="size-4" />
          </Button>
          <Button
            isIconOnly
            aria-label="取消编辑"
            className="size-9 shrink-0 rounded-xl"
            type="button"
            variant="tertiary"
            onPress={() => setIsEditing(false)}
          >
            <X className="size-4" />
          </Button>
        </form>
      </li>
    );
  }

  return (
    <li className="group flex items-start gap-2 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-border/70 hover:bg-surface-secondary/70">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-default-soft text-[11px] font-semibold text-muted">
        {index + 1}
      </span>
      <p className="min-w-0 flex-1 text-sm leading-6 break-words text-foreground/90">
        {item.content}
      </p>
      <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button
          isIconOnly
          aria-label="编辑这条记录"
          className="size-8 rounded-lg"
          variant="tertiary"
          onPress={() => setIsEditing(true)}
        >
          <Pencil className="size-3.5" />
        </Button>
        <form action={deleteItemAction}>
          <input name="id" type="hidden" value={item.id} />
          <Button
            isIconOnly
            aria-label="删除这条记录"
            className="size-8 rounded-lg text-muted hover:text-danger"
            type="submit"
            variant="tertiary"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </form>
      </div>
    </li>
  );
}
