import OnlineHotelBooking from "./OnlineHotelBooking";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://trainscafe.in";
const pageUrl = `${baseUrl}/online-hotel-booking`;

export const metadata = {
  title: "Online Hotel Booking | Book Best Hotels for Your Journey | Trains Cafe",
  description:
    "Book hotels online with Trains Cafe. Get the best deals, exclusive offers, and comfortable stays for your travel. Easy booking, 24x7 support, flexible payment options.",
  keywords:
    "online hotel booking, hotel reservation, book hotels online, couple friendly hotel, best hotel deals, trains cafe hotels",
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Online Hotel Booking | Trains Cafe",
    description:
      "Reserve your stay with Trains Cafe. Wide range of budget-friendly and premium hotels for a comfortable travel experience. Best rates, verified stays, easy payment.",
    url: pageUrl,
    type: "website",
    siteName: "Trains Cafe",
    images: [
      {
        url: `${baseUrl}/images/meta_image.png`,
        width: 1200,
        height: 630,
        alt: "Trains Cafe Online Hotel Booking OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Hotel Booking | Trains Cafe",
    description:
      "Book budget & premium hotels online with Trains Cafe. Best rates, verified stays, 24x7 support.",
    images: [`${baseUrl}/images/meta_image.png`],
  },
};

export default function Page() {
  return <OnlineHotelBooking />;
}
