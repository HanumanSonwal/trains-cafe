import ContactUsClient from "./ContactUsClient";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const pageUrl = `${baseUrl}/contact-us`;

const baseTitle =
  "Contact Trainscafe for Train Food Delivery & Customer Support";

const baseDescription =
  "Contact Trainscafe for food delivery in trains. Call, email or visit us for quick customer support, order assistance, and partnership queries. 24x7 help available.";

export const metadata = {
  title: baseTitle,
  description: baseDescription,

  keywords: [
    "contact trainscafe",
    "train food contact",
    "train food support",
    "trainscafe customer care",
    "food delivery in train contact",
    "railway food help",
    "trainscafe partnership",
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
        alt: "Contact Trainscafe for train food delivery support",
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
  return <ContactUsClient />;
}
