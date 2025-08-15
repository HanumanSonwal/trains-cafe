"use client";

import {
  Table,
  Input,
  Button,
  message,
  Modal,
  Select,
  Spin,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useState, useEffect, useCallback, useMemo } from "react";

const { Option } = Select;

export default function BulkOrderDetails() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(undefined);

  const fetchBulkOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact?slug=${selectedSlug || ""}`);
      const data = await response.json();

      if (data.success) {
        setBulkOrders(data.data);
        setTotalOrders(data.data.length);
      } else {
        message.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Error fetching orders");
    }
    setLoading(false);
  }, [selectedSlug]);

  useEffect(() => {
    fetchBulkOrders();
  }, [fetchBulkOrders, currentPage, pageSize, searchText]);

  const handleDelete = useCallback(
    async (slug, id) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/contact?slug=${slug}&id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          message.success("Order deleted successfully");
          fetchBulkOrders();
        } else {
          message.error("Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        message.error("Error deleting order");
      }
      setLoading(false);
    },
    [fetchBulkOrders]
  );

  const formatDate = useCallback((dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  }, []);

  const filteredOrders = useMemo(() => {
    return bulkOrders.filter((order) =>
      searchText
        ? order.Name.toLowerCase().includes(searchText.toLowerCase())
        : true
    );
  }, [bulkOrders, searchText]);

  const columns = useMemo(
    () => [
      {
        title: "Inquiry Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => formatDate(text),
      },
      {
        title: "Category",
        dataIndex: "slug",
        key: "slug",
      },
      {
        title: "Name",
        dataIndex: "Name",
        key: "Name",
      },
      {
        title: "Contact Number",
        dataIndex: "ContactNumber",
        key: "ContactNumber",
      },
      {
        title: "Email Address",
        dataIndex: "Email",
        key: "Email",
      },
      {
        title: "Message",
        dataIndex: "Message",
        key: "Message",
        render: (text, record) => {
          const words = text.split(" ");
          const preview = words.slice(0, 10).join(" ");
          return (
            <div>
              <span>
                {preview}
                {words.length > 10 ? "..." : ""}
              </span>
              {words.length > 10 && (
                <Button
                  type="link"
                  style={{ padding: 0, color: "#D6872A" }}
                  onClick={() =>
                    setSelectedOrder(record) || setModalVisible(true)
                  }
                >
                  Read More
                </Button>
              )}
            </div>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.slug, record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        ),
      },
    ],
    [handleDelete, formatDate]
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <h2 style={{ color: "#6F4D27", fontWeight: "600", marginBottom: "16px" }}>
        Contact-Inquiry Management
      </h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <Input
          placeholder="Search"
          style={{ width: 250, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          suffix={
            searchText && (
              <CloseCircleOutlined
                onClick={() => setSearchText("")}
                style={{ color: "rgba(0,0,0,0.45)", cursor: "pointer" }}
              />
            )
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select
          placeholder="Select Category"
          allowClear
          style={{ width: 200 }}
          value={selectedSlug}
          onChange={(value) => {
            setSelectedSlug(value);
            setCurrentPage(1);
          }}
        >
          <Option value="Hotel">Hotel</Option>
          <Option value="Coolie">Coolie</Option>
          <Option value="BulkOrder">BulkOrder</Option>
          <Option value="ContactUs">ContactUs</Option>
        </Select>
      </div>

      <Spin spinning={loading} indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalOrders,
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

      {selectedOrder && (
        <Modal
          title="Inquiry Details"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <table
            style={{
              width: "100%",
              marginBottom: "16px",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px" }}>Name:</td>
                <td style={{ padding: "8px" }}>{selectedOrder.Name}</td>
              </tr>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <td style={{ fontWeight: "bold", padding: "8px" }}>
                  Contact Number:
                </td>
                <td style={{ padding: "8px" }}>
                  {selectedOrder.ContactNumber}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px" }}>Email:</td>
                <td style={{ padding: "8px" }}>{selectedOrder.Email}</td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
            {selectedOrder.Message}
          </div>
        </Modal>
      )}
    </div>
  );
}
