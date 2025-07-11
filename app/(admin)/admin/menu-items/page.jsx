"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Popconfirm,
  Switch,
  Spin,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  ImportOutlined,
} from "@ant-design/icons";
import axios from "axios";
import MenuItemForm from "./MenuItemForm";
import BulkImportMenu from "./BulkImportMenu";
import Spinner from "@/app/componants/spinner/Spinner";

const TablePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "30"],
      showSizeChanger: true,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);

  const fetchMenuItems = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/menu?page=${page}&limit=${pageSize}&search=${search}`
      );
      const { data, total, success } = response.data;

      if (success) {
        setData(data);
        setFilteredData(data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total,
          },
        }));
      } else {
        message.error("Failed to fetch menu Item");
      }
    } catch (error) {
      message.error("Error fetching Menu Item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { current, pageSize } = tableParams.pagination;
    fetchMenuItems(current, pageSize, searchText);
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    searchText,
  ]);

  const handleAddMenuItem = () => {
    setEditingItem(null);
    setIsMenuItemModalOpen(true);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      sortOrder: sorter.order || null,
      sortField: sorter.field || null,
    }));

    fetchMenuItems(pagination.current, pagination.pageSize, searchText);
  };

  const handleBulkImport = () => {
    setIsBulkImportModalOpen(true);
  };

  const handleBulkImportSubmit = async (data) => {
    try {
      await axios.post(`/api/menu/bulk-import`, {
        data,
      });

      message.success("Bulk import processed successfully");
      setIsBulkImportModalOpen(false);
      fetchMenuItems(1, 10);
    } catch (error) {
      console.error("Bulk import failed:", error);
      message.error("Failed to process bulk import");
    }
  };

  const handleEditMenuItem = (record) => {
    setEditingItem(record);
    setIsMenuItemModalOpen(true);
  };

  // const handleStatusChange = async (checked, key) => {
  //   try {
  //     await axios.put(`/api/menu?id=${key}`, {
  //       status: checked ? true : false,
  //     });
  //     const updatedData = data.map((item) =>
  //       item.key === key ? { ...item, status: checked ? "1" : "0" } : item
  //     );
  //     setData(updatedData);
  //     setFilteredData(updatedData);
  //     message.success("Menu item status updated successfully");
  //   } catch (error) {
  //     message.error("Failed to update status");
  //   }
  // };
const handleStatusChange = async (checked, key) => {
  try {
    const formData = new FormData();
    formData.append("status", checked ? "true" : "false");

    await axios.put(`/api/menu?id=${key}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedData = data.map((item) =>
      item.key === key ? { ...item, status: checked ? "1" : "0" } : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
    message.success("Menu item status updated successfully");
  } catch (error) {
    message.error("Failed to update status");
  }
};

  const handleDeleteMenuItem = async (key) => {
    try {
      await axios.delete("/api/menu", {
        data: { id: key },
      });

      const { current, pageSize } = tableParams.pagination;

      await fetchMenuItems(current, pageSize, searchText);

      message.success("Menu item deleted successfully");
    } catch (error) {
      message.error("Failed to delete menu item");
    }
  };

  const handleMenuItemFormSubmit = async (values) => {
    try {
      if (editingItem) {
        await axios.put(`/api/menu/${editingItem.key}`, values);
        setData(
          data.map((item) =>
            item.key === editingItem.key
              ? { ...values, key: editingItem.key }
              : item
          )
        );
        setFilteredData(
          filteredData.map((item) =>
            item.key === editingItem.key
              ? { ...values, key: editingItem.key }
              : item
          )
        );
        message.success("Menu item updated successfully");
      } else {
        const response = await axios.post(`/api/menu`, values);
        const newItem = { ...values, key: response.data.key };
        setData([...data, newItem]);
        setFilteredData([...filteredData, newItem]);
        message.success("Menu item added successfully");
      }
      setIsMenuItemModalOpen(false);
    } catch (error) {
      message.error("Failed to save menu item");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const { pageSize } = tableParams.pagination;
    fetchMenuItems(1, pageSize, value);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "Item_Name",
      key: "Item_Name",
      render: (Item_Name) => <strong>{Item_Name}</strong>,
    },
    {
      title: "Image",
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
      title: "Category",
      dataIndex: "Category_Name",
      key: "Category",
    },
    {
      title: "Food Type",
      dataIndex: "Food_Type",
      key: "Category",
    },
    {
      title: "Vendor",
      dataIndex: "Vendor_Name",
      key: "Vendor",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (price) => (
        <>
          <strong style={{ color: "green", fontSize: "16px" }}>₹</strong>{" "}
          {price}
        </>
      ),
    },

    {
      title: "Discount",
      dataIndex: "Discount",
      key: "Discount",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === true}
          onChange={(checked) => handleStatusChange(checked, record._id)}
          className={status === "1" ? "ant-switch-checked" : "ant-switch"}
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
            onClick={() => handleEditMenuItem(record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteMenuItem(record._id)}
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
      <h2
        className="text-lg font-semibold mb-5"
        style={{ color: "#6F4D27", marginBottom: "20px" }}
      >
        Menu-Item Management
      </h2>
      <div className="flex justify-between items-center my-5">
        <AntdInput
          placeholder="Search Menu Items"
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={handleSearch}
          style={{ maxWidth: 300, borderColor: "#D6872A" }}
        />
        <div>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={handleBulkImport}
            style={{
              backgroundColor: "#D6872A",
              borderColor: "#D6872A",
              marginRight: "30px",
            }}
          >
            Bulk Import
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMenuItem}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          >
            Add Menu Item
          </Button>
        </div>
      </div>
      <Spin spinning={loading} color="#D6872A" indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={tableParams.pagination}
          // loading={loading}
          onChange={handleTableChange}
        />
      </Spin>
      <MenuItemForm
        fetchMenuItems={fetchMenuItems}
        open={isMenuItemModalOpen}
        onCancel={() => setIsMenuItemModalOpen(false)}
        onSubmit={handleMenuItemFormSubmit}
        initialValues={editingItem}
      />
      <BulkImportMenu
        open={isBulkImportModalOpen}
        onCancel={() => setIsBulkImportModalOpen(false)}
        onSubmit={handleBulkImportSubmit}
      />
    </div>
  );
};

export default TablePage;
