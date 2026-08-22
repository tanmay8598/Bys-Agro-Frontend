import HeroBanner from "./../components/Home/HeroBanner";
import FeatureStrip from "./../components/Home/FeatureStrip";
import ShopByCategory from "./../components/Home/ShopByCategory";
import Bestsellers from "./../components/Home/Bestsellers";
import ResponsiveBanner from './../components/Home/ResponsiveBanner';
import WhyChooseUs from './../components/Home/WhyChooseUs';
import Testimonials from './../components/Home/Testimonials';
export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeatureStrip />
      <ShopByCategory />
       <ResponsiveBanner
        desktopImg="/bannerImages/homeImage.jpg"
        mobileImg="/bannerImages/homeImageMobile.webp"
        desktopAlt="Premium Quality Products"
        mobileAlt="Premium Quality Products"
        title="Discover"
        highlight="Pure Quality"
        subtitle="Authentic pulses, oils, spices & dry fruits sourced from Indian farms"
        highlightColor="#c1552c"
        desktopHeight={400}
        mobileHeight={420}
      />
      <Bestsellers />
      <Testimonials />
    <WhyChooseUs />

    </>
  );
}
