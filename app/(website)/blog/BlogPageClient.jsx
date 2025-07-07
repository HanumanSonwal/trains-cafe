"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from 'dayjs';
import RecentOrders from "@/app/componants/RecentOrders";
import PromoBanner from "@/app/componants/PromoBanner";
import CustomerReviews from "@/app/componants/CustomerReviewSlider";

const { Meta } = Card;
const { TabPane } = Tabs;

const BlogPageClient = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogPosts = async () => {
    const categoryQuery = selectedCategory !== "All" ? `&category=${selectedCategory}` : "";
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";

    try {
      const response = await fetch(
        `/api/blog?status=publish${categoryQuery}${searchQuery}`
      );
      const data = await response.json();
      setBlogPosts(data.docs);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="relative h-40 md:h-60 mb-4">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="food delivery in train"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white font-bold">Blogs</h1>
        </div>
      </div>
      

      <div className="flex flex-col items-center mt-8">
        <Input.Search
          placeholder="Search blogs"
          onChange={handleSearchChange}
          className="mb-4 w-1/2"
          allowClear
        />
        <Tabs
          defaultActiveKey="All"
          onChange={handleCategoryChange}
          centered
          className="custom-tabs"
          size="small"
        >
          <TabPane tab="All" key="All" />
          <TabPane tab="Food" key="Food" />
          <TabPane tab="Travel" key="Travel" />
          <TabPane tab="Health" key="Health" />
        </Tabs>
      </div>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">
      Discover Delicious Food & Travel Stories
    </h2>
    <p className="text-gray-600 mb-2">
      Welcome to our blog section where we share tasty food experiences,
      travel tips and health guides specially curated for your train journeys.
    </p>
    <p className="text-gray-600">
      Stay updated with latest food trends, top station meals and safety tips for a 
      comfortable journey. Read, share and make your next train trip delicious!
    </p>
  </div>

      <div className="grid grid-cols-2 gap-6 mt-8 px-4 mb-4">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <div key={post.id} className="w-full shadow-lg rounded-lg relative">
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <img
                      alt={post.title}
                      src={post.image}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
                      {post.category}
                    </div>
                  </div>
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400 blog-date">
                    {dayjs(post.updatedAt).format('DD MMM YYYY')}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <img
                      src="/images/user-icon.png"
                      alt="Author"
                      className="w-4 h-4 mr-2"
                    />
                    <p className="blog-author">By Admin</p>
                  </div>
                </div>
                <Meta
                  className="text-[#3A3A3A]"
                  title={post.title}
                  description={post.excerpt}
                />
                <div className="flex justify-between items-center mt-4">
                  <Link href={`/blog/${post.slug}`} legacyBehavior>
                    <a className="blog-link flex items-center">
                      Read more <ArrowRightOutlined className="ml-1" />
                    </a>
                  </Link>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No blogs available for this category.
          </div>
        )}
      </div>
      <PromoBanner />
      <RecentOrders />

      <CustomerReviews />

    </div>
  );
};

export default BlogPageClient;
