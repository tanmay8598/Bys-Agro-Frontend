
"use client";

import { Truck, BadgeCheck, Wallet } from "lucide-react";

const features = [
  {
    icon: Truck,
    text: "Free delivery above ₹499",
  },
  {
    icon: BadgeCheck,
    text: "Lab-tested for purity",
  },
  {
    icon: Wallet,
    text: "Cash on delivery available",
  },
];

const FeatureStrip = () => {
  return (
    <section className="bg-[#254326] text-white overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto min-w-max  md:px-8 py-4">
        <div className="flex items-center justify-center">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.text}
                className="flex items-center"
              >
                <div className="flex items-center gap-2.5 px-6 md:px-10">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap text-xs md:text-sm font-medium">
                    {feature.text}
                  </span>
                </div>

                {index !== features.length - 1 && (
                  <span className="h-5 w-px bg-white/20 shrink-0" />
                )}
              </div>
            );
          })}

        </div>
      </div>

    
    </section>
  );
};

export default FeatureStrip;