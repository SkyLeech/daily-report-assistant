export function DailyReportSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="animate-pulse">
        <div className="h-2.5 w-28 rounded-full bg-default-soft" />
        <div className="mt-4 h-9 w-44 rounded-xl bg-default-soft" />
        <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-default-soft" />
        <div className="mt-6 flex gap-3">
          <div className="h-11 w-52 rounded-2xl bg-default-soft" />
          <div className="h-11 w-28 rounded-2xl bg-default-soft" />
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[70px] rounded-2xl border border-border/60 bg-surface/70" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,1fr)]">
          <div className="h-[460px] rounded-3xl border border-border/60 bg-surface/70" />
          <div className="h-[360px] rounded-3xl border border-border/60 bg-surface/70" />
        </div>
      </div>
    </div>
  );
}
