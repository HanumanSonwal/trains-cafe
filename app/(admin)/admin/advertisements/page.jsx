"use client";

import { Table, Input, Button, message, Modal, Dropdown, Menu, Spin, Popconfirm } from "antd";
import { SearchOutlined, CloseCircleOutlined, DownOutlined, LoadingOutlined, DeleteFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AdvertisementsForm from "./advertisementsForm";

export default function AdvertisementDetails() {
  const [advertisements, setAdvertisements] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAdvertisements, setTotalAdvertisements] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [displayText, setDisplayText] = useState("All");

  useEffect(() => {
    fetchAdvertisements();
  }, [currentPage, pageSize, searchText, selectedSlug]);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advertisements?slug=${selectedSlug}`);
      const data = await response.json();

      if (data.success) {
        setAdvertisements(data.data);
        setTotalAdvertisements(data.data.length);
      } else {
        message.error("Failed to fetch advertisements");
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      message.error("Error fetching advertisements");
    }
    setLoading(false);
  };

  const handleDelete = async (slug, id) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ slug, id });
      const response = await fetch(`/api/advertisements?${params.toString()}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        message.success("Advertisement deleted successfully");
        fetchAdvertisements();
      } else {
        message.error("Failed to delete advertisement");
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      message.error("Error deleting advertisement");
    }
    setLoading(false);
  };

  const handleAddEditAd = (ad) => {
    setSelectedAd(ad || null);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedAd(null);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleMenuClick = (e) => {
    setSelectedSlug(e.key);
    setDisplayText(e.key === "" ? "All" : e.key);
    setCurrentPage(1);
  };

  const filteredAds = advertisements.filter((ad) =>
    searchText ? ad.title.toLowerCase().includes(searchText.toLowerCase()) : true
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          src={text}
          alt={record.alt || "Advertisement Image"}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Alt",
      dataIndex: "alt",
      key: "alt",
    },
    {
      title: "Link",
      dataIndex: "link_url",
      key: "link_url",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Button onClick={() => handleAddEditAd(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.slug, record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];
  

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="">All</Menu.Item>
      <Menu.Item key="advertisements">Advertisements</Menu.Item>
      <Menu.Item key="Banner">Banner</Menu.Item>
    </Menu>
  );

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
        Advertisement Management
      </h2>
      <div className="flex items-center my-5 justify-between">
        <Input
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
        <Button
          type="primary"
          onClick={() => handleAddEditAd(null)}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          Add Advertisement
        </Button>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A", width: "150px" }}
          >
            {displayText} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <Spin spinning={loading} color="#D6872A" indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={filteredAds}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalAdvertisements,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="_id"
        />
      </Spin>

      {formVisible && (
        <AdvertisementsForm
          open={formVisible}
          onCancel={handleCloseForm}
          initialValues={selectedAd}
          fetchMenuItems={fetchAdvertisements}
        />
      )}
    </div>
  );
}
