import MenuPage from "./MenuPage";

export const metadata = {
  title: "Order Food from Train Vendors | Trains Cafe",
  description:
    "View train station vendor menus & order food online. Veg & Non-Veg options available. Fresh meals delivered on your seat.",
  keywords: "order food in train, train vendor food, IRCTC food delivery, veg non veg train food",
  openGraph: {
    title: "Order Food from Train Vendors | Trains Cafe",
    description:
      "Find your train vendor, browse menu and order food online. Hot meals delivered at your seat with Trains Cafe.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://trainscafe.in"}/menu`,
  },
};

export default function Page() {
  return <MenuPage />;
}