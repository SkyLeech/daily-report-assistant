"use client";

import { Button } from "@heroui/react";
import { Database, RotateCcw, Terminal } from "lucide-react";

export default function DailyReportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger-soft-foreground">
        <Database className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">数据库还没有准备好</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        第一次运行需要初始化 Cloudflare D1。先在项目目录执行本地迁移，然后再试一次。
      </p>

      <div className="mt-5 w-full rounded-2xl border border-border/70 bg-surface p-4 text-left shadow-surface">
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted">
          <Terminal className="size-3.5" />
          本地初始化
        </div>
        <code className="mt-2 block overflow-x-auto rounded-xl bg-background-secondary px-3 py-2.5 font-mono text-xs text-foreground/85">
          npm run db:migrate:local
        </code>
        <p className="mt-2 text-[11px] leading-5 text-muted">
          部署到 Cloudflare 后，还需要执行远程迁移：
          <code className="mx-1 rounded bg-background-secondary px-1.5 py-0.5 font-mono text-[10px]">
            npm run db:migrate:remote
          </code>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button className="rounded-xl" onPress={reset}>
          <RotateCcw className="size-4" />
          重试
        </Button>
        <Button
          className="rounded-xl"
          variant="tertiary"
          onPress={() => window.location.reload()}
        >
          刷新页面
        </Button>
      </div>

      {error.message ? (
        <details className="mt-8 w-full text-left">
          <summary className="cursor-pointer text-[11px] text-muted">技术细节</summary>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-border/60 bg-surface p-3 text-left font-mono text-[10px] leading-5 whitespace-pre-wrap text-muted">
            {error.message}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
