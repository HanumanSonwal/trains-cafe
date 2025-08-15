"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Switch,
  Popconfirm,
  Avatar ,
  Space,
  Spin,
  Tag ,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import VendorsForm from "./VendorsForm";
import axios from "axios";
import { updateData, deleteData } from "@/app/lib/ApiFuntions";

const VendorsManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50"],
      showSizeChanger: true,
      total: 0,
    },
  });
  const [searchText, setSearchText] = useState("");

  const loadVendors = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/vendors?page=${page}&limit=${pageSize}&search=${search}`
      );
      const { data, total, success } = response.data;

      if (success && data.length > 0) {
        setVendors(data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total,
          },
        }));
      } else {
        setVendors([]);
        if (search) {
          message.warning("No vendors found matching your search!");
        } else {
          message.info("No vendors available yet.");
        }
      }
    } catch (error) {
      console.error(error);
      setVendors([]);
      message.error("Something went wrong while fetching vendors!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { current, pageSize } = tableParams.pagination;
    loadVendors(current, pageSize, searchText.trim());
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, searchText]);

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (record) => {
    setEditingVendor(record);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = async (id) => {
    try {
      const result = await deleteData(`/api/vendors`, { id });
      if (result.success) {
        const updatedVendors = vendors.filter((vendor) => vendor._id !== id);
        setVendors(updatedVendors);
        message.success("Vendor deleted successfully");
      } else {
        message.error("Failed to delete vendor");
      }
    } catch (error) {
      console.error(error);
      message.error("Error deleting vendor");
    }
  };

  const handleVendorFormSubmit = (values) => {
    if (editingVendor) {
      const updatedVendors = vendors.map((vendor) =>
        vendor._id === editingVendor._id
          ? { ...values, _id: editingVendor._id }
          : vendor
      );
      setVendors(updatedVendors);
      message.success("Vendor updated successfully");
    } else {
      const newVendor = { ...values, _id: `${vendors.length + 1}` };
      const updatedVendors = [...vendors, newVendor];
      setVendors(updatedVendors);
      message.success("Vendor added successfully");
    }
    setIsVendorModalOpen(false);
  };

  const handleStatusChange = async (checked, _id) => {
    try {
      const status = checked ? "Active" : "Inactive";
      const response = await updateData(`/api/vendors/?id=${_id}`, {
        Status: status,
      });

      if (response.success) {
        const updatedVendors = vendors.map((vendor) =>
          vendor._id === _id ? { ...vendor, Status: status } : vendor
        );
        setVendors(updatedVendors);
        message.success("Vendor status updated");
      } else {
        message.error("Failed to update vendor status");
      }
    } catch (error) {
      console.error(error);
      message.error("Error while updating vendor status");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
      },
    }));
  };

  const clearSearch = () => {
    setSearchText("");
    message.info("Search cleared.");
  };

  const handleTableChange = (pagination) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };

const vendorColumns = [
  {
    title: "Vendor Id",
    dataIndex: "vendorId",
    key: "vendorId",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) => (
      <Avatar src={image} size={50} alt="vendor-image" />
    ),
  },
  {
    title: "Vendor Name",
    dataIndex: "Vendor_Name",
    key: "vendor_name",
  },
  {
    title: "Contact Info",
    key: "contact_info",
    render: (record) => (
      <>
        <div>{record.Contact_No}</div>
        <div>{record.Alternate_Contact_No || "N/A"}</div>
      </>
    ),
  },
  {
    title: "Station",
    dataIndex: "Station_Name",
    key: "station",
    render: (val) => val ? <Tag color="blue">{val}</Tag> : <Tag>N/A</Tag>,
  },
  {
    title: "Food Type",
    dataIndex: "Food_Type",
    key: "food_type",
    render: (Food_Type) => {
      if (!Array.isArray(Food_Type) || Food_Type.length === 0) return "N/A";
      return (
        <>
          {Food_Type.map((type) => (
            <Tag color={type === "Vegetarian" ? "green" : "red"} key={type}>
              {type}
            </Tag>
          ))}
        </>
      );
    },
  },
  {
    title: "Weekly Off",
    dataIndex: "Weekly_Off",
    key: "weekly_off",
    render: (val) => {
      if (!val) return "N/A";
      const formatted = val
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      return <Tag color="orange">{formatted}</Tag>;
    },
  },
{
  title: "Working Time",
  dataIndex: "Working_Time",
  key: "working_time",
  render: (val) => val ? <Tag color="cyan">{val}</Tag> : <Tag>N/A</Tag>,
},
  {
    title: "Status",
    dataIndex: "Status",
    key: "status",
    render: (Status, record) => (
      <Switch
        checked={Status === "Active"}
        onChange={(checked) => handleStatusChange(checked, record._id)}
      />
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          icon={<EditFilled />}
          onClick={() => handleEditVendor(record)}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A", color: "#fff" }}
        />
        <Button
          icon={<DeleteFilled />}
          onClick={() => handleDeleteVendor(record._id)}
          danger
        />
      </Space>
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        Vendors Management
      </h2>

      <div className="flex items-center my-5 justify-between">
        <AntdInput
          placeholder="Search vendors..."
          style={{ width: 300, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          suffix={
            searchText && (
              <CloseCircleOutlined
                onClick={clearSearch}
                style={{ cursor: "pointer", color: "#888" }}
              />
            )
          }
          value={searchText}
          onChange={handleSearch}
        />
        <Button
          icon={<PlusOutlined />}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          type="primary"
          onClick={handleAddVendor}
        >
          Add Vendor
        </Button>
      </div>

      <Spin spinning={loading} indicator={antIcon}>
        <Table
          columns={vendorColumns}
          dataSource={vendors}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: searchText
              ? "No vendors found for your search!"
              : "No vendors available.",
          }}
        />
      </Spin>

      <VendorsForm
        open={isVendorModalOpen}
        onCancel={() => setIsVendorModalOpen(false)}
        onSubmit={handleVendorFormSubmit}
        initialValues={editingVendor}
      />
    </div>
  );
};

export default VendorsManagement;
