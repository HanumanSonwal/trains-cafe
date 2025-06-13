"use client";

import React, { useState, useEffect } from "react";
import { Card, Pagination, Tabs, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from 'dayjs';

const { Meta } = Card;
const { TabPane } = Tabs;

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const postsPerPage = 2;

  const fetchBlogPosts = async () => {
    const categoryQuery = selectedCategory !== "All" ? `&category=${selectedCategory}` : "";
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";
    
    try {
      const response = await fetch(
        `/api/blog?page=${currentPage}&limit=${postsPerPage}&status=publish${categoryQuery}${searchQuery}`
      );
      const data = await response.json();
      console.log(data.docs, "data");
      setBlogPosts(data.docs); 
      setTotalPosts(data.totalDocs); 
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };
  

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
    
      <div className="relative h-40 mb-4">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold">Blogs</h1>
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

<div className="grid grid-cols-2 gap-6 mt-8 px-4">
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
            <Link
              href={`/blog/${post.slug}`}
              className="blog-link flex items-center"
            >
              Read more <ArrowRightOutlined className="ml-1" />
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

      <div className="mt-8 text-center flex justify-center mb-3">
        <Pagination
          current={currentPage}
          total={totalPosts}
          pageSize={postsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default BlogPage;
