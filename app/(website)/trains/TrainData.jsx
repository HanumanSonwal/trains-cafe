// import Link from "next/link";
// import React from "react";

// const TrainData = ({ trainNo, trainName }) => {
//   return (
//     <div
//       style={{
//         fontFamily: "Arial, sans-serif",
//         margin: "20px",
//         lineHeight: "1.6",
//       }}
//     >
//       <h2 style={{ color: "#2c3e50" }}>
//         Order Food in Train {trainName} ({trainNo})
//       </h2>
//       <p>
//         <Link
//           href="/"
//           className="primary"
//           style={{ color: "#007BFF", textDecoration: "none" }}
//         >
//           Order food in train
//         </Link>
//         <strong> {trainName}</strong> (<strong>{trainNo}</strong>) online for
//         your journey in a few simple steps. Get delicious food delivered to your
//         seat right on the train.
//       </p>
//       <h3>Steps to Order Food in {trainName}:</h3>
//       <ol style={{ paddingLeft: "20px", listStyleType: "decimal" }}>
//         <li>
//           Visit TrainsCafe Website or download the TrainsCafe Android/iOS App.
//         </li>
//         <li>
//           Select "Train Name / No." from the options to search for restaurants.
//         </li>
//         <li>
//           Enter train name "<strong>{trainName}</strong>" or train number "
//           <strong>{trainNo}</strong>" in the search box.
//         </li>
//         <li>Choose a restaurant from the displayed list.</li>
//         <li>Select your favorite dishes from the menu.</li>
//         <li>Apply discount codes from the available offers.</li>
//         <li>Choose to pay online or cash on delivery.</li>
//         <li>
//           Your order will be delivered to your seat when the train arrives at
//           the chosen station during your journey.
//         </li>
//       </ol>

//       <h3>Train Journey Details for {trainName}:</h3>
//       <p>
//         Train <strong>{trainName}</strong> (<strong>{trainNo}</strong>) runs
//         from Jabalpur (JBP) at 09:20 PM and reaches Nagpur (NGP) at 06:30 AM. It
//         runs on all days of the week, covering a total distance of 543 km with
//         an average speed of 63 km/hr.
//       </p>
//       <p>
//         The train has 22 coaches and makes stops at 13 stations with an average
//         halt time of 2 minutes per station. The longest halt is 10 minutes at
//         Itarsi Junction, and the shortest halt is 1 minute at Bankhedi railway
//         station.
//       </p>

//       <h3>Food on Train {trainName}:</h3>
//       <p>
//         Order high-quality, hygienic food online for train{" "}
//         <strong>{trainName}</strong> through TrainsCafe at various stations like
//         Jabalpur. All partner restaurants are approved by IRCTC e-Catering and
//         meet FSSAI hygiene and compliance standards.
//       </p>
//       <p>
//         TrainsCafe ensures all food is freshly prepared and safely delivered to
//         your seat. You can also use the "Food on Track" App for orders.
//       </p>

//       <h4>Bulk Orders for Groups:</h4>
//       <p>
//         Planning a group journey? TrainsCafe offers bulk booking services for
//         train <strong>{trainName}</strong> (<strong>{trainNo}</strong>).
//         Pre-book your meals for groups at Jabalpur or other selected stations.
//       </p>

//       <h4>Stations Available for Food Delivery:</h4>
//       <p>
//         Details of railway stations where food delivery is available for train{" "}
//         {trainName} (<strong>{trainNo}</strong>) are as follows:
//       </p>
//       {/* Add station details below */}
//     </div>
//   );
// };

// export default TrainData;


"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Spinner from "@/app/componants/spinner/Spinner";
import axios from "axios";
import TrainData from "./TrainData";
import { parseTrainSlug } from "@/utils/parseTrainSlug";

export default function TrainContent({ slug }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { trainNo, trainName } = parseTrainSlug(slug);

  const fetchPage = async () => {
    try {
      const res = await axios.get(`/api/web-train/${trainNo}`);
      setPage(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err?.response?.data?.message || "Error loading data");
    }
  };

  useEffect(() => {
    fetchPage().then(() => setLoading(false)).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (error || !page) return <TrainData trainName={trainName} trainNo={trainNo} />;

  return (
    <article className="max-w-3xl mx-auto mt-8">
      <section>
        <div
          className="text-gray-700 text-base md:text-lg leading-relaxed ck-content mb-8"
          dangerouslySetInnerHTML={{ __html: page.pageData || "<p>No content found.</p>" }}
        />
      </section>
      <footer className="bg-coffee-600 text-white py-6 mt-8">
        <div style={{ color: "#704d25" }} className="text-center text-sm">
          <p>
            Need help? Call{" "}
            <Link href="tel:+918696963496" className="font-bold text-blue-600 hover:text-blue-800 underline">
              +91-8696963496
            </Link> or mail{" "}
            <Link  href="mailto:info@trainscafe.in" className="font-bold text-blue-600 hover:text-blue-800 underline">
              info@trainscafe.in
            </Link>
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} TrainsCafe. All rights reserved.</p>
        </div>
      </footer>
    </article>
  );
}
