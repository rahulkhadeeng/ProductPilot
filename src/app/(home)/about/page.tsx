"use client";

import { motion } from "framer-motion";

import { FaqSection } from "@/components/landing-page/FaqSection";

export default function AboutPage() {
  return (
    <main className="mx-auto my-10 max-w-4xl px-6">
      <motion.div
        className="mt-20 flex min-h-[80vh] flex-col gap-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-semibold">About Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We are on a mission to help creators and innovators bring their
            products to life by connecting them with an engaged, supportive
            community.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-gray-600">
            Our platform is designed for creators, makers, and innovators who
            want to showcase their products, get feedback, and grow. We aim to
            empower you to build meaningful connections and improve your product
            through honest and constructive feedback.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">What We Offer</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-600">
            <li>Product Showcasing: Highlight your products and make them stand out.</li>
            <li>Community Engagement: Get valuable feedback, comments, and votes.</li>
            <li>Analytics: Track product engagement with basic and advanced insights.</li>
            <li>Upvote System: Gauge interest through community upvotes.</li>
            <li>Premium launch insights for optimizing launches.</li>
          </ul>
        </section>
      </motion.div>

      <FaqSection />
    </main>
  );
}
