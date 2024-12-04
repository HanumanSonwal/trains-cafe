'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!page) return <div>No content available</div>;

  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-40 md:h-60">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">{page.title || "No Name Provided"}</h1>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto p-4 md:p-6 z-10" style={{ background: "#fcfcfc" }}>
        <div className="relative z-10">
          <h2 style={{ color: "#704D25", fontWeight: "bold" }} className="text-xl md:text-2xl font-semibold mb-4">
            {page.title || "No Title Provided"}
          </h2>

          {/* Render HTML content safely */}
          {page.pageData ? (
            <div
              className="text-sm md:text-base mb-4 text-justify ck-content"
              dangerouslySetInnerHTML={{ __html: page.pageData }}
            />
          ) : (
            <p>No content available for this page</p>
          )}

          {/* Call to Action */}
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

      <style jsx global>{`
        /* Add basic CKEditor styles for tables */
        .ck-content {
          overflow-x: auto; /* Enable horizontal scroll for smaller screens */
        }

        .ck-content table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px; /* Enforce minimum width to maintain table layout */
        }

        .ck-content th,
        .ck-content td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 0.875rem; /* Slightly smaller text for better table readability */
        }

        .ck-content th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .ck-content tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .ck-content tr:hover {
          background-color: #ddd;
        }

        /* Responsive text and layout */
        @media (max-width: 768px) {
          .ck-content th,
          .ck-content td {
            font-size: 0.75rem; /* Adjust text size on smaller screens */
          }
        }
      `}</style>
    </div>
  );
}
