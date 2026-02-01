"use client";
import { useState, useEffect } from "react";
import { Table, Button, Input as AntdInput, message, Switch, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";
import ManagerForm from "./ManagerForm"; // Update the form component for managers
import axios from "axios";

const ManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchManagers();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchManagers = async () => {
    try {
      const response = await axios.get(
        `/api/user?search=${searchText}&page=${pagination.current}&limit=${pagination.pageSize}`
      );
      const { data, total } = response.data;

      setManagers(data);
      setFilteredManagers(data);
      setPagination((prev) => ({
        ...prev,
        total,
      }));
    } catch (error) {
      console.error("Failed to fetch managers:", error);
      message.error("Failed to fetch managers");
    }
  };

  const handleAdd = () => {
    setEditingManager(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingManager(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/api/manager/${key}`);
      message.success("Manager deleted successfully");
      fetchManagers(); 
    } catch (error) {
      console.error("Failed to delete manager:", error);
      message.error("Failed to delete manager");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingManager) {
        await axios.put(`/api/manager/${editingManager.key}`, values);
        message.success("Manager updated successfully");
      } else {
        // Add new manager
        await axios.post("/api/manager", values);
        message.success("Manager added successfully");
      }
      setIsModalOpen(false);
      fetchManagers(); 
    } catch (error) {
      console.error("Failed to save manager:", error);
      message.error("Failed to save manager");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusChange = async (checked, key) => {
    try {
      await axios.patch(`/api/manager/${key}`, { status: checked ? "1" : "0" });
      message.success("Manager status updated successfully");
      fetchManagers(); 
    } catch (error) {
      console.error("Failed to update manager status:", error);
      message.error("Failed to update manager status");
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
      title: "Full Name",
      dataIndex: "name",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
        Manager List
      </h2>
      <div className="flex items-center mb-4 justify-between">
        <AntdInput
          placeholder="Search"
          style={{ width: 300, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Manager
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredManagers}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          position: ["bottomRight"],
        }}
        onChange={handleTableChange}
      />

      <ManagerForm
        fetchManagers={fetchManagers}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingManager}
      />
    </div>
  );
};

export default ManagerList;
