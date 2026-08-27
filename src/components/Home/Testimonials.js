// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
// import apiClient from './../../api/client';

// function Testimonials() {
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const autoPlayRef = useRef(null);
//   const scrollContainerRef = useRef(null);

//   const fetchTestimonials = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get("/testimonial/get-active-testimonials");
//       if (response.ok) {
//         setTestimonials(response.data.testimonials || []);
//       }
//     } catch (error) {
//       console.error("Error fetching testimonials:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, []);

//   // Auto-play for desktop
//   useEffect(() => {
//     if (isAutoPlaying && testimonials.length > 0) {
//       autoPlayRef.current = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//       }, 4000);
//     }

//     return () => {
//       if (autoPlayRef.current) {
//         clearInterval(autoPlayRef.current);
//       }
//     };
//   }, [isAutoPlaying, testimonials.length]);

//   const handleMouseEnter = () => {
//     setIsAutoPlaying(false);
//     if (autoPlayRef.current) {
//       clearInterval(autoPlayRef.current);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsAutoPlaying(true);
//   };

//   const goToSlide = (index) => {
//     setIsAutoPlaying(false);
//     setCurrentIndex(index);
//     if (autoPlayRef.current) {
//       clearInterval(autoPlayRef.current);
//     }
//     setTimeout(() => setIsAutoPlaying(true), 3000);
//   };

//   const scroll = (direction) => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       const scrollAmount = direction === 'left' ? -300 : 300;
//       container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={16}
//         className={i < rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-300"}
//       />
//     ));
//   };

//   if (loading) {
//     return (
//       <section className="bg-[#faf4ea] py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-8">
//           <div className="text-center mb-12">
//             <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
//             <div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-2 animate-pulse"></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[1, 2, 3].map((_, index) => (
//               <div key={index} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-12 h-12 rounded-full bg-gray-200"></div>
//                   <div className="flex-1">
//                     <div className="h-4 w-24 bg-gray-200 rounded"></div>
//                     <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
//                   </div>
//                 </div>
//                 <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
//                 <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (testimonials.length === 0) {
//     return null;
//   }

//   return (
//     <section className="bg-[#faf4ea] py-10 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-8">
//         {/* Header */}
//         <div className="text-left mb-8">
//           <p className="text-[#c1552c] text-sm font-semibold uppercase tracking-wider mb-2">
//             Testimonials
//           </p>
//           <h2 className="font-serif text-3xl font-semibold text-[#1D241D]">
//             What Our Customers Say
//           </h2>
//           <p className="text-[#5a4a3a] mt-2 text-left max-w-2xl">
//             Real stories from real people who trust us for their daily staples
//           </p>
//         </div>

//         {/* Desktop View - Card Grid with Auto-play */}
//         <div 
//           className="hidden md:block relative"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <div className="grid grid-cols-3 gap-6">
//             {testimonials.map((testimonial, index) => {
//               const isActive = index === currentIndex;
//               return (
//                 <div
//                   key={testimonial._id}
//                   className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 ${
//                     isActive ? 'scale-105 shadow-xl  border-[#c1552c]/20' : 'scale-100 opacity-70'
//                   }`}
//                 >
//                   {/* Rating */}
//                   <div className="flex gap-0.5 mb-3">
//                     {renderStars(testimonial.rating)}
//                   </div>

//                   {/* Quote */}
//                   <Quote size={20} className="text-[#c1552c]/30 mb-2" />

//                   {/* Description */}
//                   <p className="text-[#5a4a3a] text-sm leading-relaxed line-clamp-4">
//                     "{testimonial.description}"
//                   </p>

//                   {/* User Info */}
//                   <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#e6ded2]">
//                     <div className="w-10 h-10 rounded-full bg-[#c1552c] flex items-center justify-center text-white font-semibold text-sm">
//                       {testimonial.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-[#2b1b12] text-sm">
//                         {testimonial.name}
//                       </p>
//                       <p className="text-[#8a8179] text-xs">
//                         {testimonial.location}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Dots Indicator */}
//           <div className="flex justify-center gap-2 mt-8">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`transition-all duration-500 cursor-pointer ${
//                   index === currentIndex
//                     ? "w-8 h-2 bg-[#c1552c] rounded-full"
//                     : "w-2 h-2 bg-[#c1552c]/30 hover:bg-[#c1552c]/50 rounded-full"
//                 }`}
//                 aria-label={`Go to testimonial ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Mobile View - Horizontal Scroll */}
//         <div className="md:hidden relative">
//           <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar" ref={scrollContainerRef}>
//             {testimonials.map((testimonial) => (
//               <div
//                 key={testimonial._id}
//                 className="min-w-[280px] max-w-[280px] bg-white rounded-2xl p-5 shadow-sm flex-shrink-0"
//               >
//                 {/* Rating */}
//                 <div className="flex gap-0.5 mb-3">
//                   {renderStars(testimonial.rating)}
//                 </div>

//                 {/* Quote */}
//                 <Quote size={16} className="text-[#c1552c]/30 mb-2" />

