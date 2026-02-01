import AllServicesClient from "./AllServicesClient";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const pageUrl = `${baseUrl}/all-services`;

const baseTitle =
  "All Railway Train Services in One Platforms in India | Trainscafe";

const baseDescription =
  "Explore railway services in one platform on trainscafe including food delivery in trains, live train status, station details, offers, blogs and 24x7 support.";

export const metadata = {
  title: baseTitle,
  description: baseDescription,

  keywords: [
    "railway services online",
    "food in train",
    "order food in train",
    "train food order online",
    "pnr status check",
    "railway station details",
    "train updates",
    "bulk food order in train",
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
        alt: "All railway services including train food delivery",
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
  return <AllServicesClient />;
}
