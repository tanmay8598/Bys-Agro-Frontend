"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";
import { Parser } from "html-to-react";
import AccordionItem from './../Accordian/AccordianProductDetails';

const ProductDetails = ({
  products,
  groupId,
  initialVisualId,
  onVariantChange,
  currentProduct,
  scrollToReviews,
}) => {
  const router = useRouter();
  const { addToCart, getTotalItems, getProductQuantity } = useCartStore();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    setQty(1);
  }, [currentProduct?._id]);

  useEffect(() => {
    if (products?.length > 0) {
      let initialIndex = 0;

      if (initialVisualId) {
        const foundIndex = products.findIndex(
          (p) => p.visualId === initialVisualId,
        );
        if (foundIndex !== -1) {
          initialIndex = foundIndex;
        }
      }

      setSelectedVariant(initialIndex);
    }
  }, [products, initialVisualId]);

  const variants =
    products?.map((product, index) => {
      const originalPrice = product.price;

      const normalPrice =
        product.discount > 0
          ? Math.round(originalPrice - (originalPrice * product.discount) / 100)
          : originalPrice;

      let finalPrice = normalPrice;
      let saveAmount = originalPrice - normalPrice;

      if (product.isFlash && product.flash) {
        if (product.flash.discountType === "PERCENT") {
          finalPrice = Math.round(
            originalPrice - (originalPrice * product.flash.discountValue) / 100,
          );
        } else {
          finalPrice = Math.round(originalPrice - product.flash.discountValue);
        }
        finalPrice = Math.max(finalPrice, 0);
        saveAmount = originalPrice - finalPrice;
      }
      return {
        id: index,
        visualId: product.visualId,
        productId: product._id,
        price: finalPrice,
        oldPrice: originalPrice,
        weight: product.weight || "250g",
        save: saveAmount,
        product,
      };
    }) || [];

  const originalPrice = currentProduct?.price || 0;
  const discountedPrice =
    currentProduct?.discount > 0
      ? Math.round(originalPrice - (originalPrice * currentProduct.discount) / 100)
      : originalPrice;

  let finalFlashPrice = discountedPrice;
  if (currentProduct?.isFlash && currentProduct?.flash) {
    if (currentProduct.flash.discountType === "PERCENT") {
      finalFlashPrice = Math.round(
        originalPrice - (originalPrice * currentProduct.flash.discountValue) / 100,
      );
    } else {
      finalFlashPrice = Math.round(originalPrice - currentProduct.flash.discountValue);
    }
    finalFlashPrice = Math.max(finalFlashPrice, 0);
  }

  const currentPrice = currentProduct?.isFlash && currentProduct?.flash ? finalFlashPrice : discountedPrice;

  const handleVariantChange = (index) => {
    setSelectedVariant(index);
    const variant = variants[index];

    if (variant) {
      if (onVariantChange && variant.product) {
        onVariantChange(variant.product);
      }

      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(currentUrl.search);

      if (index === 0) {
        params.delete("visualId");
      } else {
        params.set("visualId", variant.visualId);
      }

      const queryString = params.toString();
      const url = queryString
        ? `/product/${groupId}?${queryString}`
        : `/product/${groupId}`;

      router.replace(url, { scroll: false });
    }
  };

  const increment = () => {
    if (qty < 4) setQty(qty + 1);
  };

  const decrement = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation();

    const totalItems = getTotalItems();
    if (totalItems >= 4) {
      toast.error("Maximum 4 items allowed per order");
      return;
    }

    const productQuantity = getProductQuantity(currentProduct?._id || currentProduct?.groupId);
    if (productQuantity >= 4) {
      toast.error("Maximum 4 items of this product allowed");
      return;
    }

    addToCart(currentProduct, qty);
    toast.success(`${currentProduct?.name} added to cart!`);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleBuyNow = () => {
    if (currentProduct?.countInStock?.quantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    addToCart(currentProduct, qty);
    router.push("/checkout");
  };

  const renderStars = () => {
    const stars = [];
    const rating = currentProduct?.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#E58103] text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#E58103] text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#E58103] text-sm opacity-40" />);
      }
    }
    return stars;
  };

  if (!currentProduct) {
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
        <div className="flex flex-wrap gap-2">
          {currentProduct?.features?.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-[#cde9b1] text-green-700 px-3 py-1 rounded-sm"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Product Name */}
        <h2 className="text-2xl md:text-3xl text-[#2b1b12] font-semibold my-2">
          {currentProduct?.name}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">{renderStars()}</div>
          <span className="text-[17px] font-semibold text-[#1A3232]">
            {currentProduct?.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-sm text-gray-500">
            ({currentProduct?.reviews || 0} reviews)
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
            {currentProduct?.discount > 0 && (
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                {Math.round(currentProduct.discount)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Weight Variants */}
        {products?.length > 0 && (
          <>
            <h5 className="font-semibold text-[#2b1b12] text-lg mt-4">
              Select weight
            </h5>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {variants?.map((v) => {
                const isActive = v.id === selectedVariant;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    className={`rounded-xl py-3 px-3 text-center cursor-pointer transition-all duration-200 border 
                      ${
                        isActive
                          ? "bg-[#FFF3EB] border-[#E56B5D] shadow-md"
                          : "bg-white border-gray-300 hover:border-[#E26D5A] hover:shadow-sm"
                      }`}
                  >
                    <p
                      className={`font-medium text-sm ${
                        isActive ? "text-[#2b1b12]" : "text-gray-700"
                      }`}
                    >
                      {v.weight}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Description */}
        <div className="mt-4 text-gray-700 leading-6">
          {Parser().parse(currentProduct?.description || "")}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center justify-between gap-4 my-4">
          <span className="text-lg font-semibold text-black">Quantity</span>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
            <button
              onClick={decrement}
              disabled={qty === 1}
              className={`text-xl font-semibold px-3 ${
                qty === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 cursor-pointer"
              }`}
            >
              –
            </button>
            <span className="text-lg text-[#2b1b12] font-medium px-4">
              {qty}
            </span>
            <button
              onClick={increment}
              disabled={qty >= 4}
              className={`text-xl font-semibold px-3 ${
                qty >= 4
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
            Add to Cart – ₹{currentPrice * qty}
          </button>
       
        </div>

                 {/* Accordion Items */}
         <div className="w-full font-figtree mx-auto my-5">
           <AccordionItem title="Nutritional Facts">
             {Parser().parse(currentProduct?.nutritionalInfo || "")}
           </AccordionItem>
           <AccordionItem title="Details">
             {Parser().parse(currentProduct?.productDetails || "")}
           </AccordionItem>
           <AccordionItem title="Benefits">
             {Parser().parse(currentProduct?.benefits || "")}
           </AccordionItem>

          </div>


    

        {/* Recipe Suggestion */}
        {currentProduct?.recipe && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">
              Try it in: {currentProduct.recipe} - A comforting classic
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;