// app/page.js or wherever your Home page is defined

import HeroSection from "../componants/HeroSection";
import OfferSection from "../componants/OfferSection";
import OrderForm from "../componants/OrderForm";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <OrderForm />
      <OfferSection />
    </div>
  );
}
