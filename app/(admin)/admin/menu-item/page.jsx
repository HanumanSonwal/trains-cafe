"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  ImportOutlined
} from "@ant-design/icons";
import axios from "axios";
import MenuItemForm from "./MenuItemForm";
import BulkImportMenu from "./BulkImportMenu";

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
      pageSizeOptions: ['10', '20', '30'],
      showSizeChanger: true,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);


  const fetchMenuItems = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/menu?page=${page}&limit=${pageSize}&search=${search}`);
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
        message.error('Failed to fetch menu Item');
      }
    } catch (error) {
      message.error('Error fetching Menu Item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { current, pageSize } = tableParams.pagination;
    fetchMenuItems(current, pageSize, searchText);
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, searchText]);


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

  const handleBulkImportSubmit = (formData) => {
    message.success("Bulk import processed successfully");
    setIsBulkImportModalOpen(false);
    fetchMenuItems(page, pageSize);
  };

  const handleEditMenuItem = (record) => {
    setEditingItem(record);
    setIsMenuItemModalOpen(true);
  };

  const handleStatusChange = async (checked, key) => {
    try {
      await axios.put(`/api/menu/${key}/status`, { status: checked ? "1" : "0" });
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
      await axios.delete('/api/menu', {
        data: { id: key },
      });
  
      // Destructure pagination values from tableParams
      const { current, pageSize } = tableParams.pagination;
      
      // Refetch menu items after deletion
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
            item.key === editingItem.key ? { ...values, key: editingItem.key } : item
          )
        );
        setFilteredData(
          filteredData.map((item) =>
            item.key === editingItem.key ? { ...values, key: editingItem.key } : item
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
    fetchMenuItems(1, pageSize, value); 
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "Item_Name",
      key: "Item_Name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="thumbnail" style={{ width: '70px', height: '50px', borderRadius: '8px' }} />
      ),
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Vendor",
      dataIndex: "Vendor",
      key: "Vendor",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      key: "Discount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "1"}
          onChange={(checked) => handleStatusChange(checked, record.key)}
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
        Menu-Item Management
      </h2>
      <div className="flex justify-between items-center mb-4">
        <AntdInput
          placeholder="Search Menu Items"
          prefix={<SearchOutlined />}
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
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
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
