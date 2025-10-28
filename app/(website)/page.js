import Articles from "../componants/Article";
import BlogSection from "../componants/BlogSection";
import CustomerReviewSlider from "../componants/CustomerReviewSlider";
import HeroSection from "../componants/HeroSection";
import OrderFood from "../componants/OrderFood";
import PromoBanner from "../componants/PromoBanner";
import RecentOrders from "../componants/RecentOrders";
import StepsSection from "../componants/StepsSection";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
const pageUrl = `${baseUrl}/`;

export const metadata = {
  title: "Best Food Delivery in Train | Fresh & Hygienic Meals – Trainscafe",
  description:
    "Order fresh meals online with Trainscafe. Enjoy hygienic Food Delivery in Train at 450+ stations with FSSAI-approved restaurants, easy PNR search & COD options.",
  keywords:
    "Train food delivery, order food in train, IRCTC food order, e-catering, Trains Cafe",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },

};

export default function Home() {
  return (
    <div>
      
      <HeroSection />
      <OrderFood />
      <StepsSection />
      <PromoBanner />
      <RecentOrders />
      <CustomerReviewSlider />
      <BlogSection />
      <Articles />
    </div>
  );
}
