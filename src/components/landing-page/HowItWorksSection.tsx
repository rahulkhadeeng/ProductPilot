import { RocketIcon, EditIcon, PlusIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const HowItWorksSection = () => {
  return (
    <div className="site-container-wide flex flex-col items-center justify-center py-32">
      <div className="text-center">
        <h2 className="text-3xl min-[470px]:text-4xl md:text-[2.8rem] font-medium transition-all leading-tight">
          Three steps to launch <br /> your dream product
        </h2>

        <p className="text-muted-foreground mt-4 text-sm md:text-base">
          Share your creation with the world <br /> in just 3 simple steps
        </p>
      </div>

      <MainSection />
    </div>
  );
};

function MainSection() {
  const features = [
    {
      title: "Add Your Product",
      description:
        "Create an account and submit your product with all the essential details.",
      icon: PlusIcon,
    },
    {
      title: "Customize Your Listing",
      description:
        "Enhance your product page with descriptions, images, and links to showcase its features.",
      icon: EditIcon,
    },
    {
      title: "Launch",
      description:
        "Share your product with the community and watch it gain traction.",
      icon: RocketIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 pt-10 w-full mx-auto max-w-5xl">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

export default HowItWorksSection;

const Feature = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-6 relative group/feature dark:border-neutral-800",
        index === 0 && "lg:border-l dark:border-neutral-800"
      )}
    >
      <div className="group-hover/feature:-translate-y-1 transform-gpu transition-all duration-300 flex flex-col w-full">
        <div className="relative z-10 mb-3 px-6 text-neutral-600 dark:text-neutral-400">
          <Icon
            strokeWidth="1.5"
            className="w-6 h-6 group-hover/feature:scale-90 transition-all will-change-transform"
          />
        </div>

        <div className="text-base font-semibold mb-2 relative z-10 px-6">
          <div className="absolute left-0 inset-y-0 h-5 group-hover/feature:h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />

          <span className="transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
            {title}
          </span>
        </div>

        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-6">
          {description}
        </p>
      </div>
    </div>
  );
};