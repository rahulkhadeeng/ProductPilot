"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 15,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-2xl border bg-background",
                  "shadow-lg shadow-primary/5",
                  "max-w-xs w-full"
                )}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-3 mt-5">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium leading-5">
                      {testimonial.name}
                    </p>

                    <p className="text-sm text-muted-foreground leading-5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};