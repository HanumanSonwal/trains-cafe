import HeroSection from "@/app/componants/HeroSection";
import CouponList from "@/app/componants/CouponList";
import RecentOrders from "@/app/componants/RecentOrders";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const pageUrl = `${baseUrl}/offers`;

const baseTitle =
  "Train Food Offers & Discount Coupons – Save More | Trainscafe";

const baseDescription =
  "Save on train meals with Trainscafe offers and discount coupons. Order hygienic train food across 450+ stations and get exclusive deals on online food delivery in train.";

export const metadata = {
  title: baseTitle,
  description: baseDescription,

  keywords: [
    "food in train",
    "order food in train",
    "train food order online",
    "food delivery in train",
    "online food order in train",
    "railway food order",
    "best food in train",
  ],

  robots: "index, follow",

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: baseTitle,
    description: baseDescription,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "Train food offers and online food delivery in train",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: baseDescription,
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return (
    <>
      <HeroSection />
      <CouponList />
      <RecentOrders />
    </>
  );
}
