"use client";

import React, { useState } from "react";
import { Card, Pagination, Tabs } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Meta } = Card;
const { TabPane } = Tabs;

const BlogPage = () => {
  const allBlogPosts = [
    {
      id: 1,
      title: "Delicious Food Trends for 2024",
      date: "06 Jul 2024",
      author: "Admin",
      category: "Food",
      excerpt: "Explore the hottest food trends for 2024, from plant-based diets to fusion cuisines.",
      imageUrl: "/images/blog-1.png",
      link: "/blog/delicious-food-trends-2024",
    },
    {
      id: 2,
      title: "The Best Street Foods Around the World",
      date: "08 Aug 2024",
      author: "Admin",
      category: "Travel",
      excerpt: "Discover the best street foods you must try on your next global adventure.",
      imageUrl: "/images/blog-2.png",
      link: "/blog/best-street-foods",
    },
    {
      id: 3,
      title: "Healthy Eating Habits",
      date: "15 Sep 2024",
      author: "Admin",
      category: "Health",
      excerpt: "Learn about healthy eating habits and how to maintain a balanced diet.",
      imageUrl: "/images/blog-1.png",
      link: "/blog/healthy-eating-habits",
    },
    {
      id: 4,
      title: "Top Travel Destinations in 2024",
      date: "25 Sep 2024",
      author: "Admin",
      category: "Travel",
      excerpt: "Check out the top travel destinations to visit in 2024 and start planning your trip.",
      imageUrl: "/images/blog-2.png",
      link: "/blog/top-travel-destinations-2024",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const postsPerPage = 2;

  const filteredPosts = selectedCategory === "All"
    ? allBlogPosts
    : allBlogPosts.filter((post) => post.category === selectedCategory);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    setCurrentPage(1); 
  };

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
          <h1 className="text-white text-2xl md:text-4xl font-bold">Blogs</h1>
        </div>
      </div>

      {/* Category Tabs */}
      <div>
        <Tabs
          defaultActiveKey="All"
          onChange={handleCategoryChange}
          centered
          className="custom-tabs mt-8"
          size="small"
        >
          <TabPane tab="All" key="All" />
          <TabPane tab="Food" key="Food" />
          <TabPane tab="Travel" key="Travel" />
          <TabPane tab="Health" key="Health" />
        </Tabs>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-2 gap-6 mt-8 px-4">
        {paginatedPosts.map((post) => (
          <div key={post.id} className="w-full shadow-lg rounded-lg relative">
            <Card hoverable cover={
              <div className="relative">
                <img alt={post.title} src={post.imageUrl} className="w-full h-40 object-cover" />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
                  {post.category}
                </div>
              </div>
            }>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400 blog-date">{post.date}</p>
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
                description={post.excerpt}
              />
              <div className="flex justify-between items-center mt-4">
                <Link href={post.link} className="blog-link flex items-center">
                  Read more <ArrowRightOutlined className="ml-1" />
                </Link>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center flex justify-center mb-3">
        <Pagination
          current={currentPage}
          total={filteredPosts.length}
          pageSize={postsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default BlogPage;
