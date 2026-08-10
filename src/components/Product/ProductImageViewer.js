// components/ProductImageViewer/ProductImageViewer.jsx

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const ProductImageViewer = ({ product }) => {
  const images = product?.images || [];
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setIndex(0);
  }, [product]);

  const handleSwipeStart = (clientX) => {
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleSwipeMove = (clientX) => {
    if (!isDragging.current) return;
    const diff = startX.current - clientX;
    if (diff > 60) {
      setIndex((prev) => Math.min(prev + 1, images.length - 1));
      isDragging.current = false;
    }
    if (diff < -60) {
      setIndex((prev) => Math.max(prev - 1, 0));
      isDragging.current = false;
    }
  };

  const handleSwipeEnd = () => {
    isDragging.current = false;
  };

  if (!images.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-3xl">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-4 mt-5 items-center relative">
      {/* Discount Badge */}
      {product?.discount > 0 && (
        <div className="absolute top-2 right-6 md:right-14 md:top-5 lg:right-8 lg:top-4 z-10">
          <div className="bg-[#E56B5D] text-white font-bold text-sm lg:text-base px-4 py-2 rounded-2xl md:rounded-full">
            {Math.round(product.discount)}% OFF
          </div>
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full max-w-214.5 cursor-pointer"
        onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={(e) => handleSwipeStart(e.clientX)}
        onMouseMove={(e) => handleSwipeMove(e.clientX)}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        <Image
          src={images[index]}
          alt={product?.name || "Product image"}
          sizes="(max-width: 1024px) 100vw, 858px"
          width={858}
          height={858}
          className="w-full h-auto rounded-xl lg:rounded-3xl object-contain transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-4 w-full max-w-md flex items-center justify-center gap-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`min-w-16 min-h-16 w-16 h-16 lg:min-w-28 lg:min-h-28 lg:h-28 lg:w-28 aspect-square rounded-xl border lg:border-2 flex items-center justify-center overflow-hidden transition ${
                i === index ? "border-[#E56B5D]" : "border-gray-200"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  fill
                  className="object-cover"
                  alt={`Thumbnail ${i + 1}`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageViewer;