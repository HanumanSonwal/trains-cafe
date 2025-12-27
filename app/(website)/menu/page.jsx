import { Suspense } from "react";
import MenuClient from "./MenuClient";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";
const pageUrl = `${baseUrl}/menu`;

export const metadata = {
  title: "Order Food from Train Vendors | Trains Cafe",
  description:
    "View train station vendor menus & order food online. Veg & Non-Veg options available. Fresh meals delivered on your seat.",
  keywords:
    "order food in train, train vendor food, IRCTC food delivery, veg non veg train food",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Order Food from Train Vendors | Trains Cafe",
    description:
      "Find your train vendor, browse menu and order food online. Hot meals delivered at your seat with Trains Cafe.",
    url: pageUrl,
    type: "website",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "Trains Cafe Menu OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Food from Train Vendors | Trains Cafe",
    description:
      "Browse train vendor menus, order veg & non-veg meals online with Trains Cafe.",
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MenuClient />
    </Suspense>
  );
}
