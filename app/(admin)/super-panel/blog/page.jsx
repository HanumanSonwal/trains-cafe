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
  Modal,
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
  const [isContentModalVisible, setIsContentModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/blog?search=${searchText}&page=${pagination.current}&limit=${pagination.pageSize}`
      );
      const { docs, totalDocs } = response.data;
      setBlogs(docs);
      setFilteredBlogs(docs);
      setPagination((prev) => ({ ...prev, total: totalDocs }));
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/blog?id=${id}`);
      message.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      message.error("Failed to delete blog");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleStatusChange = async (checked, id) => {
    try {
      await axios.put(`/api/blog?id=${id}`, {
        status: checked ? "publish" : "draft",
      });
      message.success("Blog status updated successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to update blog status:", error);
      message.error("Failed to update blog status");
    }
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleViewMore = (content) => {
    setModalContent(content);
    setIsContentModalVisible(true);
  };

  const truncateContent = (content, wordLimit) => {
    const words = content.split(" ");
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}...`
      : content;
  };

  const handleFormSubmit = () => {
    fetchBlogs();
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Blog Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="thumbnail"
          style={{ width: "70px", height: "50px", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Content",
      key: "content",
      render: (text, record) => {
        const truncatedContent = truncateContent(record.content, 8);

        return (
          <div>
            <span dangerouslySetInnerHTML={{ __html: truncatedContent }} />
            {record.content.split(" ").length > 8 && (
              <Button
                className="text-[#D6872A] hover:underline"
                type="link"
                onClick={() => handleViewMore(record.content)}
              >
                View More
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "publish"}
          onChange={(checked) => handleStatusChange(checked, record._id)}
          checkedChildren="Publish"
          unCheckedChildren="Draft"
          style={{
            backgroundColor: status === "publish" ? "#D6872A" : "#B0B0B0",
            borderColor: status === "publish" ? "#D6872A" : "#B0B0B0",
          }}
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
          dataSource={filteredBlogs}
          rowKey={(record) => record._id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            position: ["bottomRight"],
          }}
          onChange={handleTableChange}
        />
      </Spin>

      <Modal
        title="Full Content"
        open={isContentModalVisible}
        onCancel={() => setIsContentModalVisible(false)}
        footer={null}
        width={800}
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
      </Modal>

      <BlogForm
        fetchBlogs={fetchBlogs}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialValues={editingBlog}
      />
    </div>
  );
};

export default BlogManagement;
