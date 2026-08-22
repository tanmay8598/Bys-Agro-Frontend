"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaPhone } from "react-icons/fa6";
import { MdEmail, MdOutlineMail } from "react-icons/md";
import { X, ShieldCheck } from "lucide-react";
import { useCartStore } from "./../../stores/cartStore";
import useAuth from './../../auth/useAuth';
import apiClient from './../../api/client';
import { useRouter } from "next/navigation";


export default function LoginSidebar({
  isOpen,
  onClose,
  mobile,
  setMobile,
  email,
  setEmail,
  isEmailMode,
  setIsEmailMode,
  setIsVerificationModalOpen,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logIn } = useAuth();
  const { syncCartToBackend } = useCartStore();
  const sidebarRef = useRef(null);
    const router = useRouter();


  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    setError(value.length !== 10 ? "Mobile number must be 10 digits" : "");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setError(!emailRegex.test(value) ? "Enter a valid email address" : "");
  };

  const toggleMode = () => {
    setIsEmailMode(!isEmailMode);
    setError("");
    setMobile("");
    setEmail("");
  };

  const handleSendOtp = async () => {
    const url = `/user/${
      isEmailMode ? "login-with-email" : "login-with-mobile"
    }`;
// console.log("url payload", url,  {
//         [isEmailMode ? "email" : "phone"]: isEmailMode ? email : mobile,
//       })
    try {
      setLoading(true);
      const response = await apiClient.post(url, {
        [isEmailMode ? "email" : "phone"]: isEmailMode ? email : mobile,
      });

      // console.log("response", response)

      if (!response.ok) {
        return;
      }
      toast.success(response?.data?.message);
      onClose();
      setIsVerificationModalOpen(true);
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;

    try {
      const response = await apiClient.post(`/user/register-user-google`, {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        jwtToken: idToken,
      });

      if (response?.ok) {
        toast.success(response.data.message || "Login successful");

        if (response?.data) {
          const synced = await syncCartToBackend(
            response?.data?._id,
            apiClient,
          );
          if (synced) {
            toast.success("Your cart items have been saved to your account!");
          }
        }

        logIn(response?.data?.accessToken, response?.data?.refreshToken);

        const shouldRedirect = localStorage.getItem("redirectToCheckout");
        if (shouldRedirect === "true") {
          localStorage.removeItem("redirectToCheckout");
          window.location.href = "/checkout";
          return;
        }

        onClose();
      } else {
        toast.error(response.data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google Login Failed");
  };

  const isMobileValid = !isEmailMode && mobile.length === 10;
  const isEmailValid = isEmailMode && email && !error;
  const isDisabled = !isMobileValid && !isEmailValid;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#312620]/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-full sm:w-110 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slideIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9e1d7]">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2b1b12]">
              Welcome Back
            </h2>
            <p className="text-sm text-[#8a8179] mt-0.5">
              Login to continue shopping
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#faf4ea] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={22} className="text-[#5a5a5a]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          <div className="max-w-sm mx-auto">
            <p className="text-[#5a4a3a] text-sm mb-6">
              {isEmailMode
                ? "Enter your email address to receive a verification code."
                : "Enter your mobile number to receive a verification code."}
            </p>

            {/* Input Field */}
            <div className="mb-5">
              <label className="text-[#5a4a3a] text-sm font-medium mb-2 block">
                {isEmailMode ? "Email Address" : "Mobile Number"}
              </label>

              <div
                className={`flex items-center bg-[#faf4ea] border rounded-xl px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#c1552c]/30 ${
                  error
                    ? "border-red-400"
                    : isMobileValid || isEmailValid
                    ? "border-[#c1552c]"
                    : "border-[#e6ded2]"
                }`}
              >
                {!isEmailMode ? (
                  <div className="flex items-center gap-2 pr-3 border-r border-[#e6ded2]">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm text-[#5a4a3a] font-medium">
                      +91
                    </span>
                  </div>
                ) : (
                  <div className="pr-3 border-r border-[#e6ded2]">
                    <MdOutlineMail className="text-[#8a8179] text-xl" />
                  </div>
                )}

                <input
                  type={isEmailMode ? "email" : "text"}
                  value={isEmailMode ? email : mobile}
                  onChange={isEmailMode ? handleEmailChange : handleMobileChange}
                  maxLength={isEmailMode ? undefined : 10}
                  inputMode={isEmailMode ? "email" : "numeric"}
                  placeholder={
                    isEmailMode ? "Enter email address" : "Enter mobile number"
                  }
                  className="flex-1 py-3.5 px-3 bg-transparent text-[#2b1b12] text-sm focus:outline-none placeholder:text-[#a0968c]"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={isDisabled || loading}
              className={`w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                !isDisabled && !loading
                  ? "bg-[#c1552c] hover:bg-[#ad4825] hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                  : "bg-[#a0968c] cursor-not-allowed opacity-60"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6 text-[#a0968c]">
              <span className="flex-1 border-t border-[#e6ded2]"></span>
              <span className="px-3 text-xs font-medium">or continue with</span>
              <span className="flex-1 border-t border-[#e6ded2]"></span>
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleLoginError}
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                />
              </div>

              <button
                onClick={toggleMode}
                className="w-full rounded-xl bg-[#faf4ea] p-3.5 flex items-center justify-center gap-3 text-[#2b1b12] text-sm font-medium hover:bg-[#efe8dd] hover:scale-[1.01] transition-all duration-200 cursor-pointer border border-[#e6ded2]"
              >
                {isEmailMode ? (
                  <>
                    <FaPhone size={18} className="text-[#c1552c]" />
                    Continue with Phone
                  </>
                ) : (
                  <>
                    <MdEmail size={18} className="text-[#c1552c]" />
                    Continue with Email
                  </>
                )}
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-[#8a8179] mt-6 text-center">
              By continuing, you agree to our{" "}
              <button
                onClick={() => {
                  onClose();
                  router.push("/terms-conditions");
                }}
                className="text-[#c1552c] hover:underline cursor-pointer"
              >
                Terms & Conditions
              </button>
            </p>

            {/* Trust Badge */}
            {/* <div className="mt-6 p-4 bg-[#faf4ea] rounded-xl border border-[#e6ded2]">
              <div className="flex items-center justify-center gap-2 text-xs text-[#5a4a3a]">
                <ShieldCheck size={16} className="text-[#c1552c]" />
                <span>100% secure • No spam • Fast checkout</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </>
  );
}