import BulkOrderForm from "./GroupFoodOrder";

export const metadata = {
  title: "Group Food Ordering in Train | Trains Cafe",
  description: "Order bulk or group food in train with Trains Cafe. Convenient online booking for families, groups & corporate travel. Get fresh meals delivered to your seat.",
  keywords: "group food ordering in train, bulk food order, train catering, IRCTC group food, food delivery in train",
  openGraph: {
    title: "Group Food Ordering in Train | Trains Cafe",
    description: "Book bulk food orders for your train journey. Fresh meals for families, groups, corporates delivered on your seat.",
    url: `${process.env.NEXT_PUBLIC_URL || "https://trainscafe.in"}/group-food-ordering-in-train`,
  },
};
export default function Page() {
  return <BulkOrderForm />;
}
