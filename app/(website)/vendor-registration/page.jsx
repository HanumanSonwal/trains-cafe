import VendorRegistration from "./VendorRegistration";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";
const pageUrl = `${baseUrl}/vendor-registration`;

export const metadata = {
  title: "Restaurant Vendor Registration for Train Food Delivery | TrainsCafe",
  description:
    "Become an IRCTC authorized food vendor with TrainsCafe. Register your restaurant to deliver hygienic food in trains across India.",
  keywords:
    "vendor registration, restaurant tie up, train food delivery partner, IRCTC food vendor registration",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Restaurant Vendor Registration for Train Food Delivery | TrainsCafe",
    description:
      "Join TrainsCafe as an authorized IRCTC food vendor and grow your restaurant's reach by serving food in trains. Register now!",
    url: pageUrl,
    type: "website",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "TrainsCafe Vendor Registration OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Vendor Registration for Train Food Delivery | TrainsCafe",
    description:
      "Partner with TrainsCafe as an IRCTC vendor to serve hygienic food in trains across India.",
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return <VendorRegistration />;
}
