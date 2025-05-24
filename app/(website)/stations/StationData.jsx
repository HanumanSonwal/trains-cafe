import React, { useState } from "react";
import VendorCardWithoutTrain from "./VendorCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const StationData = ({ selectedStation }) => {
  const [expanded, setExpanded] = useState(false);
  const { name: stationName, value: stationCode } = selectedStation || {};

  console.log(JSON.stringify(selectedStation), "stationvendor");
  const toggleReadMore = () => setExpanded(!expanded);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "3%", lineHeight: "1.6", textAlign: "justify" }}>
      <h1 style={{ color: "#2c3e50", fontSize: "1.6rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Order Food on Train at {stationName}
      </h1>

      <div style={{ marginBottom: "1rem", borderRadius: "12px", overflow: "hidden" }}>
      <Swiper
  modules={[Autoplay]} 
  slidesPerView={1}
  loop={true}
  autoplay={{ delay: 3000 }}
>
  {["/images/TrainscafeBanner1.png", "/images/TrainscafeBanner2.png", "/images/TrainscafeBanner3.png" , "/images/TrainscafeBanner4.png" ].map((src, index) => (
    <SwiperSlide key={index}>
      <Image
        src={src}
        alt={`Banner ${index + 1}`}
        width={1200}
        height={80}
        style={{ objectFit: "cover", height: "80px", width: "100%" }}
      />
    </SwiperSlide>
  ))}
</Swiper>
      </div>

      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2c3e50", fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
        <Image src="/images/railway.webp" alt="train icon" width={50} height={50} />
        Restaurants at {stationName}
      </h1>

      <VendorCardWithoutTrain selectedStation={selectedStation} />

      <p>
        Order food on train at <strong>{stationName}</strong> online and get delivery right at your train seat.
        Station code of <strong>{stationName}</strong> is <strong>{stationCode}</strong>. It is one of the major railway
        stations where Zoop is currently serving meals to railway passengers.
      </p>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        Food Delivery Timings and Booking Info
      </h2>
      <p>
        The service hours for food delivery in trains at {stationName} Railway Station are between 08:30 am to 09:30 pm.
        Cut-off time to book train food delivery ranges from 60 to 120 minutes depending on the restaurant chosen by the passenger.
      </p>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        Group Orders at {stationName}
      </h2>
      <p>
        You can also book food for groups in bulk quantity with best discounts for {stationName}.
        In a few steps, order food for school or college student groups or corporate teams traveling together.
      </p>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        How to Order Food at {stationName} Railway Station
      </h2>

      {expanded && (
        <ol style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
          <li>Visit Zoop Website or download the Zoop Android/iOS App</li>
          <li>Click on ‘Station’ to search restaurants</li>
          <li>Enter '{stationName}' or station code '{stationCode}' in the search</li>
          <li>Choose a restaurant and menu</li>
          <li>Apply discount if any</li>
          <li>Pay and get delivery at your seat</li>
        </ol>
      )}

      <a
        onClick={toggleReadMore}
        style={{
          display: "inline-block",
          marginTop: "1rem",
          color: "#007BFF",
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        {expanded ? "Read Less" : "Read More"}
      </a>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        Nearby Stations Supporting Food Delivery
      </h2>
      <p>
        Zoop is also present at nearby stations: Gangapur City, Sawai Madhopur, Chittaurgarh, Guna, Ajmer, Jaipur, and Nagda.
      </p>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        Food delivery in train for {stationName}
      </h2>
      <p>
        Book food delivery in train for {stationName} railway station for your journey through some of the popular restaurants
        empanelled with Zoop. All restaurants at Kota Jn serving railway passengers under Zoop are approved by IRCTC e-Catering
        train food services division after thorough checks and audits. At present you can order food from 6 restaurant(s)
        namely Virangna The Virasat, All Season, Hotel Chitrakoot And Restaurant, Hotel Shri Kalyan, Jatin Tiffin Center,
        Romys Dine for Kota Jn KOTA. Most of these restaurants specialize in North Indian, Chinese, Punjabi, South Indian,
        Maharashtrian, Bengali, Mughalai, Continental cuisines.
      </p>

      <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2c3e50", marginTop: "2rem" }}>
        More Information for Food Delivery at Kota Jn (KOTA) Railway Station
      </h2>

      <div
        style={{
          margin: "2rem 0",
          textAlign: "center",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Image
          src="/images/vendors_banner.webp"
          alt="Bottom Ad Banner"
          layout="responsive"
          width={728}
          height={90}
        />
      </div>

      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: "1rem",
        }}
      >
        FAQs on train food delivery of online orders at {stationName}
      </h2>
      <ul style={{ listStyleType: "none" }}>
  {[
    {
      q: `How to book food online for ${stationName} railway station?`,
      a: `You can book food for ${stationName} station online at TrainsCafe Website or via mobile application at Google Play Store or iOS Store.`,
    },
    {
      q: `How to order food delivery in train online for ${stationName} railway station?`,
      a: `Booking food for ${stationName} station for train journeys online is amazingly simple. Just follow the below mentioned steps to book hygienic, fresh, and affordable food for delivery at your train seat.

Visit TrainsCafe Website and type station name,
Choose restaurant from the list displayed,
Pick menu items from the chosen restaurant’s menu displayed,
You can pay for your order safely online or cash on delivery,
Your order would get delivered right at your seat when the train arrives at ${stationName} railway station.`,
    },
    {
      q: `How to order Railway food delivery from running train at ${stationName} on call?`,
      a: `Please call at +91 801080 2222 to order train food delivery at ${stationName} station. You can also visit mobile webpage of TrainsCafe to place your orders online.`,
    },
    {
      q: `Can we pay for train food orders booked for ${stationName} station online?`,
      a: `Yes, you can pay online safely with convenience from various mediums like Debit / Credit Card, eWallets, Net Banking etc to pay for train food orders booked for ${stationName} station online.`,
    },
    {
      q: `How to order food in bulk quantity for groups bulk food in train for groups for on ${stationName} online?`,
      a: `Following steps help you order food in bulk for groups at ${stationName} station online:

Click on 'Group Order' button on TrainsCafe mobile web page,
Enter journey plan in the form displayed along with number of passengers,
Mention your menu and food preference,
Check menu options and prices from the best restaurants on ${stationName},
Create order as per your taste,
You will receive delivery in train at ${stationName} railway station.
You can also call at +91 8010802222 to order food in bulk for groups on ${stationName}.`,
    },
    {
      q: `How to register restaurant as food vendor for e-Catering in IRCTC for train delivery at ${stationName}?`,
      a: `Restaurant owners can click on 'Restaurant Signup' button on TrainsCafe web page and fill IRCTC e-Catering food vendor application form to register as food vendor for IRCTC e-Catering at ${stationName}. You can also call at +91 8010802222 for tie-up and listing on TrainsCafe.`,
    },
    {
      q: `How to order food delivery online for ${stationName} in IRCTC e-Catering ‘Food on Track’ App?`,
      a: `Please note steps to order food delivery online for ${stationName} in IRCTC e-Catering ‘Food on Track’ App:

Enter PNR or station name/code ${stationName} in the search box,
Look for TrainsCafe logo in the stations available on your journey,
Pick restaurants from the list displayed,
Create your order from the online menu card,
You can pay cash on delivery or online in advance,
Get delivery on your train seat.`,
    },
    {
      q: `Can passengers order train food online from WhatsApp for ${stationName} railway station?`,
      a: `Indian Railways now allows passengers to order train food from WhatsApp number 7042062070 for ${stationName} railway station.`,
    },
  ].map(({ q, a }, i) => (
    <li key={i} style={{ marginBottom: "14px", fontSize: "14px" }}>
      <strong>Q{i + 1}:</strong>{" "}
      <span>{q}</span>
      <br />
      <span style={{ marginLeft: "1rem", whiteSpace: "pre-line", display: "inline-block" }}>{a}</span>
    </li>
  ))}
</ul>

    </div>
  );
};

export default StationData;
