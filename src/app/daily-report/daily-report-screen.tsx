import { connection } from "next/server";

import { DailyReportView } from "@/components/daily-report/daily-report-view";
import { isValidDateString, todayInShanghai } from "@/lib/date";
import { getDailyReportData } from "@/lib/daily-report";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function DailyReportScreen({ searchParams }: { searchParams: SearchParams }) {
  await connection();

  const params = await searchParams;
  const dateParam = Array.isArray(params.date) ? params.date[0] : params.date;
  const date = isValidDateString(dateParam) ? dateParam : todayInShanghai();
  const data = await getDailyReportData(date);

  return <DailyReportView data={data} />;
}
