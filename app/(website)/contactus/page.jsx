import ContactUsClient from "./ContactUsClient";

export const metadata = {
  title: "Contact Us - Trains Cafe",
  description:
    "Contact Trains Cafe for food delivery in trains. Call, email or visit us for quick support & partnership queries. 24x7 customer care available.",
  keywords:
    "Contact Trains Cafe, Train Food Contact, Train Food Support, Trains Cafe Customer Care",
  openGraph: {
    title: "Contact Us - Trains Cafe",
    description:
      "Contact Trains Cafe for food delivery in trains. Call, email or visit us for quick support & partnership queries.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contactus`,
  },
};

export default function Page() {
  return <ContactUsClient />;
}
