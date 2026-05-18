"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    description: "Essential tools to kickstart your product journey.",
    price: 0,
    features: [
      "Upload up to 2 products",
      "Community feedback and voting",
      "Basic analytics on engagement",
      "Limited upvotes on other products",
      "Notifications for comments and upvotes",
    ],
  },
  {
    name: "Premium",
    description: "Enhanced tools and insights for serious creators.",
    price: 7.99,
    features: [
      "Everything in Basic plan",
      "Unlimited product uploads",
      "Advanced analytics on engagement",
      "Priority listing for products",
      "Personalized product launch insights",
      "Premium support and feedback",
    ],
  },
];

export default function PricingPage() {
  return (
    <motion.main
      className="flex flex-col items-center pb-24"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: "easeInOut",
      }}
    >
      <div className="mx-10 mb-12 mt-16 flex flex-col items-center justify-center">
        <h1 className="mt-5 text-center text-4xl font-semibold !leading-tight transition-all sm:text-5xl md:tracking-tight">
          Fair pricing, unfair advantage.
        </h1>

        <p className="mt-6 text-center text-base text-muted-foreground md:text-lg">
          Get started and take your product to the next level.
        </p>
      </div>

      <div className="flex flex-col gap-10 px-10 transition-all min-[840px]:flex-row">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex w-full min-w-fit flex-col rounded-xl border-border",
              plan.name === "Premium" && "border-2 border-purple-500"
            )}
          >
            <CardHeader
              className={cn(
                "border-b border-border",
                plan.name === "Premium"
                  ? "bg-purple-500/[0.07]"
                  : "bg-foreground/[0.03]"
              )}
            >
              <CardTitle
                className={cn(
                  plan.name !== "Premium" && "text-muted-foreground",
                  "text-lg font-medium"
                )}
              >
                {plan.name}
              </CardTitle>

              <CardDescription>{plan.description}</CardDescription>
              <h2 className="text-3xl font-semibold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  {plan.name !== "Basic" ? "/month" : ""}
                </span>
              </h2>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-purple-500" />
                  <p className="text-sm transition-all sm:text-base">
                    {feature}
                  </p>
                </div>
              ))}
            </CardContent>

            <CardFooter className="mt-auto w-full">
              <button className="group relative flex w-full transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-indigo-500 px-2 py-1 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 active:scale-95 sm:px-4 sm:py-1.5">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                </span>
                <div className="absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.main>
  );
}
