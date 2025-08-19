"use client";
import { useState } from "react";
import { Button, Collapse } from "antd";
import Link from "next/link";
const { Panel } = Collapse;

export default function Articles() {
  const [showFullContent, setShowFullContent] = useState(false);
  const previewText = ``;

  return (
    <div className="py-8 px-2 mx-auto max-w-[575px] bg-gray-100 rounded-md mb-3">
  

      <div className="text-center">
        <h1 className="font-bold text-[#704D25] text-xl mb-3">
          Order{" "}
          <Link
            className="text-blue-600 font-bold underline hover:text-blue-800"
            href={`${BASE_URL}/online-food-on-train`}
          >
            Fresh & Tasty Food on Train
          </Link>{" "}
          with Trainscafe
        </h1>
        <p className="text-justify text-sm">
          Are you bored of eating boring pantry food on the train? Are you on
          your long train journey and still ordering the same tasteless rail
          food? No need to worry now, introducing Trainscafe, which provides an
          extensive variety of food varieties on 450+ Railway Stations. you can
          easily order freshly prepared vegetarian, non-vegetarian, Jain, and
          regional dishes from FSSAI-certified kitchens across India. Whether
          you're on a pantry or non-pantry train, Trainscafe ensures timely
          delivery of hot, hygienic food directly to your seat.{" "}
        </p>
        {!showFullContent ? (
          <p className="text-sm mb-5">{previewText}</p>
        ) : (
          <div className="text-left text-sm mb-5 space-y-4">
            <h2 className="text-xl font-bold relative z-10 mt-3 text-[#704D25]">Why choose Trainscafe for online food orders on the train?</h2>
           
            <p>
              Trainscafe provides fresh meals and the{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/pure-veg-food-delivery-in-train`}
              >
                best food delivery in trains
              </Link>{" "}
              for travelers at all popular railway stations. Whatever you wish
              to eat, you can easily order it from Trainscafe,
            </p>
            <h4 className="font-bold text-[#704D25]">
              Try Trainscafe Delicious Food Menu and you will never regret it
              Some of the food offered by Trainscafe are listed below-
            </h4>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <b>North Indian:</b> North Indian food menu a rich variety of
                popular dishes from northern states, including Palak Paneer,
                Paneer Pasanda, Matar Paneer, Paneer Butter Masala, Mushroom
                Matar, Dum Aloo, Mixed Vegetables, Bhindi Masala, and Aloo or
                Vegetable Paratha. It is often enjoyed with a range of Indian
                breads such as Naan, Missi Roti, Plain Roti, and Butter Roti.
                North Indian cuisine also includes flavorful Veg and Non-Veg
                Biryani, making it a diverse and delicious culinary tradition.
              </li>
              <li className="mb-2">
                <b>South Indian:</b> South Indian cuisine, don’t hesitate to
                order delicious dishes like Masala Dosa, Rawa Dosa, or Madras
                Dosa, along with Rasam and Rice, Uttapam, Upma, Vada with
                Sambar, and the all-time favorite Idli Sambar.
              </li>
              <li className="mb-2">
                <b>Chinese Food:</b> Chinese food options include Manchurian,
                Hakka noodles or Veg noodles, Spring rolls, a Chinese platter,
                Veg fried rice, and a combination of Hakka noodles or Fried rice
                served with Chilli Paneer or Manchurian.
              </li>
              <li className="mb-2">
                <b> International Cuisine:</b> The menu may include salads,
                sandwiches, spaghetti, and other items prepared in the Western
                style.
              </li>
              <li className="mb-2">
                <b>Regional Specialties Food:</b> The variety of Indian cuisine
                is reflected in the distinct dishes that each region
                contributes.
              </li>

              <li className="mb-2">
                <b>Jain Food in Train:</b> We delivers fresh and hygienic{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/jain-food-in-train`}
                >
                  {" "}
                  Jain food in train{" "}
                </Link>{" "}
                specially prepared without onion, garlic, or root vegetables.
                Our meals are crafted by experienced chefs who understand
                traditional Jain dietary needs, ensuring purity, taste, and
                timely delivery. Whether you're on a short trip or a long
                journey, enjoy sattvik Jain food in train served hot, wholesome,
                and right to your seat.
              </li>
              <li className="mb-2">
                <b>Veg Thali:</b> Don't stop yourself if you want to savor the
                delicious veg thali of your choosing. A thali can be from
                Punjab, Bengal, North India, or South India.{" "}
              </li>
              <li className="mb-2">
                <b>Non-Veg Deluxe Thali:</b>
                We promise not to let any non-vegetarians down; you are welcome
                to select your preferred{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/non-veg-food-in-train`}
                >
                  {" "}
                  non-vegetarian thali in train
                </Link>
                .This is the train's most well-organized thali.
              </li>
              <li className="mb-2">
                <b>Swiggy/Zomato Delivery:</b> Trainscafe allows passengers to
                have the opportunity of online food order online from Swiggy and
                Zomato directly.
              </li>
              <li className="mb-2">
                <b>Domino's /Pizza Hut Delivery:</b> Order the best Pizza online
                from near by Domino's or Pizza Hut restaurants of the Railway
                station.
              </li>
              <li>
                <b>Fast Food Favorites:</b> Bite juicy aloo tikki, cheese
                burgers, crispy French fries, or cheesy veg/non-veg pizzas,
                rolls, chinese fast food, for a quick, satisfying meal.chy
                snacks like chips, wafers, tangy pickles, or sip chai/coffee to
                elevate your journey.
              </li>
            </ul>
            <h2 className="font-bold text-xl text-[#704D25]">
              Exciting Offers & Promo Codes on Trainscafe
            </h2>
            <p>Save more on your train meals with our latest deals:</p>
            <ul className="list-disc list-inside">
              <li>
                <b>First Order Offer -</b> Get flat ₹50 off on your first order.
              </li>
              <li>
                <b>First Order Offer -</b> Get flat ₹50 off on your first order.
              </li>
              <li>
                <b>Group Booking Discount -</b> Traveling with friends or
                family? Trainscafe makes{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/group-food-order-in-train`}
                >
                  {" "}
                  group food order in train{" "}
                </Link>{" "}
                easy and hassle-free.
              </li>
              <li>
                <b>Festival Specials -</b> Celebrate with special combo meals at
                discounted prices.
              </li>
              <li>
                <b>Coupon Codes -</b> Apply exclusive codes during checkout for
                instant discounts.
              </li>
              <li>
                <b>Free Delivery Offers -</b> Available on select stations and
                restaurants.
              </li>
            </ul>
            <p>
              🎁New offers updated regularly-check the “Apply Coupon” section
              before checkout
            </p>

            <h2 className="font-bold text-xl text-[#704D25]">
              Online{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href="https://api.whatsapp.com/send/?phone=%2B918696963496&text=Hi&type=phone_number&app_absent=0"
              >
                Order Food on the Train via WhatsApp
              </Link>{" "}
              - Easy Steps
            </h2>
            <p>
              Now you can easily order food on your train journey through
              WhatsApp. Just follow these simple steps:
            </p>
            <ul className="list-disc list-inside">
              <li>
                <b>First Order Offer -</b> Get flat ₹50 off on your first order.
              </li>
              <li>
                <b>Say Hello -</b> Send a “Hi” message to WhatsApp number{" "}
                <b>+91 8696963496</b>.
              </li>
              <li>
                <b>Enter PNR -</b> Type your <b>Train no.</b> OR{" "}
                <b>10-digit PNR number</b> to help us find your train details.
              </li>
              <li>
                <b>Choose Station -</b> Select the station where you want your
                food to be delivered.
              </li>
              <li>
                <b>Pick a Restaurant -</b> After selecting the station, choose a
                restaurant from the list provided.
              </li>
              <li>
                <b>Select Your Food -</b> Browse the menu and choose the dishes
                you want to order.
              </li>
              <li>
                <b>Share Your Details -</b> Provide your{" "}
                <b> name and seat number</b> for easy delivery.
              </li>
              <li>
                <b>Make Payment -</b> Pay online using <b>UPI</b>, or choose{" "}
                <b>cash on delivery</b> (available at some locations).
              </li>
            </ul>
            <p>
              That’s it! Enjoy hot and fresh meals delivered right to your train
              seat.
            </p>
            <h2 className="font-bold  text-xl text-[#704D25]">
              Don’t Need to Download our app ‘Trainscafe’ from Playstore
            </h2>
            <p>
              Now you can easily Visit our (PWA) Web App from your browser for
              quick ordering of food in train. Follow the mentioned below steps-
            </p>
            <ul className="list-disc list-inside">
              <li>Open your browser and search Trainscafe.</li>
              <li>Visit our Website.</li>
              <li>Finally, the Web App open it for ordering food on train.</li>
              <li>Don’t Need to download App directly order on web App</li>
            </ul>

            <h3 className="fw-bold">Just Tap & Eat - No App Download Needed</h3>
            <ul className="list-disc list-inside">
              <li>
                <b>Fresh Meals, No App Required - </b>Trainscafe runs as a
                Progressive Web App (PWA); no app store download needed.
              </li>
              <li>
                <b>Instant Access via Browser - </b>Simply open{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}`}
                >
                  {" "}
                  Trainscafe.com
                </Link>{" "}
                and tap “Add to Home Screen” for easy reordering.
              </li>
              <li>
                <b> Fast, Tap-Based Ordering - </b> Enjoy a smooth experience
                right from your phone’s browser-no installations, no clutter.
              </li>
              <li>
                <b>FSSAI-Certified Kitchens - </b>Every meal is freshly cooked
                in certified, hygienic kitchens to meet food safety standards.
              </li>
              <li>
                <b>Hot Food Delivered to Your Berth - </b>Order your favorite
                dishes and get them delivered fresh and hot to your train seat.
              </li>
              <li>
                <b>Safe, Hygienic, and Quality-Driven - </b>Our focus is on
                health, cleanliness, and the satisfaction of every traveler.
              </li>
            </ul>

            <h2 className="t -skew-x-12 text-xl font-bold text-[#704D25]">About Trainscafe -</h2>
            <p>
              Trainscafe is a well-known e-catering platform that provides fresh
              and hygienic online food delivery on trains. Trainscafe ranked
              among the top food service provider companies in the train.
              Whether you are North Indian or South Indian, we take care of all
              and provide the best fresh food delivery on train. We work 24*7
              and consist of dedicated workers and professionals. Trainscafe
              also operates in more than 450+ Indian railway stations across
              India. With many smiling faces, it has served over 4 lakh meals on
              over 6500 trains and counting. Because of its dedication to
              providing high-quality food in trains at reasonable prices,
              Trainscafe has become well-known among many passengers. Order
              online train food with us.
            </p>

            <h2 className="font-bold text-xl text-[#704D25]">
              Enjoy Delicious{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/train-food-delivery`}
               
              >
                {" "}
                Train Food Delivery{" "}
              </Link>{" "}
              with Fresh Food Delivered to Your train seat
            </h2>
            <p>
              Tired of bland train food or limited pantry options? Say goodbye
              to boring meals and hello to tasty, hygienic food delivered right
              to your train seat with <b>Trainscafe</b> - India’s most trusted
              train food delivery platform
            </p>

            <h2 className="text-xl">
              <b>Top Reasons to Trust Trainscafe for Food Delivery on Train</b>
            </h2>

            <ul className="list-disc list-inside">
              <li>
                <b>Wide Variety - </b>From regional specialties to your favorite
                dishes, choose from a diverse menu of veg and non-veg meals.
              </li>
              <li>
                <b> Fresh & Hot - </b>No more stale snacks! Your food is
                prepared fresh and delivered hot to your train seat.
              </li>
              <li>
                <b>Easy Ordering - </b>Just a few clicks, and your meal is on
                its way!
              </li>
              <li>
                <b>Pantry or No Pantry? - </b>
                No problem! We deliver to all major trains across India.
              </li>
              <li>
                <b>Real-Time Tracking -</b> Stay updated on your order status
                and delivery time.
              </li>
              <li>
                <b>24x7 Customer Support for a Smooth Experience</b>
              </li>
            </ul>

            <h4 style={{fontSize:"20px"}} className="font-bold text-[#704D25]">FSSAI-Certified Partner Restaurants</h4>
            <p>
              {" "}
              Hygienically prepared meals from verified kitchens to ensure food
              safety.
            </p>
            <ul className=" list-inside">
              <li className="mb-2">
                <b>🚉 Available on 6000+ Trains</b>
                <br></br> Pantry or Non-pantry - we serve fresh food across
                major trains in India.
              </li>
              <li className="mb-2">
                <b>🍱 Hot & Regional Food Delivered to Your Seat</b> <br></br>{" "}
                From North Indian to South Indian, Jain meals & combos - all
                freshly packed.
              </li>
              <li className="mb-2">
                <b>📍 Live Order Tracking</b>
                <br></br> Real-time updates from kitchen to train seat for full
                transparency.
              </li>
              <li className="mb-2">
                <b>🔢 Simple Booking via PNR & Train Number</b>
                <br></br> No app hassles - just enter your PNR, select station,
                order & relax.
              </li>
              <li className="mb-2">
                <b>💳 Safe Payments & COD Available</b>
                <br></br> Contactless online payments + cash-on-delivery for
                ease.
              </li>
              <li className="mb-2">
                <b>☎️ 24/7 Customer Support</b>
                <br></br> Human assistance whenever you need - before, during,
                or after your journey.
              </li>
              <li className="mb-2">
                <b>🌟 Rated & Reviewed by Verified Travelers</b>
                <br></br> Thousands of 4.5+ star reviews from satisfied
                passengers nationwide.
              </li>
            </ul>
            <p>
              Make your journey more enjoyable with delicious, hassle-free
              meals.
            </p>

            <h2 className="font-bold  text-xl text-[#704D25]">
              Delicious Hot & Hygienic Meals on Your Train Journey with
              Trainscafe
            </h2>
            <p>
              {" "}
              Skip the train food and treat yourself to delicious, hygienic
              meals from top-rated restaurants delivered to your seat! Whether
              you’re craving for tasty food at your seat, regional specialities,
              or quick bites, we’ve covered all your choices, especially for
              travellers.
            </p>
            <h2 className="font-bold text-xl text-[#704D25]">
              Online Food Order in Trains at 450+ Railway Stations Across India
            </h2>
            <p>
              Trainscafe makes your train journey more enjoyable with seamless
              online food order in trains. Our e-catering services are available
              on 7000+ trains and at 450+ major railway stations, including New
              Delhi (NDLS), Mumbai (BCT), Kolkata (KOAA), Chennai (MAS),
              Ahmedabad (ADI), Agra (AGC), and Prayagraj (PRYJ), among many
              others. Choose from a wide range of hygienic, freshly prepared
              meals by FSSAI-certified restaurant partners. Whether it's
              breakfast, lunch, or dinner -{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/order-favourite-dishes-in-train`}
              >
                {" "}
                order your favorite dishes in train{" "}
              </Link>{" "}
              are delivered hot and fresh, directly to your train seat.
              <br></br>Enjoy your journey, and let Trainscafe handle the food
              with care and quality you can trust.
            </p>
            <h2 className="font-bold text-xl text-[#704D25]">
              More Than Just Train Food - Trainscafe Helps You Travel Smarter
            </h2>
            <p>
              Trainscafe isn't just about food delivery. We also make your train
              journey smooth and stress-free with essential travel tools like:
            </p>

            <ul className=" list-inside">
              <li className="mb-2">
                <b>🔍 Check PNR Status :</b> Instantly you can{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/check-pnr-updates`}
                >
                  {" "}
                  check PNR updates{" "}
                </Link>{" "}
                about your ticket confirmation and seat details.
              </li>
              <li className="mb-2">
                <b>🚆 Live Train Running Status :</b> Track your{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/check-live-train-running-status`}
                >
                  {" "}
                  train running live status{" "}
                </Link>{" "}
                with real-time updates. Our system uses advanced GPS-based
                technology to provide accurate train location, delays, and
                estimated arrival times.
              </li>
              <li className="mb-2">
                <b>📍 🛤️ Train Schedule & Timings :</b> Plan your journey with
                our accurate{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/check-train-time-table`}
                >
                  {" "}
                  IRCTC train time table schedule.
                </Link>{" "}
                View complete train routes, arrival and departure times, halt
                durations, and all stoppages - all in one place.
              </li>
              <li className="mb-2">
                <b>📍 Coach Position & Platform Info:</b> Avoid last-minute
                confusion by checking the exact{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/check-train-coach-position`}
                >
                  check coach position
                </Link>{" "}
                of your train. Know in advance where your coach will be on the
                platform and reach it without hassle.
              </li>
              <li className="mb-2">
                <b>👷 Book Coolie Services Easily:</b> Avoid carrying heavy
                luggage! With just a few clicks,{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/online-coolie-in-train`}
                >
                  book a coolie in train{" "}
                </Link>{" "}
                to help with your bags, ensuring a smoother, stress-free travel
                experience.{" "}
              </li>
              <li className="mb-2">
                <b>🛏️ Book Hotels Near Your Station:</b>
                Planning to take a break?{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/book-hotels-in-train-near-by-station`}
                >
                  {" "}
                  Find & Book hotels near major railway stations{" "}
                </Link>{" "}
                to rest comfortably before continuing your journey. Perfect for
                long travels.
              </li>
              <li className="mb-2">
                <b>🍴 Restaurant Partners - Join Us:</b>
                Are you a restaurant owner looking to serve train passengers?{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href={`${BASE_URL}/vendor-registration`}
                >
                  {" "}
                  Vendor registration with Trainscafe{" "}
                </Link>{" "}
                delivers your delicious food to thousands of railway travelers
                daily. We bring your tasty meals to thousands of travelers every
                day.
              </li>
            </ul>

            <h2 className="font-bold text-xl text-[#704D25]">
              Why Choose Trainscafe for All Your Travel Needs?
            </h2>

            <p>
              Traveling by Indian Railways? Make your journey more enjoyable
              with Trainscafe’s e-catering service. We bring you fresh, hot
              meals, from light snacks to hearty thalis and regional
              specialties, all tailored to your preferences. Order online
              effortlessly and enjoy trusted, hygienic meals delivered directly
              to your seat.
            </p>

            <ul className=" list-inside mb-3">
              <li className="mb-2">
                Trainscafe has successfully delivered over 10K+ meals to
                passengers across 7000+ trains in India.
              </li>
              <li className="mb-2">
                Rated 4.8/5 on Google by our customers, you can{" "}
                <Link
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                  href="https://g.co/kgs/Jsxy8vM"
                >
                  {" "}
                  Check on Trainscafe -{" "}
                </Link>{" "}
                Google My Business{" "}
              </li>
              <li className="mb-2">
                Our team includes FSSAI-trained kitchen partners, logistics
                professionals, and customer care experts with 5+ years of
                railway e-catering experience.
              </li>
              <li className="mb-2">
                All restaurant partners are FSSAI-certified and verified through
                a strict onboarding process
              </li>
              <li className="mb-2">
                Convenience in One Place: We are your one-stop solution for
                train food, hotel bookings, luggage assistance, and real-time
                train tracking.
              </li>
              <li className="mb-2">
                Business Opportunity for Restaurants: Expand your restaurant’s
                reach and serve fresh, local food to thousands of train
                travelers.
              </li>
              <li className="mb-2">
                Seamless Experience: From booking food to a coolie, tracking
                your train, and even finding a nearby hotel - it's all just a
                tap away!
              </li>
            </ul>

            <h2 className="font-bold text-xl text-[#704D25]">Our Related Search Queries on Browser</h2>
            <p className="mb-3">
              Hygienic food delivery in trains |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/online-train-food-delivery`}
              >
                Train food delivery online{" "}
              </Link>
              | Fast train food ordering |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/order-food-in-train`}
              >
                Order food in train{" "}
              </Link>{" "}
              | IRCTC food delivery |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/order-meals-in-train`}
              >
                {" "}
                Fresh meals in train{" "}
              </Link>
              | Regional food in trains |
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/railway-meal-food-in-train`}
              >
                {" "}
                Railway meal delivery service{" "}
              </Link>{" "}
              | Online food for train travel | Food delivery to your train seat
              |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/ecatering-train-services`}
              >
                {" "}
                E-catering train services{" "}
              </Link>{" "}
              | Quick meal delivery in trains |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/train-food-booking-online`}
              >
                {" "}
                Train food booking online{" "}
              </Link>{" "}
              | Best train food delivery services India |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href="https://jsdl.in/DT-30J42CYB8JR"
              >
                {" "}
                Justdial Food delivery in train{" "}
              </Link>
              | Book meals for train journey |{" "}
              <Link
                className="text-blue-600 font-bold underline hover:text-blue-800"
                href={`${BASE_URL}/online-food-for-train-passengers`}
              >
                {" "}
                Online food for train passengers{" "}
              </Link>
              | Delicious train meals delivery | Hot meals in train | Tasty
              train food options | Meal options for train travel | Comfortable
              train food ordering
            </p>

            <h2 className="font-bold text-xl text-[#704D25]">Top-Rated Trains</h2>
            <p>
              Order Food in Vande Bharat Express - 22436 | Order Food in Tejas
              Express - 22671 | Order Food in Rajdhani Express - 12951 | Order
              Food in Duronto Express - 12274 | Order Food in Shatabdi Express -
              12002 | Order Food in Humsafar Express - 22355 | Order Food in
              Gatimaan Express - 12049 | Order Food in Double Decker Express -
              12932 | Order Food in Garib Rath Express - 12203 | Order Food in
              Antyodaya Express - 22877 | Order Food in Suvidha Express - 82653
              | Order Food in Jan Shatabdi Express - 12071 | Order Food in
              Deccan Odyssey - 02101 | Order Food in Palace on Wheels - 02301 |
              Order Food in Golden Chariot - 02701 | Order Food in Maharajas'
              Express - 02401 | Order Food in Howrah Rajdhani Express - 12301 |
              Order Food in Mumbai CSMT Rajdhani - 22222 | Order Food in
              Secunderabad Shatabdi - 12025 | Order Food in Chennai Duronto -
              12270 | Order Food in Kerala Express - 12625 | Order Food in
              Punjab Mail - 12137 | Order Food in Coromandel Express - 12841 |
              Order Food in Tamil Nadu Express - 12621 | Order Food in Sapt
              Kranti Express - 12557 | Order Food in Bhubaneswar Rajdhani -
              22823 | Order Food in Pune Duronto Express - 12263 | Order Food in
              Yesvantpur Howrah Duronto - 12246 | Order Food in Sealdah Rajdhani
              Express - 12314 | Order Food in Bangalore Rajdhani Express - 22691
              | Order Food in Howrah Yeshvantpur Express - 12863 | Order Food in
              Lokmanya Tilak AC Express - 22123
            </p>
            <h2 className="font-bold text-xl text-[#704D25]">Top Railway Stations</h2>
            <p className="mb-3">
              Order Food in train at New Delhi Railway Station - NDLS | Order
              Food in train at Mumbai CST Railway Station - CSMT | Order Food in
              train at Howrah Junction - HWH | Order Food in train at Chennai
              Central - MAS | Order Food in train at Bengaluru City Junction -
              SBC | Order Food in train at Ahmedabad Junction - ADI | Order Food
              in train at Secunderabad Junction - SC | Order Food in train at
              Pune Junction - PUNE | Order Food in train at Lucknow NR - LKO |
              Order Food in train at Patna Junction - PNBE | Order Food in train
              at Jaipur Junction - JP | Order Food in train at Bhopal Junction -
              BPL | Order Food in train at Kanpur Central - CNB | Order Food in
              train at Vijayawada Junction - BZA | Order Food in train at
              Ernakulam Junction - ERS | Order Food in train at Bhubaneswar -
              BBS | Order Food in train at Visakhapatnam - VSKP | Order Food in
              train at Nagpur Junction - NGP | Order Food in train at Coimbatore
              Junction - CBE | Order Food in train at Vadodara Junction - BRC
            </p>

            <h2 className="font-bold  text-xl text-[#704D25]">
              Frequently Asked Questions (FAQs)
            </h2>
            <Collapse accordion>
              <Panel
                header="Q1. How do I order food on a train using Trainscafe?"
                key="1"
              >
                <p>
                  Go to Trainscafe.com and enter the required details to get the
                  availability of the station through the PNR Number. Choose
                  your favourite items from the list of restaurants available.
                  Call and WhatsApp at 8696963496 for customer care assistance.
                </p>
              </Panel>
              <Panel
                header="Q2. How can I track my Trainscafe food order?"
                key="2"
              >
                <p>
                  After placing an order through Trainscafe, you’ll get a
                  confirmation SMS/WhatsApp with your Order ID. Use this Order
                  ID on our website to track your order.
                </p>
              </Panel>
              <Panel
                header="Q3. Can I order food directly while travelling on a train?"
                key="3"
              >
                <p>
                  Yes! you can order food directly while travelling. Trainscafe
                  lets you order food from the best restaurants along your
                  route. Use our website, calling number and as well whatsapp
                  (+91 8696963496), or social media chats (Instagram/Google) to
                  place orders.
                </p>
              </Panel>

              <Panel
                header="Q4. How do I complain about a delayed or incorrect order?"
                key="4"
              >
                <p>
                  Contact us via WhatsApp at 8696963496, call +91 8696963496, or
                  email complaints to info@trainscafe.in. We resolve customer
                  queries within 2 hours.
                </p>
              </Panel>

              <Panel
                header="Q5. What makes Trainscafe the best app for train food?"
                key="5"
              >
                <p>
                  Trainscafe partners with 3,000+ FSSAI-approved restaurants all
                  across India, offering diverse cuisines across India (North
                  Indian, South Indian, Continental, Chinese, etc) at
                  budget-friendly prices with freshly prepared meals, delivered
                  directly to your seat.
                </p>
              </Panel>

              <Panel
                header="Q6. Is Trainscafe an IRCTC-approved service?
"
                key="6"
              >
                <p>
                  ❌ "No, Currently Trainscafe is working..." → ✅ “We’re
                  actively working to meet IRCTC integration requirements and
                  currently serve with 100% FSSAI-approved restaurant partners.
                </p>
              </Panel>

              <Panel
                header="Q7. How do I get restaurant-quality meals on a train?"
                key="7"
              >
                <p>
                  Trainscafe provides the options of choosing a restaurant. You
                  can simply choose according to the ratings and pricing options
                  of the restaurant. Trainscafe partners with only the best
                  quality meals restaurant.
                </p>
              </Panel>

              <Panel
                header="Q8. Can I order food for someone else traveling by train?"
                key="8"
              >
                <p>
                  Absolutely, Enter their Train/PNR Number and select the food
                  options. Mention this Name and Contact Number while checking
                  out from the cart. Trainscafe ensures that meals reach
                  directly to their seat.
                </p>
              </Panel>

              <Panel
                header="Q9. How do I add food to my existing train ticket?"
                key="9"
              >
                <p>
                  Visit Trainscafe.com or open the PWA app. <br></br>
                  Enter your 10-digit PNR.<br></br>
                  Choose your station and restaurant.<br></br>
                  Select dishes and Select payment Mode.
                </p>
              </Panel>

              <Panel
                header="Q10. Does Trainscafe serve burgers and pizzas on trains?"
                key="10"
              >
                <p>
                  Yes! Trainscafe serves a delicious variety of burgers and best
                  quality pizzas from the top restaurant chains in India.
                </p>
              </Panel>

              <Panel
                header="Q11. What payment options does Trainscafe accept?"
                key="11"
              >
                <p>
                  We accept UPI, credit/debit cards, net banking, and
                  cash-on-delivery payment modes.
                </p>
              </Panel>

              <Panel header="Q12. How early should I place my order?" key="12">
                <p>
                  It depends on the restaurant's minimum order time.
                  Approximately order should be before 1 Hour from arrival of
                  the station.
                </p>
              </Panel>

              <Panel header="Q13. Are there vegetarian/vegan options?" key="13">
                <p>
                  Yes! Menus can be filtered by dietary preferences (veg,
                  non-veg, Jain, vegan). Choose the meals that suit your needs.
                </p>
              </Panel>

              <Panel header="Q14. Can I cancel or modify an order?" key="14">
                <p>
                  Modify/cancel orders up to 1 hour before delivery by calling
                  customer care at 8696963496. Changes can be made according to
                  the time otherwise, it is gonna be the same.
                </p>
              </Panel>

              <Panel
                header="Q15. How do I apply discounts to my order?
"
                key="15"
              >
                <p>
                  Check the offers during checkout from the cart. Enter codes at
                  checkout and get the available discounts on your first order
                  or another one.
                </p>
              </Panel>

              <Panel
                header="Q16. Is Trainscafe available on all trains?"
                key="16"
              >
                <p>
                  We cover 8,000+ trains, including Rajdhani, Shatabdi, Duronto,
                  and Holiday Special trains. Enter your PNR Number to check the
                  availability of restaurants.
                </p>
              </Panel>

              <Panel
                header="Q17. What if my train is running late?
"
                key="17"
              >
                <p>
                  Trainscafe team checks the live train statuses of running
                  trains. Your order will be adjusted according to the time if
                  the train is late and order will be prepared accordingly from
                  the restaurant, as we are dedicated to serving fresh and hot
                  meals.
                </p>
              </Panel>

              <Panel
                header="Q18. Do you serve breakfast on early-morning trains?
"
                key="18"
              >
                <p>
                  Yes! We do deliver food in the early morning time on several
                  stations. Breakfast can be customized according to the
                  requirements.
                </p>
              </Panel>

              <Panel
                header="Q19. Can we order in bulk from Trainscafe?"
                key="19"
              >
                <p>
                  Yes, you can order in bulk from Trainscafe. We have experience
                  in providing the best quality meals on entire coaches and
                  trains.
                </p>
              </Panel>

              <Panel
                header="Q20. How to book 450+ meals through Trainscafe?"
                key="20"
              >
                <p>
                  Simply go to Trainscafe.com, and there will be an option of
                  group booking. Fill in the details, and after some time the
                  Trainscafe customer care executive will call you to get your
                  preference.
                </p>
              </Panel>
            </Collapse>
          </div>
        )}
        <Button
          type="default"
          onClick={() => setShowFullContent(!showFullContent)}
          className="border-none rounded-full px-4 py-2 text-xs font-bold hover:bg-[#D49929] hover:text-white"
        >
          {showFullContent ? "Show Less" : "View More"}
        </Button>
      </div>
    </div>
  );
}
