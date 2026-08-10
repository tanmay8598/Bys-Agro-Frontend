// components/FeatureStrip.tsx

import { Truck, BadgeCheck, Wallet } from "lucide-react";

const FeatureStrip = () => {
  return (
    <section className="bg-[#254326] text-white">
      <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center justify-center gap-3">
          <Truck size={22} />
          <span className="text-sm font-medium">Free delivery above ₹499</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <BadgeCheck size={22} />
          <span className="text-sm font-medium">Lab-tested for purity</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Wallet size={22} />
          <span className="text-sm font-medium">
            Cash on delivery available
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
