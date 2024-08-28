"use client";

import React from "react";
import { Card, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Meta } = Card;

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Food Blog",
      date: "06 Jul 2024",
      author: "Admin",
      description:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.",
      imageUrl: "/images/blog-1.png",
    },
    {
      id: 2,
      title: "Food Blog",
      date: "06 Jul 2024",
      author: "Admin",
      description:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.",
      imageUrl: "/images/blog-1.png",
    },
  ];

  return (
    <div className="py-8 mx-auto max-w-[575px]">
      <div className="relative text-center mb-8">
        <img
          src="/images/Blog.png"
          alt="Blog Title Background"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <h2 className="text-2xl font-bold relative z-10 text-[#704D25]">
          Our Blogs
        </h2>
      </div>

      <div className="flex justify-center">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="max-w-sm mx-4 mb-8 shadow-lg rounded-lg"
          >
            <Card
              hoverable
              cover={<img alt={post.title} src={post.imageUrl} />}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm blog-date text-gray-400">{post.date}</p>
                <div className="flex items-center text-sm text-gray-400">
                  <img
                    src="/images/user-icon.png"
                    alt="Author"
                    className="w-4 h-4 mr-2"
                  />
                  <p className="blog-author">By {post.author}</p>
                </div>
              </div>
              <Meta
                className="text-[#3A3A3A]"
                title={post.title}
                description={post.description}
              />
              <Link href="/blog" passHref>
                <Button type="link" className="blog-link mt-4 flex items-center">
                  Read more <ArrowRightOutlined className="ml-1" />
                </Button>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
