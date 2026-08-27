

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ShopDrawer from "./../Navbar/ShopDrawer";

const HeroBanner = () => {
  const router = useRouter();
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop",
      alt: "Assorted Indian spices",
    },
    {
      src: "https://images.unsplash.com/photo-1673791031093-eb8eefa60083?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VnYXJ8ZW58MHx8MHx8fDA%3D",
      alt: "Pulses and dal",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1671379041175-782d15092945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJ5JTIwZnJ1aXRzfGVufDB8fDB8fHww",
      alt: "Cooking oils",
    },
    {
      src: "https://media.istockphoto.com/id/478191096/photo/vinaigrette-ingredients-on-rustic-wood-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=CB4YIttj2DhkWSwRq3CqIfj3hkylkHVyvQiJzKT84QY=",
      alt: "Dry fruits and nuts",
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, images.length]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleShopNow = () => {
    router.push("/all-products");
  };

  const handleExploreCategories = () => {
    setIsShopDrawerOpen(true);
  };

  return (
    <>
      <section className="bg-[#f4e6d2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
            
            {/* Right Side - Image (Shows first on mobile) */}
            <div 
              className="w-full lg:order-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="relative w-full h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-110 z-0"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-500 cursor-pointer ${
                        index === currentIndex
                          ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#c1552c] rounded-full"
                          : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white/80 rounded-full"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Left Side - Text (Shows below image on mobile) */}
            <div className="lg:order-1 text-center lg:text-left">
              <p className="text-[#B45B2E] uppercase tracking-widest text-xs font-regular mb-3 sm:mb-5 animate-heroFadeIn">
                Farm-Graded Staples
              </p>

              <h1 className="font-serif text-[#2D2018] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight animate-heroSlideUp">
                Pure dal, oil &
                <br className="hidden sm:block" />
                spices for the
                <br className="hidden sm:block" />
                everyday kitchen
              </h1>

              <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg text-[#5F5650] max-w-lg mx-auto lg:mx-0 leading-7 sm:leading-8 animate-heroSlideUp animation-delay-200">
                Lab-tested staples sourced directly from Indian farms, delivered
                to your door within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 animate-heroSlideUp animation-delay-400">
                <button
                  onClick={handleShopNow}
                  className="w-full sm:w-auto bg-[#c1552c] cursor-pointer hover:bg-[#AF5528] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition transform hover:scale-105 duration-300"
                >
                  Shop Now
                </button>

                <button
                  onClick={handleExploreCategories}
                  className="hidden sm:block w-full sm:w-auto border cursor-pointer border-[#6F5E52] text-[#3E322A] hover:bg-[#EFE4D7] font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition transform hover:scale-105 duration-300"
                >
                  Explore Categories
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Shop Drawer */}
      <ShopDrawer
        isOpen={isShopDrawerOpen}
        onClose={() => setIsShopDrawerOpen(false)}
      />
    </>
  );
};

export default HeroBanner;