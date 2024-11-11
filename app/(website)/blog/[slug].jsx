"use client";

import { useRouter } from "next/router"; // useRouter import करें
import { useEffect, useState } from "react";
import { Card } from "antd";
import dayjs from "dayjs";

const { Meta } = Card;

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query; // यहाँ slug को router.query से प्राप्त किया जाएगा
  const [blogPost, setBlogPost] = useState(null);

  // ब्लॉग पोस्ट को fetch करने का function
  useEffect(() => {
    if (!slug) return; // अगर slug नहीं है तो कुछ न करें

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`); // API से ब्लॉग पोस्ट प्राप्त करें
        const data = await response.json();
        setBlogPost(data); // डेटा को state में सेट करें
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    fetchBlogPost(); // ब्लॉग पोस्ट को fetch करें
  }, [slug]); // जब slug बदलता है, तब effect को फिर से चलाएँ

  if (!blogPost) {
    return <div>Loading...</div>; // जब तक डेटा लोड नहीं होता तब तक 'Loading...' दिखाएँ
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        cover={<img alt={blogPost.title} src={blogPost.image} />} // ब्लॉग पोस्ट की इमेज दिखाएँ
        className="shadow-lg"
      >
        <Meta
          title={blogPost.title} // ब्लॉग पोस्ट का शीर्षक
          description={`Published on ${dayjs(blogPost.updatedAt).format("DD MMM YYYY")}`} // प्रकाशित की तारीख
        />
        <div className="mt-4 text-gray-700">{blogPost.content}</div> {/* ब्लॉग पोस्ट की सामग्री */}
      </Card>
    </div>
  );
};

export default BlogPost;
