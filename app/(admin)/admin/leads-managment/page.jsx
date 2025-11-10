"use client";

import {
  Table,
  Input,
  Button,
  message,
  Modal,
  Select,
  Spin,
  Tag,
  DatePicker,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PhoneOutlined,
  MailOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function LeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "new",
    "contacted",
    "interested",
    "not_interested",
    "converted",
  ];

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
      });

      if (searchText) params.append("search", searchText);
      if (statusFilter) params.append("status", statusFilter);
      if (dateRange.length >= 1) {
        const start = dateRange[0].format("YYYY-MM-DD");
        const end =
          dateRange.length === 2
            ? dateRange[1].format("YYYY-MM-DD")
            : dateRange[0].format("YYYY-MM-DD");

        params.append("startDate", start);
        params.append("endDate", end);
      }

      const response = await fetch(`/api/leads?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
        setTotalLeads(result.pagination.total);
      } else {
        message.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error fetching data");
    }
    setLoading(false);
  }, [searchText, statusFilter, dateRange, currentPage, pageSize]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (leadId, status) => {
    try {
      await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status }),
      });
      message.success("Status Updated");
      fetchLeads();
    } catch {
      message.error("Failed to update status");
    }
  };

  const deleteLead = async (id) => {
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      message.success("Lead Deleted");
      fetchLeads();
    } catch {
      message.error("Delete Failed");
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

  const statusColor = {
    new: "gold",
    contacted: "blue",
    interested: "purple",
    not_interested: "red",
    converted: "green",
  };

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value?.length === 0
    ) {
      return "-";
    }
    return value;
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => displayValue(formatDate(date)),
    },
    { title: "Passenger Name", dataIndex: "name", render: displayValue },
    { title: "Mobile", dataIndex: "mobile", render: displayValue },
    { title: "Email", dataIndex: "email", render: displayValue },
    { title: "Station", dataIndex: "station", render: displayValue },
    { title: "Train No", dataIndex: "train_number", render: displayValue },
    { title: "PNR", dataIndex: "pnr", render: displayValue },

    {
      title: "Items",
      dataIndex: "cartItems",
      render: (items) => (items && items.length > 0 ? items.length : "-"),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => updateStatus(record._id, value)}
        >
          {statusOptions.map((opt) => (
            <Option key={opt} value={opt}>
              <Tag
                color={statusColor[opt]}
                style={{ textTransform: "capitalize" }}
              >
                {opt.replace("_", " ")}
              </Tag>
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <div className="flex" style={{ display: "flex", gap: 8 }}>
          {/* Call */}
          <Tooltip title="Call Lead">
            <Button
              icon={<PhoneOutlined />}
              style={{
                backgroundColor: "#6F4D27",
                borderColor: "#6F4D27",
                color: "#fff",
              }}
              onClick={() => (window.location.href = `tel:${record.mobile}`)}
            />
          </Tooltip>

          {/* Email */}
          <Tooltip title="Send Email">
            <Button
              icon={<MailOutlined />}
              style={{
                backgroundColor: "#D6872A",
                borderColor: "#D6872A",
                color: "#fff",
              }}
              href={`mailto:${record.email}`}
            />
          </Tooltip>

          {/* Delete */}
          <Popconfirm
            title="Delete Lead?"
            onConfirm={() => deleteLead(record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#FAF3CC", borderRadius: 8, padding: 16 }}>
      <h2 style={{ color: "#6F4D27", fontWeight: 600, marginBottom: 16 }}>
        Lead Management
      </h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Input
          placeholder="Search name / email / mobile"
          style={{ width: 250, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          suffix={
            searchText && (
              <CloseCircleOutlined
                onClick={() => setSearchText("")}
                style={{ cursor: "pointer" }}
              />
            )
          }
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          placeholder="Status Filter"
          allowClear
          style={{ width: 200 }}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || null)}
        >
          {statusOptions.map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>

        <RangePicker onChange={(dates) => setDateRange(dates || [])} />
      </div>

      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      >
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalLeads,
            showSizeChanger: true,
            onChange: (p, s) => (setCurrentPage(p), setPageSize(s)),
          }}
        />
      </Spin>
    </div>
  );
}
