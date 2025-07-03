"use client";

import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import dayjs from "dayjs";

const { Meta } = Card;

export default function SingleBlogClient({ params }) {
  const { slug } = params;
  const [blogPost, setBlogPost] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog?slug=${slug}`);
        const data = await response.json();
        setBlogPost(data.docs[0]);
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
      <Card
        cover={
          <img
            alt={blogPost.title}
            src={blogPost.image}
            className="object-cover w-full h-40 max-w-full"
          />
        }
        className="shadow-lg rounded-lg"
      >
        <Meta
          title={blogPost.title}
          description={`Published on ${dayjs(blogPost.updatedAt).format("DD MMM YYYY")}`}
        />
        <div
          className="mt-4 text-gray-700 leading-relaxed ck-content"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />
      </Card>

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
