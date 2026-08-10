"use client";

import { useRouter } from "next/navigation";
import ProductCard from './../Cards/ProductCard';

const products = [
  {
    id: 1,
    groupId: "toor-dal-1",
    name: "Toor Dal (Arhar)",
    weight: "1kg",
    price: 165,
    originalPrice: 195,
    discount: 15,
    rating: 4.7,
    reviews: 1284,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&sat=-50",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&sat=-100",
    ],
    category: "grains",
    badges: ["FSSAI Certified", "100% Natural"],
    inStock: true,
    mostSelling: true,
    description: "Premium quality Toor Dal (Arhar) sourced directly from Indian farms. Lab-tested for purity and authenticity.",
    nutritionalInfo: {
      protein: "22g",
      carbs: "57g",
      fiber: "15g",
      energy: "335kcal"
    },
    recipe: "Dal Tadka",
    variants: [
      { id: "500g", weight: "500g", price: 85, discountedPrice: 75 },
      { id: "1kg", weight: "1kg", price: 165, discountedPrice: 140 },
      { id: "5kg", weight: "5kg", price: 750, discountedPrice: 650 },
    ]
  },
  {
    id: 2,
    groupId: "moong-dal-1",
    name: "Moong Dal (Split)",
    weight: "1kg",
    price: 172,
    originalPrice: 195,
    discount: 12,
    rating: 4.6,
    reviews: 856,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&sat=-100",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&sat=-100",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&sat=-120",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&sat=-140",
    ],
    category: "grains",
    badges: ["FSSAI Certified", "100% Natural"],
    inStock: true,
    mostSelling: false,
    description: "Premium quality Split Moong Dal, perfect for khichdi and soups. Rich in protein and easy to digest.",
    nutritionalInfo: {
      protein: "24g",
      carbs: "59g",
      fiber: "16g",
      energy: "340kcal"
    },
    recipe: "Moong Dal Khichdi",
    variants: [
      { id: "500g", weight: "500g", price: 90, discountedPrice: 80 },
      { id: "1kg", weight: "1kg", price: 172, discountedPrice: 148 },
      { id: "5kg", weight: "5kg", price: 800, discountedPrice: 690 },
    ]
  },
  {
    id: 3,
    groupId: "sunflower-oil-1",
    name: "Sunflower Cooking Oil",
    weight: "1L",
    price: 148,
    originalPrice: 175,
    discount: 15,
    rating: 4.5,
    reviews: 2340,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&sat=-50",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&sat=-80",
    ],
    category: "oils",
    badges: ["FSSAI Certified", "Heart Healthy"],
    inStock: true,
    mostSelling: true,
    description: "Pure sunflower cooking oil with high smoke point. Perfect for everyday cooking and deep frying.",
    nutritionalInfo: {
      protein: "0g",
      carbs: "0g",
      fiber: "0g",
      energy: "900kcal"
    },
    recipe: "Healthy Stir-fry",
    variants: [
      { id: "500ml", weight: "500ml", price: 78, discountedPrice: 68 },
      { id: "1L", weight: "1L", price: 148, discountedPrice: 128 },
      { id: "5L", weight: "5L", price: 700, discountedPrice: 620 },
    ]
  },
  {
    id: 4,
    groupId: "mustard-oil-1",
    name: "Cold-Pressed Mustard Oil",
    weight: "1L",
    price: 210,
    originalPrice: 250,
    discount: 16,
    rating: 4.8,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&sat=-50",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&sat=-50",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&sat=-80",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&sat=-110",
    ],
    category: "oils",
    badges: ["Cold-Pressed", "100% Natural", "FSSAI Certified"],
    inStock: true,
    mostSelling: false,
    description: "Traditional cold-pressed mustard oil with strong pungent flavor. Rich in omega-3 fatty acids and antioxidants.",
    nutritionalInfo: {
      protein: "0g",
      carbs: "0g",
      fiber: "0g",
      energy: "902kcal"
    },
    recipe: "Fish Curry",
    variants: [
      { id: "500ml", weight: "500ml", price: 110, discountedPrice: 95 },
      { id: "1L", weight: "1L", price: 210, discountedPrice: 180 },
      { id: "5L", weight: "5L", price: 980, discountedPrice: 840 },
    ]
  },
];

const Bestsellers = () => {
   const router = useRouter();
  return (
    <section className="bg-[#faf4ea] py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-semibold text-[#1D241D]">
            Bestsellers
          </h2>
          <button
            onClick={() => router.push("/all-products")}
           className="text-sm text-[#C7602C] cursor-pointer hover:text-[#AF5528] font-medium transition">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
       {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
