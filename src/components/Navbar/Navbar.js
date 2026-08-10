// components/Navbar.tsx
"use client";
import { Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "./../../stores/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Pulses & Dal",
  "Cooking Oils",
  "Spices",
  "Sugar & Salt",
  "Dry Fruits & Nuts",
];

export default function Navbar({ onCartClick }) {
  const router = useRouter();

  const { getTotalItems } = useCartStore();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCartCount(getTotalItems());
    };

    updateCount();
    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, [getTotalItems]);

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick(); // Use the prop from ClientOnly
    } else if (window.openCartSidebar) {
      window.openCartSidebar(); // Fallback to global function
    }
  };
  return (
    <nav className="w-full bg-[#faf4ea] border-b border-[#E6DED2]">
      <div className="max-w-375 mx-auto h-20 px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="shrink-0">
          <h1
            onClick={() => router.push("/")}
            className="text-3xl cursor-pointer font-serif font-bold text-[#4B2E1E] tracking-tight"
          >
            Anaaj
          </h1>
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {categories.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[#312620] hover:text-black transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-8">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
              size={20}
            />

            <input
              type="text"
              placeholder="Search staples..."
              className="w-82.2 h-13 rounded-full bg-[#EFE8DD] pl-14 pr-6 text-sm outline-none placeholder:text-[#8A8A8A] text-gray-800"
            />
          </div>

          {/* Cart */}

          <button
            onClick={handleCartClick}
            className="hover:scale-105 cursor-pointer transition relative"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.7}
              className="text-[#5A5A5A]"
            />

            {/* Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-[#c1552c] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
