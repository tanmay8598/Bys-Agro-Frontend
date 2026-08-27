

"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaBuilding,
  FaTag,
  FaGift,
} from "react-icons/fa";
import { IoLocationOutline, IoPricetagOutline } from "react-icons/io5";
import { useRazorpay } from "react-razorpay";
import apiClient from "./../../api/client";
import AuthContext from "./../../auth/context";
import { useCartStore } from "./../../stores/cartStore";
import { GiPresent } from "react-icons/gi";
import useAuth from './../../auth/useAuth';
import Loader from './../../utility/Loader';
import FloatingLabelInput from './../../components/UI/FloatingLableInput';

export default function CheckoutContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { openLoginModal } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressSaving, setAddressSaving] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  // Cart states
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [originalShippingCharges, setOriginalShippingCharges] = useState({});

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const [isCodAvailable, setIsCodAvailable] = useState(false);
  const [checkingCod, setCheckingCod] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("online payments");
  const [shippingCharges, setShippingCharges] = useState({});
  const { error, Razorpay } = useRazorpay();
  const [errors, setErrors] = useState({});
  const [phoneHelperText, setPhoneHelperText] = useState("");

  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  // Form states
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    const zipRegex = /^[0-9]{6}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const cleanedPhone = formData.phone.replace(/\D/g, "");
      if (cleanedPhone.length !== 10) {
        newErrors.phone = "Mobile number must be exactly 10 digits";
      } else if (!phoneRegex.test(cleanedPhone)) {
        newErrors.phone =
          "Please enter a valid Indian mobile number (starts with 6,7,8, or 9)";
      }
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else {
      const cleanedZip = formData.zipCode.replace(/\D/g, "");
      if (cleanedZip.length !== 6) {
        newErrors.zipCode = "ZIP code must be exactly 6 digits";
      } else if (!zipRegex.test(cleanedZip)) {
        newErrors.zipCode = "Please enter a valid 6-digit ZIP code";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const discount = discountAmount || 0;

  const ItemsFinalPrice = cartItems.reduce((total, item) => {
    let itemFinalPrice = item.finalPrice;

    if (!itemFinalPrice && item.product) {
      const originalPrice = item.product.price || 0;
      const discount = item.product.discount || 0;
      const isFlash = item.product.isFlash && item.product.flash;

      if (isFlash) {
        const flash = item.product.flash;
        if (flash.discountType === "PERCENT") {
          itemFinalPrice =
            originalPrice - (originalPrice * flash.discountValue) / 100;
        } else if (flash.discountType === "FIXED") {
          itemFinalPrice = originalPrice - flash.discountValue;
        }
      } else if (discount > 0) {
        itemFinalPrice = originalPrice - (originalPrice * discount) / 100;
      } else {
        itemFinalPrice = originalPrice;
      }
      itemFinalPrice = Math.max(itemFinalPrice, 0);
    }

    return (
      total + Math.round(itemFinalPrice || 0) * (item.qty || item.quantity || 1)
    );
  }, 0);

  const finalTotal = Math.max(
    0,
    backendTotals.grandTotal +
      deliveryFee +
      codHandlingCharge -
      (backendTotals.grandTotal * extraDiscount) / 100 -
      discount,
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("redirectToCheckout")) {
      localStorage.removeItem("redirectToCheckout");
    }
  }, []);

  useEffect(() => {
    fetchCartData();
    getUser();
  }, [user]);
  useEffect(() => {
    getShippingCharges();
  }, [user, formData?.zipCode, cartItems, paymentMethod]);

  useEffect(() => {
    if (formData.zipCode && formData.zipCode.length === 6) {
      checkIfCashonDeliveryAvailable();
    } else {
      setIsCodAvailable(false);
    }
  }, [formData.zipCode, cartItems]);

  useEffect(() => {
    getDeliveryPrices();
  }, [paymentMethod]);

  useEffect(() => {
    if (user) {
      applyLinkedDiscountsToCart();
    }
  }, [user]);

  useEffect(() => {
    const cartTotal = backendTotals.grandTotal;
    const fee = calculateDeliveryFee(cartTotal);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, deliveryPrices]);

  const getDeliveryPrices = async () => {
    try {
      const response = await apiClient.get("/delivery-fee/get", {
        paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
      });

      if (response.ok && response.data?.data) {
        setDeliveryPrices(response.data.data);
        setExtraDiscount(response.data.data.extraDiscount || 0);
        setCodHandlingCharge(response.data.data.codHandlingCharge || 0);
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

  const extractWeightInGrams = (weightStr) => {
    if (!weightStr) return 0;

    const str = weightStr.toLowerCase().trim();

    try {
      if (str.includes("g") || str.includes("gram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      if (str.includes("kg") || str.includes("kilogram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]) * 1000;
        }
      }

      if (str.includes("ml") || str.includes("l")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      const fallbackMatch = str.match(/(\d+(\.\d+)?)/);
      if (fallbackMatch) {
        return parseFloat(fallbackMatch[1]);
      }

      return 0;
    } catch (error) {
      console.error("Error parsing weight:", weightStr, error);
      return 0;
    }
  };

  const calculateTotalWeight = async (items) => {
    let totalWeight = 0;

    items.forEach((item) => {
      if (item.product && item.product.weight) {
        const weightStr = item.product.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      }
      else if (item.weight) {
        const weightStr = item.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      }
    });

    return totalWeight;
  };

  const getUser = async () => {
    if (!user) return;
    const response = await apiClient.get("/user/get-user-by-id", {
      id: user?.id,
    });

    if (response.ok) {
      const u = response.data.user;

      setUserData(response.data.user);

      setFormData((prev) => ({
        ...prev,
        email: u.email || prev.email,
        firstName: u.firstName || prev.firstName,
        lastName: u.lastName || prev.lastName,
        address: u.address?.area || u.address?.address || prev.address,
        landmark: u.address?.landmark || prev.landmark,
        city: u.address?.city || prev.city,
        area: u.address?.area || prev.city,
        state: u.address?.state || prev.state,
        zipCode: u.address?.zipCode || u.address?.pincode || prev.zipCode,
        phone: u.phone || u.mobile || u.contactNumber || prev.phone,
      }));
    }
  };

  const updateUserDetails = async () => {
    if (!user) return;

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setAddressSaving(true);

    const response = await apiClient.post("/user/update", {
      userId: user?.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        area: formData.area,
        state: formData.state,
        city: formData.city,
        landmark: formData.landmark,
        mobile: formData.phone,
        pincode: formData.zipCode,
      },
    });

    if (response.ok) {
      const u = response.data.user;

      setFormData((prev) => ({
        ...prev,
        email: u.email || prev.email,
        firstName: u.firstName || prev.firstName,
        lastName: u.lastName || prev.lastName,
        address: u.address?.area || u.address?.address || prev.address,
        landmark: u.address?.landmark || prev.landmark,
        city: u.address?.city || prev.city,
        area: u.address?.area || prev.city,
        state: u.address?.state || prev.state,
        zipCode: u.address?.zipCode || u.address?.pincode || prev.zipCode,
        phone: u.phone || u.mobile || u.contactNumber || prev.phone,
      }));

      toast.success(response?.data?.message || "Address Updated!");
    }
    setAddressSaving(false);
  };

  const fetchCartData = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let items = [];
      if (response.data) {
        if (Array.isArray(response.data.cart)) items = response.data.cart;
        else if (Array.isArray(response.data.items))
          items = response.data.items;
        else if (response.data.cart) items = response.data.cart;
      }

      if (items.length === 0) {
        toast.error("Your cart is empty");
        router.push("/");
        return;
      }

      const calculatedSubtotal = items.reduce((sum, item) => {
        const originalPrice = item?.product?.price || 0;
        const quantity = item?.quantity || 0;
        const discount = item?.product?.discount || 0;
        const isFlash = item?.product?.isFlash && item?.product?.flash;

        let finalPrice = originalPrice;

        if (isFlash) {
          const flash = item.product.flash;
          if (flash.discountType === "PERCENT") {
            finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
          } else if (flash.discountType === "FIXED") {
            finalPrice = finalPrice - flash.discountValue;
          }
        }
        else if (discount > 0) {
          finalPrice = finalPrice - (finalPrice * discount) / 100;
        }

        finalPrice = Math.max(finalPrice, 0);
        return sum + Math.round(finalPrice) * quantity;
      }, 0);

      const originalSubtotal = items.reduce(
        (sum, item) =>
          sum + (item?.product?.price || 0) * (item?.quantity || 0),
        0,
      );

      const calculatedShipping = calculatedSubtotal > 500 ? 0 : 50;

      setCartItems(items);
      setSubtotal(calculatedSubtotal);
      setOriginalSubtotal(originalSubtotal);
      setShipping(calculatedShipping);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart information");
    }
  };

  const handleNoShippingOptions = () => {
    let calculatedShipping = subtotal > 500 ? 0 : 50;
    if (calculatedShipping > 0) {
      calculatedShipping = 80;
    }

    setShipping(calculatedShipping);
    setShippingCharges({
      cost: calculatedShipping,
      name: "Standard Shipping",
      delivery_days: "5-7",
      delivery_hours: "Estimated",
    });
  };

  const getShippingCharges = async () => {
    if (
      !formData?.zipCode ||
      formData.zipCode.length !== 6 ||
      cartItems.length === 0
    ) {
      return;
    }

    const weightInGrams = await calculateTotalWeight(cartItems);
    const weightInKg = weightInGrams / 1000;

    const orderItems = cartItems.map((item) => {
      const isCartItem = !!item.product;
      const productData = isCartItem ? item.product : item;
      const quantity = item?.quantity || 1;

      let finalPrice = productData?.price || 0;
      const originalPrice = productData?.price || 0;

      const discount = productData?.discount || 0;
      const isFlash = productData?.isFlash && productData?.flash;
      const flashId = isFlash ? productData.flash._id : null;

      if (isFlash) {
        const flash = productData.flash;
        if (flash.discountType === "PERCENT") {
          finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
        } else if (flash.discountType === "FIXED") {
          finalPrice = finalPrice - flash.discountValue;
        }
      }
      else if (discount > 0) {
        finalPrice = finalPrice - (finalPrice * discount) / 100;
      }

      finalPrice = Math.max(finalPrice, 0);

      return {
        name: productData?.name || "Product",
        qty: quantity,
        image: productData?.images?.[0] || "/icons/honey-jar.png",
        price: originalPrice,
        finalPrice: finalPrice,
        product: productData?._id,
        flashId: flashId,
        isCombo: productData?.isCombo || false,
        itemWeight: parseFloat(productData?.weight || 0),
        weight: parseFloat(
          productData?.packageWeight || productData?.weight || 0,
        ),
        height: productData?.height || 0,
        length: productData?.length || 0,
        width: productData?.width || 0,
      };
    });

    try {
      const response = await apiClient.post(
        "/shipping/calculate-shipping-cost-for-order",
        {
          orderItems: orderItems,
          deliveryPincode: formData.zipCode,
          total: finalTotal,
          weight: weightInKg.toString(),
          paymentMethod:
            paymentMethod === "online payments" ? "PREPAID" : "COD",
        },
      );

      if (response.ok) {
        const shippingData = response.data;

        setOriginalShippingCharges(shippingData?.totalShippingCost);

        let selectedShipping = null;

        if (shippingData?.cheapest?.cost !== undefined) {
          selectedShipping = shippingData.cheapest;
        } else if (shippingData?.fastest?.cost !== undefined) {
          selectedShipping = shippingData.fastest;
        } else if (shippingData?.recommended?.cost !== undefined) {
          selectedShipping = shippingData.recommended;
        }

        const hasFreeDelivery = selectedShipping?.delivery === true;

        if (selectedShipping) {
          if (hasFreeDelivery) {
            selectedShipping.cost = 0;
          }

          if (selectedShipping.cost > 0) {
            selectedShipping.cost = 80;
          }

          setShippingCharges(selectedShipping);
          setShipping(selectedShipping.cost || 0);
        } else {
          handleNoShippingOptions();
        }
      } else {
        handleNoShippingOptions();
      }
    } catch (error) {
      console.error("Error fetching shipping charges:", error);
      handleNoShippingOptions();
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await apiClient.get("/variation/apply-coupon", {
        code: couponCode.trim(),
        userId: user?.id,
      });

      if (response.ok) {
        const couponData = response.data.promoCode;

        const cartTotal = backendTotals.grandTotal;
        let discountAmount = 0;

        if (couponData.type === "Percentage") {
          discountAmount = (cartTotal * couponData.discount) / 100;

          if (
            couponData.maxDiscount &&
            discountAmount > couponData.maxDiscount
          ) {
            discountAmount = couponData.maxDiscount;
          }
        } else if (couponData.type === "Flat") {
          discountAmount = couponData.flatDiscount;
        }

        discountAmount = Math.min(discountAmount, cartTotal);

        setDiscountAmount(discountAmount);
        setAppliedCoupon({
          code: couponCode.trim(),
          discount: discountAmount,
          type: couponData.type,
          originalDiscount: couponData.discount,
          flatDiscount: couponData.flatDiscount,
          maxDiscount: couponData.maxDiscount,
        });

        toast.success(
          `Coupon applied! ${
            couponData.type === "Percentage"
              ? `${couponData.discount}% off`
              : `₹${couponData.flatDiscount} off`
          }`,
        );
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        toast.error("Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon");
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);

    if (value.length === 1 && !/^[6-9]/.test(value)) {
      value = "";
    } else if (value.length > 1) {
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleZipCodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      zipCode: value,
    }));

    if (errors.zipCode) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "",
      }));
    }

    if (value.length === 6) {
      await fetchPincodeDetails(value);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    setIsFetchingPincode(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      if (response.ok) {
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const firstPostOffice = data[0].PostOffice[0];

          setFormData((prev) => ({
            ...prev,
            city:
              firstPostOffice.District || firstPostOffice.Block || prev.city,
            state: firstPostOffice.State || prev.state,
            address: firstPostOffice.Name || prev.address,
          }));

          toast.success("City & State auto-filled!");
        } else {
          console.log("No pincode data found");
        }
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const checkIfCashonDeliveryAvailable = async () => {
    if (!formData?.zipCode || formData.zipCode.length !== 6) {
      setIsCodAvailable(false);
      return;
    }

    setCheckingCod(true);

    const weightInGrams = await calculateTotalWeight(cartItems);

    const weightInKg = weightInGrams / 1000;

    try {
      const response = await apiClient.post("/shipping/check-pincode", {
        deliveryPincode: formData.zipCode,
        weight: weightInKg.toString(),
        paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
      });

      if (response.ok && response.data?.serviceable === true) {
        setIsCodAvailable(true);
      } else {
        setIsCodAvailable(false);
      }
    } catch (error) {
      console.error("Error checking COD availability:", error);
      setIsCodAvailable(false);
    } finally {
      setCheckingCod(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!user) {
      toast.error("Please login to continue");
      openLoginModal();
      return;
    }

    if (!shippingCharges?.cost && shippingCharges?.cost !== 0) {
      toast.error("Please wait for shipping calculation to complete");
      return;
    }

    const weightInGrams = await calculateTotalWeight(cartItems);
    const weightInKg = weightInGrams / 1000;

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => {
        const isCartItem = !!item.product;
        const productData = isCartItem ? item.product : item;
        const quantity = item?.quantity || 1;

        let finalPrice = productData?.price || 0;
        const originalPrice = productData?.price || 0;

        const discount = productData?.discount || 0;
        const isFlash = productData?.isFlash && productData?.flash;
        const flashId = isFlash ? productData.flash._id : null;

        if (isFlash) {
          const flash = productData.flash;
          if (flash.discountType === "PERCENT") {
            finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
          } else if (flash.discountType === "FIXED") {
            finalPrice = finalPrice - flash.discountValue;
          }
        }
        else if (discount > 0) {
          finalPrice = finalPrice - (finalPrice * discount) / 100;
        }

        finalPrice = Math.max(finalPrice, 0);
        finalPrice = Math.round(finalPrice);

        return {
          name: productData?.name || "Product",
          qty: quantity,
          image: productData?.images?.[0] || "/icons/honey-jar.png",
          price: originalPrice,
          finalPrice: finalPrice,
          product: productData?._id,
          flashId: flashId,
          isCombo: productData?.isCombo || false,
          itemWeight: parseFloat(productData?.weight || 0),
          weight: parseFloat(
            productData?.packageWeight || productData?.weight || 0,
          ),
          height: productData?.height || 0,
          length: productData?.length || 0,
          width: productData?.width || 0,
        };
      });

      const shippingAddress = {
        area: formData.area || "",
        city: formData.city || "",
        landmark: formData.landmark || "",
        mobileNumber: formData.phone || "",
        email: formData.email || "",
        pincode: formData.zipCode || "",
        state: formData.state || "",
      };

      const ItemsFinalPrice = orderItems.reduce(
        (total, item) => total + item.finalPrice * item.qty,
        0,
      );

      const orderData = {
        orderItems,
        courierId: shippingCharges?.courier_id,
        courierName: shippingCharges?.courier_name,
        shippingAddress,
        shippingPrice: deliveryFee,
        paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
        totalWeight: weightInKg,
        itemsPrice: Number(ItemsFinalPrice),
        totalPrice: Number(finalTotal),
        userId: user?.id,
        freeDelivery: deliveryFee === 0,
        discount: discount,
        couponCode: appliedCoupon?.code || null,
        extraDiscount: extraDiscount,
        codHandlingCharge: codHandlingCharge,
      };

      console.log("pyaload", orderData);

      const response = await apiClient.post("/order/create-order", orderData);

      var paymentStatus = "pending";

      if (response.ok) {
        const orderData = response.data.orders[0];

        if (paymentMethod === "cash on delivery") {
          await apiClient.delete("/cart/clear", {
            userId: user?.id,
          });

          useCartStore.getState().clearCart();
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          localStorage.removeItem("buyNowItem");

          toast.success("Order placed successfully!");

          router.replace(`/checkout/success?orderId=${orderData._id}`);

          return;
        }

        const result = await createRazorpayOrder(finalTotal);
        const options = {
          key: result?.data?.notes?.key,
          amount: finalTotal,
          currency: "INR",
          name: "Ardvera Naturals LLP.",
          description: "Order Transaction",
          image: "https://motherlandpure.com/LogoR.webp",
          order_id: result?.data?.id,
          handler: async (res) => {
            try {
              const paymentId = res?.razorpay_payment_id;
              if (paymentId) {
                paymentStatus = "completed";
                const orderIds = response.data.orders.map((order) => order._id);

                await verifyOrder(orderIds, paymentStatus, orderData);
              }
            } catch (error) {
              paymentStatus = "failed";
              const orderIds = response.data.orders.map((order) => order._id);
              await verifyOrder(orderIds, paymentStatus);
              console.error("Payment verification error:", error);
            }
          },
          prefill: {
            email: user?.email,
            name: user?.name,
          },
          theme: {
            color: "#E56A5C",
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
      } else {
        toast.error(response.data.message || "Order not placed!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOrder = async (orderIds, paymentStatus, orderData) => {
    const idsArray = Array.isArray(orderIds) ? orderIds : [orderIds];

    const response = await apiClient.post("/order/verify-order", {
      orderIds: idsArray,
      paymentStatus,
      paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
    });

    if (response.ok && paymentStatus === "completed") {
      await apiClient.delete("/cart/clear", {
        userId: user?.id,
      });

      useCartStore.getState().clearCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      localStorage.removeItem("buyNowItem");

      toast.success("Order placed successfully!");

      router.replace(`/checkout/success?orderId=${orderData._id}`);
    }
  };

  const createRazorpayOrder = async (finalTotal) => {
    try {
      const response = await apiClient.get("/order/payment", {
        userId: user?.id,
        total: Math.round(finalTotal),
      });

      if (response?.ok) {
        return response;
      } else {
        toast.error(
          response?.data?.message || "Failed to create Razorpay order",
        );
        return null;
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Failed to create Razorpay order");
      return null;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif">
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-7xl mx-auto">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-[#E56A5C] rounded-full opacity-10"
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(i) * 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-white/80 backdrop-blur-md border-b border-[#e6ded2] shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-2">
          <div className="flex items-center md:text-left gap-2 md:gap-0 flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-xl md:text-3xl text-center font-bold text-[#2b1b12]">
                Checkout
              </h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-2 lg:py-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-[#e6ded2] p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
                    <FaUser className="text-[#c1552c]" size={20} />
                  </div>
                  <h2 className="text-lg md:text-2xl font-semibold text-[#2b1b12]">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />

                  <FloatingLabelInput
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => {
                      const isFirstDigit =
                        formData.phone.length === 0 ||
                        (e.target.selectionStart === 0 &&
                          e.target.selectionEnd === formData.phone.length);
                      if (isFirstDigit && /^[0-5]$/.test(e.key)) {
                        e.preventDefault();
                        toast.error("Mobile number cannot start with 0-5");
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text");
                      const cleaned = pasted.replace(/\D/g, "").slice(0, 10);
                      if (cleaned.length > 0 && /^[6-9]/.test(cleaned)) {
                        setFormData((prev) => ({ ...prev, phone: cleaned }));
                      } else if (cleaned.length > 0) {
                        toast.error(
                          "Mobile number must start with 6,7,8, or 9",
                        );
                      }
                    }}
                    error={errors.phone}
                    helperText={phoneHelperText}
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-[#e6ded2] p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-[#c1552c]" size={20} />
                  </div>
                  <h2 className="text-lg md:text-2xl font-semibold text-[#2b1b12]">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />

                  <FloatingLabelInput
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      label="Address"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      error={errors.area}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      label="Landmark (nearby place, optional)"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      error={errors.landmark}
                    />
                  </div>

                  <FloatingLabelInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                  <FloatingLabelInput
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                    required
                  />

                  <div className="relative">
                    <FloatingLabelInput
                      label="ZIP code"
                      name="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={handleZipCodeChange}
                      error={errors.zipCode}
                      maxLength={6}
                      inputMode="numeric"
                      required
                    />
                    {isFetchingPincode && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-[#c1552c] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {formData.zipCode.length === 6 &&
                      !isFetchingPincode &&
                      !errors.zipCode && (
                        <p className="text-xs text-gray-500 mt-1">
                          Enter 6 digits to auto-fill city & state
                        </p>
                      )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e6ded2]">
                  <motion.button
                    type="button"
                    onClick={() => updateUserDetails()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-sm md:w-auto px-8 py-3 bg-[#c1552c] text-white rounded-4xl font-semibold shadow-md transition-colors cursor-pointer hover:bg-[#a84824]"
                  >
                    {isAddressSaving
                      ? "Saving Address..."
                      : "Save Shipping Address"}
                  </motion.button>
                  <p className="text-sm text-gray-500 mt-2">
                    Save this address for future orders
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                  <h3 className="text-lg md:text-2xl font-semibold text-[#2b1b12] mb-6 text-center">
                    Order Summary
                  </h3>

                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(!isCartOpen)}
                      className="w-full flex cursor-pointer items-center justify-between mb-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#2b1b12]">
                          Your Items
                        </h4>
                        <span className="text-xs text-gray-500">
                          ({cartItems.length} items)
                        </span>
                      </div>
                      <div className="flex cursor-pointer items-center gap-2">
                        <svg
                          className={`w-4 h-4 text-[#c1552c] transition-transform duration-200 ${
                            isCartOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isCartOpen && (
                        <div
                          className={`space-y-4 ${cartItems.length > 3 ? "max-h-96 no-scrollbar overflow-y-auto pr-2" : ""}`}
                        >
                          {cartItems.map((item) => {
                            const originalPrice =
                              item?.product?.price || item?.price || 0;
                            const internalDiscount =
                              item?.product?.discount || item?.discount || 0;
                            const isFlash =
                              item?.product?.isFlash && item?.product?.flash;
                            const hasLinkedOffer = !!item?.linkedVia;

                            let displayPrice = originalPrice;
                            let showDiscount = false;
                            let isComboDiscount = false;
                            let comboDiscountValue = 0;
                            let comboDiscountType = "";
                            let finalDiscountPercent = 0;

                            if (isFlash) {
                              const flash = item.product.flash || item.flash;
                              if (flash?.discountType === "PERCENT") {
                                displayPrice =
                                  originalPrice -
                                  (originalPrice * flash.discountValue) / 100;
                                finalDiscountPercent = flash.discountValue;
                              } else if (flash?.discountType === "FIXED") {
                                displayPrice =
                                  originalPrice - flash.discountValue;
                                finalDiscountPercent =
                                  (flash.discountValue / originalPrice) * 100;
                              }
                              displayPrice = Math.max(displayPrice, 0);
                              showDiscount = true;
                            }
                            else if (
                              hasLinkedOffer &&
                              item.linkedVia?.linkedOfferId
                            ) {
                              const offer = item.linkedVia.linkedOfferId;
                              comboDiscountValue = offer.discountValue;
                              comboDiscountType = offer.discountType;
                              isComboDiscount = true;

                              if (comboDiscountType === "percentage") {
                                const totalDiscountPercent =
                                  internalDiscount + comboDiscountValue;
                                displayPrice =
                                  originalPrice -
                                  (originalPrice * totalDiscountPercent) / 100;
                                finalDiscountPercent = totalDiscountPercent;
                              } else if (
                                comboDiscountType === "flat" ||
                                comboDiscountType === "fixed"
                              ) {
                                const priceAfterInternal =
                                  originalPrice -
                                  (originalPrice * internalDiscount) / 100;
                                displayPrice =
                                  priceAfterInternal - comboDiscountValue;
                                finalDiscountPercent =
                                  ((originalPrice - displayPrice) /
                                    originalPrice) *
                                  100;
                              }
                              displayPrice = Math.max(displayPrice, 0);
                              showDiscount = true;
                            }
                            else if (internalDiscount > 0) {
                              displayPrice =
                                originalPrice -
                                (originalPrice * internalDiscount) / 100;
                              displayPrice = Math.max(displayPrice, 0);
                              finalDiscountPercent = internalDiscount;
                              showDiscount = true;
                            }

                            displayPrice = Math.round(displayPrice);

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
                                className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow mb-3"
                              >
                                <div className="flex gap-3">
                                  <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative">
                                      <Image
                                        src={
                                          item?.product?.images?.[0] ||
                                          item?.images?.[0] ||
                                          "/icons/honey-jar.png"
                                        }
                                        alt={
                                          item?.product?.name ||
                                          item?.name ||
                                          "Product"
                                        }
                                        fill
                                        className="object-cover rounded-xl"
                                      />
                                    </div>

                                    {!isFlash &&
                                      internalDiscount > 0 &&
                                      !isComboDiscount && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                          {Math.round(internalDiscount)}%
                                        </div>
                                      )}

                                    {isFlash && showDiscount && (
                                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {Math.round(finalDiscountPercent)}%
                                      </div>
                                    )}

                                    {isComboDiscount && !isFlash && (
                                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {Math.round(internalDiscount)}%
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                          {item?.product?.name || item?.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                          {item?.product?.weight ||
                                            item?.weight ||
                                            "Standard weight"}
                                        </p>

                                        {isComboDiscount && (
                                          <div className="flex items-center gap-1.5 mt-1">
                                            <GiPresent className="text-[#c1552c] text-xs" />
                                            <span className="text-xs bg-[#faf4ea] text-[#c1552c] px-2 py-0.5 rounded-full font-medium">
                                              Combo discount{" "}
                                              {getComboDiscountText()} OFF
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                      <div>
                                        {showDiscount ? (
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="font-bold text-[#c1552c] text-base">
                                              ₹
                                              {(displayPrice * (item?.quantity || 1)).toFixed(0)}
                                            </span>
                                            <span className="text-xs line-through text-gray-400">
                                              ₹
                                              {(originalPrice * (item?.quantity || 1)).toFixed(0)}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="font-bold text-gray-800 text-base">
                                            ₹
                                            {(displayPrice * (item?.quantity || 1)).toFixed(0)}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="bg-[#c1552c] rounded-lg border border-gray-200 px-2 py-1">
                                          <span className="text-sm font-medium">
                                            Qty: {item?.quantity || 1}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-6">
                    {appliedCoupon ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-linear-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-4 mb-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-green-800">
                                  {appliedCoupon.code}
                                </p>
                                <p className="text-xs text-green-600">
                                  {appliedCoupon.type === "Percentage"
                                    ? `${appliedCoupon.originalDiscount}% off`
                                    : `Flat ₹${appliedCoupon.flatDiscount} off`}
                                  {appliedCoupon.maxDiscount &&
                                    appliedCoupon.type === "Percentage" &&
                                    ` (Max ₹${appliedCoupon.maxDiscount})`}
                                </p>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="mb-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              setCouponError("");
                            }}
                            placeholder="Enter coupon code"
                            className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] focus:border-transparent pr-32 text-[#2b1b12]"
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#c1552c] text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#a84824]"
                          >
                            {isApplyingCoupon ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Applying
                              </div>
                            ) : (
                              "Apply"
                            )}
                          </motion.button>
                        </div>
                        {couponError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-2"
                          >
                            {couponError}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-2 font-figtree">
                    <div className="flex justify-between text-gray-800 text-sm font-medium">
                      <span>Original Price</span>
                      <span className="font-semibold text-gray-800">
                        ₹{Math.round(backendTotals.totalMRP).toFixed(0)}
                      </span>
                    </div>

                    {originalSubtotal - finalTotal > 0 &&
                      (() => {
                        const hasFlashSale = cartItems.some(
                          (item) =>
                            item?.product?.isFlash && item?.product?.flash,
                        );
                        const hasRegularDiscount = cartItems.some(
                          (item) =>
                            (item?.product?.discount > 0 ||
                              item?.discount > 0) &&
                            !(item?.product?.isFlash || item?.isFlash),
                        );

                        const badgeLabel = hasFlashSale
                          ? "FLASH SALE"
                          : "DISCOUNT ON MRP";
                        const badgeColor = hasFlashSale ? "red" : "amber";

                        return (
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-600">{badgeLabel}</span>
                            <span className="text-green-600 font-semibold">
                              -₹
                              {Math.floor(backendTotals?.totalMRPDiscount || 0)}
                            </span>
                          </div>
                        );
                      })()}

                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <span>Delivery fee</span>
                        {!formData.zipCode || formData.zipCode.length !== 6 ? (
                          <p className="text-xs text-gray-400 mt-1">
                            Enter pincode to see delivery options
                          </p>
                        ) : (
                          <p
                            className={`text-xs mt-1 ${deliveryFee === 0 ? "text-green-600" : "text-gray-500"}`}
                          >
                            {deliveryFee === 0
                              ? "FREE delivery on this order!"
                              : `₹${deliveryFee} delivery fee applies`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          {!formData.zipCode || formData.zipCode.length !== 6
                            ? "—"
                            : deliveryFee === 0
                              ? "FREE"
                              : `₹${deliveryFee}`}
                        </span>
                      </div>
                    </div>

                    {deliveryPrices?.feeStrategy === "CONDITIONAL" &&
                      deliveryFee > 0 &&
                      deliveryPrices?.freeThreshold > 0 && (
                        <div className="flex justify-between items-center bg-[#faf4ea] p-2 rounded-lg mt-1">
                          <span className="text-xs text-[#c1552c]">
                            Add ₹
                            {Math.max(
                              0,
                              (deliveryPrices?.freeThreshold || 500) - subtotal,
                            ).toFixed(0)}{" "}
                            more to get
                            <span className="font-semibold">
                              {" "}
                              FREE delivery
                            </span>
                          </span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#c1552c] rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, (subtotal / (deliveryPrices?.freeThreshold || 500)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                    {backendTotals.totalComboDiscount > 0 && (
                      <div className="flex justify-between items-center bg-[#faf4ea] p-2 rounded-lg -mx-2 px-2">
                        <div className="flex flex-col">
                          <span className="text-[#c1552c] font-medium text-sm">
                            Combo Savings
                          </span>
                          <span className="text-xs text-gray-500">
                            Additional discount on combo items
                          </span>
                        </div>
                        <span className="text-[#c1552c] font-bold text-sm">
                          -₹{Math.round(backendTotals.totalComboDiscount)}
                        </span>
                      </div>
                    )}

                    {codHandlingCharge > 0 && (
                      <div className="flex text-sm justify-between text-amber-600 bg-amber-50 p-2 rounded-lg -mx-2 px-2">
                        <div className="flex flex-col">
                          <span className="text-amber-700 font-medium">
                            COD Handling Charge
                          </span>
                          <span className="text-xs text-amber-600">
                            Extra charge for cash on delivery
                          </span>
                        </div>
                        <span className="text-amber-700 font-bold">
                          +₹{codHandlingCharge}
                        </span>
                      </div>
                    )}

                    {extraDiscount > 0 && (
                      <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
                        <div className="flex flex-col">
                          <span className="text-green-700 font-medium">
                            {paymentMethod === "online payments" ? "Prepaid Discount" : "Special Discount"}
                          </span>
                          <span className="text-xs text-green-600">
                            {paymentMethod === "online payments" ? "Prepaid discount applied" : "Special discount applied"}
                          </span>
                        </div>
                        <span className="text-green-700 font-bold">
                          -{extraDiscount}%
                        </span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
                        <div className="flex flex-col">
                          <span className="text-green-700 font-medium">
                            Coupon Discount
                          </span>
                          <span className="text-xs text-green-600">
                            {appliedCoupon?.type === "Percentage"
                              ? `${appliedCoupon?.originalDiscount}% off`
                              : `Flat ₹${appliedCoupon?.flatDiscount} off`}
                          </span>
                        </div>
                        <span className="text-green-700 font-bold">
                          -₹{discount.toFixed(0)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        Discounted Subtotal
                      </span>
                      <span className="text-sm font-bold text-[#c1552c]">
                        ₹{Math.round(backendTotals.grandTotal).toFixed(0)}
                      </span>
                    </div>

                    <div className="border-t border-[#e6ded2] pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <motion.span
                          key={finalTotal}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-2xl text-[#c1552c]"
                        >
                          ₹{finalTotal.toFixed(0)}
                        </motion.span>
                      </div>

                      <p className="text-sm text-gray-500">
                        Including all taxes
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/90 backdrop-blur-sm mb-6"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-6 h-6 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
                        <FaWallet className="text-[#c1552c]" size={14} />
                      </div>
                      <h2 className="text-lg md:text-xl font-semibold text-[#2b1b12]">
                        Payment Method
                      </h2>
                    </div>

                    <div className="space-y-3 mb-6">
                      <label
                        className={`flex items-center px-3 py-4 border rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === "online payments"
                            ? "border-[#c1552c] bg-[#faf4ea]"
                            : "border-gray-200 hover:border-[#c1552c]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online payments"
                          checked={paymentMethod === "online payments"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-[#c1552c] focus:ring-[#c1552c] shrink-0"
                        />

                        <div className="flex items-center gap-2 ml-3 overflow-x-auto no-scrollbar flex-nowrap">
                          <div className="flex items-center gap-1 shrink-0">
                            <FaMobileAlt className="text-[#c1552c] text-xs" />
                            <span className="text-xs text-gray-700">UPI</span>
                          </div>

                          <div className="w-px h-4 bg-gray-300 shrink-0"></div>

                          <div className="flex items-center gap-1 shrink-0">
                            <FaCreditCard className="text-[#c1552c] text-xs" />
                            <span className="text-xs text-gray-700">Credit/Debit</span>
                          </div>

                          <div className="w-px h-4 bg-gray-300 shrink-0"></div>

                          <div className="flex items-center gap-1 shrink-0">
                            <FaUniversity className="text-[#c1552c] text-xs" />
                            <span className="text-xs text-gray-700">Netbanking</span>
                          </div>

                          <div className="w-px h-4 bg-gray-300 shrink-0"></div>

                          <div className="flex items-center gap-1 shrink-0">
                            <FaWallet className="text-[#c1552c] text-xs" />
                            <span className="text-xs text-gray-700">Wallet</span>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-center p-4 border rounded-2xl transition-all ${
                          isCodAvailable
                            ? "cursor-pointer hover:border-[#c1552c]"
                            : "opacity-50 cursor-not-allowed"
                        } ${
                          paymentMethod === "cash on delivery"
                            ? "border-[#c1552c] bg-[#faf4ea]"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash on delivery"
                          checked={paymentMethod === "cash on delivery"}
                          onChange={(e) => {
                            if (isCodAvailable) {
                              setPaymentMethod(e.target.value);
                            }
                          }}
                          disabled={!isCodAvailable}
                          className="w-5 h-5 text-[#c1552c] focus:ring-[#c1552c] disabled:cursor-not-allowed mt-1 shrink-0"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between w-full flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-regular text-xs text-gray-900">
                                Cash on Delivery
                              </span>
                            </div>
                            {checkingCod && (
                              <div className="flex items-center text-sm text-gray-500">
                                <div className="w-4 h-4 border-2 border-[#c1552c] border-t-transparent rounded-full animate-spin mr-2"></div>
                                Checking...
                              </div>
                            )}
                          </div>

                          {!isCodAvailable && formData.zipCode.length === 6 && (
                            <p className="text-sm text-red-500 mt-2">
                              COD not available for this location
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    className="w-full bg-[#c1552c] cursor-pointer text-white py-4 rounded-4xl font-bold text-lg shadow-lg mb-4 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#a84824]"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">
                          Pay ₹{finalTotal.toFixed(0)}
                        </span>
                        <motion.div
                          className="absolute inset-0 cursor-pointer bg-[#a84824]"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </>
                    )}
                  </motion.button>

                  <div className="mt-2 pt-2 border-t border-[#e6ded2]">
                    <p className="text-center text-gray-600 font-semibold">
                      Secure & Encrypted
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}