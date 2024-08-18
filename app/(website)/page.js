import Articles from "../componants/Article";
import BlogSection from "../componants/BlogSection";
import CustomerReviewSlider from "../componants/CustomerReviewSlider";
import HeroSection from "../componants/HeroSection";
import OrderFood from "../componants/OrderFood";
import PromoBanner from "../componants/PromoBanner";
import RecentOrders from "../componants/RecentOrders";
import StepsSection from "../componants/StepsSection";



export default function Home() {
  return (
    <div >
      <HeroSection/>
      <OrderFood/>
      <StepsSection/>
      <PromoBanner/>
      <RecentOrders/>
      <CustomerReviewSlider />
      <BlogSection/>
      <Articles/>
      
    </div>
  );
}
