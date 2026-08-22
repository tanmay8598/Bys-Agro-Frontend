"use client";

import { useState, useEffect } from "react";
import ProductImageViewer from "./../../../components/Product/ProductImageViewer";
import ProductDetails from "./../../../components/Product/ProductDetails";
import apiClient from "../../../api/client";
import YouMightAlsoLike from "../../../components/YouMightAlsoLike/YouMightAlsoLike";

const ProductPageContent = ({ products = [], groupId, initialVisualId }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [excludeProductId, setExcludeProductId] = useState(products?.[0]?._id);
  const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState([]);

   useEffect(() => {
    if (products?.length > 0 && !isInitialized) {
      let initialProduct = products[0];

      if (initialVisualId) {
        const foundProduct = products.find(
          (p) => p.visualId === initialVisualId,
        );
        if (foundProduct) {
          initialProduct = foundProduct;
        }
      }

      setCurrentProduct(initialProduct);
      setIsInitialized(true);
    }
  }, [products, initialVisualId, isInitialized]);

  useEffect(() => {
    if (excludeProductId && currentProduct?.category?._id) {
      getProductsYouMayAlsoLike();
    }
  }, [excludeProductId, currentProduct?.category?._id]);

    const getProductsYouMayAlsoLike = async () => {
    const response = await apiClient.post("/product/get-related-by-category", {
      category: currentProduct?.category?._id,
      excludeProductId: excludeProductId,
    });

    setYouMayAlsoLikeProducts(response.data.products);
  };

  const handleVariantChange = (selectedProduct) => {
    setCurrentProduct(selectedProduct);
    setExcludeProductId(selectedProduct._id);

  };

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#faf4ea] py-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-16 lg:max-w-6xl lg:mx-auto">
        <div className="lg:w-1/2 lg:max-w-lg lg:self-stretch">
          <div className="sticky top-32">
            <ProductImageViewer
              product={currentProduct}
              discount={currentProduct.discount}
            />
          </div>
        </div>

        <div className="lg:w-1/2 lg:max-w-lg">
          <ProductDetails
            products={products}
            groupId={groupId}
             initialVisualId={initialVisualId} 
            onVariantChange={handleVariantChange}
            currentProduct={currentProduct}
          />
        </div>
      </div>


         {youMayAlsoLikeProducts.length > 0 && (
        <div className="mt-8">
          <YouMightAlsoLike youMayAlsoLikeProducts={youMayAlsoLikeProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductPageContent;