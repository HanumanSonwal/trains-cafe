"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input as AntdInput,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteFilled,
  EditFilled,
  CopyOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UploadModal from "./UploadModal";

const ImageTable = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/images?search=${searchText}`);
      if (data.success) {
        setImages(data.images);
      }
    } catch (err) {
      message.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [searchText]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/images?id=${id}`);
      message.success("Deleted successfully");
      fetchImages();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleEdit = (record) => {
    setEditingImage(record);
    setIsModalOpen(true);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      message.success("URL copied");
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "url",
      render: (url) => (
        <img
          src={url}
          alt="Uploaded"
          style={{ width: 80, height: 50, borderRadius: 6, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Folder",
      dataIndex: "folder",
    },
    {
      title: "URL",
      dataIndex: "url",
      render: (url) => (
        <div>
          <AntdInput value={url} readOnly size="small" style={{ width: "80%" }} />
          <Button icon={<CopyOutlined />} onClick={() => handleCopy(url)} />
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditFilled />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
          <Popconfirm
            title="Delete image?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ background: "#FAF3CC", borderRadius: 8 }}>
      <div className="flex justify-between mb-4">
        <AntdInput
          placeholder="Search images"
          allowClear
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300, borderColor: "#D6872A" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingImage(null);
            setIsModalOpen(true);
          }}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          Upload Image
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={images.map((img) => ({ ...img, key: img._id }))}
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      <UploadModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        fetchImages={fetchImages}
        editingImage={editingImage}
      />
    </div>
  );
};

export default ImageTable;
