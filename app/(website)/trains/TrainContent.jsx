"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, message } from "antd";
import Spinner from "@/app/componants/spinner/Spinner";
import axios from "axios";
import TrainData from "./TrainData";

export default function TrainContent({ slug  }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(page, "pagepage");
  const parts = slug.split("-");
  const trainNo = parts[parts.length - 1]; 
  const trainName = parts.slice(0, -1).join(" "); 

  const fetchPage = async (slug) => {
    try {
      const res = await axios.get(`/api/web-train/${trainNo}`);
      const data = res.data;
      setPage(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPage(slug)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (error || !page) return  <TrainData trainName={trainName} trainNo={trainNo} />;

  return (
<article class="max-w-3xl mx-auto mt-8">
  {/* <header>
    <h3 
      style={{ color: '#704d25' }} 
      class="text-2xl md:text-3xl font-bold text-coffee-600 mb-4">
      {page.title || "No Title Provided"}
    </h3>
  </header> */}

  <section>
    <div 
      class="text-gray-700 text-base md:text-lg leading-relaxed ck-content mb-8" 
      dangerouslySetInnerHTML={{ __html: page.pageData || "<p>No content available for this page.</p>" }} 
    />
  </section>

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
          <p className="mt-2">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
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

    .ck-content th, .ck-content td {
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
      .ck-content th, .ck-content td {
        font-size: 0.875rem;
      }
    }
  `}</style>
</article>

  );
}
