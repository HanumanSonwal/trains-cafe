// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "antd";
// import Spinner from "@/app/componants/spinner/Spinner";
// import OrderFood from "@/app/componants/OrderFood";
// import Custom404 from "@/app/componants/Custom404";

// export default function DynamicPage({ params }) {
//   const [page, setPage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const slug = params.slug;

//     const fetchPage = async () => {
//       try {
//         const res = await fetch(`/api/web-pages?slug=${slug}`);
//         if (!res.ok) throw new Error("Failed to fetch page");
//         const data = await res.json();
//         const found = data.docs.find(
//           (p) => p.slug === slug && p.status === "published"
//         );
//         if (found) {
//           setPage(found);
//         } else {
//           setError("Page not found");
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPage();
//   }, [params.slug]);

//   if (loading) return <Spinner />;
//   if (error || !page) return <Custom404 />;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="relative h-40 md:h-60">
//         <img
//           src="/images/Trainscafe-Banner.webp"
//           alt="Order food in train"
//           className="absolute inset-0 object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <h1 className="text-white font-bold text-center px-4">
//             {page.title || "No Name Provided"}
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg ">
//         <h2
//           style={{ color: "#704d25" }}
//           className="text-2xl md:text-3xl font-bold text-center mb-4"
//         >
//           {page.title || "No Title Provided"}
//         </h2>

//         <OrderFood />

//         <div
//           className="text-gray-700 text-base md:text-lg leading-relaxed ck-content mb-6"
//           dangerouslySetInnerHTML={{
//             __html:
//               page.pageData || "<p>No content available for this page.</p>",
//           }}
//         />

//         <div className="text-center">
//           <Link href="/contactus" passHref>
//             <Button className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]">
//               Contact Us
//             </Button>
//           </Link>
//         </div>
//       </div>

//       <footer className="bg-coffee-600 text-white py-6 mt-8">
//         <div style={{ color: "#704d25" }} className="text-center text-sm">
//           <p>
//             Need help? Reach us at{" "}
//             <Link
//               href="tel:+918696963496"
//               className="font-bold text-blue-600 hover:text-blue-800 underline"
//             >
//               +91-8696963496
//             </Link>{" "}
//             |{" "}
//             <Link
//               href="mailto:support@trainscafe.in"
//               className="font-bold text-blue-600 hover:text-blue-800 underline"
//             >
//               support@trainscafe.in
//             </Link>
//           </p>
//           <p className="mt-2">
//             &copy; {new Date().getFullYear()} Trains Cafe. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }


// Vineet ka code

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, message } from "antd";
import Spinner from "@/app/componants/spinner/Spinner";
import OrderFood from "@/app/componants/OrderFood";
import Custom404 from "@/app/componants/Custom404";

const fetchPage = async (slug) => {
  try {
    const res = await fetch(`/api/web-pages?slug=${slug}`);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }
    const data = await res.json();
    return data.docs.find((page) => page.slug === slug && page.status === "published") || null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default function Page({ params }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const slug = params.slug;
    fetchPage(slug)
      .then((data) => {
        if (data) {
          setPage(data);
        } else {
          setError("Page not found or unpublished");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) return <Spinner />;
  if (error) return <Custom404 />; 
  if (!page) return <Custom404 />; 

  return (
    <div className="min-h-screen bg-gray-50">
  

      <div className="relative h-40 md:h-60">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="online food in train"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1  className="text-white font-bold text-center px-4">{page.title || "No Name Provided"}</h1>
        </div>
      </div>

      {/* Page Content Section */}
      <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg ">


        <h2 style={{color:'#704d25'}} className="text-2xl md:text-3xl font-bold text-center text-coffee-600 mb-4">
          {page.title || "No Title Provided"}
        </h2>
        <OrderFood/>
        <div
          className="text-gray-700 text-base md:text-lg leading-relaxed ck-content mb-6"
          dangerouslySetInnerHTML={{ __html: page.pageData || "<p>No content available for this page.</p>" }}
        />

        {/* Call-to-Action */}
        <div className="text-center">
        <Link href="/contactus" passHref>
           <Button
              type="btn"
              className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-coffee-600 text-white py-6 mt-8">
        <div style={{color:'#704d25'}} className="text-center text-sm">
          <p>
            Need help? Reach us at{" "}
            
            <Link href="tel:+918696963496" className="font-bold text-blue-600 hover:text-blue-800 underline">
                                +91-8696963496
                              </Link> | <Link href="support@trainscafe.in" className="font-bold text-blue-600 hover:text-blue-800 underline">
                               support@trainscafe.in
                              </Link>
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Trainscafe.com. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        .ck-content {
          {/* overflow-x: auto; */}
          font-size: 1rem;
        }

        .ck-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .ck-content th,
        .ck-content td {
          border: 1px solid #ddd;
          padding: 0.75rem;
          text-align: left;
        }

        .ck-content th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .ck-content tr:nth-child(even) {
          background-color: #fafafa;
        }

        .ck-content tr:hover {
          background-color: #f0f0f0;
        }

        @media (max-width: 768px) {
          .ck-content th,
          .ck-content td {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}