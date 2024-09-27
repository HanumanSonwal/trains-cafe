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
import MenuItemForm from "./MenuItemForm";
import BulkImportMenu from "./BulkImportMenu";

const initialData = [
  // Add your initial data here if needed
];

const TablePage = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData([JSON.parse(storedData)]);
      setFilteredData([JSON.parse(storedData)]);
    }
  }, []);

  const handleAddMenuItem = () => {
    setEditingItem(null);
    setIsMenuItemModalOpen(true);
  };
  const handleBulkImport = () => {
    setIsBulkImportModalOpen(true); 
  };
  const handleBulkImportSubmit = (formData) => {
    message.success("Bulk import processed successfully");
    setIsBulkImportModalOpen(false);
  };

  const handleEditMenuItem = (record) => {
    setEditingItem(record);
    setIsMenuItemModalOpen(true);
  };
  const handleStatusChange = (checked, key) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, status: checked ? "1" : "0" } : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
    message.success("Menu item status updated successfully");
  };

  const handleDeleteMenuItem = (key) => {
    setData(data.filter((item) => item.key !== key));
    setFilteredData(filteredData.filter((item) => item.key !== key));
    message.success("Menu item deleted successfully");
  };

  const handleMenuItemFormSubmit = (values) => {
    const newItemId =
      data.length > 0
        ? `${Math.max(...data.map((c) => parseInt(c.itemId))) + 1}`
        : "1";
    if (editingItem) {
      setData(
        data.map((item) =>
          item.key === editingItem.key
            ? { ...values, key: editingItem.key, itemId: editingItem.itemId }
            : item
        )
      );
      setFilteredData(
        filteredData.map((item) =>
          item.key === editingItem.key
            ? { ...values, key: editingItem.key, itemId: editingItem.itemId }
            : item
        )
      );
      message.success("Menu item updated successfully");
    } else {
      const newItem = {
        ...values,
        key: `${data.length + 1}`,
        itemId: newItemId,
      };
      setData([...data, newItem]);
      setFilteredData([...filteredData, newItem]);
      message.success("Menu item added successfully");
    }
    setIsMenuItemModalOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = data.filter((item) =>
      item.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="item" style={{ width: 50 }} />,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
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
            onConfirm={() => handleDeleteMenuItem(record.key)}
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
          style={{ maxWidth: 300 ,borderColor: "#D6872A"}}
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
          icon={<PlusOutlined /> }
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
        pagination={{ pageSize: 10 }}
      />
      <MenuItemForm
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
