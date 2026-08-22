

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const { addToCart, getTotalItems, getProductQuantity } = useCartStore();
  const router = useRouter();


  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Check global cart limit (max 4 items total)
    const totalItems = getTotalItems();
    if (totalItems >= 4) {
      toast.error("Maximum 4 items allowed per order");
      return;
    }

    // Check product limit (max 4 per product)
    const productId = product._id || product.id || product.groupId;
    const productQuantity = getProductQuantity(productId);
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

  // Get the first image from images array or fallback to image property
  const productImage = product.images?.[0] || product.image || "https://via.placeholder.com/400x300";

  // Calculate discounted price if discount exists
  const discountedPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  // Format weight display
  const weightDisplay = product.weight 
    ? `${product.weight}${product.weightUnit || 'g'}` 
    : product.weight || '';

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8E3D8] p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
   
    >
      {/* Product Image */}
      <div className="relative h-44 rounded-xl overflow-hidden bg-[#F5F0E8]">
         <Link
    href={{
      pathname: `/product/${product.groupId}`,
      query: { visualId: product.visualId },
    }}
    onClick={() => sessionStorage.setItem("productId", product._id)}
    className="w-full h-full block"
  >
        <Image
          src={productImage}
          alt={product.name || "Product"}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e) => {
            // Fallback image if image fails to load
            e.currentTarget.src = "https://via.placeholder.com/400x300";
          }}
        />

        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {product.discount}% OFF
          </div>
        )}

        {/* Stock Status */}
        {product.countInStock?.quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-sm px-3 py-1 bg-red-600 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-[#312721] leading-snug line-clamp-1">
          {product.name || "Product Name"}
        </h3>

        {product.category?.name && (
          <p className="text-[#817670] text-xs mt-0.5">{product.category.name}</p>
        )}

        <p className="text-[#817670] text-sm mt-1">
          {weightDisplay}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#362b25]">
              ₹{discountedPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-[#817670] line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            className={`${
              product.countInStock?.quantity > 0
                ? "bg-[#2F7D32] hover:bg-[#256728]"
                : "bg-gray-400 cursor-not-allowed"
            } text-white text-sm px-5 py-2.5 rounded-xl font-medium transition active:scale-95`}
            onClick={handleAddToCart}
            disabled={product.countInStock?.quantity === 0}
          >
            {product.countInStock?.quantity > 0 ? "Add" : "Out of Stock"}
          </button>
        </div>

       
      </div>
    </div>
  );
};

export default ProductCard;