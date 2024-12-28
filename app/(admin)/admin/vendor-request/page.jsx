"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  CloseCircleOutlined,
  LoadingOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { deleteData } from "@/app/lib/ApiFuntions";
import axios from "axios";
import { Tooltip } from "antd";

const VendorsManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "30"],
    showSizeChanger: true,
    total: 0,
  });

  const loadVendors = async (search = "", page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        vendorname: search.trim(),
        stationname: "",
        stationcode: "",
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(
        `/api/vendorregistration?${params.toString()}`
      );
      const { data, success, total } = response.data;

      if (success) {
        setVendors(data);
        setFilteredVendors(data);
        setPagination((prev) => ({
          ...prev,
          total: total,
        }));
      } else {
        message.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors(searchText, pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleDeleteVendor = async (id) => {
    try {
      const result = await deleteData(`/api/vendorregistration`, { id });
      if (result.success) {
        setVendors(vendors.filter((vendor) => vendor._id !== id));
        setFilteredVendors(
          filteredVendors.filter((vendor) => vendor._id !== id)
        );
        message.success("Vendor deleted successfully");
      } else {
        message.error("Failed to delete vendor");
      }
    } catch (error) {
      console.error(error);
      message.error("Error deleting vendor");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    loadVendors(value, pagination.current, pagination.pageSize);
  };

  const clearSearch = () => {
    setSearchText("");
    loadVendors("", pagination.current, pagination.pageSize);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    loadVendors(searchText, pagination.current, pagination.pageSize);
  };

  const vendorColumns = [
    {
      title: "Vendor Name",
      dataIndex: "Vendor_Name",
      key: "vendor_name",
    },
    {
      title: "Restaurant Name",
      dataIndex: "Restaurant_Name",
      key: "restaurant_name",
    },
    {
      title: "Contact No",
      dataIndex: "Contact_No",
      key: "contact_no",
    },
    {
      title: "Station",
      dataIndex: "Station_Name",
      key: "station",
    },
    {
      title: "Distance",
      dataIndex: "Distance",
      key: "distance",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Tooltip title="Send Email">
            <Button
              type="link"
              onClick={() => (window.location.href = `mailto:${record.Email}`)}
              icon={<MailOutlined />}
              style={{
                backgroundColor: "#D6872A",
                borderColor: "#D6872A",
                color: "#000",
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteVendor(record._id)}
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
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        Vendors Management
      </h2>
      <div className="flex items-center my-5 justify-between">
        <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>
   
      </div>

      <Spin spinning={loading} color="#D6872A" indicator={antIcon}>
        <Table
          columns={vendorColumns}
          dataSource={filteredVendors}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default VendorsManagement;
