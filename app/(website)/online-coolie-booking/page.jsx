import OnlineCoolieBooking from "./OnlineCoolieBooking";

export const metadata = {
  title: "Online Coolie Booking in Train | Hire Railway Porters | Trains Cafe",
  description:
    "Book verified railway coolies online with Trains Cafe. Get instant porter assistance at your train station. Hassle-free luggage handling, affordable rates, trusted service.",
  keywords:
    "online coolie booking, railway porter booking, train porter service, book coolie online, luggage porter railway station",
  openGraph: {
    title: "Online Coolie Booking | Trains Cafe",
    description:
      "Hire coolies online for hassle-free luggage handling at railway stations. Easy booking, fixed prices, verified porters with Trains Cafe.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://trainscafe.in"}/online-coolie-booking`,
  },
};


export default function Page() {
  return <OnlineCoolieBooking />;
}