import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import AnimatedGradientText from "../ui/animated-gradient-text";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-start px-6 transition-all xl:px-[15%]">
      <div className="flex w-full flex-col items-center pt-24 text-center">
        <div className="z-10 mb-5 flex items-center justify-center md:mb-10">
          <AnimatedGradientText>
            <Sparkles className="ml-1 h-3.5 w-3.5 text-indigo-500" />
            <span
              className={cn(
                "ml-2 inline animate-gradient bg-gradient-to-r from-[#ff8c00] via-[#6b23b4] to-[#ff8c00] bg-[length:var(--bg-size)_100%] bg-clip-text text-xs font-medium text-transparent md:text-sm"
              )}
            >
              Introducing ProductPilot
            </span>
            <ChevronRight className="ml-1 size-3 transition-all duration-300 ease-in-out group-hover:translate-x-0.5 will-change-transform" />
          </AnimatedGradientText>
        </div>

        <h1 className="text-2xl font-medium tracking-tight transition-all min-[400px]:text-3xl min-[500px]:text-4xl min-[620px]:text-5xl md:max-w-2xl md:text-6xl lg:!leading-[3.75rem]">
          Your ultimate platform to <br /> discover new products
        </h1>

        <p className="mt-2 max-w-sm font-medium leading-6 text-foreground/70 transition-all md:mt-4 md:max-w-[26rem] md:text-lg">
          Discover, share, and discuss the latest products in tech and
          innovation.
        </p>

        <Link
          href="/products"
          className="group relative mt-10 flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-indigo-500 px-6 py-1.5 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 active:scale-90"
        >
          <span className="group relative z-10 flex items-center gap-2 transition-all md:text-lg">
            Discover
            <ArrowRight
              className="size-4 transition-all duration-500 group-hover:translate-x-1"
              strokeWidth={1}
            />
          </span>

          <div className="ease-&lsqb;cubic-bezier(0.19,1,0.22,1)&rsqb; absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
        </Link>
      </div>

      <div className="relative mt-5">
        <div className="gradient absolute inset-0 left-1/2 top-1/2 -z-10 h-3/4 w-full -translate-x-1/2 -translate-y-1/2 blur-[10rem]" />

        <div className="relative mx-auto mb-10 mt-12 max-w-5xl rounded-xl border border-neutral-300 bg-neutral-200/20 p-2 backdrop-blur-lg md:p-4 lg:rounded-[32px]">
          <div className="rounded-lg border border-neutral-300 bg-white p-2 lg:rounded-[24px]">
            <Image
              src="/product-pilot-hero.svg"
              alt="ProductPilot product discovery dashboard preview"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              className="rounded-lg lg:rounded-[20px]"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
