
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useCartStore } from './../../stores/cartStore';

export default function CartSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:rounded-tl-4xl lg:rounded-bl-4xl right-0 top-0 h-full w-full sm:w-lg md:w-sm bg-[#FAFAF6] z-50 flex flex-col font-figtree"
            >
              <div className="flex justify-between items-center p-5 rounded-tl-4xl bg-white border-b border-amber-100">
                <h2 className="font-semibold text-xl text-gray-800">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoClose className="text-xl cursor-pointer text-gray-600" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-32 h-32 mb-6 relative">
                  <div className="absolute inset-0 bg-[#E56A5C]/10 rounded-full"></div>
                  <div className="absolute inset-3 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="text-5xl text-[#E56A5C]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Your Cart is Empty
                </h3>

                <p className="text-gray-500 mb-8">
                  Looks like you haven't added anything yet
                </p>

                <button
                  onClick={() => {
                    onClose();
                    router.push("/all-products");
                  }}
                  className="bg-[#c1552c] cursor-pointer text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Start Shopping
                </button>
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
            {/* Header */}
            <div className="flex justify-between items-center rounded-tl-4xl p-5 bg-white border-b border-amber-100">
              <div>
                <h2 className="font-bold text-xl text-gray-800">Your Cart</h2>
                <p className="text-sm text-gray-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="text-xl cursor-pointer text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="bg-gray-100 rounded-2xl p-2 shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden relative">
                        <Image
                          src={item.image || "/icons/honey-jar.png"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.weight}
                          </p>
                        </div>
                        <span className="font-bold text-gray-800 text-base">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex cursor-pointer items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
                          >
                            <IoTrashOutline size={16} />
                          </button>

                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="text-sm font-medium text-[#2b1b12] w-6 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQty(item.id)}
                              disabled={item.quantity >= 4 || totalItems >= 4}
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
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-20 bg-white border-t border-amber-100 shadow-lg rounded-bl-4xl">
              <div className="px-5 py-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-xl text-[#c1552c]">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#c1552c] cursor-pointer text-white py-3.5 rounded-2xl font-semibold text-base shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                </button>

                <div className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <span>Powered by</span>
                  <img
                    src="/razorpay.png"
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