

"use client";

import apiClient from './../../api/client';
 import useAuth from './../../auth/useAuth';
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaMoneyCheck } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import CompactLinkedOffers from "./../../components/Offers/CompactLinkedOffers";
import { useCartStore } from './../../stores/cartStore';


export default function CartSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  // const { openLoginModal } = useContext(AuthContext);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const {
    cart: localCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    syncCartToBackend,
  } = useCartStore();

  const [backendCartData, setBackendCartData] = useState([]);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [codDeliveryPrices, setCodDeliveryPrices] = useState(null);
  const [prepaidDeliveryPrices, setPrepaidDeliveryPrices] = useState(null);
  const [activeDiscountType, setActiveDiscountType] = useState(null);

  // offers states
  const [selectedParentForOffers, setSelectedParentForOffers] = useState(null);
  const [showLinkedOffers, setShowLinkedOffers] = useState(true);
  const [availableParents, setAvailableParents] = useState([]);
  const [isCheckingOffers, setIsCheckingOffers] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true);

  // new backend discount states
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  // Merge local and backend carts
  const cartData = user ? backendCartData : localCart;

  // Add this after line ~55 (after cartData definition)
  const getLocalCartTotals = () => {
    if (!Array.isArray(localCart) || localCart.length === 0) {
      return {
        totalMRP: 0,
        totalMRPDiscount: 0,
        totalComboDiscount: 0,
        grandTotal: 0,
      };
    }

    let totalMRP = 0;
    let totalMRPDiscount = 0;

    localCart.forEach((item) => {
      const price = item?.product?.price || 0;
      const discount = item?.product?.discount || 0;
      const qty = item?.quantity || 1;

      totalMRP += price * qty;
      totalMRPDiscount += ((price * discount) / 100) * qty;
    });

    const grandTotal = totalMRP - totalMRPDiscount;

    return {
      totalMRP,
      totalMRPDiscount,
      totalComboDiscount: 0,
      grandTotal,
    };
  };

  const getTotalCartQuantity = () => {
    if (!Array.isArray(cartData)) return 0;
    return cartData.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  const localTotals = getLocalCartTotals();
  const cartTotal = user ? backendTotals.grandTotal : localTotals.grandTotal;

  const getCartCount = async () => {
    if (!user) return;

    try {
         setIsLoadingCart(true);
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let backendItems = [];
      if (response.data && Array.isArray(response.data?.cart)) {
        backendItems = response.data.cart;
      } else if (response.data && Array.isArray(response.data.items)) {
        backendItems = response.data.items;
      } else if (response.data && response.data.cart) {
        backendItems = response.data.cart || [];
      }

      setBackendCartData(backendItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setBackendCartData([]);
    }finally {
    setIsLoadingCart(false);
  }
  };

  const checkLinkedOffersForCart = async () => {
    if (!user || cartData.length === 0) return;

    setIsCheckingOffers(true);
    try {
      const parentsWithOffers = [];

      for (const item of cartData) {
        const response = await apiClient.get(
          "/linked-offer/get-linked-offers-by-product",
          {
            productId: item.product._id,
          },
        );

        if (response.data?.offers?.length > 0) {
          parentsWithOffers.push({
            productId: item.product._id,
            product: item.product,
            offers: response.data.offers,
          });
        }
      }

      setAvailableParents(parentsWithOffers);
      if (parentsWithOffers.length > 0) {
        setSelectedParentForOffers(parentsWithOffers[0]);
        setShowLinkedOffers(true);
      } else {
        setShowLinkedOffers(false);
      }
    } catch (error) {
      console.error("Error checking linked offers:", error);
    } finally {
      setIsCheckingOffers(false);
    }
  };

  // applyLinkedDiscountsToCart function
  const applyLinkedDiscountsToCart = async () => {
    try {
      const response = await apiClient.post("/cart/apply-linked-discounts", {
        userId: user?.id,
      });

      if (response.data) {
        setBackendTotals({
          totalMRP: response.data.totalMRP || 0,
          totalComboDiscount: response.data.totalComboDiscount || 0,
          totalMRPDiscount: response.data.totalMRPDiscount || 0,
          grandTotal: response.data.grandTotal || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cart totals:", error);
    }
  };

  const getDeliveryPrices = async () => {
    try {
      // Fetch PREPAID delivery settings
      const prepaidResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "PREPAID",
      });
      
      // Fetch COD delivery settings
      const codResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "COD",
      });

      let prepaidData = null;
      let codData = null;

      if (prepaidResponse.ok && prepaidResponse.data?.data) {
        prepaidData = prepaidResponse.data.data;
        setPrepaidDeliveryPrices(prepaidData);
      }
      
      if (codResponse.ok && codResponse.data?.data) {
        codData = codResponse.data.data;
        setCodDeliveryPrices(codData);
      }

      // Priority: PREPAID extraDiscount > COD extraDiscount > Nothing
      if (prepaidData && prepaidData.extraDiscount > 0) {
        setDeliveryPrices(prepaidData);
        setExtraDiscount(prepaidData.extraDiscount || 0);
        setCodHandlingCharge(0);
        setActiveDiscountType("PREPAID");
      } else if (codData && codData.extraDiscount > 0) {
        setDeliveryPrices(codData);
        setExtraDiscount(codData.extraDiscount || 0);
        setCodHandlingCharge(codData.codHandlingCharge || 0);
        setActiveDiscountType("COD");
      } else {
        setDeliveryPrices(prepaidData || codData || null);
        setExtraDiscount(0);
        setCodHandlingCharge(0);
        setActiveDiscountType(null);
      }
      
    } catch (error) {
      console.error("Error fetching delivery prices:", error);
    }
  };

  const calculateDeliveryFee = (cartTotal) => {
    if (!deliveryPrices) return 0;

    const { feeStrategy, feeAmount, freeThreshold } = deliveryPrices;

    if (feeStrategy === "FREE") {
      return 0;
    } else if (feeStrategy === "CONDITIONAL") {
      return cartTotal >= freeThreshold ? 0 : feeAmount;
    } else if (feeStrategy === "FIXED") {
      return feeAmount;
    }

    return 0;
  };

  const removeSingleItemFromCart = async (item) => {
    if (user) {
      const response = await apiClient.delete("/cart/remove", {
        cartItemId: item._id,
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        getCartCount();
        applyLinkedDiscountsToCart();
        checkLinkedOffersForCart();
        toast.success(response.data.message || "Done!");
      }
    } else {
      removeFromCart(item._id);
      toast.success("Item removed from cart!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  // QUANTITY CHANGE - SAME LOGIC AS CartContent
  const handleQuantityChange = async (
    cartItem,
    newQuantity,
    currentQuantity,
  ) => {
    if (newQuantity < 1) return;

    // Calculate current total cart quantity
    const currentTotalQuantity = getTotalCartQuantity();
    const quantityDifference = newQuantity - currentQuantity;
    const newTotalQuantity = currentTotalQuantity + quantityDifference;

    // GLOBAL CART LIMIT CHECK (max 4 total items)
    if (newQuantity > currentQuantity && newTotalQuantity > 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please remove some items before adding more.",
      );
      return;
    }

    if (newQuantity > currentQuantity && newQuantity > 4) {
      toast.error(
        "You can add maximum 4 items of the same product. For larger quantities, please create another order.",
      );
      return;
    }

    if (newQuantity > currentQuantity) {
      const availableStock = cartItem?.product?.countInStock?.quantity || 0;
      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    setUpdatingItem(cartItem?._id);

    try {
      if (user) {
        const type = newQuantity > currentQuantity ? "increment" : "decrement";

        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: {
            product: cartItem?.product?._id,
            qty: Math.abs(newQuantity - currentQuantity),
          },
          type: type,
        });

        if (response.ok) {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          getCartCount();
          toast.success(
            response.data.message ||
              `Quantity ${type === "increment" ? "increased" : "decreased"}!`,
          );
        } else {
          toast.error("Failed to update quantity");
        }
      } else {
        if (newQuantity > currentQuantity) {
          increaseQty(cartItem?._id);
        } else {
          decreaseQty(cartItem?._id);
        }
        toast.success(`Quantity updated!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const refreshCartData = async () => {
    if (user) {
      await getCartCount();
      await applyLinkedDiscountsToCart();
      await checkLinkedOffersForCart();
    }
  };

  const handleCheckout = () => {
    if (!user) {
      onClose();
      localStorage.setItem("redirectToCheckout", "true");
      // openLoginModal();
      return;
    }


    router.push("/checkout");
    onClose();
  };

  useEffect(() => {
    if (user && cartData.length > 0) {
      checkLinkedOffersForCart();
    } else {
      setShowLinkedOffers(false);
      setAvailableParents([]);
      setSelectedParentForOffers(null);
    }
  }, [user, cartData]);


  // Sync cart when user logs in
  useEffect(() => {
    if (user && localCart.length > 0) {
      const syncCart = async () => {
        const success = await syncCartToBackend(user.id, apiClient);
        if (success) {
          getCartCount();
        }
      };
      syncCart();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getCartCount();
    }else {
    setIsLoadingCart(false);
  }
  }, [user]);

  useEffect(() => {
    getDeliveryPrices();
  }, []);

  useEffect(() => {
    if (user && backendCartData.length > 0) {
      applyLinkedDiscountsToCart();
    }
  }, [user, backendCartData]);

  useEffect(() => {
    if (isOpen && user) {
      getCartCount();
    }
  }, [isOpen, user]);

  // CONFETTI
  useEffect(() => {
    if (isOpen && cartData?.length > 0) {
      import("canvas-confetti").then((confetti) => {

  confetti.default({
          particleCount: 60,
          spread: 70,
          origin: { x: 0.8, y: 0.2 },
        });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const cartTotal = user ? backendTotals.grandTotal : localTotals.grandTotal;
    const fee = calculateDeliveryFee(cartTotal);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, deliveryPrices]);

  useEffect(() => {
    // Listen for custom event to open cart
    const openCartFromEvent = () => {
      window.dispatchEvent(new CustomEvent("triggerCartOpen"));
    };

    window.addEventListener("openCartSidebar", openCartFromEvent);

    return () => {
      window.removeEventListener("openCartSidebar", openCartFromEvent);
    };
  }, []);

    // After cartData definition
if (isLoadingCart) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:rounded-tl-4xl lg:rounded-bl-4xl right-0 top-0 h-full w-full sm:w-lg md:w-sm bg-[#FAFAF6] z-50 flex flex-col font-figtree shadow-2xl"
          >
            <div className="flex justify-between items-center rounded-tl-4xl p-5 bg-white border-b border-amber-100">
              <div>
                <h2 className="font-bold text-xl text-gray-800">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="text-xl cursor-pointer text-gray-600" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#c1552c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#2b1b12]">Loading cart...</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

  

  if (cartData?.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:rounded-tl-4xl lg:rounded-bl-4xl right-0 top-0 h-full w-full sm:w-lg md:w-sm bg-[#FAFAF6] z-50 flex flex-col font-figtree"
            >
              <div className="flex justify-between items-center p-5 rounded-tl-4xl bg-white border-b border-amber-100">
                <h2 className="font-semibold text-xl text-gray-800">
                  Your Cart
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoClose className="text-xl cursor-pointer text-gray-600" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 mb-6 relative"
                >
                  <div className="absolute inset-0 bg-[#E56A5C]/10 rounded-full"></div>
                  <div className="absolute inset-3 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="text-5xl text-[#E56A5C]" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Your Cart is Empty
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 mb-8"
                >
                  Looks like you haven't added anything yet
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    router.push("/all-products");
                  }}
                  className="bg-[#E56A5C] cursor-pointer text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Start Shopping
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:rounded-tl-4xl lg:rounded-bl-4xl right-0 top-0 h-full w-full sm:w-lg md:w-sm bg-[#FAFAF6] z-50 flex flex-col font-figtree shadow-2xl"
          >
            <div className="flex justify-between items-center rounded-tl-4xl p-5 bg-white border-b border-amber-100">
              <div>
                <h2 className="font-bold text-xl text-gray-800">Your Cart</h2>
                <p className="text-sm text-gray-500">
                  {cartData.length} {cartData.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="text-xl cursor-pointer text-gray-600" />
              </button>
            </div>

            {showLinkedOffers && selectedParentForOffers && (
              <div className="sticky top-0 z-10 bg-linear-to-r from-primary-50 to-amber-50 border-b border-primary-200 shadow-sm">
               <div
  onClick={() => setIsOffersExpanded(!isOffersExpanded)}
  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#FDF5F0] transition-colors rounded-t-lg"
>
  <div className="flex items-center gap-2">
    <div className="relative">
      <GiPresent className="text-[#E56A5C] text-sm animate-bounce" />
    </div>
    <p className="text-xs font-semibold text-[#E56A5C]">
      Special Add-On Offers Available!
    </p>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-[#c1552c] font-medium">
      Add to save more
    </span>
    {isOffersExpanded ? (
      <FaChevronUp className="w-3 h-3 text-[#c1552c]" />
    ) : (
      <FaChevronDown className="w-3 h-3 text-[#c1552c]" />
    )}
  </div>
</div>

                <AnimatePresence>
                  {isOffersExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 max-h-48 lg:max-h-40 overflow-y-auto no-scrollbar">
                        {availableParents.length > 1 && (
                          <div className="flex items-center gap-1 mb-2 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] text-gray-500 whitespace-nowrap">
                              For:
                            </span>
                            <div className="flex gap-1">
                              {availableParents.map((parent) => (
                                <button
                                  key={parent.productId}
                                  onClick={() =>
                                    setSelectedParentForOffers(parent)
                                  }
                                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                    selectedParentForOffers?.productId ===
                                    parent.productId
                                      ? "bg-primary-400 text-white"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  {parent.product.name.length > 15
                                    ? parent.product.name.substring(0, 15) +
                                      "..."
                                    : parent.product.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <CompactLinkedOffers
                          parentProductId={selectedParentForOffers.productId}
                          parentProduct={selectedParentForOffers.product}
                          onAddSuccess={refreshCartData}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {cartData.map((item) => {
                const originalPrice = item?.product?.price || 0;
                const internalDiscount = item?.product?.discount || 0;
                const isFlash = item?.product?.isFlash && item?.product?.flash;
                const hasLinkedOffer = !!item?.linkedVia;

                let displayPrice = originalPrice;
                let showDiscount = false;
                let isComboDiscount = false;
                let comboDiscountValue = 0;
                let comboDiscountType = "";
                let totalDiscountPercent = 0;

                if (hasLinkedOffer && item.linkedVia?.linkedOfferId) {
                  const offer = item.linkedVia.linkedOfferId;
                  comboDiscountValue = offer.discountValue;
                  comboDiscountType = offer.discountType;
                  isComboDiscount = true;
                }

                if (isComboDiscount) {
                  if (comboDiscountType === "percentage") {
                    totalDiscountPercent =
                      internalDiscount + comboDiscountValue;
                    displayPrice =
                      originalPrice -
                      (originalPrice * totalDiscountPercent) / 100;
                  } else if (
                    comboDiscountType === "flat" ||
                    comboDiscountType === "fixed"
                  ) {
                    const priceAfterInternal =
                      originalPrice - (originalPrice * internalDiscount) / 100;
                    displayPrice = priceAfterInternal - comboDiscountValue;
                    totalDiscountPercent =
                      ((originalPrice - displayPrice) / originalPrice) * 100;
                  }
                  displayPrice = Math.max(displayPrice, 0);
                  showDiscount = true;
                } else if (isFlash) {
                  const flash = item.product.flash;
                  if (flash.discountType === "PERCENT") {
                    displayPrice =
                      originalPrice -
                      (originalPrice * flash.discountValue) / 100;
                  } else {
                    displayPrice = originalPrice - flash.discountValue;
                  }
                  displayPrice = Math.max(displayPrice, 0);
                  showDiscount = true;
                } else if (internalDiscount > 0) {
                  displayPrice =
                    originalPrice - (originalPrice * internalDiscount) / 100;
                  displayPrice = Math.max(displayPrice, 0);
                  showDiscount = true;
                }

                const getComboDiscountText = () => {
                  if (comboDiscountType === "percentage") {
                    return `+${comboDiscountValue}%`;
                  } else if (
                    comboDiscountType === "flat" ||
                    comboDiscountType === "fixed"
                  ) {
                    return `+₹${comboDiscountValue}`;
                  }
                  return null;
                };

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="bg-gray-100 rounded-2xl p-2 shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
                      {/* IMAGE SECTION */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden relative">
                          <Image
                            src={
                              item?.product?.images?.[0] ||
                              "/icons/honey-jar.png"
                            }
                            alt={item?.product?.name || "Product"}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>

                        {internalDiscount > 0 && !isFlash && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {Math.round(internalDiscount)}%
                          </div>
                        )}

                        {isFlash && showDiscount && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            SALE
                          </div>
                        )}
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                              {item?.product?.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item?.product?.weight}
                            </p>

                            {isComboDiscount && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <GiPresent className="text-primary-400 text-xs" />
                                <span className="text-xs bg-primary-100 text-primary-400 px-2 py-0.5 rounded-full font-medium">
                                  Combo discount {getComboDiscountText()} OFF
                                </span>
                              </div>
                            )}
                          </div>

                          {/* PRICE SECTION */}
                          <div className="text-right">
                            {showDiscount ? (
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-amber-600 text-lg">
                                  ₹{Math.round(displayPrice)}
                                </span>
                                <span className="text-xs line-through text-gray-400">
                                  ₹{Math.round(originalPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-gray-800 text-base">
                                ₹{Math.round(displayPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* BOTTOM ROW - Quantity Controls */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeSingleItemFromCart(item)}
                              className="w-8 h-8 flex cursor-pointer items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
                            >
                              <IoTrashOutline size={16} />
                            </button>

                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity - 1,
                                    item.quantity,
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updatingItem === item._id
                                }
                                className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                              >
                                −
                              </button>

                              <span className="text-sm font-medium w-6 text-center">
                                {updatingItem === item._id ? (
                                  <div className="w-4 h-4 border-2  border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                 <p className="text-gray-700"> {item.quantity}</p>
                                )}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity + 1,
                                    item.quantity,
                                  )
                                }
                                disabled={
                                  updatingItem === item._id ||
                                  item.quantity >= 4 ||
                                  getTotalCartQuantity() >= 4 ||
                                  item.quantity >=
                                    (item?.product?.countInStock?.quantity || 0)
                                }
                                className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="sticky bottom-0 z-20 bg-white border-t border-amber-100 shadow-lg rounded-bl-4xl">
              <div
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex justify-between items-center px-5 py-4 cursor-pointer"
              >
                <div className="flex text-sm items-center gap-2 font-semibold text-gray-800">
                  <FaMoneyCheck className="text-lg text-[#E56A5C]" />
                  <span>Estimated total</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    <span>
                      ₹
                      {Math.round(
                        (user ? backendTotals.grandTotal : localTotals.grandTotal) +
                        deliveryFee +
                        (activeDiscountType === "COD" ? codHandlingCharge : 0) -
                        ((user ? backendTotals.grandTotal : localTotals.grandTotal) * 
                          (extraDiscount || 0)) / 100
                      )}
                    </span>
                  </span>
                  {showBreakdown ? (
                    <FaChevronUp className="text-gray-500 text-sm" />
                  ) : (
                    <FaChevronDown className="text-gray-500 text-sm" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-4 text-sm text-gray-600"
                  >
                    <div className="border-t border-dashed pt-3 space-y-2">
                      {/* Total MRP */}
                      <div className="flex justify-between">
                        <span>Total MRP</span>
                        <span>
                          ₹
                          {Math.round(
                            user
                              ? backendTotals.totalMRP
                              : localTotals.totalMRP,
                          )}
                        </span>
                      </div>

                      {/* Product Internal Discounts */}
                      {(user
                        ? backendTotals.totalMRPDiscount
                        : localTotals.totalMRPDiscount) > 0 && (
                        <div className="flex justify-between">
                          <span>Discount on MRP</span>
                          <span className="text-green-700">
                            -₹
                            {Math.round(
                              user
                                ? backendTotals.totalMRPDiscount
                                : localTotals.totalMRPDiscount,
                            )}
                          </span>
                        </div>
                      )}

                      {/* Combo Savings */}
                      {backendTotals.totalComboDiscount > 0 && (
                        <div className="flex justify-between items-center bg-primary-100 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">
                              Combo Savings
                            </span>
                            <span className="text-xs text-gray-500">
                              Additional discount on combo items
                            </span>
                          </div>
                          <span className="text-primary-400 font-bold">
                            -₹{Math.round(backendTotals.totalComboDiscount)}
                          </span>
                        </div>
                      )}

                      {/* Delivery Fee */}
                      <div className="flex justify-between items-center">
                        <span>Delivery fee</span>
                        <span>
                          {deliveryFee === 0 ? (
                            <span className="font-semibold">
                              FREE shipping {activeDiscountType === "PREPAID" ? "(Prepaid)" : activeDiscountType === "COD" ? "(COD)" : ""}
                            </span>
                          ) : (
                            `₹${deliveryFee}`
                          )}
                        </span>
                      </div>

                      {/* Free shipping progress */}
                      {deliveryPrices?.feeStrategy !== "FREE" &&
                        deliveryPrices?.feeStrategy !== "FIXED" &&
                        backendTotals.grandTotal <
                          (deliveryPrices?.freeThreshold || 500) &&
                        backendTotals.grandTotal > 0 && (
                          <div className="flex justify-between items-center bg-primary-100 p-2 rounded-lg mt-1">
                            <span className="text-xs text-primary-400">
                              Add ₹
                              {Math.max(
                                0,
                                (deliveryPrices?.freeThreshold || 500) -
                                  backendTotals.grandTotal,
                              ).toFixed(0)}{" "}
                              more to get
                              <span className="font-semibold">
                                {" "}
                                FREE shipping (Prepaid)
                              </span>
                            </span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-400 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, (backendTotals.grandTotal / (deliveryPrices?.freeThreshold || 500)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                      {/* Extra Discount */}
                      {extraDiscount > 0 && activeDiscountType === "PREPAID" && (
                        <div className="flex justify-between items-center bg-primary-50 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">Prepaid Discount</span>
                            <span className="text-xs text-gray-500">Prepaid discount applied</span>
                          </div>
                          <span className="text-primary-400 font-bold">-{extraDiscount}%</span>
                        </div>
                      )}

                      {extraDiscount > 0 && activeDiscountType === "COD" && (
                        <div className="flex justify-between items-center bg-primary-50 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">Special Discount</span>
                            <span className="text-xs text-gray-500">Special discount applied</span>
                          </div>
                          <span className="text-primary-400 font-bold">-{extraDiscount}%</span>
                        </div>
                      )}

                      {codHandlingCharge > 0 && activeDiscountType === "COD" && (
                        <div className="flex justify-between items-center">
                          <span>COD Handling Charge</span>
                          <span className="text-warning">+₹{codHandlingCharge}</span>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div className="border-t border-dashed pt-2 mt-2 flex justify-between font-semibold text-gray-800">
                        <span>Grand total</span>
                        <span>
                          ₹
                          {Math.round(
                            (user ? backendTotals.grandTotal : localTotals.grandTotal) +
                            deliveryFee +
                            (activeDiscountType === "COD" ? codHandlingCharge : 0) -
                            ((user ? backendTotals.grandTotal : localTotals.grandTotal) * 
                              (extraDiscount || 0)) / 100
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-5 pb-5">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#c1552c] cursor-pointer text-white py-3.5 rounded-2xl font-semibold text-base shadow-md hover:shadow-lg transition-all"
                >
                  Checkout
                </button>

                <div className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <span>Powered by</span>
                  <img
                    src="/icons/razorpay.png"
                    alt="razorpay"
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}