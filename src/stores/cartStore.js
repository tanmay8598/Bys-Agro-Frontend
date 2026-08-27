
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
//               : item
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
//             item._id === id ? { ...item, quantity: item.quantity + 1 } : item
//           ),
//         }),

//       decreaseQty: (id) =>
//         set({
//           cart: get()
//             .cart.map((item) =>
//               item._id === id ? { ...item, quantity: item.quantity - 1 } : item
//             )
//             .filter((item) => item.quantity > 0),
//         }),

//       cartTotal: () => {
//         return get().cart.reduce(
//           (total, item) => total + (item.product?.price || 0) * item.quantity,
//           0
//         );
//       },

//       // Sync local cart to backend when user logs in
//       syncCartToBackend: async (userId, apiClient) => {
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
//           (localItem) => !backendMap.has(localItem.product._id)
//         );

//         // Combine backend items with unique local items
//         const mergedCart = [...backendCart, ...uniqueLocalItems];

//         set({ cart: mergedCart });
//       },
//     }),
//     {
//       name: "bysAgro-cart", // localStorage key
//     }
//   )
// );

// stores/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add product with proper structure matching your backend
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.product._id === product._id);

        if (exists) {
          const updated = cart.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  product: product,
                }
              : item
          );
          set({ cart: updated });
        } else {
          set({
            cart: [
              ...cart,
              {
                _id: `local_${Date.now()}`,
                product: product,
                quantity: quantity,
                isLocal: true,
              },
            ],
          });
        }
      },

      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((item) => item._id !== id),
        }),

      clearCart: () => set({ cart: [] }),

      increaseQty: (id) =>
        set({
          cart: get().cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }),

      decreaseQty: (id) =>
        set({
          cart: get()
            .cart.map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        }),

      cartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        );
      },

      // Sync local cart to backend when user logs in
      syncCartToBackend: async (userId, apiClient) => {
        const localCart = get().cart.filter((item) => item.isLocal);
        if (localCart.length === 0) return;

        try {
          // First, get current backend cart to check what exists
          const backendResponse = await apiClient.get("/cart/get", {
            userId: userId,
          });

          const existingItems = backendResponse.data?.cart || [];

          // Create a map of existing backend items
          const existingMap = new Map();
          existingItems.forEach((item) => {
            existingMap.set(item.product._id, item);
          });

          // For each local item, check if it exists in backend
          for (const localItem of localCart) {
            const existingItem = existingMap.get(localItem.product._id);

            if (existingItem) {
              // Product already exists in backend - UPDATE quantity (not increment)
              // Calculate the difference between local and backend quantities
              const qtyDiff = localItem.quantity - existingItem.quantity;

              if (qtyDiff > 0) {
                // Local has more - increment by difference
                await apiClient.post("/cart/add", {
                  userId: userId,
                  item: {
                    product: localItem.product._id,
                    qty: qtyDiff,
                  },
                  type: "increment",
                });
              } else if (qtyDiff < 0) {
                // Backend has more - decrement by difference
                await apiClient.post("/cart/add", {
                  userId: userId,
                  item: {
                    product: localItem.product._id,
                    qty: Math.abs(qtyDiff),
                  },
                  type: "decrement",
                });
              }
              // If qtyDiff === 0, no change needed
            } else {
              // Product doesn't exist in backend - add it
              await apiClient.post("/cart/add", {
                userId: userId,
                item: {
                  product: localItem.product._id,
                  qty: localItem.quantity,
                },
                type: "increment",
              });
            }
          }

          // Clear local cart after successful sync
          set({
            cart: get().cart.filter((item) => !item.isLocal),
          });

          // Dispatch event to refresh cart count
          window.dispatchEvent(new CustomEvent("cartUpdated"));

          return true;
        } catch (error) {
          console.error("Failed to sync cart to backend:", error);
          return false;
        }
      },

      getTotalQuantity: () => {
        const state = get();
        return state.cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
      },

      // Merge backend cart with local cart
      mergeCarts: (backendCart) => {
        const localCart = get().cart;

        // Create a map for easy lookup
        const backendMap = new Map();
        backendCart.forEach((item) => {
          backendMap.set(item.product._id, item);
        });

        // Filter out local items that already exist in backend
        const uniqueLocalItems = localCart.filter(
          (localItem) => !backendMap.has(localItem.product._id)
        );

        // Combine backend items with unique local items
        const mergedCart = [...backendCart, ...uniqueLocalItems];

        set({ cart: mergedCart });
      },
    }),
    {
      name: "bysAgro-cart",
    }
  )
);