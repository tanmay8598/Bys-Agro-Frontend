// "use client";

// import React, { useState, useEffect } from "react";
// import { IoFilter } from "react-icons/io5";
// import { IoClose } from "react-icons/io5";
// import { MdCheck } from "react-icons/md";
// import { IoChevronDown, IoChevronUp } from "react-icons/io5";
// import { useRouter, useSearchParams } from "next/navigation";
// import ProductCard from "./../../components/Cards/ProductCard";

// // Generate dummy products
// const generateDummyProducts = () => {
//   const productNames = [
//     "Toor Dal (Arhar)",
//     "Moong Dal (Split)",
//     "Sunflower Cooking Oil",
//     "Cold-Pressed Mustard Oil",
//     "Organic Turmeric Powder",
//     "Red Chilli Powder",
//     "Cumin Seeds",
//     "Coriander Powder",
//     "Garam Masala",
//     "Black Pepper",
//     "Himalayan Pink Salt",
//     "Sugar (White)",
//     "Brown Sugar",
//     "Desi Ghee",
//     "Peanut Oil",
//     "Sesame Oil",
//     "Coconut Oil",
//     "Basmati Rice",
//     "Wheat Flour",
//     "Besan (Gram Flour)",
//   ];

//   const categories = ["honey", "tea", "spices", "oils", "grains"];
//   const weights = ["500g", "1kg", "2kg", "500ml", "1L", "2L"];

//   return Array.from({ length: 20 }, (_, index) => ({
//     id: index + 1,
//     name: productNames[index % productNames.length],
//     weight: weights[index % weights.length],
//     price: Math.floor(Math.random() * 500) + 50,
//     image: [
//       "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
//     ][index % 5],
//     category: categories[index % categories.length],
//     mostSelling: Math.random() > 0.7,
//     rating: (Math.random() * 2 + 3).toFixed(1),
//     reviews: Math.floor(Math.random() * 100),
//   }));
// };

// const AllProductsClient = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(2);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [showDesktopPriceSlider, setShowDesktopPriceSlider] = useState(false);
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

//   const initialCategory = searchParams?.get("category") || "";

//   const [tempFilters, setTempFilters] = useState({
//     minPrice: 0,
//     maxPrice: 2000,
//     mostSelling: false,
//     category: initialCategory,
//   });

//   const [appliedFilters, setAppliedFilters] = useState({
//     minPrice: 0,
//     maxPrice: 2000,
//     mostSelling: false,
//     category: initialCategory,
//   });

//   // Load dummy products
//   useEffect(() => {
//     setLoading(true);
//     // Simulate API delay
//     setTimeout(() => {
//       const products = generateDummyProducts();

//       // Apply filters
//       let filtered = [...products];

//       if (appliedFilters.category) {
//         filtered = filtered.filter(
//           (p) => p.category === appliedFilters.category,
//         );
//       }

//       if (appliedFilters.mostSelling) {
//         filtered = filtered.filter((p) => p.mostSelling);
//       }

//       if (appliedFilters.minPrice > 0) {
//         filtered = filtered.filter((p) => p.price >= appliedFilters.minPrice);
//       }

//       if (appliedFilters.maxPrice < 2000) {
//         filtered = filtered.filter((p) => p.price <= appliedFilters.maxPrice);
//       }

//       setTotalProducts(filtered.length);
//       setTotalPages(Math.ceil(filtered.length / 8));

//       // Paginate
//       const start = (currentPage - 1) * 8;
//       const end = start + 8;
//       setAllProducts(filtered.slice(start, end));

//       setLoading(false);
//     }, 500);
//   }, [currentPage, appliedFilters]);

//   // Update category from URL
//   useEffect(() => {
//     const category = searchParams?.get("category") || "";
//     if (category !== appliedFilters.category) {
//       setTempFilters((prev) => ({ ...prev, category }));
//       setAppliedFilters((prev) => ({ ...prev, category }));
//       setCurrentPage(1);
//     }
//   }, [searchParams]);

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...tempFilters });
//     setCurrentPage(1);
//     setShowDesktopPriceSlider(false);
//     setDrawerOpen(false);

