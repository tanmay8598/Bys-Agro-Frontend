"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Footer from "./../Footer/Footer";
import ScrollToTop from "./../ScrollToTop/ScrollToTop";
import Navbar from "./../Navbar/Navbar";
import AuthContext from "./../../auth/context";
import CartSidebar from "./../../app/cart/cartSidebar";

const ClientOnly = ({ children }) => {
  const [user, setUser] = useState();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Function to open cart from Navbar
  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // Global function to open cart from anywhere
  useEffect(() => {
    window.openCartSidebar = () => {
      setIsCartOpen(true);
    };

    window.closeCartSidebar = () => {
      setIsCartOpen(false);
    };

    // Listen for cart update events
    const handleCartUpdate = () => {
      console.log("Cart updated");
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      delete window.openCartSidebar;
      delete window.closeCartSidebar;
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Close cart on navigation (optional - improves UX)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsCartOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <Navbar onCartClick={handleCartOpen} />
        <main className="relative">
          {children}
          <ScrollToTop />
        </main>
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </AuthContext.Provider>
    </>
  );
};

export default ClientOnly;
