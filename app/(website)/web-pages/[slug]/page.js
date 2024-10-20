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
    console.log("API Response Data:", data);

    // Find the relevant page by slug and check if it's published
    const page = data.docs.find(page => page.slug === slug && page.status === "published");
    return page || null;
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
        console.log("Fetched page data:", data); 
        if (data) {
          setPage(data); 
        } else {
          setError('Page not found or unpublished');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
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
      <div className="relative md:h-60 h-40 mb-4">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold">
            {page.name || "No Name Provided"} 
          </h1>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-lg z-10">
        <div className="relative z-10">
          <h2 style={{color:'#704D25',fontWeight:'bold'}} className="text-2xl font-semibold mb-4">{page.title || "No Title Provided"}</h2>
          {/* <p className="text-sm mb-4 text-justify">{page.description || "No Description Provided"}</p> */}

          {/* Render HTML content safely */}
          {page.pageData ? (
            <div
              className="text-sm mb-4 text-justify"
              dangerouslySetInnerHTML={{ __html: page.pageData }}
            />
          ) : (
            <p>No content available for this page</p> 
          )}

          {/* Call to Action */}
          <Link href="/contactus" passHref>
            <Button
          type="btn"
           className='order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]'
        >
          Contact Us
        </Button>
          </Link>

        </div>
      </div>
    </div>
  );
}
