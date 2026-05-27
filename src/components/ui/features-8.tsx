import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  info: string;
  pattern?: number[][];
};

type FeaturesProps = {
  title?: ReactNode;
  description?: ReactNode;
  features?: FeatureItem[];
};

export function Features({ title, description, features = [] }: FeaturesProps) {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 lg:max-w-5xl">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mt-6 text-3xl font-medium transition-all min-[420px]:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="relative mt-16">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={`${feature.title}-${index}`}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureItem;
  index: number;
}) {
  const Icon = feature.icon;
  const isWide = index === 3 || index === 4;

  return (
    <Card
      className={cn(
        "relative col-span-full overflow-hidden",
        isWide ? "lg:col-span-3" : "sm:col-span-3 lg:col-span-2"
      )}
    >
      <CardContent
        className={cn(
          "relative z-10 flex h-full flex-col justify-between gap-10 pt-6",
          isWide && "sm:grid sm:grid-cols-2 sm:gap-6"
        )}
      >
        <div className="relative z-10 flex flex-col justify-between space-y-10 lg:space-y-6">
          <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
            <Icon className="m-auto size-5" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-800 transition dark:text-white">
              {feature.title}
            </h3>
            <p className="text-foreground/75">{feature.info}</p>
          </div>
        </div>

        {isWide ? (
          <ChartAccent index={index} />
        ) : (
          <PatternAccent pattern={feature.pattern} />
        )}
      </CardContent>
    </Card>
  );
}

function PatternAccent({ pattern }: { pattern?: number[][] }) {
  const squares =
    pattern ??
    [
      [7, 1],
      [8, 3],
      [9, 2],
      [10, 5],
      [7, 6],
    ];
  const patternId = `feature-pattern-${squares
    .map(([x, y]) => `${x}-${y}`)
    .join("-")}`;

  return (
    <div className="pointer-events-none absolute right-0 top-0 h-full w-2/3 opacity-70 [mask-image:linear-gradient(90deg,transparent,white)]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full fill-black/10 stroke-black/10 dark:fill-white/10 dark:stroke-white/10"
      >
        <defs>
          <pattern
            id={patternId}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            x="-12"
            y="4"
          >
            <path d="M.5 20V.5H20" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        {squares.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            width="21"
            height="21"
            x={x * 20}
            y={y * 20}
            strokeWidth="0"
          />
        ))}
      </svg>
    </div>
  );
}

function ChartAccent({ index }: { index: number }) {
  const path =
    index % 2 === 0
      ? "M1 126C31 86 53 100 78 75C107 47 126 105 154 80C183 54 205 120 235 85C267 47 288 78 312 56C337 33 355 68 365 44"
      : "M1 110C36 58 64 86 92 52C125 12 142 94 172 66C205 34 226 104 255 73C284 42 306 50 330 27C347 12 359 37 365 24";

  return (
    <div className="relative -mb-6 -mr-6 mt-6 h-fit overflow-hidden rounded-tl-[var(--radius)] border-l border-t p-6 sm:ml-6">
      <div className="absolute left-3 top-2 flex gap-1">
        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
      </div>
      <svg
        aria-hidden="true"
        className="w-full text-indigo-500/80 sm:w-[150%]"
        viewBox="0 0 366 160"
        fill="none"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          className="text-indigo-500/10"
          d={`${path}V160H1V${index % 2 === 0 ? "126" : "110"}Z`}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
