"use client";

import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import AnimatedGradientText from "../ui/animated-gradient-text";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <section
      className="bg-background text-foreground px-6 xl:px-[15%] flex flex-col items-center justify-start transition-all overflow-hidden"
    >
      <div className="pt-24 flex flex-col items-center w-full text-center">
        {/* Badge */}
        <Link href="/products" className="animate-appear z-10 mb-5 md:mb-10 flex items-center justify-center">
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
        </Link>

        {/* Title */}
        <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-2xl min-[400px]:text-3xl min-[500px]:text-4xl min-[620px]:text-5xl md:text-6xl md:max-w-2xl lg:!leading-[3.75rem] font-medium tracking-tight text-transparent drop-shadow-2xl transition-all">
          Your ultimate platform to <br /> discover new products
        </h1>

        {/* Description */}
        <p className="text-md relative z-10 max-w-sm md:max-w-[26rem] md:text-lg text-muted-foreground font-medium leading-6 transition-all mt-2 md:mt-4 animate-appear opacity-0 delay-100">
          Discover, share, and discuss the latest products in tech and
          innovation.
        </p>

        {/* Actions */}
        <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300 mt-10">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 font-medium px-6 py-2 h-auto text-base md:text-lg" asChild>
            <Link href="/products">
              Discover
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Image with Glow */}
        <div className="relative mt-5 w-full max-w-5xl">
          <MockupFrame
            className="animate-appear opacity-0 delay-700 mx-auto max-w-5xl rounded-xl lg:rounded-[32px] border border-neutral-200/50 backdrop-blur-lg border-neutral-300 bg-neutral-200/20 mt-12 mb-10 p-2 md:p-4"
          >
            <Mockup type="responsive" className="rounded-lg lg:rounded-[24px] border p-2 border-neutral-300 bg-white shadow-none">
              <Image
                src="/product-pilot-hero.svg"
                alt="ProductPilot product discovery dashboard preview"
                width={1920}
                height={1080}
                priority
                className="rounded-lg lg:rounded-[20px]"
                draggable={false}
              />
            </Mockup>
          </MockupFrame>
          <Glow
            variant="top"
            className="animate-appear-zoom opacity-0 delay-1000"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

