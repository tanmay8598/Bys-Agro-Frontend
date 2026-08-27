"use client";
import { useRouter } from "next/navigation";
import ProductCard from './../Cards/ProductCard';
import { useEffect, useState } from "react";
import apiClient from './../../api/client';

const Bestsellers = () => {
  const router = useRouter();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllCategories = async () => {
    try {
      const response = await apiClient.get("/product/get-products")
      
      if (response.ok) {
        
        setBestSellers(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#faf4ea] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-semibold text-[#1D241D]">
              Bestsellers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf4ea] py-5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="font-serif text-xl md:text-3xl font-semibold text-[#1D241D]">
            Bestsellers
          </h2>
          <button
            onClick={() => router.push("/all-products")}
            className="text-sm text-[#C7602C] cursor-pointer hover:text-[#AF5528] font-medium transition"
          >
            View All →
          </button>
        </div>

        {bestSellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellers?.slice(0, 4)?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bestsellers;