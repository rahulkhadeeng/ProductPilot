"use client";

import { ArrowRight } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const CtaSection = () => {
  return (
    <div className="site-container mb-40 flex flex-col items-center justify-center">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/60 py-20 text-center">

        {/* FLICKERING GRID */}
        <FlickeringGrid
          className="absolute inset-0 z-0"
          squareSize={3}
          gridGap={6}
          color="#6366f1"
          maxOpacity={0.35}
          flickerChance={0.05}
        />

        {/* BLUISH GRADIENT GLOW */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-72 bg-gradient-to-b from-indigo-500/20 via-blue-500/10 to-transparent" />

        {/* RADIAL LIGHT */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_65%)]" />

        {/* CONTENT */}
        <div className="relative z-20 flex flex-col items-center">
          <h2 className="text-3xl font-semibold tracking-tight transition-all min-[450px]:text-4xl sm:text-5xl">
            From Idea to Launch <br /> Faster Than Ever
          </h2>

          <p className="mx-auto mt-6 max-w-[21rem] text-sm text-muted-foreground transition-all sm:max-w-md sm:text-base">
            Launch and showcase incredible products effortlessly with our
            intuitive and user friendly platform.
          </p>

          <button className="group relative mt-10 flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-indigo-500 px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-indigo-400 active:scale-90">
            <span className="relative z-10 flex items-center gap-2 md:text-lg">
              Get Started
              <ArrowRight
                className="size-4 transition-all duration-500 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </span>

            {/* SHINE EFFECT */}
            <div className="absolute -left-[75px] -top-[50px] z-0 h-[155px] w-8 rotate-[35deg] bg-white/30 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:left-[120%]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
