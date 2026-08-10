// // stores/cartStore.js
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],

//       // Add product with proper structure matching your backend
//       addToCart: (product, quantity = 1) => {
//         const cart = get().cart;
//         const exists = cart.find((item) => item.product._id === product._id);

//         if (exists) {
//           const updated = cart.map((item) =>
//             item.product._id === product._id
//               ? {
//                   ...item,
//                   quantity: item.quantity + quantity,
//                   product: product,
//                 }
//               : item,
//           );
//           set({ cart: updated });
//         } else {
//           set({
//             cart: [
//               ...cart,
//               {
//                 _id: `local_${Date.now()}`, // Temporary ID for local items
//                 product: product,
//                 quantity: quantity,
//                 isLocal: true, // Flag to identify local items
//               },
//             ],
//           });
//         }
//       },

//       removeFromCart: (id) =>
//         set({
//           cart: get().cart.filter((item) => item._id !== id),
//         }),

//       clearCart: () => set({ cart: [] }),

//       increaseQty: (id) =>
//         set({
//           cart: get().cart.map((item) =>
//             item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
//           ),
//         }),

//       decreaseQty: (id) =>
//         set({
//           cart: get()
//             .cart.map((item) =>
//               item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
//             )
//             .filter((item) => item.quantity > 0),
//         }),

//       cartTotal: () => {
//         return get().cart.reduce(
//           (total, item) => total + (item.product?.price || 0) * item.quantity,
//           0,
//         );
//       },

//       // Sync local cart to backend when user logs in
//       syncCartToBackend: async (userId, apiClient) => {
//         // console.log("from zustand", userId, apiClient);
//         const localCart = get().cart.filter((item) => item.isLocal);
//         if (localCart.length === 0) return;

//         try {
//           // Add each local item to backend
//           for (const item of localCart) {
//             await apiClient.post("/cart/add", {
//               userId: userId,
//               item: {
//                 product: item.product._id,
//                 qty: item.quantity,
//               },
//               type: "increment",
//             });
//           }

//           // Clear local cart after successful sync
//           set({
//             cart: get().cart.filter((item) => !item.isLocal),
//           });

//           return true;
//         } catch (error) {
//           console.error("Failed to sync cart to backend:", error);
//           return false;
//         }
//       },

//       getTotalQuantity: () => {
//         const state = get();
//         return state.cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
//       },

//       // Merge backend cart with local cart
//       mergeCarts: (backendCart) => {
//         const localCart = get().cart;

//         // Create a map for easy lookup
//         const backendMap = new Map();
//         backendCart.forEach((item) => {
//           backendMap.set(item.product._id, item);
//         });

//         // Filter out local items that already exist in backend
//         const uniqueLocalItems = localCart.filter(
//           (localItem) => !backendMap.has(localItem.product._id),
//         );

//         // Combine backend items with unique local items
//         const mergedCart = [...backendCart, ...uniqueLocalItems];

//         set({ cart: mergedCart });
//       },
//     }),
//     {
//       name: "bysAgro-cart",
//     },
//   ),
// );



// stores/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add product to cart
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.productId === product.id || item.productId === product.groupId);

        if (exists) {
          // Update quantity if product already exists
          const updated = cart.map((item) =>
            item.productId === (product.id || product.groupId)
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          );
          set({ cart: updated });
        } else {
          // Add new product
          set({
            cart: [
              ...cart,
              {
                id: `cart_${Date.now()}`,
                productId: product.id || product.groupId,
                product: product,
                quantity: quantity,
                price: product.price,
                name: product.name,
                weight: product.weight,
                image: product.images?.[0] || product.image,
              },
            ],
          });
        }
      },

      // Remove product from cart
      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((item) => item.id !== id),
        }),

      // Clear entire cart
      clearCart: () => set({ cart: [] }),

      // Increase quantity
      increaseQty: (id) =>
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }),

      // Decrease quantity
      decreaseQty: (id) =>
        set({
          cart: get()
            .cart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        }),

      // Get total items in cart
      getTotalItems: () => {
        const state = get();
        return state.cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
      },

      // Get total price
      getTotalPrice: () => {
        const state = get();
        return state.cart.reduce(
          (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
          0,
        );
      },

      // Check if product is in cart
      isInCart: (productId) => {
        const state = get();
        return state.cart.some((item) => item.productId === productId);
      },

      // Get quantity of a specific product
      getProductQuantity: (productId) => {
        const state = get();
        const item = state.cart.find((item) => item.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: "bysAgro-cart", // localStorage key
    },
  ),
);