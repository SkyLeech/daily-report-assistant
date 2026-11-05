"use client";

import { Button, Chip } from "@heroui/react";
import {
  FileText,
  FolderKanban,
  Menu,
  Sparkles,
  StickyNote,
  WandSparkles,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const activeTools = [
  {
    href: "/daily-report",
    label: "日报助手",
    description: "记录完成，一键复制",
    icon: FileText,
  },
];

const upcomingTools = [
  { label: "周报助手", icon: FolderKanban },
  { label: "素材速记", icon: StickyNote },
];

function Brand() {
  return (
    <Link className="group flex items-center gap-3" href="/daily-report">
      <div className="brand-gradient brand-glow flex size-10 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
        <Wrench className="size-[19px]" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold tracking-tight">Toolbox</p>
        <p className="truncate text-[11px] tracking-wide text-muted">个人效率工具集</p>
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-4 py-5">
      <Brand />

      <nav aria-label="工具导航" className="mt-9 flex flex-1 flex-col gap-7">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
            工具
          </p>
          <div className="space-y-1.5">
            {activeTools.map((tool) => {
              const isActive = pathname === tool.href || pathname.startsWith(`${tool.href}/`);
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-[0_10px_26px_-16px_var(--accent)]"
                      : "text-foreground/70 hover:bg-default-soft hover:text-foreground",
                  )}
                  href={tool.href}
                  onClick={onNavigate}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isActive ? "bg-white/16" : "bg-default-soft",
                    )}
                  >
                    <Icon className="size-[17px]" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{tool.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-[11px]",
                        isActive ? "text-accent-foreground/70" : "text-muted",
                      )}
                    >
                      {tool.description}
                    </span>
                  </span>
                  {isActive ? <span className="size-1.5 rounded-full bg-current" /> : null}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
            即将加入
          </p>
          <div className="space-y-1">
            {upcomingTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.label}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-foreground/45"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/80">
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="flex-1">{tool.label}</span>
                  <Chip className="h-5 px-2 text-[10px]" size="sm" variant="soft">
                    Soon
                  </Chip>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-surface-secondary/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
            <Sparkles className="size-3.5 text-accent" />
            今日工作流
          </div>
          <p className="mt-2 text-[12px] leading-5 text-muted">
            白天记录完成事项，明天直接复制日报。今日计划会立即出现在今天的预览里。
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-accent-soft-foreground">
            <WandSparkles className="size-3" />
            自动编号 · 自动拼装
          </div>
        </div>
      </nav>

      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <span className="size-1.5 rounded-full bg-success" />
          v0.1.0
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-dvh">
      <aside className="sidebar-surface fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-border/70 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="关闭导航"
            className="absolute inset-0 bg-backdrop/55 backdrop-blur-[2px]"
            type="button"
            onClick={() => setMobileOpen(false)}
          />
          <div className="sidebar-surface relative h-full w-[292px] max-w-[86vw] animate-rise border-r border-border/80 shadow-overlay">
            <Button
              isIconOnly
              aria-label="关闭导航"
              className="absolute end-3 top-4 z-10 size-8 rounded-full"
              variant="tertiary"
              onPress={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </Button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/78 px-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5">
            <Button
              isIconOnly
              aria-label="打开导航"
              className="size-9 rounded-full"
              variant="tertiary"
              onPress={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <Brand />
          </div>
          <ThemeToggle />
        </header>

        <main className="dashboard-canvas min-h-[calc(100dvh-4rem)] lg:min-h-dvh">{children}</main>
      </div>
    </div>
  );
}
