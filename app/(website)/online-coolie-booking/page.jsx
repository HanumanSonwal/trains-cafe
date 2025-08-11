import OnlineCoolieBooking from "./OnlineCoolieBooking";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
const pageUrl = `${baseUrl}/online-coolie-booking`;

export const metadata = {
  title: "Online Coolie Booking in Train | Hire Railway Porters | Trains Cafe",
  description:
    "Book verified railway coolies online with Trains Cafe. Get instant porter assistance at your train station. Hassle-free luggage handling, affordable rates, trusted service.",
  keywords:
    "online coolie booking, railway porter booking, train porter service, book coolie online, luggage porter railway station",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Online Coolie Booking | Trains Cafe",
    description:
      "Hire coolies online for hassle-free luggage handling at railway stations. Easy booking, fixed prices, verified porters with Trains Cafe.",
    url: pageUrl,
    type: "website",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "Trains Cafe Online Coolie Booking OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Coolie Booking | Trains Cafe",
    description:
      "Book verified railway coolies online with Trains Cafe. Trusted porter service for easy luggage handling.",
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return <OnlineCoolieBooking />;
}
