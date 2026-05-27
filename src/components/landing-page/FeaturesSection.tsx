import {
  BarChart,
  Globe,
  MessageCircle,
  Rocket,
  Shield,
  Star,
  Users,
} from "lucide-react";

import { Features } from "@/components/ui/features-8";

const FeaturesSection = () => {
  return (
    <div className="site-container-wide relative  flex flex-col items-center justify-center">
      <Features
        title="Discover the features driving innovation"
        description={
          <>
            Explore the tools that make sharing, discovering, and celebrating
            innovative products easier than ever
          </>
        }
        features={features}
      />
    </div>
  );
};

export default FeaturesSection;

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
  
];
