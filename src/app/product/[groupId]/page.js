import ProductPageContent from "./productPageContent";

export async function generateMetadata({ params }) {
  const { groupId } = await params;
  
  return {
    title: `Product Details | Motherland`,
    description: "Premium quality product from Motherland",
  };
}

export default async function ProductPage({ params }) {
  const { groupId } = await params;
  
  return <ProductPageContent groupId={groupId} />;
}