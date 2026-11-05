const SHANGHAI_TIME_ZONE = "Asia/Shanghai";
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function todayInShanghai(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHANGHAI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("无法计算当前日期");
  }

  return `${year}-${month}-${day}`;
}

export function addDays(date: string, amount: number): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + amount);
  return parsed.toISOString().slice(0, 10);
}

export function formatDateCN(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatMonthDay(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatWeekday(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "UTC",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatDateWithWeekday(date: string): string {
  return `${formatDateCN(date)} ${formatWeekday(date)}`;
}
