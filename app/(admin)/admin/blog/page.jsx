"use client";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Switch,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import BlogForm from "./BlogForm";
import axios from "axios";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  console.log(filteredBlogs,"filteredBlogs")

  useEffect(() => {
    fetchBlogs();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/blog?search=${searchText}&page=${pagination.current}&limit=${pagination.pageSize}`
      );

      console.log("API response:", response.data);

      const { docs, totalDocs } = response.data;
      setBlogs(docs);
      setFilteredBlogs(docs);
      setPagination((prev) => ({
        ...prev,
        total: totalDocs,
      }));
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      message.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingBlog(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/api/blog/${key}`);
      message.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      message.error("Failed to delete blog");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingBlog) {
        await axios.put(`/api/blog/${editingBlog._id}`, values);
        message.success("Blog updated successfully");
      } else {
        await axios.post("/api/blog", values);
        message.success("Blog added successfully");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);
      message.error("Failed to save blog");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleStatusChange = async (checked, key) => {
    try {
      await axios.put(`/api/blog?id=${key}`, {
        status: checked ? "Published" : "Draft",
      });
      message.success("Blog status updated successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to update blog status:", error);
      message.error("Failed to update blog status");
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Keywords",
      dataIndex: "metakeyword",
      key: "metakeyword",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "Published"}
          onChange={(checked) => handleStatusChange(checked, record._id)}
          checkedChildren="Published"
          unCheckedChildren="Draft"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditFilled />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <>
      <div
        className="p-4"
        style={{
          backgroundColor: "#FAF3CC",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
          Blog Management
        </h2>
        <div className="flex items-center my-5 justify-between">
          <div style={{ display: "flex", alignItems: "center" }}>
            <AntdInput
              placeholder="Search"
              style={{ width: 300, borderColor: "#D6872A" }}
              prefix={<SearchOutlined />}
              suffix={
                searchText && (
                  <CloseCircleOutlined
                    onClick={clearSearch}
                    style={{ color: "rgba(0, 0, 0, 0.45)", cursor: "pointer" }}
                  />
                )
              }
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Blog
          </Button>
        </div>

        <Spin spinning={loading} indicator={antIcon}>
          <Table
            columns={columns}
            // dataSource={(filteredBlogs || []).map((blog) => ({ ...blog, key: blog._id }))}
            dataSource={filteredBlogs}

            pagination={{
              ...pagination,
              showSizeChanger: true,
              position: ["bottomRight"],
            }}
            onChange={handleTableChange}
          />
        </Spin>

        <BlogForm
          fetchBlogs={fetchBlogs}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialValues={editingBlog}
        />
      </div>
    </>
  );
};

export default BlogManagement;
