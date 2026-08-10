// components/HeroBanner.tsx

import Image from "next/image";

const HeroBanner = () => {
  return (
    <section className="bg-[#f4e6d2]">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <div>
            <p className="text-[#B45B2E] uppercase tracking-widest text-xs font-regular mb-5">
              Farm-Graded Staples
            </p>

            <h1 className="font-serif text-[#2D2018] text-2xl lg:text-5xl font-semibold ">
              Pure dal, oil &
              <br />
              spices for the
              <br />
              everyday kitchen
            </h1>

            <p className="mt-8 text-lg text-[#5F5650] max-w-lg leading-8">
              Lab-tested staples sourced directly from Indian farms, delivered
              to your door within 24 hours.
            </p>

            <div className="flex gap-4 mt-10">
              <button className="bg-[#c1552c] cursor-pointer hover:bg-[#AF5528] text-white font-semibold px-8 py-4 rounded-lg transition">
                Shop Now
              </button>

              <button className="border cursor-pointer border-[#6F5E52] text-[#3E322A] hover:bg-[#EFE4D7] font-semibold px-8 py-4 rounded-lg transition">
                Explore Categories
              </button>
            </div>
          </div>

          {/* Right Side */}
         <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-[#F2DEC7]">
            <Image
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop"
              alt="Assorted Indian spices, dal, and cooking oils in traditional containers"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
