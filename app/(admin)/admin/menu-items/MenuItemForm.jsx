"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Col,
  Row,
  Select,
  Radio,
  message,
  Form,
  InputNumber,
} from "antd";
import { fetchData, postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";

const { Option } = Select;

const MenuItemForm = ({
  open,
  onCancel,
  initialValues,
  fetchMenuItems,
}) => {
  const [form] = Form.useForm();
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [imageError, setImageError] = useState("");
  const [isreset, setIsreset] = useState(false);



  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetchData("/api/categories");
      if (response.success !== false) {
        setCategories(response.data);
      } else {
        message.error("Failed to fetch categories");
      }
    };

    const fetchStations = async () => {
      const response = await fetchData("/api/station?search=&page=0");
      if (response.success !== false) {
        setStations(response.data);
      } else {
        message.error("Failed to fetch stations");
      }
    };

    fetchCategories();
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStationName) {
      fetchVendors(selectedStationName);
    }
  }, [selectedStationName]);

  const fetchVendors = async (stationName) => {
    try {
      const response = await fetchData(`/api/vendors?page=1&limit=10&search=${stationName}`);
      if (response && response.success !== false) {
        setVendors(response.data);
      } else {
        message.error("Failed to fetch vendors");
      }
    } catch (error) {
      message.error("An error occurred while fetching vendors");
    }
  };

  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    setIsreset(false);
  }, []);

const handleFinish = async (values) => {
  if (!url) {
    setImageError("Please upload an image.");
    return;
  } else {
    setImageError("");
  }

  const body = {
    Item_Name: values.Item_Name,
    Category_Id: values.Category_Id,
    Vendor: values.Vendor,
    Station: values.Station,
    Food_Type: values.Food_Type,
    Price: parseFloat(values.Price),
    Discount: parseFloat(values.Discount || "0"),
    Description: values.Description || "",
    image: url
  };

  const urlPath = initialValues ? `/api/menu?id=${initialValues?._id}` : "/api/menu";
  const method = initialValues ? updateData : postData;

  try {
    const response = await method(urlPath, body);
    if (response.success !== false) {
      message.success(initialValues ? "Menu item updated successfully!" : "Menu item added successfully!");
      fetchMenuItems();
      form.resetFields();
      setIsreset(true);
      onCancel();
    } else {
      throw new Error(response.err || "Failed to save menu item");
    }
  } catch (error) {
    message.error(error.message || "Something went wrong");
  }
};


  return (
    <Modal
      open={open}
      width={1000}
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues ? "Save" : "Submit"}
        </Button>,
      ]}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        {initialValues ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Item Name"
              name="Item_Name"
              rules={[{ required: true, message: "Item name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Select Category"
              name="Category_Id"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select placeholder="Select Category">
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Select Station"
              name="Station"
              rules={[{ required: true, message: "Station is required" }]}
            >
              <Select
                showSearch
                placeholder="Search for a station"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  const selectedStation = stations.find(station => station._id === value);
                  setSelectedStationName(selectedStation?.name || "");
                }}
              >
                {stations.map((station) => (
                  <Option key={station._id} value={station._id}>
                    {station.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
  label="Select Vendor"
  name="Vendor"
  rules={[{ required: true, message: "Vendor is required" }]}
>
  <Select
    showSearch
    placeholder="Search for a vendor"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option?.children.toLowerCase().includes(input.toLowerCase())
    }
  >
    {vendors.map((vendor) => (
      <Option key={vendor._id} value={vendor._id}>
        {vendor.Vendor_Name}
      </Option>
    ))}
  </Select>
</Form.Item>

          </Col>
        </Row>

        <Row gutter={20}>
        <Col span={12}>
    <Form.Item
      label="Price"
      name="Price"
      rules={[
        { required: true, message: "Price is required" },
        { type: "number", min: 0.01, message: "Price must be positive and at least 0.01" },
      ]}
    >
      <InputNumber
        style={{ width: "100%" }}
        min={0.01}
      />
    </Form.Item>
  </Col>
           <Col span={12}>
    <Form.Item
      label="Discount (%)"
      name="Discount"
      rules={[
        { type: "number", min: 0, max: 100, message: "Discount must be between 0 and 100" },
      ]}
    >
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        max={100}
      />
    </Form.Item>
  </Col>
        </Row>

        <Row gutter={20}>
<Col span={12}>
  <Form.Item
    label="Food Type"
    name="Food_Type"
    rules={[{ required: true, message: "Please select food type" }]}
  >
    <Select placeholder="Select food type" allowClear>
      <Option value="Vegetarian">Vegetarian</Option>
      <Option value="Non-Vegetarian">Non-Vegetarian</Option>

    </Select>
  </Form.Item>
</Col>


          <Col span={12}>
            <Form.Item label="Image">
              <FileUploadComponent
                url={url}
                setUrl={setUrl}
                isreset={isreset}
                setImageError={setImageError}
              />
              {imageError && (
                <p className="text-red-500">{imageError}</p>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Col>
          <Form.Item
            label="Description"
            name="Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default MenuItemForm;