//                 {/* Description */}
//                 <p className="text-[#5a4a3a] text-sm leading-relaxed line-clamp-4">
//                   "{testimonial.description}"
//                 </p>

//                 {/* User Info */}
//                 <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#e6ded2]">
//                   <div className="w-10 h-10 rounded-full bg-[#c1552c] flex items-center justify-center text-white font-semibold text-sm">
//                     {testimonial.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-[#2b1b12] text-sm">
//                       {testimonial.name}
//                     </p>
//                     <p className="text-[#8a8179] text-xs">
//                       {testimonial.location}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Gradient Fade */}
//           <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#faf4ea] to-transparent pointer-events-none"></div>
//           <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#faf4ea] to-transparent pointer-events-none"></div>

        
//         </div>
//       </div>

   
//     </section>
//   );
// }

// export default Testimonials;


"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import apiClient from "./../../api/client";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        "/testimonial/get-active-testimonials"
      );

      if (response.ok) {
        setTestimonials(response.data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const scrollAmount = 360;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        strokeWidth={1.8}
        className={
          index < rating
            ? "text-[#c1552c] fill-[#c1552c]"
            : "text-[#d8cec2]"
        }
      />
    ));
  };

  /* -----------------------------------------
     Loading
  ----------------------------------------- */

  if (loading) {
    return (
      <section className="bg-[#faf4ea] py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-10">
            <div className="h-3 w-24 bg-[#e6ded2] rounded animate-pulse" />

            <div className="h-10 w-64 bg-[#e6ded2] rounded mt-4 animate-pulse" />

            <div className="h-4 w-80 max-w-full bg-[#e6ded2] rounded mt-3 animate-pulse" />
          </div>

          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="shrink-0 w-[320px] md:w-90 bg-white rounded-2xl p-6 animate-pulse"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="w-3.5 h-3.5 bg-[#e6ded2] rounded"
                    />
                  ))}
                </div>

                <div className="h-4 bg-[#e6ded2] rounded w-full mb-3" />
                <div className="h-4 bg-[#e6ded2] rounded w-4/5 mb-8" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e6ded2]" />

                  <div>
                    <div className="h-3 w-24 bg-[#e6ded2] rounded" />
                    <div className="h-2.5 w-16 bg-[#e6ded2] rounded mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f3efe7] py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">

          <div>
              <p className="text-[#c1552c] text-xs font-semibold uppercase tracking-[0.2em] mb-2 md:mb-4">

              Customer stories
            </p>

                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1D241D]">

              Loved by our customers
            </h2>

            <p className="text-[#6b5b4c] mt-2 text-sm max-w-xl">
              Real experiences from people who choose Anaaj for their everyday
              staples.
            </p>
          </div>

          {/* =====================================
              DESKTOP ARROWS
          ===================================== */}

          <div className="hidden md:flex items-center gap-2 shrink-0">

            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full cursor-pointer border border-[#d9cdbf] bg-[#fffdf9] flex items-center justify-center text-[#4b2e1e] hover:bg-[#c1552c] hover:text-white hover:border-[#c1552c] transition-all duration-200"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full cursor-pointer border border-[#d9cdbf] bg-[#fffdf9] flex items-center justify-center text-[#4b2e1e] hover:bg-[#c1552c] hover:text-white hover:border-[#c1552c] transition-all duration-200"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>

          </div>
        </div>

        {/* =========================================
            TESTIMONIAL STRIP
        ========================================= */}

        <div className="relative">

          <div
            ref={scrollContainerRef}
            className="
              flex
              gap-4 md:gap-5
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              pb-3
              no-scrollbar
            "
          >

            {testimonials.map((testimonial) => (
              <article
                key={testimonial._id}
                className="
                  shrink-0
                  snap-start
                  w-72.5
                  sm:w-[320px]
                  md:w-90
                  bg-white
                  rounded-2xl
                  p-5
                  md:p-6
                  border
                  border-[#eee6dc]
                  hover:border-[#dfcfc0]
                 
                  transition-all
                  duration-300
                "
              >

                {/* Rating */}

                <div className="flex items-center gap-1 mb-5">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Quote */}

                <div className="flex gap-3">

                  <Quote
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#c1552c]/40 mt-0.5"
                  />

                  <p className="text-[#4f443a] text-sm leading-6 line-clamp-4">
                    {testimonial.description}
                  </p>

                </div>

                {/* Customer */}

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#eee6dc]">

                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#c1552c] flex items-center justify-center text-white font-semibold text-xs">
                    {testimonial.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold text-[#2b1b12] text-sm truncate">
                      {testimonial.name}
                    </p>

                    {testimonial.location && (
                      <p className="text-[#8a8179] text-xs mt-0.5 truncate">
                        {testimonial.location}
                      </p>
                    )}

                  </div>

                </div>

              </article>
            ))}

          </div>

          {/* =====================================
              RIGHT FADE
          ===================================== */}

          {testimonials.length > 2 && (
            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                bottom-3
                w-12
                md:w-20
                bg-linear-to-l
                from-[#faf4ea]
                to-transparent
              "
            />
          )}

        </div>

   
      </div>

   
   
    </section>
  );
}

export default Testimonials;