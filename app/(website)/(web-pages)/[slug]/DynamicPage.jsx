"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";
import Spinner from "@/app/componants/spinner/Spinner";
import OrderFood from "@/app/componants/OrderFood";
import Custom404 from "@/app/componants/Custom404";
import HeroSection from "@/app/componants/HeroSection";
import CustomerReviews from "@/app/componants/CustomerReviewSlider";
import PromoBanner from "@/app/componants/PromoBanner";
import RecentOrders from "@/app/componants/RecentOrders";

const fetchPage = async (slug) => {
  try {
    const res = await fetch(`/api/web-pages?slug=${slug}`);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }
    const data = await res.json();
    return (
      data.docs.find(
        (page) => page.slug === slug && page.status === "published"
      ) || null
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default function Page({ params }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const slug = params.slug;

  useEffect(() => {
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
  }, [slug]);

  if (loading) return <Spinner />;
  if (error || !page) return <Custom404 />;

  // Slug exceptions:
  const isExceptionSlug =
    slug === "stations" || slug === "trains";

  const rawContent = page.pageData || "<p>No content available for this page.</p>";

  let plainText = "";
  if (typeof window !== "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawContent;
    plainText = tempDiv.innerText;
  }

  const previewLength = 300;
  const shouldTruncate = !isExceptionSlug && plainText.length > previewLength;

  const truncatedHTML = shouldTruncate
    ? plainText.slice(0, previewLength) + "..."
    : plainText;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <OrderFood />

      {/* Dynamic Page Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
        <h2
          style={{ color: "#704d25" }}
          className="text-2xl md:text-3xl font-bold text-center mb-4"
        >
          {page.title || "No Title Provided"}
        </h2>

        <div
          className="text-gray-700 text-base md:text-lg leading-relaxed ck-content mb-6"
          dangerouslySetInnerHTML={{
            __html: showFullContent || isExceptionSlug ? rawContent : truncatedHTML,
          }}
        />

        {/* Show More Toggle */}
        {shouldTruncate && (
          <div className="text-center mb-4">
            <Button
              type="btn"
              className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "Show Less" : "View More"}
            </Button>
          </div>
        )}

        {/* CTA */}
   
      </div>

        <PromoBanner />
      <RecentOrders />
      <CustomerReviews />

      {/* Footer */}
      <footer className="bg-coffee-600 text-white py-6 mt-8">
        <div style={{ color: "#704d25" }} className="text-center text-sm">
          <p>
            Need help? Reach us at{" "}
            <Link
              href="tel:+918696963496"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              +91-8696963496
            </Link>{" "}
            |{" "}
            <Link
              href="mailto:support@trainscafe.in"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              support@trainscafe.in
            </Link>
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Trainscafe.com. All rights reserved.
          </p>
        </div>
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
      </footer>

      <style jsx global>{`
        .ck-content {
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
