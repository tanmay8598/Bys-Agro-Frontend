"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import apiClient from './../../api/client';
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ShopByCategory = () => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollRef = useRef(null);

  const getAllCategories = async () => {
    try {
      const response = await apiClient.get("/variation/category/get");
      if (response.ok) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (categories.length > 0 && isAutoScrolling) {
      autoScrollRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 200, behavior: 'smooth' });
          }
        }
      }, 3000);
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [categories, isAutoScrolling]);

  // Stop auto-scroll on user interaction
  const handleUserInteraction = () => {
    setIsAutoScrolling(false);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/all-products?category=${categoryId}`);
  };

  const scroll = (direction) => {
    handleUserInteraction();
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      setTimeout(checkScrollButtons, 100);
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [categories]);

  if (loading) {
    return (
      <section className="bg-[#F7F2EA] py-10">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-serif text-sm md:text-3xl font-semibold text-[#1D241D] mb-8">
            Shop by Category
          </h2>
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="min-w-45 animate-pulse">
                <div className="h-32 rounded-3xl bg-gray-200"></div>
                <div className="mt-5 h-4 bg-gray-200 rounded mx-auto w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F7F2EA] py-5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="font-serif text-xl md:text-3xl font-semibold text-[#1D241D]">
            Shop by Category
          </h2>
          
          <div className="flex items-center gap-3">
        
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  showLeftArrow 
                    ? 'border-[#c1552c] text-[#c1552c] hover:bg-[#c1552c] hover:text-white cursor-pointer' 
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                }`}
                disabled={!showLeftArrow}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`p-2 rounded-full border transition-all duration-200 ${
                  showRightArrow 
                    ? 'border-[#c1552c] text-[#c1552c] hover:bg-[#c1552c] hover:text-white cursor-pointer' 
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                }`}
                disabled={!showRightArrow}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => {
            setTimeout(() => setIsAutoScrolling(true), 5000);
          }}
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            onScroll={checkScrollButtons}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories?.map((item) => (
              <div
                key={item._id}
                className="min-w-45 max-w-50 shrink-0 group py-1 cursor-pointer"
                onClick={() => {
                  handleUserInteraction();
                  handleCategoryClick(item._id);
                }}
              >
                <div
                  className="relative h-32 rounded-3xl overflow-hidden transition duration-300 group-hover:scale-105 group-hover:shadow-lg"
                  style={{
                    background: item.color || '#E8E3D8',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-5 text-center text-sm font-semibold text-[#312620] group-hover:text-[#c1552c] transition-colors">
                  {item.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-[#F7F2EA] to-transparent pointer-events-none"></div>
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-[#F7F2EA] to-transparent pointer-events-none"></div>
        </div>

        {/* <div className="md:hidden flex justify-center mt-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
            <ChevronLeft size={14} />
            <span>Swipe to explore</span>
            <ChevronRight size={14} />
          </div>
        </div> */}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ShopByCategory;