"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input as AntdInput,
  Spin,
  Select,
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

const { Option } = Select;

const ImageManager = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });

  const fetchFolders = async () => {
    try {
      const { data } = await axios.get("/api/fileUpload/folders");
      if (data.success) {
        setFolders(data.folders);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch folders");
    }
  };

  const fetchImages = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedFolder) {
        query.append("folder", selectedFolder);
      }
      if (searchText) {
        query.append("search", searchText);
      }
      query.append("page", page);
      query.append("limit", pagination.pageSize);

      const { data } = await axios.get(
        `/api/fileUpload/list?${query.toString()}`
      );

      if (data.success) {
        setImages(data.images);
        setPagination({
          ...pagination,
          current: page,
          total: data.total,
        });
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchImages(1);
  }, [selectedFolder, searchText]);

  const handleDelete = async (public_id) => {
    try {
      const res = await axios.delete(
        `/api/fileUpload/delete?public_id=${public_id}`
      );
      if (res.data.success) {
        message.success("Deleted successfully");
        fetchImages(pagination.current);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error(err);
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
          style={{
            width: 80,
            height: 50,
            borderRadius: 6,
            objectFit: "cover",
          }}
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
            style={{
              backgroundColor: "#D6872A",
              borderColor: "#D6872A",
            }}
          />
          <Popconfirm
            title="Delete image?"
            onConfirm={() => handleDelete(record.public_id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      className="p-4"
      style={{
        background: "#FAF3CC",
        borderRadius: 8,
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        Image Manager
      </h2>

      <div className="flex justify-between items-center mb-4 gap-4">
        <Select
          placeholder="Select Folder"
          style={{ minWidth: 200 }}
          value={selectedFolder || undefined}
          onChange={(value) => {
            setSelectedFolder(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
          allowClear
        >
          {folders.map((folder) => (
            <Option key={folder} value={folder}>
              {folder}
            </Option>
          ))}
        </Select>

        <AntdInput
          placeholder="Search by name"
          allowClear
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 250, borderColor: "#D6872A" }}
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
          dataSource={images.map((img) => ({ ...img, key: img.public_id }))}
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.current,
            total: pagination.total,
            onChange: (page) => fetchImages(page),
          }}
        />
      </Spin>

      <UploadModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        folderName={selectedFolder}
        fetchImages={() => fetchImages(pagination.current)}
        editingImage={editingImage}
          fetchFolders={fetchFolders}
      />
    </div>
  );
};

export default ImageManager;
