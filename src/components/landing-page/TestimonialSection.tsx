"use client";

import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";

const testimonials = [
  {
    text: "ProductPilot helped me discover high-quality products much faster than browsing manually.",
    image: "https://avatar.vercel.sh/jack",
    name: "Jack",
    role: "Indie Hacker",
  },
  {
    text: "The UI feels incredibly polished and the product discovery workflow is smooth.",
    image: "https://avatar.vercel.sh/jill",
    name: "Jill",
    role: "Product Designer",
  },
  {
    text: "I found multiple tools for my startup within minutes using ProductPilot.",
    image: "https://avatar.vercel.sh/john",
    name: "John",
    role: "Startup Founder",
  },
  {
    text: "Clean design, fast experience, and genuinely useful recommendations.",
    image: "https://avatar.vercel.sh/jane",
    name: "Jane",
    role: "Frontend Developer",
  },
  {
    text: "This platform makes discovering new SaaS products actually enjoyable.",
    image: "https://avatar.vercel.sh/jenny",
    name: "Jenny",
    role: "Tech Creator",
  },
  {
    text: "ProductPilot saved me hours while researching tools for my workflow.",
    image: "https://avatar.vercel.sh/james",
    name: "James",
    role: "Freelancer",
  },
  {
    text: "The animations and overall UX make the site feel premium.",
    image: "https://avatar.vercel.sh/mike",
    name: "Mike",
    role: "UI Engineer",
  },
  {
    text: "One of the cleanest product showcase platforms I’ve used recently.",
    image: "https://avatar.vercel.sh/emma",
    name: "Emma",
    role: "Product Manager",
  },
  {
    text: "Excellent experience for discovering trending developer tools.",
    image: "https://avatar.vercel.sh/david",
    name: "David",
    role: "Software Engineer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialSection = () => {
  return (
    <section className="site-container-wide my-32 relative overflow-hidden">
      <div className="mx-auto text-center max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-medium mt-6"
        >
          What people are saying
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-muted-foreground mt-4 max-w-md mx-auto"
        >
          Discover how ProductPilot helps creators and innovators shine.
          Here&apos;s what real users are saying about us.
        </motion.p>
      </div>

      <div className="flex justify-center gap-4 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[400px] overflow-hidden">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />

        <TestimonialsColumn
          testimonials={secondColumn}
          duration={18}
          className="hidden md:block"
        />

        <TestimonialsColumn
          testimonials={thirdColumn}
          duration={20}
          className="hidden lg:block"
        />
      </div>
    </section>
  );
};

export default TestimonialSection;