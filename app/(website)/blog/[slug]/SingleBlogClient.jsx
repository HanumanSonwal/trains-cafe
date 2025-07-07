"use client";

import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import dayjs from "dayjs";
import PromoBanner from "@/app/componants/PromoBanner";
import RecentOrders from "@/app/componants/RecentOrders";
import CustomerReviews from "@/app/componants/CustomerReviewSlider";
import Link from "next/link";

const { Meta } = Card;

export default function SingleBlogClient({ params }) {
  const { slug } = params;
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog?slug=${slug}`);
        const data = await response.json();
        const post = data.docs[0];
        setBlogPost(post);

        // Related blogs fetch karo, same category ke aur blogs le lo
        if (post && post.category) {
          const relatedRes = await fetch(
            `/api/blog?category=${post.category}&status=publish`
          );
          const relatedData = await relatedRes.json();
          // Current blog ko related se hata do
          const filtered = relatedData.docs.filter((p) => p.slug !== slug);
          setRelatedPosts(filtered);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (!blogPost) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading blog..." />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-40 md:h-60 mb-8">
        <img
          src={blogPost.image}
          alt={blogPost.title}
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2">
            {blogPost.title}
          </h1>
          <p className="text-gray-200">
            Published on {dayjs(blogPost.updatedAt).format("DD MMM YYYY")}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div
          className="text-gray-700 leading-relaxed ck-content"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />
      </div>

      {/* Related Blogs */}
      {relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Related Blogs in {blogPost.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div
                key={post.id}
                className="w-full shadow-lg rounded-lg relative"
              >
                <Card
                  hoverable
                  cover={
                    <div className="relative">
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
                        {post.category}
                      </div>
                    </div>
                  }
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">
                      {dayjs(post.updatedAt).format("DD MMM YYYY")}
                    </p>
                    <p className="text-xs text-gray-400">By Admin</p>
                  </div>
                  <Meta
                    title={post.title}
                    description={post.excerpt}
                    className="text-[#3A3A3A]"
                  />
                  <div className="flex justify-start mt-4">
                    <Link href={`/blog/${post.slug}`} legacyBehavior>
                      <a className="text-blue-600 hover:underline text-sm">
                        Read more →
                      </a>
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Sections */}
      <PromoBanner />
      <RecentOrders />
      <CustomerReviews />

      {/* Rich content styling */}
      <style jsx global>{`
        .ck-content {
          font-size: 1rem;
        }
        .ck-content h1,
        .ck-content h2,
        .ck-content h3 {
          margin: 1rem 0 0.5rem;
          font-weight: bold;
        }
        .ck-content p {
          margin-bottom: 1rem;
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
          .ck-content {
            font-size: 0.95rem;
          }
          .ck-content th,
          .ck-content td {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
