import Articles from "../componants/Article";
import BlogSection from "../componants/BlogSection";
import Breadcrumbs from "../componants/Breadcrumbs";
import CustomerReviewSlider from "../componants/CustomerReviewSlider";
import HeroSection from "../componants/HeroSection";
import OrderFood from "../componants/OrderFood";
import PromoBanner from "../componants/PromoBanner";
import RecentOrders from "../componants/RecentOrders";
import StepsSection from "../componants/StepsSection";

export const metadata = {
  title: "Trains Cafe | Order Food in Train | Fresh Meals Delivered to Your Seat",
  description: "Order fresh, hygienic food in train with Trains Cafe. Get meals delivered to your seat at any railway station in India.",
  keywords: "Train food delivery, order food in train, IRCTC food order, e-catering, Trains Cafe",
  openGraph: {
    title: "Trains Cafe - Fresh Meals Delivered in Train",
    description: "Order food in train with Trains Cafe and enjoy fresh hygienic meals at your seat.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Trains Cafe OG Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trains Cafe - Order Food in Train",
    description: "Fresh meals delivered at your train seat. Hassle-free IRCTC food ordering.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/og-image.jpg`],
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
