import dynamic from "next/dynamic";
import HeroSection from "../componants/HeroSection";
import OrderFood from "../componants/OrderFood";
import StepsSection from "../componants/StepsSection";

const PromoBanner = dynamic(() => import("../componants/PromoBanner"), {
  ssr: false,
});

const RecentOrders = dynamic(() => import("../componants/RecentOrders"), {
  ssr: false,
});

const CustomerReviewSlider = dynamic(
  () => import("../componants/CustomerReviewSlider"),
  { ssr: false },
);

const BlogSection = dynamic(() => import("../componants/BlogSection"), {
  ssr: false,
});

const Articles = dynamic(() => import("../componants/Article"), { ssr: false });

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.trainscafe.in";
const pageUrl = `${baseUrl}/`;

export const metadata = {
  title: "Best Food Delivery in Train | Fresh & Hygienic Meals – Trainscafe",
  description:
    "Order fresh meals online with Trainscafe. Enjoy hygienic food delivery in train at 450+ stations with FSSAI-approved restaurants, easy PNR search & COD options.",
  keywords:
    "Train food delivery, order food in train, IRCTC food order, e-catering, Trains Cafe",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <OrderFood />
      <StepsSection />

      <PromoBanner />
      <RecentOrders />
      <CustomerReviewSlider />
      <BlogSection />
      <Articles />
    </main>
  );
}
