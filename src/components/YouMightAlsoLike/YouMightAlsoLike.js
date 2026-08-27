"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import ProductCard from "./../Cards/ProductCard";

function YouMightAlsoLike({ youMayAlsoLikeProducts = [] }) {
  const router = useRouter();

  if (!youMayAlsoLikeProducts || youMayAlsoLikeProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl  font-serif font-semibold text-[#1D241D]">
         Frequently Bought Together
        </h2>
    
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {youMayAlsoLikeProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default YouMightAlsoLike;