'use client'
import React from "react";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

const fetchPage = async () => {

    const router = useRouter();
    const {slug} = Router.query;

  console.log("Fetching  page data...");
  try {
    const res = await fetch(`/api/page-content?${slug}`);
    console.log("API response status:", res.status);
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status}`);
    }
    const data = await res.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default function pages() {
  const [pages, setpages] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchpages()
      .then((data) => {
        setpages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pages) return <div>No content available</div>;

  return (
    <div>
      {/* Banner Section */}
      <div className="relative md:h-60 h-40 mb-4">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold">
            {pages.name}
          </h1>
        </div>
      </div>

      {/* About Us Content */}
      <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-lg z-10">
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-4">{pages.title}</h2>
          <p className="text-sm mb-4 text-justify">{pages.description}</p>

          {/* Render HTML content safely */}
          {pages.pageData && (
            <div
              className="text-sm mb-4 text-justify"
              dangerouslySetInnerHTML={{ __html: pages.pageData }}
            />
          )}

          {/* Call to Action */}
          <Link href="/contactus" passHref>
            <Button type="primary" className="order-btn">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}