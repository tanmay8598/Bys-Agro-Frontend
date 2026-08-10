"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";


const ProductCard = ({ product }) => {
  const { addToCart, getTotalItems, getProductQuantity } = useCartStore();

  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to product detail page
    if (product.groupId) {
      router.push(`/product/${product.groupId}`);
    } else if (product.id) {
      router.push(`/product/${product.id}`);
    }
  };
  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Check global cart limit (max 4 items total)
    const totalItems = getTotalItems();
    if (totalItems >= 4) {
      toast.error("Maximum 4 items allowed per order");
      return;
    }

    // Check product limit (max 4 per product)
    const productQuantity = getProductQuantity(product.id || product.groupId);
    if (productQuantity >= 4) {
      toast.error("Maximum 4 items of this product allowed");
      return;
    }

    // Add to cart
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);

    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8E3D8] p-4 cursor-pointer "
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative h-44 rounded-xl overflow-hidden bg-[#F5F0E8]">
        <Image
          src={product.images[0] || product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-[#312721] leading-snug line-clamp-1">
          {product.name}
        </h3>

        <p className="text-[#817670] text-sm mt-1">{product.weight}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#362b25]">
            ₹{product.price}
          </span>

          <button
            className="bg-[#2F7D32] cursor-pointer hover:bg-[#256728] text-white text-sm px-5 py-2.5 rounded-xl font-medium transition active:scale-95"
            onClick={handleAddToCart}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
