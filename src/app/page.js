import HeroBanner from "./../components/Home/HeroBanner";
import FeatureStrip from "./../components/Home/FeatureStrip";
import ShopByCategory from "./../components/Home/ShopByCategory";
import Bestsellers from "./../components/Home/Bestsellers";
export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeatureStrip />
      <ShopByCategory />
      <Bestsellers />
    </>
  );
}
