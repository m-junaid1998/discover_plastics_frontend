import React from "react";
import { Award, Headphones, Star, Globe, type LucideIcon } from "lucide-react";

interface Feature {
  titleLine1: string;
  titleLine2: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  { titleLine1: "Quality You", titleLine2: "Can Trust", description: "Premium products handpicked for you.", icon: Award },
  { titleLine1: "Customer", titleLine2: "Support", description: "We're here to help, 24/7.", icon: Headphones },
  { titleLine1: "Loved by", titleLine2: "Thousands", description: "Join our happy customer community.", icon: Star },
  { titleLine1: "Sustainable", titleLine2: "Choice", description: "Conscious shopping, better tomorrow.", icon: Globe },
];

const StatsBar: React.FC = () => {
  return (
    <section className=" bg-[var(--color-bg-light)] py-4 sm:py-8 font-sans">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 grid grid-cols-4 divide-x divide-[var(--color-border)]">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-1.5 md:gap-4 px-1 sm:px-4">
              <div className="p-2 sm:p-2.5 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] shrink-0">
                <Icon className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] sm:text-sm font-bold text-[var(--color-primary)] tracking-tight leading-tight">
                  <span className="block sm:inline">{item.titleLine1} </span>
                  <span className="block sm:inline">{item.titleLine2}</span>
                </h4>
                <p className="hidden sm:block text-xs text-[var(--color-muted)] leading-relaxed mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsBar;