"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Card, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import dynamic from "next/dynamic";

// lazy load heavy sections
const PromoBanner = dynamic(() => import("@/app/componants/PromoBanner"), {
  ssr: false,
});
const RecentOrders = dynamic(() => import("@/app/componants/RecentOrders"), {
  ssr: false,
});
const CustomerReviews = dynamic(
  () => import("@/app/componants/CustomerReviewSlider"),
  { ssr: false }
);

const { Meta } = Card;

export default function SingleBlogClient({ blog }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const slug = blog?.slug;
  const category = blog?.category;

  const fetchRelatedPosts = useCallback(async () => {
    if (!category) return;

    try {
      const res = await fetch(
        `/api/blog?category=${category}&status=publish`,
        { cache: "no-store" }
      );
      const data = await res.json();
      const filtered = (data?.docs || []).filter(
        (p) => p.slug !== slug
      );
      setRelatedPosts(filtered);
    } catch (err) {
      console.error("Error fetching related posts:", err);
    } finally {
      setLoading(false);
    }
  }, [category, slug]);

  useEffect(() => {
    if (category && slug) fetchRelatedPosts();
  }, [fetchRelatedPosts, category, slug]);

  const formattedDate = useMemo(
    () =>
      blog?.updatedAt
        ? dayjs(blog.updatedAt).format("DD MMM YYYY")
        : "",
    [blog?.updatedAt]
  );

  const relatedPostsList = useMemo(
    () =>
      relatedPosts.map((post) => (
        <Card
          key={post._id}
          hoverable
          className="shadow-md rounded-lg"
          cover={
            <div className="relative">
              <Image
                alt={post.title}
                src={post.image}
                width={600}
                height={300}
                sizes="(max-width: 768px) 100vw, 33vw"
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

          <Meta title={post.title} description={post.excerpt} />

          <div className="flex justify-start mt-4">
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Read more →
            </Link>
          </div>
        </Card>
      )),
    [relatedPosts]
  );

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading blog..." />
      </div>
    );
  }

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <div className="relative h-40 md:h-60 mb-8 w-full">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2">
            {blog.title}
          </h1>
          <p className="text-gray-200">
            Published on {formattedDate}
          </p>
        </div>
      </div>

      {/* ---------- BLOG CONTENT ---------- */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div
          className="jodit-content text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* ---------- RELATED BLOGS ---------- */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" tip="Loading related blogs..." />
        </div>
      ) : relatedPosts.length > 0 ? (
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Related Blogs in {blog.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPostsList}
          </div>
        </div>
      ) : null}

      {/* ---------- EXTRA SECTIONS ---------- */}
      <PromoBanner />
      <RecentOrders />
      <CustomerReviews />

      {/* ---------- GLOBAL STYLES ---------- */}
      <style jsx global>{`
        .jodit-content {
          font-size: 1rem;
          line-height: 1.7;
          word-break: break-word;
        }

        .jodit-content img {
          display: block;
          max-width: 100%;
          height: auto !important;
          margin: 1rem auto;
          border-radius: 6px;
        }

        .jodit-content p {
          margin-bottom: 1rem;
        }

        .jodit-content h1,
        .jodit-content h2,
        .jodit-content h3,
        .jodit-content h4 {
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .jodit-content ul,
        .jodit-content ol {
          margin-left: 2rem;
          margin-bottom: 1rem;
        }

        .jodit-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .jodit-content th,
        .jodit-content td {
          border: 1px solid #ddd;
          padding: 0.75rem;
          text-align: left;
        }

        .jodit-content th {
          background-color: #f9f9f9;
          font-weight: bold;
        }

        .jodit-content iframe {
          max-width: 100%;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .jodit-content {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
