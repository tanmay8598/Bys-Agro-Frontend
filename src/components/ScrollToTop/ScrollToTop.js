// components/ScrollToTop.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScrollToTop() {
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Listen for route changes using `router.events`
    router.events?.on("routeChangeComplete", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events?.off("routeChangeComplete", handleScroll);
    };
  }, [router]);

  return null; // No UI needed
}
