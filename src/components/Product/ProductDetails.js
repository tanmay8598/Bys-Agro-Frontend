// components/ProductDetails/ProductDetails.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";


const ProductDetails = ({ product, onVariantChange }) => {
  const { addToCart, getTotalItems, getProductQuantity } = useCartStore();

  const [selectedWeight, setSelectedWeight] = useState(
    product?.variants?.[0]?.id || "1kg",
  );
  const [quantity, setQuantity] = useState(1);

  // Get selected variant price
  const selectedVariant =
    product?.variants?.find((v) => v.id === selectedWeight) ||
    product?.variants?.[0];
  const currentPrice =
    selectedVariant?.discountedPrice ||
    product?.discountedPrice ||
    product?.price;
  const originalPrice = selectedVariant?.price || product?.price;

  const renderStars = () => {
    const stars = [];
    const rating = product?.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#E58103] text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-[#E58103] text-sm" />,
        );
      } else {
        stars.push(
          <FaRegStar key={i} className="text-[#E58103] text-sm opacity-40" />,
        );
      }
    }
    return stars;
  };

  const increment = () => {
    if (quantity < 4) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
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

  if (!product) {
    return (
      <div className="w-full max-w-2xl lg:max-w-lg px-4 text-left">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex font-figtree mt-5 justify-center">
      <div className="w-full max-w-2xl lg:max-w-lg px-4 text-left">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 ">
          {product?.badges?.map((badge, index) => (
            <span
              key={index}
              className="text-xs  bg-[#cde9b1] text-green-700 px-3 py-1 rounded-sm "
            >
              {badge}
            </span>
          ))}
        </div>
        {/* Product Name */}
        <h2 className="text-2xl md:text-3xl text-[#2b1b12] font-semibold my-2">
          {product?.name}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">{renderStars()}</div>
          <span className="text-[17px] font-semibold text-[#1A3232]">
            {product?.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-sm text-gray-500">
            ({product?.reviews || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="my-3">
          <div className="font-semibold flex items-center gap-2 text-xl">
            <span className="font-semibold text-3xl text-[#2b1b12]">
              ₹{currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <span className="line-through text-gray-400 text-xl">
                ₹{originalPrice}
              </span>
            )}
            {product?.discount > 0 && (
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                {Math.round(product.discount)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Weight Variants */}

        {product?.variants && product.variants.length > 0 && (
          <>
            <h5 className="font-semibold text-[#2b1b12] text-lg mt-4">
              Select Weight
            </h5>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.variants.map((variant) => {
                const isActive = selectedWeight === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedWeight(variant.id);
                      if (onVariantChange) onVariantChange(variant);
                    }}
                    className={`relative rounded-xl py-4 px-3 text-center cursor-pointer transition-all duration-200 border 
              ${
                isActive
                  ? "bg-[#FFF3EB] border-[#E56B5D] shadow-md"
                  : "bg-white border-gray-300 hover:border-[#E26D5A] hover:shadow-sm"
              }`}
                  >
                    <p
                      className={`font-bold text-lg ${
                        isActive ? "text-[#E56B5D]" : "text-gray-800"
                      }`}
                    >
                      ₹{variant.discountedPrice}
                    </p>
                    <p
                      className={`line-through text-sm ${
                        isActive ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      ₹{variant.price}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        isActive ? "text-[#2b1b12]" : "text-gray-700"
                      }`}
                    >
                      {variant.weight}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Description */}
        <div className="mt-4 text-gray-700 leading-6">
          {product?.description}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between gap-4 my-4">
          <span className="text-lg font-semibold text-black">Quantity</span>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
            <button
              onClick={decrement}
              disabled={quantity === 1}
              className={`text-xl font-semibold px-3 ${
                quantity === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 cursor-pointer"
              }`}
            >
              –
            </button>
            <span className="text-lg text-[#2b1b12] font-medium px-4">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= 4}
              className={`text-xl font-semibold px-3 ${
                quantity >= 4
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 cursor-pointer"
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#c1552c] cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-[#c94a1e] transition"
          >
            Add to Cart - ₹{currentPrice * quantity}
          </button>
          <button className="w-full border-2 cursor-pointer border-[#c1552c] text-[#c1552c] py-3 rounded-xl font-semibold hover:bg-[#E05222] hover:text-white transition">
            Buy It Now
          </button>
        </div>

        {/* Nutrition Information */}
        {product?.nutritionalInfo && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Nutrition (per 100g)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-3 rounded-xl text-center"
                >
                  <p className="text-xl font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-500 capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Suggestion */}
        {product?.recipe && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">
              Try it in: {product.recipe} - A comforting classic
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
