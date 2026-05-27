import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";

const PricingSection = () => {
  return (
    <div className="site-container flex flex-col items-center py-18">
      <div className="flex flex-col items-center justify-center mb-8 mx-6">
        <h1 className="text-3xl md:text-[2.8rem] font-medium text-center !leading-tight transition-all">
          Fair pricing, unfair advantage.
        </h1>

        <p className="text-sm md:text-base mt-3 text-center text-muted-foreground transition-all">
          Get started and take your product to the next level.
        </p>
      </div>

      <div className="flex flex-col min-[840px]:flex-row gap-5 transition-all w-full max-w-3xl">
        {Plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col w-full border-border rounded-xl min-w-fit",
              plan.name === "Premium" && "border-2 border-purple-500"
            )}
          >
            <CardHeader
              className={cn(
                "border-b border-border px-5 py-5",
                plan.name === "Premium"
                  ? "bg-purple-500/[0.07]"
                  : "bg-foreground/[0.03]"
              )}
            >
              <CardTitle
                className={cn(
                  plan.name !== "Pro" && "text-muted-foreground",
                  "text-base font-medium"
                )}
              >
                {plan.name}
              </CardTitle>

              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>

              <h5 className="text-2xl font-semibold">
                ${plan.price}
                <span className="text-sm text-muted-foreground font-normal">
                  {plan.name !== "Free" ? "/month" : ""}
                </span>
              </h5>
            </CardHeader>

            <CardContent className="pt-5 space-y-3 px-5">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircleIcon className="text-purple-500 w-4 h-4 mt-0.5 shrink-0" />

                  <p className="text-sm leading-5 transition-all">
                    {feature}
                  </p>
                </div>
              ))}
            </CardContent>

            <CardFooter className="w-full mt-auto px-5 pb-5">
              <button className="group relative w-full px-3 py-2 flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white text-sm text-white bg-indigo-500 font-medium transition-all duration-300 active:scale-95 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-500">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                </span>

                <div className="absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Plans = [
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

export default PricingSection;