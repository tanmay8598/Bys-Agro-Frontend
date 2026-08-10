// "use client";

// import { useState, useEffect } from "react";
// import ProductImageViewer from './../../../components/Product/ProductImageViewer';
// import ProductDetails from './../../../components/Product/ProductDetails';
// import { dummyProduct } from './../../all-products/dummyProductData';

// const ProductPageContent = () => {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   // Simulate API call
//   //   setTimeout(() => {
//   //     setProduct(dummyProduct);
//   //     setLoading(false);
//   //   }, 500);
//   // }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-500">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Product not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#faf4ea] py-8">
//       <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-16 lg:max-w-6xl lg:mx-auto">
//         {/* Product Images */}
//         <div className="lg:w-1/2 lg:max-w-lg lg:self-stretch">
//           <ProductImageViewer product={product} />
//         </div>

//         {/* Product Details */}
//         <div className="lg:w-1/2 lg:max-w-lg">
//           <ProductDetails product={product} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPageContent;

// app/product/[groupId]/productPageContent.jsx

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductImageViewer from "./../../../components/Product/ProductImageViewer";
import ProductDetails from "./../../../components/Product/ProductDetails";
import { dummyProducts } from "./../../all-products/dummyProductData";

const ProductPageContent = () => {
  const params = useParams();
  const groupId = params?.groupId;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Find product by groupId from your dummy data
        const foundProduct = dummyProducts.find((p) => p.groupId === groupId);
        setProduct(foundProduct || null);
        setLoading(false);
      }, 500);
    }
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] py-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-16 lg:max-w-6xl lg:mx-auto">
        <div className="lg:w-1/2 lg:max-w-lg lg:self-stretch">
          <ProductImageViewer product={product} />
        </div>
        <div className="lg:w-1/2 lg:max-w-lg">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductPageContent;
