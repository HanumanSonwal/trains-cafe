"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";
import Spinner from "@/app/componants/spinner/Spinner";
import OrderFood from "@/app/componants/OrderFood";
import Custom404 from "@/app/componants/Custom404";
import HeroSection from "@/app/componants/HeroSection";
import dynamic from "next/dynamic";

const CustomerReviews = dynamic(
  () => import("@/app/componants/CustomerReviewSlider"),
  { ssr: false, loading: () => <Spinner /> }
);

const PromoBanner = dynamic(() => import("@/app/componants/PromoBanner"), {
  ssr: false,
  loading: () => <Spinner />,
});

const RecentOrders = dynamic(() => import("@/app/componants/RecentOrders"), {
  ssr: false,
  loading: () => <Spinner />,
});

function DynamicPage({ page, slug, previewHtml, shouldTruncate }) {
  const [showFullContent, setShowFullContent] = useState(false);

  if (!page) return <Custom404 />;

  const isExceptionSlug = slug === "stations" || slug === "trains";

  const contentToRender = useMemo(() => {
    const rawHtml = page.pageData || "<p>No content available.</p>";

    if (isExceptionSlug) return rawHtml;

    if (shouldTruncate && !showFullContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = rawHtml;

      const textContent = tempDiv.innerText || "";
      const truncatedText =
        textContent.length > 300
          ? textContent.slice(0, 300) + "..."
          : textContent;

      return `<div>${truncatedText}</div><div style="display:none;">${rawHtml}</div>`;
    }

    return rawHtml;
  }, [page.pageData, showFullContent, isExceptionSlug, shouldTruncate]);

  const toggleContent = useCallback(() => {
    setShowFullContent((prev) => !prev);
  }, []);

  useEffect(() => {
    // Ensure Googlebot always sees full content
    if (typeof window !== "undefined" && navigator.userAgent.includes("Googlebot")) {
      setShowFullContent(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <OrderFood />

      <main className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#704d25]">
          {page.title || "No Title Provided"}
        </h1>

        <div
          className="jodit-content-view"
          dangerouslySetInnerHTML={{ __html: contentToRender }}
        />

        {shouldTruncate && !isExceptionSlug && (
          <div className="text-center mb-4">
            <Button
              className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-white"
              onClick={toggleContent}
            >
              {showFullContent ? "Show Less" : "View More"}
            </Button>
          </div>
        )}
      </main>

      <PromoBanner />
      <RecentOrders />
      <CustomerReviews />

      <footer className="bg-coffee-600 text-white py-6 mt-8 text-center">
        <div style={{ color: "#704d25" }}>
          <p>
            Need help?{" "}
            <Link
              href="tel:+918696963496"
              className="font-bold text-blue-600 hover:underline"
            >
              +91-8696963496
            </Link>{" "}
            |{" "}
            <Link
              href="mailto:support@trainscafe.in"
              className="font-bold text-blue-600 hover:underline"
            >
              support@trainscafe.in
            </Link>
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} trainscafe.in
          </p>
        </div>

        <div className="mt-3">
          <Link href="/contact-us">
            <Button className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-white">
              Contact Us
            </Button>
          </Link>
        </div>
      </footer>

      <style jsx global>{`
        .jodit-content-view {
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.6;
          color: #333;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .jodit-content-view img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          object-fit: contain;
        }

        .jodit-content-view table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .jodit-content-view th,
        .jodit-content-view td {
          border: 1px solid #ddd;
          padding: 0.75rem;
          text-align: left;
        }

        .jodit-content-view iframe,
        .jodit-content-view video {
          max-width: 100%;
          border-radius: 8px;
          display: block;
          margin: 10px auto;
        }

        @media (max-width: 768px) {
          .jodit-content-view {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default React.memo(DynamicPage);
