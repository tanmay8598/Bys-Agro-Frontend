"use client";

import { useState, useEffect } from "react";
import apiClient from "./../../api/client";

export default function Banner() {
  const [bannerMessage, setBannerMessage] = useState("");

  const getBannerMessage = async () => {
    try {
      const response = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "PREPAID",
      });

      if (response.ok) {
        setBannerMessage(response.data.data.bannerMessage);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  useEffect(() => {
    getBannerMessage();
  }, []);

  return (
    <div className="w-full text-center text-xs text-white py-1 bg-[#46504A] font-medium tracking-wide">
      {bannerMessage || "Free delivery and extra 5% discount on prepaid orders above ₹500"}
    </div>
  );
}