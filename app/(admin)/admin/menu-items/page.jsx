"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Popconfirm,
  Switch,
  Spin,
  Tag,
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

const TablePage = () => {
  const [data, setData] = useState([]);
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

  const fetchMenuItems = useCallback(
    async (page = 1, pageSize = 10, search = "") => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/menu?page=${page}&limit=${pageSize}&search=${search}`
        );
        const { data, total, success } = response.data;

        if (success) {
          setData(data);
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
      } catch {
        message.error("Error fetching Menu Item");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const { current, pageSize } = tableParams.pagination;
    fetchMenuItems(current, pageSize, searchText);
  }, [
    fetchMenuItems,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    searchText,
  ]);

  const handleAddMenuItem = useCallback(() => {
    setEditingItem(null);
    setIsMenuItemModalOpen(true);
  }, []);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
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
  }, []);

  const handleBulkImport = useCallback(() => {
    setIsBulkImportModalOpen(true);
  }, []);

  const handleBulkImportSubmit = useCallback(
    async (data) => {
      try {
        await axios.post(`/api/menu/bulk-import`, { data });
        message.success("Bulk import processed successfully");
        setIsBulkImportModalOpen(false);
        fetchMenuItems(1, 10);
       } catch (error) {
      // Log full error for debugging
      console.error("Bulk import error:", error);

      // Try to read API message
      const apiMessage =
        error?.response?.data?.message || // if backend sends { message: "..."}
        error?.response?.data ||          // if backend sends plain string
        "Failed to process bulk import";  // fallback

      message.error(apiMessage);
    }
  },
    //   } catch {
    //     message.error("Failed to process bulk import");
    //   }
    // },
    [fetchMenuItems]
  );

  const handleEditMenuItem = useCallback((record) => {
    setEditingItem(record);
    setIsMenuItemModalOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (checked, key) => {
      try {
        await axios.put(`/api/menu?id=${key}`, { status: checked });
        message.success("Menu item status updated successfully");
        const { current, pageSize } = tableParams.pagination;
        fetchMenuItems(current, pageSize, searchText);
      } catch {
        message.error("Failed to update status");
      }
    },
    [fetchMenuItems, tableParams.pagination, searchText]
  );

  const handleDeleteMenuItem = useCallback(
    async (key) => {
      try {
        await axios.delete("/api/menu", { data: { id: key } });
        const { current, pageSize } = tableParams.pagination;
        await fetchMenuItems(current, pageSize, searchText);
        message.success("Menu item deleted successfully");
      } catch {
        message.error("Failed to delete menu item");
      }
    },
    [fetchMenuItems, tableParams.pagination, searchText]
  );

  const handleMenuItemFormSubmit = useCallback(
    async (values) => {
      try {
        if (editingItem) {
          await axios.put(`/api/menu/${editingItem.key}`, values);
          message.success("Menu item updated successfully");
        } else {
          await axios.post(`/api/menu`, values);
          message.success("Menu item added successfully");
        }
        setIsMenuItemModalOpen(false);
        fetchMenuItems(
          tableParams.pagination.current,
          tableParams.pagination.pageSize,
          searchText
        );
      } catch {
        message.error("Failed to save menu item");
      }
    },
    [editingItem, fetchMenuItems, tableParams.pagination, searchText]
  );

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const columns = useMemo(
    () => [
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
        key: "Food_Type",
        render: (type) => {
          const colors = {
            Vegetarian: "green",
            "Non-Vegetarian": "volcano",
            Vegan: "gold",
          };
          return type ? (
            <Tag color={colors[type]}>{type}</Tag>
          ) : (
            <span>N/A</span>
          );
        },
      },
      {
        title: "Vendor",
        dataIndex: "Vendor_Name",
        key: "Vendor",
      },
      {
        title: "Price",
        dataIndex: "Final_Price",
        key: "price",
        render: (finalPrice, record) => {
          const originalPrice = parseFloat(record.Price) || finalPrice;
          const discount = parseFloat(record.Discount) || 0;
          const hasDiscount = discount > 0;
          return (
            <div className="text-left">
              <div className="flex justify-start gap-2 items-center">
                {hasDiscount && (
                  <span className="line-through text-gray-500 text-sm">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-green-600 font-bold text-md">
                  ₹{finalPrice}
                </span>
              </div>
              {hasDiscount && (
                <div className="text-red-500 text-xs mt-1">
                  Customers Save ₹{(originalPrice - finalPrice).toFixed(2)}
                </div>
              )}
            </div>
          );
        },
        align: "left",
      },
      {
        title: "Discount",
        dataIndex: "Discount",
        key: "Discount",
        render: (discount) => {
          const value = parseFloat(discount) || 0;
          return value > 0 ? (
            <Tag color="red" style={{ fontWeight: "bold" }}>
              {value}% OFF
            </Tag>
          ) : (
            <span style={{ color: "#999" }}>No Discount</span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, record) => (
          <Switch
            checked={status === true || status === "1" || status === 1}
            onChange={(checked) => handleStatusChange(checked, record._id)}
          />
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
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
    ],
    [handleStatusChange, handleEditMenuItem, handleDeleteMenuItem]
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "#FAF3CC", borderRadius: "8px" }}
    >
      <h2 className="text-lg font-semibold mb-5" style={{ color: "#6F4D27" }}>
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
      <Spin spinning={loading} indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          rowKey="_id"
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
