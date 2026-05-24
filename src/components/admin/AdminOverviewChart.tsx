type OverviewMetric = {
  label: string;
  value: number;
};

export default function AdminOverviewChart({
  metrics,
}: {
  metrics: OverviewMetric[];
}) {
  const maxValue = Math.max(...metrics.map((metric) => metric.value), 1);

  return (
    <div className="grid min-h-72 w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric) => {
        const height = Math.max((metric.value / maxValue) * 100, 8);

        return (
          <div
            key={metric.label}
            className="flex min-h-64 flex-col justify-end rounded-md border bg-muted/30 p-3"
          >
            <div className="flex flex-1 items-end">
              <div
                className="w-full rounded-md bg-indigo-500 transition-all"
                style={{ height: `${height}%` }}
              />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {metric.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
