"use client";

import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Tooltip delay={250}>
      <Button
        isIconOnly
        aria-label="切换深浅色主题"
        className="size-9 rounded-full"
        variant="tertiary"
        onPress={toggleTheme}
      >
        <Sun className="theme-icon-dark size-4" />
        <Moon className="theme-icon-light size-4" />
      </Button>
      <Tooltip.Content>切换深色 / 浅色</Tooltip.Content>
    </Tooltip>
  );
}
