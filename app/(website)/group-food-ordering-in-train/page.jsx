import BulkOrderForm from "./GroupFoodOrder";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
const pageUrl = `${baseUrl}/group-food-ordering-in-train`;

export const metadata = {
  title: "Group Food Ordering in Train | Trains Cafe",
  description:
    "Order bulk or group food in train with Trains Cafe. Convenient online booking for families, groups & corporate travel. Get fresh meals delivered to your seat.",
  keywords:
    "group food ordering in train, bulk food order, train catering, IRCTC group food, food delivery in train",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Group Food Ordering in Train | Trains Cafe",
    description:
      "Book bulk food orders for your train journey. Fresh meals for families, groups, corporates delivered on your seat.",
    url: pageUrl,
    type: "website",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "Trains Cafe Group Food OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Group Food Ordering in Train | Trains Cafe",
    description:
      "Book bulk food orders easily with Trains Cafe. Fresh meals for groups, families and corporate travelers.",
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return <BulkOrderForm />;
}
