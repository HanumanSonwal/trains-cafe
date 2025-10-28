"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Switch,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import StationsForm from "./StationsForm";

const Page = () => {
  const [stations, setStations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/station?search=${searchText}&page=${pagination.current}&limit=${pagination.pageSize}`
      );
      const { data, total, message: apiMsg } = response.data;

      setStations(data);
      setPagination((prev) => ({
        ...prev,
        total,
      }));

      if (apiMsg) message.success(apiMsg);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to fetch stations";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleAdd = useCallback(() => {
    setEditingStation(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((record) => {
    setEditingStation(record);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (key) => {
    try {
      const response = await axios.delete(`/api/station/${key}`);
      message.success(response.data?.message || "Station deleted successfully");
      fetchStations();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to delete station";
      message.error(errMsg);
    }
  }, [fetchStations]);

  const handleStatusChange = useCallback(
    async (checked, key) => {
      try {
        const response = await axios.put(`/api/station?id=${key}`, {
          status: checked,
        });
        message.success(
          response.data?.message || "Station status updated successfully"
        );
        fetchStations();
      } catch (error) {
        const errMsg =
          error.response?.data?.message || "Failed to update station status";
        message.error(errMsg);
      }
    },
    [fetchStations]
  );

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText("");
  }, []);

  const handleTableChange = useCallback((pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Station Id",
        dataIndex: "stationId",
        key: "stationId",
      },
      {
        title: "Station Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Station Code",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "location",
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
            checked={status === true}
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
    ],
    [handleDelete, handleEdit, handleStatusChange]
  );

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
        Station Management
      </h2>
      <div className="flex items-center my-5 justify-between">
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

        <Button
          type="primary"
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Station
        </Button>
      </div>

      <Spin spinning={loading} indicator={antIcon}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={stations}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            position: ["bottomRight"],
          }}
          onChange={handleTableChange}
        />
      </Spin>

      {isModalOpen && (
        <StationsForm
          fetchStations={fetchStations}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          initialValues={editingStation}
        />
      )}
    </div>
  );
};

export default Page;
