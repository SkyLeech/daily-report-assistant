import type { Metadata, Viewport } from "next";

import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Toolbox · 日报助手",
    template: "%s · Toolbox",
  },
  description: "个人效率工具集：记录每天完成的事，第二天一键复制日报。",
  applicationName: "Toolbox",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#16181f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