//     const query = new URLSearchParams({
//       page: 1,
//       category: tempFilters.category,
//       minPrice: tempFilters.minPrice,
//       maxPrice: tempFilters.maxPrice,
//       mostSelling: tempFilters.mostSelling,
//     });

//     router.push(`/all-products?${query.toString()}`);
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleTempFilterChange = (key, value) => {
//     setTempFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const clearAllFilters = () => {
//     const resetFilters = {
//       minPrice: 0,
//       maxPrice: 2000,
//       mostSelling: false,
//       category: "",
//     };

//     setTempFilters(resetFilters);
//     setDrawerOpen(false);
//     setAppliedFilters(resetFilters);
//     setShowDesktopPriceSlider(false);
//     setCurrentPage(1);

//     router.push("/all-products");
//   };

//   const PriceSlider = () => {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Min Price</span>
//               <span className="font-medium">₹{tempFilters.minPrice}</span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="2000"
//               step="10"
//               value={tempFilters.minPrice}
//               onChange={(e) =>
//                 handleTempFilterChange("minPrice", parseInt(e.target.value))
//               }
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Max Price</span>
//               <span className="font-medium">₹{tempFilters.maxPrice}</span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="2000"
//               step="10"
//               value={tempFilters.maxPrice}
//               onChange={(e) =>
//                 handleTempFilterChange("maxPrice", parseInt(e.target.value))
//               }
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//           </div>

//           <style jsx>{`
//             input[type="range"]::-webkit-slider-thumb {
//               appearance: none;
//               width: 20px;
//               height: 20px;
//               border-radius: 50%;
//               background: #f59e0b;
//               border: 2px solid white;
//               box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
//               cursor: pointer;
//               transition: all 0.1s ease;
//             }
//             input[type="range"]::-webkit-slider-thumb:hover {
//               transform: scale(1.1);
//               box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
//             }
//             input[type="range"]::-moz-range-thumb {
//               width: 20px;
//               height: 20px;
//               border-radius: 50%;
//               background: #f59e0b;
//               border: 2px solid white;
//               box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
//               cursor: pointer;
//             }
//           `}</style>

//           <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-2">
//             <div className="text-center">
//               <div className="text-sm text-gray-500 mb-1">Selected Range</div>
//               <div className="font-bold text-gray-800 text-xl">
//                 ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-500">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className=" font-figtree bg-[#faf4ea] py-4">
//       <section className="max-w-6xl mx-auto px-4 lg:px-0">
//         <div className="flex flex-row sm:flex-row justify-between items-center sm:items-center mb-6 gap-4">
//           <div className="hidden lg:flex items-center gap-6 flex-wrap relative">
//             <div className="flex items-center gap-2">
//               <span className="font-semibold text-gray-900">Filters:</span>

//               <button
//                 onClick={() => {
//                   const newMostSellingValue = !tempFilters.mostSelling;
//                   handleTempFilterChange("mostSelling", newMostSellingValue);
//                   setAppliedFilters((prev) => ({
//                     ...prev,
//                     mostSelling: newMostSellingValue,
//                   }));
//                   setCurrentPage(1);
//                 }}
//                 className={`flex items-center cursor-pointer gap-1 px-4 py-2 rounded-lg border text-sm transition-all ${
//                   tempFilters.mostSelling
//                     ? "bg-[#E56A5C] text-white border-[#E56A5C]"
//                     : "border-gray-300 text-gray-700 hover:bg-amber-50"
//                 }`}
//               >
//                 {tempFilters.mostSelling && <MdCheck className="mr-1" />}
//                 Most Selling
//               </button>

//               <div className="relative">
//                 <button
//                   onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
//                   className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
//                 >
//                   <span>Category:</span>
//                   <span className="font-semibold text-amber-600 capitalize">
//                     {tempFilters.category || "All"}
//                   </span>
//                   {showCategoryDropdown ? (
//                     <IoChevronUp size={16} />
//                   ) : (
//                     <IoChevronDown size={16} />
//                   )}
//                 </button>

//                 {showCategoryDropdown && (
//                   <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-amber-100 p-2 z-40">
//                     <button
//                       onClick={() => {
//                         handleTempFilterChange("category", "");
//                         const updatedFilters = { ...tempFilters, category: "" };
//                         setAppliedFilters(updatedFilters);
//                         setCurrentPage(1);
//                         setShowCategoryDropdown(false);
//                         router.push("/all-products");
//                       }}
//                       className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
//                         tempFilters.category === ""
//                           ? "bg-amber-50 text-[#E56A5C] font-medium"
//                           : "hover:bg-gray-50 text-gray-700"
//                       }`}
//                     >
//                       All
//                       {tempFilters.category === "" && <MdCheck size={16} />}
//                     </button>
//                     {["honey", "tea", "spices", "oils", "grains"].map(
//                       (item) => (
//                         <button
//                           key={item}
//                           onClick={() => {
//                             handleTempFilterChange("category", item);
//                             const updatedFilters = {
//                               ...tempFilters,
//                               category: item,
//                             };
//                             setAppliedFilters(updatedFilters);
//                             setCurrentPage(1);
//                             setShowCategoryDropdown(false);
//                             const query = new URLSearchParams({
//                               category: item,
//                             });
//                             router.push(`/all-products?${query.toString()}`);
//                           }}
//                           className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
//                             tempFilters.category === item
//                               ? "bg-amber-50 text-[#E56A5C] font-medium"
//                               : "hover:bg-gray-50 text-gray-700"
//                           }`}
//                         >
//                           {item}
//                           {tempFilters.category === item && (
//                             <MdCheck size={16} />
//                           )}
//                         </button>
//                       ),
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="relative">
//                 <button
//                   onClick={() =>
//                     setShowDesktopPriceSlider(!showDesktopPriceSlider)
//                   }
//                   className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
//                 >
//                   <span>Price:</span>
//                   <span className="font-semibold text-amber-600">
//                     ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
//                   </span>
//                   {showDesktopPriceSlider ? (
//                     <IoChevronUp size={16} />
//                   ) : (
//                     <IoChevronDown size={16} />
//                   )}
//                 </button>

//                 {showDesktopPriceSlider && (
//                   <div className="absolute top-full -left-50 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-amber-100 p-6 z-40">
//                     <div className="space-y-6">
//                       <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-gray-800 text-lg">
//                           Price Range
//                         </h3>
//                         <button
//                           onClick={() => setShowDesktopPriceSlider(false)}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           <IoClose size={20} />
//                         </button>
//                       </div>
//                       <PriceSlider />
//                       <button
//                         onClick={handleApplyFilters}
//                         className="w-full mt-4 bg-[#E56A5C] cursor-pointer text-white py-2.5 rounded-xl font-medium hover:bg-[#d45a4c] transition"
//                       >
//                         Apply Price Filter
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <button
//             className="lg:hidden flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm bg-white shadow-sm hover:bg-gray-50"
//             onClick={() => setDrawerOpen(true)}
//           >
//             <IoFilter size={18} /> Filters
//             {(tempFilters.minPrice > 0 ||
//               tempFilters.maxPrice < 2000 ||
//               tempFilters.mostSelling ||
//               tempFilters.category) && (
//               <span className="ml-1 bg-[#E56A5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {
//                   [
//                     tempFilters.mostSelling,
//                     tempFilters.minPrice > 0,
//                     tempFilters.maxPrice < 2000,
//                     tempFilters.category,
//                   ].filter(Boolean).length
//                 }
//               </span>
//             )}
//           </button>

//           <div className="font-semibold text-gray-700 text-sm sm:text-base">
//             {totalProducts} {totalProducts === 1 ? "product" : "products"} found
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {(appliedFilters.minPrice > 0 ||
//           appliedFilters.maxPrice < 2000 ||
//           appliedFilters.mostSelling ||
//           appliedFilters.category) && (
//           <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
//             <div className="flex flex-wrap items-center justify-center md:justify-between gap-3">
//               <span className="text-sm font-medium text-gray-700">
//                 Active filters:
//               </span>

//               {appliedFilters.category && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
//                   Category: {appliedFilters.category}
//                   <button
//                     onClick={() => {
//                       const updatedFilters = {
//                         ...appliedFilters,
//                         category: "",
//                       };
//                       setTempFilters(updatedFilters);
//                       setAppliedFilters(updatedFilters);
//                       setCurrentPage(1);
//                       router.push("/all-products");
//                     }}
//                     className="ml-1.5 text-amber-600 hover:text-amber-800"
//                   >
//                     <IoClose size={16} />
//                   </button>
//                 </span>
//               )}

//               {appliedFilters.mostSelling && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
//                   Most Selling
//                   <button
//                     onClick={() => {
//                       const updatedFilters = {
//                         ...appliedFilters,
//                         mostSelling: false,
//                       };
//                       setTempFilters(updatedFilters);
//                       setAppliedFilters(updatedFilters);
//                       setCurrentPage(1);
//                     }}
//                     className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
//                   >
//                     <IoClose size={16} />
//                   </button>
//                 </span>
//               )}

//               {(appliedFilters.minPrice > 0 ||
//                 appliedFilters.maxPrice < 2000) && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
//                   Price: ₹{appliedFilters.minPrice} - ₹{appliedFilters.maxPrice}
//                   <button
//                     onClick={() => {
//                       const updatedFilters = {
//                         ...appliedFilters,
//                         minPrice: 0,
//                         maxPrice: 2000,
//                       };
//                       setTempFilters(updatedFilters);
//                       setAppliedFilters(updatedFilters);
//                       setCurrentPage(1);
//                     }}
//                     className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
//                   >
//                     <IoClose size={16} />
//                   </button>
//                 </span>
//               )}

//               <button
//                 onClick={clearAllFilters}
//                 className="lg:ml-auto text-center cursor-pointer text-sm text-amber-600 hover:text-amber-800 font-medium px-3 py-1.5 hover:bg-amber-100 rounded-lg transition-colors"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Product Grid */}
//         <section className="w-full flex justify-center items-center">
//           <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
//             {allProducts.map((item) => (
//               <ProductCard key={item.id} product={item} />
//             ))}
//           </div>
//         </section>

//         {allProducts.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 font-figtree text-lg">
//               No products found. Try adjusting your filters.
//             </p>
//             <button
//               onClick={clearAllFilters}
//               className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
//             >
//               Clear all filters
//             </button>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="my-5 flex justify-center items-center gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-lg border ${
//                 currentPage === 1
//                   ? "border-gray-200 text-gray-400 cursor-not-allowed"
//                   : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
//               }`}
//             >
//               Previous
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`w-10 h-10 rounded-lg border ${
//                   currentPage === page
//                     ? "bg-[#E56A5C]  text-white border-[#E56A5C]"
//                     : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-lg border ${
//                 currentPage === totalPages
//                   ? "border-gray-200  text-gray-400 cursor-not-allowed"
//                   : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </section>

//       {/* Mobile Filter Drawer */}
//       <div
//         className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
//           drawerOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-900">Filters</h2>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={clearAllFilters}
//               className="text-sm text-gray-700 font-medium px-3 py-1 hover:bg-amber-50 rounded"
//             >
//               Clear all
//             </button>
//             <button
//               onClick={() => setDrawerOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <IoClose size={28} />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-8 h-[calc(100vh-140px)] overflow-y-auto">
//           <div>
//             <h3 className="font-semibold text-gray-800 text-lg mb-4">
//               Most Selling
//             </h3>
//             <button
//               onClick={() =>
//                 handleTempFilterChange("mostSelling", !tempFilters.mostSelling)
//               }
//               className={`flex items-center w-full p-4 rounded-xl border-2 transition-all ${
//                 tempFilters.mostSelling
//                   ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
//                   : "border-gray-200 text-gray-700 hover:border-amber-300"
//               }`}
//             >
//               <div
//                 className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
//                   tempFilters.mostSelling
//                     ? "bg-[#E56A5C] border-[#E56A5C]"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {tempFilters.mostSelling && (
//                   <MdCheck className="text-white" size={16} />
//                 )}
//               </div>
//               <span className="font-medium text-base">
//                 Show Most Selling Products
//               </span>
//             </button>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-800 text-lg mb-4">
//               Category
//             </h3>

//             <button
//               onClick={() => handleTempFilterChange("category", "")}
//               className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
//                 tempFilters.category === ""
//                   ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
//                   : "border-gray-200 text-gray-700 hover:border-amber-300"
//               }`}
//             >
//               <div
//                 className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
//                   tempFilters.category === ""
//                     ? "bg-[#E56A5C] border-[#E56A5C]"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {tempFilters.category === "" && (
//                   <MdCheck className="text-white" size={16} />
//                 )}
//               </div>
//               <span className="font-medium text-base capitalize">All</span>
//             </button>

//             {["honey", "tea", "spices", "oils", "grains"].map((item) => (
//               <button
//                 key={item}
//                 onClick={() => handleTempFilterChange("category", item)}
//                 className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
//                   tempFilters.category === item
//                     ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
//                     : "border-gray-200 text-gray-700 hover:border-amber-300"
//                 }`}
//               >
//                 <div
//                   className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
//                     tempFilters.category === item
//                       ? "bg-[#E56A5C] border-[#E56A5C]"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {tempFilters.category === item && (
//                     <MdCheck className="text-white" size={16} />
//                   )}
//                 </div>
//                 <span className="font-medium text-base capitalize">{item}</span>
//               </button>
//             ))}
//           </div>

//           <PriceSlider />
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white shadow-lg">
//           <button
//             onClick={() => {
//               setDrawerOpen(false);
//               handleApplyFilters();
//             }}
//             className="w-full bg-[#E56A5C] text-white py-3.5 cursor-pointer rounded-xl font-semibold text-base shadow-md hover:bg-[#d45a4c] transition"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       {drawerOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 sm:z-40"
//           onClick={() => setDrawerOpen(false)}
//         />
//       )}

//       {showDesktopPriceSlider && (
//         <div
//           className="fixed inset-0 z-30"
//           onClick={() => setShowDesktopPriceSlider(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AllProductsClient;

"use client";

import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./../../components/Cards/ProductCard";
import { dummyProducts } from "./dummyProductData";

const AllProductsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showDesktopPriceSlider, setShowDesktopPriceSlider] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const initialCategory = searchParams?.get("category") || "";

  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    mostSelling: false,
    category: initialCategory,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    mostSelling: false,
    category: initialCategory,
  });

  // Load products from dummyData
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Use the complete products from dummyData
      let filtered = [...dummyProducts];

      // Apply filters
      if (appliedFilters.category) {
        filtered = filtered.filter(
          (p) => p.category === appliedFilters.category,
        );
      }

      if (appliedFilters.mostSelling) {
        filtered = filtered.filter((p) => p.mostSelling);
      }

      if (appliedFilters.minPrice > 0) {
        filtered = filtered.filter((p) => p.price >= appliedFilters.minPrice);
      }

      if (appliedFilters.maxPrice < 2000) {
        filtered = filtered.filter((p) => p.price <= appliedFilters.maxPrice);
      }

      setTotalProducts(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 8));

      // Paginate
      const start = (currentPage - 1) * 8;
      const end = start + 8;
      setAllProducts(filtered.slice(start, end));

      setLoading(false);
    }, 500);
  }, [currentPage, appliedFilters]);

  // Update category from URL
  useEffect(() => {
    const category = searchParams?.get("category") || "";
    if (category !== appliedFilters.category) {
      setTempFilters((prev) => ({ ...prev, category }));
      setAppliedFilters((prev) => ({ ...prev, category }));
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setCurrentPage(1);
    setShowDesktopPriceSlider(false);
    setDrawerOpen(false);

    const query = new URLSearchParams({
      page: 1,
      category: tempFilters.category,
      minPrice: tempFilters.minPrice,
      maxPrice: tempFilters.maxPrice,
      mostSelling: tempFilters.mostSelling,
    });

    router.push(`/all-products?${query.toString()}`);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    const resetFilters = {
      minPrice: 0,
      maxPrice: 2000,
      mostSelling: false,
      category: "",
    };

    setTempFilters(resetFilters);
    setDrawerOpen(false);
    setAppliedFilters(resetFilters);
    setShowDesktopPriceSlider(false);
    setCurrentPage(1);

    router.push("/all-products");
  };

  const PriceSlider = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Min Price</span>
              <span className="font-medium">₹{tempFilters.minPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={tempFilters.minPrice}
              onChange={(e) =>
                handleTempFilterChange("minPrice", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Price</span>
              <span className="font-medium">₹{tempFilters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={tempFilters.maxPrice}
              onChange={(e) =>
                handleTempFilterChange("maxPrice", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #f59e0b;
              border: 2px solid white;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              transition: all 0.1s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #f59e0b;
              border: 2px solid white;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              cursor: pointer;
            }
          `}</style>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-2">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Selected Range</div>
              <div className="font-bold text-gray-800 text-xl">
                ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-figtree bg-[#faf4ea] py-4">
      <section className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="flex flex-row sm:flex-row justify-between items-center sm:items-center mb-6 gap-4">
          <div className="hidden lg:flex items-center gap-6 flex-wrap relative">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Filters:</span>

              <button
                onClick={() => {
                  const newMostSellingValue = !tempFilters.mostSelling;
                  handleTempFilterChange("mostSelling", newMostSellingValue);
                  setAppliedFilters((prev) => ({
                    ...prev,
                    mostSelling: newMostSellingValue,
                  }));
                  setCurrentPage(1);
                }}
                className={`flex items-center cursor-pointer gap-1 px-4 py-2 rounded-lg border text-sm transition-all ${
                  tempFilters.mostSelling
                    ? "bg-[#E56A5C] text-white border-[#E56A5C]"
                    : "border-gray-300 text-gray-700 hover:bg-amber-50"
                }`}
              >
                {tempFilters.mostSelling && <MdCheck className="mr-1" />}
                Most Selling
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <span>Category:</span>
                  <span className="font-semibold text-amber-600 capitalize">
                    {tempFilters.category || "All"}
                  </span>
                  {showCategoryDropdown ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-amber-100 p-2 z-40">
                    <button
                      onClick={() => {
                        handleTempFilterChange("category", "");
                        const updatedFilters = { ...tempFilters, category: "" };
                        setAppliedFilters(updatedFilters);
                        setCurrentPage(1);
                        setShowCategoryDropdown(false);
                        router.push("/all-products");
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
                        tempFilters.category === ""
                          ? "bg-amber-50 text-[#E56A5C] font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      All
                      {tempFilters.category === "" && <MdCheck size={16} />}
                    </button>
                    {["spices", "oils", "grains"].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          handleTempFilterChange("category", item);
                          const updatedFilters = {
                            ...tempFilters,
                            category: item,
                          };
                          setAppliedFilters(updatedFilters);
                          setCurrentPage(1);
                          setShowCategoryDropdown(false);
                          const query = new URLSearchParams({
                            category: item,
                          });
                          router.push(`/all-products?${query.toString()}`);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
                          tempFilters.category === item
                            ? "bg-amber-50 text-[#E56A5C] font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {item}
                        {tempFilters.category === item && <MdCheck size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setShowDesktopPriceSlider(!showDesktopPriceSlider)
                  }
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <span>Price:</span>
                  <span className="font-semibold text-amber-600">
                    ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
                  </span>
                  {showDesktopPriceSlider ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </button>

                {showDesktopPriceSlider && (
                  <div className="absolute top-full -left-50 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-amber-100 p-6 z-40">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Price Range
                        </h3>
                        <button
                          onClick={() => setShowDesktopPriceSlider(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                      <PriceSlider />
                      <button
                        onClick={handleApplyFilters}
                        className="w-full mt-4 bg-[#E56A5C] cursor-pointer text-white py-2.5 rounded-xl font-medium hover:bg-[#d45a4c] transition"
                      >
                        Apply Price Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="lg:hidden flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm bg-white shadow-sm hover:bg-gray-50"
            onClick={() => setDrawerOpen(true)}
          >
            <IoFilter size={18} /> Filters
            {(tempFilters.minPrice > 0 ||
              tempFilters.maxPrice < 2000 ||
              tempFilters.mostSelling ||
              tempFilters.category) && (
              <span className="ml-1 bg-[#E56A5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {
                  [
                    tempFilters.mostSelling,
                    tempFilters.minPrice > 0,
                    tempFilters.maxPrice < 2000,
                    tempFilters.category,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>

          <div className="font-semibold text-gray-700 text-sm sm:text-base">
            {totalProducts} {totalProducts === 1 ? "product" : "products"} found
          </div>
        </div>

        {/* Active Filters Display */}
        {(appliedFilters.minPrice > 0 ||
          appliedFilters.maxPrice < 2000 ||
          appliedFilters.mostSelling ||
          appliedFilters.category) && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active filters:
              </span>

              {appliedFilters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Category: {appliedFilters.category}
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        category: "",
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                      router.push("/all-products");
                    }}
                    className="ml-1.5 text-amber-600 hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              {appliedFilters.mostSelling && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Most Selling
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        mostSelling: false,
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                    }}
                    className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              {(appliedFilters.minPrice > 0 ||
                appliedFilters.maxPrice < 2000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Price: ₹{appliedFilters.minPrice} - ₹{appliedFilters.maxPrice}
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        minPrice: 0,
                        maxPrice: 2000,
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                    }}
                    className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="lg:ml-auto text-center cursor-pointer text-sm text-amber-600 hover:text-amber-800 font-medium px-3 py-1.5 hover:bg-amber-100 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <section className="w-full flex justify-center items-center">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {allProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>

        {allProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-figtree text-lg">
              No products found. Try adjusting your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="my-5 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === page
                    ? "bg-[#E56A5C] text-white border-[#E56A5C]"
                    : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 cursor-pointer text-gray-700 hover:bg-amber-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-700 font-medium px-3 py-1 hover:bg-amber-50 rounded"
            >
              Clear all
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 h-[calc(100vh-140px)] overflow-y-auto">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Most Selling
            </h3>
            <button
              onClick={() =>
                handleTempFilterChange("mostSelling", !tempFilters.mostSelling)
              }
              className={`flex items-center w-full p-4 rounded-xl border-2 transition-all ${
                tempFilters.mostSelling
                  ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
                  : "border-gray-200 text-gray-700 hover:border-amber-300"
              }`}
            >
              <div
                className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                  tempFilters.mostSelling
                    ? "bg-[#E56A5C] border-[#E56A5C]"
                    : "border-gray-300"
                }`}
              >
                {tempFilters.mostSelling && (
                  <MdCheck className="text-white" size={16} />
                )}
              </div>
              <span className="font-medium text-base">
                Show Most Selling Products
              </span>
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Category
            </h3>

            <button
              onClick={() => handleTempFilterChange("category", "")}
              className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
                tempFilters.category === ""
                  ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
                  : "border-gray-200 text-gray-700 hover:border-amber-300"
              }`}
            >
              <div
                className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                  tempFilters.category === ""
                    ? "bg-[#E56A5C] border-[#E56A5C]"
                    : "border-gray-300"
                }`}
              >
                {tempFilters.category === "" && (
                  <MdCheck className="text-white" size={16} />
                )}
              </div>
              <span className="font-medium text-base capitalize">All</span>
            </button>

            {["spices", "oils", "grains"].map((item) => (
              <button
                key={item}
                onClick={() => handleTempFilterChange("category", item)}
                className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
                  tempFilters.category === item
                    ? "bg-amber-50 border-[#E56A5C] text-[#E56A5C]"
                    : "border-gray-200 text-gray-700 hover:border-amber-300"
                }`}
              >
                <div
                  className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                    tempFilters.category === item
                      ? "bg-[#E56A5C] border-[#E56A5C]"
                      : "border-gray-300"
                  }`}
                >
                  {tempFilters.category === item && (
                    <MdCheck className="text-white" size={16} />
                  )}
                </div>
                <span className="font-medium text-base capitalize">{item}</span>
              </button>
            ))}
          </div>

          <PriceSlider />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white shadow-lg">
          <button
            onClick={() => {
              setDrawerOpen(false);
              handleApplyFilters();
            }}
            className="w-full bg-[#E56A5C] text-white py-3.5 cursor-pointer rounded-xl font-semibold text-base shadow-md hover:bg-[#d45a4c] transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {showDesktopPriceSlider && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDesktopPriceSlider(false)}
        />
      )}
    </div>
  );
};

export default AllProductsClient;
