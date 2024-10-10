"use client";
import { useState, useEffect } from "react";
import { Table, Button, Input as AntdInput, message, Switch, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";
import StationsForm from "./StationsForm";
import axios from "axios";

const StationManagement = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchStations();
  }, [pagination.current, pagination.pageSize, searchText]);


  const fetchStations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/station?search=${searchText}&page=${pagination.current}&limit=${pagination.pageSize}`
      );
      const { data, total } = response.data;

      setStations(data);
      setFilteredStations(data);
      setPagination((prev) => ({
        ...prev,
        total,
      }));
    } catch (error) {
      console.error("Failed to fetch stations:", error);
      message.error("Failed to fetch stations");
    }
  };

  const handleAdd = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingStation(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/station/${key}`);
      message.success("Station deleted successfully");
      fetchStations(); 
    } catch (error) {
      console.error("Failed to delete station:", error);
      message.error("Failed to delete station");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingStation) {
     
        await axios.put(`http://localhost:3000/api/station/${editingStation.key}`, values);
        message.success("Station updated successfully");
      } else {
        // Add new station
        await axios.post("http://localhost:3000/api/station", values);
        message.success("Station added successfully");
      }
      setIsModalOpen(false);
      fetchStations(); 
    } catch (error) {
      console.error("Failed to save station:", error);
      message.error("Failed to save station");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusChange = async (checked, key) => {
    try {
      await axios.patch(`http://localhost:3000/api/station/${key}`, { status: checked ? "1" : "0" });
      message.success("Station status updated successfully");
      fetchStations(); 
    } catch (error) {
      console.error("Failed to update station status:", error);
      message.error("Failed to update station status");
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
      title: "Station Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Station Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
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
        Station Management
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
          Add Station
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStations}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          position: ["bottomRight"],
        }}
        onChange={handleTableChange}
      />

      <StationsForm
      fetchStations={fetchStations}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingStation}
      />
    </div>
  );
};

export default StationManagement;
