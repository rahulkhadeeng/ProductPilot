import React, { useId } from "react";
import {
  Rocket,
  Users,
  Star,
  MessageCircle,
  Globe,
  Shield,
  BarChart,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <div
      className="site-container-wide relative my-32 flex flex-col items-center justify-center"
    >
      {/* gradients */}
      {/* <div className="hidden md:block absolute top-0 -right-[30%] 2xl:-right-[40%] w-72 h-72 gradient rounded-full blur-[10rem] -z-10"></div> */}

      {/* <div className="hidden md:block absolute bottom-0 -left-[30%] 2xl:-left-[40%] w-72 h-72 gradient rounded-full blur-[10rem] -z-10"></div> */}

      {/* main section */}
      <div className="px-5">
        {/* heading */}
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl min-[420px]:text-4xl md:text-5xl font-medium mt-6 transition-all">
            Discover the features driving innovation
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md mx-auto">
            Explore the tools that make sharing, discovering, and celebrating
            innovative products easier than ever
          </p>
        </div>

        {/*  */}
        <div className="">
          <FeaturesGrid />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

function FeaturesGrid() {
  return (
    <div className="py-16 px-0 sm:px-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-3 max-w-6xl mx-auto transition-all">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden group"
          >
            <Grid size={20} pattern={feature.pattern} />

            <feature.icon className="mb-5 size-8 group-hover:scale-110 transition-all duration-300 will-change-transform transform" />

            <p className="text-lg font-semibold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.info}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [7, 1],
    [8, 3],
    [9, 2],
    [10, 5],
    [7, 6],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-100/30 to-zinc-300/30 dark:from-zinc-900/30 dark:to-zinc-900/30">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-black/10 stroke-black/10 dark:fill-white/10 dark:stroke-white/10"
        />
      </div>
    </div>
  );
};

type GridPatternProps = React.SVGProps<SVGSVGElement> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
};

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: GridPatternProps) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const features = [
  {
    icon: Rocket,
    title: "Launch Ready",
    info: "Effortlessly showcase your product and connect with early adopters.",
    pattern: [
      [7, 1],
      [8, 3],
      [9, 2],
      [10, 5],
      [7, 6],
    ],
  },
  {
    icon: Users,
    title: "Engaged Community",
    info: "Join a thriving community of product enthusiasts and creators.",
    pattern: [
      [8, 2],
      [10, 1],
      [7, 4],
      [9, 6],
      [10, 5],
    ],
  },
  {
    icon: Star,
    title: "Trending Insights",
    info: "Discover the hottest products and trends as they gain traction.",
    pattern: [
      [9, 1],
      [7, 3],
      [10, 2],
      [8, 5],
      [9, 6],
    ],
  },
  {
    icon: MessageCircle,
    title: "Interactive Discussions",
    info: "Encourage feedback and spark conversations with user comments.",
    pattern: [
      [10, 1],
      [8, 2],
      [7, 5],
      [9, 4],
      [10, 6],
    ],
  },
  {
    icon: Globe,
    title: "Global Reach",
    info: "Promote your product to a worldwide audience of potential users.",
    pattern: [
      [7, 2],
      [9, 1],
      [10, 4],
      [8, 6],
      [9, 5],
    ],
  },
  {
    icon: Shield,
    title: "Safe and Secure",
    info: "Experience a reliable and secure platform built for creators.",
    pattern: [
      [8, 1],
      [10, 3],
      [7, 6],
      [9, 2],
      [8, 5],
    ],
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    info: "Track product performance with detailed analytics and user metrics.",
    pattern: [
      [9, 3],
      [7, 1],
      [10, 6],
      [8, 4],
      [9, 5],
    ],
  },
  {
    icon: Rocket,
    title: "Early Feedback",
    info: "Gather actionable insights from early users to refine your product.",
    pattern: [
      [10, 2],
      [8, 6],
      [7, 3],
      [9, 1],
      [10, 5],
    ],
  },
];
