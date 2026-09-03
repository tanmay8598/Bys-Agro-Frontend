"use client";
import { useRouter } from "next/navigation";
import ProductCard from './../Cards/ProductCard';

const Bestsellers = ({ products = [] }) => {
  const router = useRouter();


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

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {products?.slice(0, 4)?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bestsellers;