import { Suspense } from "react";

import { DailyReportSkeleton } from "@/components/daily-report/daily-report-skeleton";
import { DailyReportScreen } from "./daily-report-screen";

type DailyReportPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DailyReportPage({ searchParams }: DailyReportPageProps) {
  return (
    <Suspense fallback={<DailyReportSkeleton />}>
      <DailyReportScreen searchParams={searchParams} />
    </Suspense>
  );
}
