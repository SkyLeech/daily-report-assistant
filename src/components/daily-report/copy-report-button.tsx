"use client";

import { Button, toast } from "@heroui/react";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

type CopyReportButtonProps = {
  content: string;
  className?: string;
  compact?: boolean;
};

export function CopyReportButton({ content, className, compact = false }: CopyReportButtonProps) {
  const [state, setState] = useState<"idle" | "copying" | "copied">("idle");

  async function handleCopy() {
    if (state === "copying") {
      return;
    }

    setState("copying");

    try {
      await copyText(content);
      setState("copied");
      toast.success("日报已复制", {
        description: "去工作群粘贴就好，格式已经排好了。",
        timeout: 3200,
      });
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("idle");
      toast.danger("复制失败", {
        description: "浏览器没有授予剪贴板权限，请手动选中预览内容复制。",
      });
    }
  }

  const isCopied = state === "copied";
  const isCopying = state === "copying";

  return (
    <Button
      className={cn(
        "rounded-2xl font-medium shadow-[0_12px_28px_-18px_var(--accent)]",
        compact ? "h-9 px-3.5" : "h-11 px-5",
        className,
      )}
      isPending={isCopying}
      size={compact ? "sm" : "md"}
      onPress={handleCopy}
    >
      {({ isPending }) => (
        <>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isCopied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          {isCopied ? "已复制" : "复制日报"}
        </>
      )}
    </Button>
  );
}
