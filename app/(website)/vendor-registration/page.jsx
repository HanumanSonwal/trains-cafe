import VendorRegistration from "./VendorRegistration";
export const metadata = {
  title: "Restaurant Vendor Registration for Train Food Delivery | TrainsCafe",
  description:
    "Become an IRCTC authorized food vendor with TrainsCafe. Register your restaurant to deliver hygienic food in trains across India.",
  keywords:
    "vendor registration, restaurant tie up, train food delivery partner, IRCTC food vendor registration",
  openGraph: {
    title: "Restaurant Vendor Registration for Train Food Delivery | TrainsCafe",
    description:
      "Join TrainsCafe as an authorized IRCTC food vendor and grow your restaurant's reach by serving food in trains. Register now!",
    url: "https://trainscafe.in/vendor-registration",
  },
};

export default function Page() {
  return <VendorRegistration />;
}