"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  TimePicker,
  Form,
  message,
} from "antd";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { fetchData, postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";

dayjs.extend(customParseFormat);
const { Option } = Select;

const TextEditor = dynamic(() => import("../../../componants/TextEditor"), {
  ssr: false,
});

const VendorsForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const [stations, setStations] = useState([]);
  const [form] = Form.useForm();
  const [image, setimage] = useState("");
  const [imageError, setImageError] = useState("");
  const [isreset, setIsreset] = useState(false);

  console.log(initialValues, "initialValues -va;ues");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetchData("/api/station?search=&page=0");
        if (response && response.success !== false) {
          setStations(response.data);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...initialValues,
        Working_Time: initialValues?.Working_Time
          ? initialValues.Working_Time.split(" - ").map((time) =>
              dayjs(time, "hh:mm A")
            )
          : [],
      });
      setimage(initialValues?.image || "");
    } else {
      form.resetFields();
      setimage("");
      setIsreset(true);
    }
  }, [open, initialValues, form]);

  const handleFinish = async (values) => {
    if (!image) {
      setImageError("Please upload an image");
      return;
    }

    const payload = {
      ...values,
      image: image,
      Working_Time:
        values.Working_Time?.length === 2
          ? `${values.Working_Time[0].format(
              "hh:mm A"
            )} - ${values.Working_Time[1].format("hh:mm A")}`
          : "",
    };

    let response;
    try {
      if (initialValues?._id) {
        response = await updateData(
          `/api/vendors/?id=${initialValues._id}`,
          payload
        );
      } else {
        response = await postData("/api/vendors", payload);
      }

      if (response && response.success !== false) {
        message.success("Vendor saved successfully!");
        form.resetFields();
        setimage("");
        onSubmit(payload);
        onCancel();
      } else {
        message.warning(response?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      message.error("Server error occurred.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setimage("");
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Edit Vendor" : "Add Vendor"}
      open={open}
      onCancel={handleCancel}
      width={800}
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Vendor_Name"
              label="Vendor Name"
              rules={[{ required: true, message: "Vendor name is required" }]}
            >
              <Input placeholder="Enter vendor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Contact_No"
              label="Contact No."
              rules={[
                { required: true, message: "Contact number is required" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Contact number must be exactly 10 digits",
                },
              ]}
            >
              <Input
                placeholder="Enter contact number"
                maxLength={10}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ Contact_No: onlyNums });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="Alternate_Contact_No"
              label="Alternate Contact No."
              rules={[
                {
                  pattern: /^$|^[0-9]{10}$/,
                  message: "Alternate number must be exactly 10 digits",
                },
              ]}
            >
              <Input
                placeholder="Enter alternate contact number"
                maxLength={10}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ Alternate_Contact_No: onlyNums });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Station"
              label="Station"
              rules={[{ required: true, message: "Please select a station" }]}
            >
              <Select
                showSearch
                placeholder="Select station"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.map((station) => (
                  <Option key={station._id} value={station._id}>
                    {station.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Delivery_Charges"
              label="Delivery Charges"
              rules={[{ required: true, message: "Delivery charges required" }]}
            >
              <Input placeholder="Enter delivery charges" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Min_Order_Value"
              label="Min. Order Value (Rs.)"
              rules={[
                { required: true, message: "Minimum order value required" },
              ]}
            >
              <Input placeholder="Enter minimum order value" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Min_Order_Time"
              label="Min. Order Time (Minutes)"
              rules={[{ required: true, message: "Min order time required" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter minutes"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="Working_Time"
              label="Working Time"
              rules={[{ required: true, message: "Working time required" }]}
            >
              <TimePicker.RangePicker format="hh:mm A" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
      <Col span={12}>
  <Form.Item
    name="Weekly_Off"
    label="Weekly Off"
  >
    <Select placeholder="Select weekly off" defaultValue="">
      <Option value="">No Weekly Off</Option>
      <Option value="Monday">Monday</Option>
      <Option value="Tuesday">Tuesday</Option>
      <Option value="Wednesday">Wednesday</Option>
      <Option value="Thursday">Thursday</Option>
      <Option value="Friday">Friday</Option>
      <Option value="Saturday">Saturday</Option>
      <Option value="Sunday">Sunday</Option>
    </Select>
  </Form.Item>
</Col>

          <Col span={12}>
            <Form.Item
              name="Food_Type"
              label="Food Type"
              rules={[{ required: true, message: "Food type is required" }]}
            >
              <Select placeholder="Select food type">
                <Option value="Veg & Non-Veg">Veg & Non-Veg</Option>
                <Option value="Veg">Veg</Option>
                <Option value="Non-Veg">Non-Veg</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="Address"
          label="Address"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter address here" />
        </Form.Item>
        <Form.Item
          name="Description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <TextEditor
            previousValue={form.getFieldValue("Description")}
            updatedValue={(content) =>
              form.setFieldValue("Description", content)
            }
            height={200}
          />
        </Form.Item>

        <Form.Item label="Upload Image" required>
          <FileUploadComponent
            url={image}
            setUrl={setimage}
            isreset={isreset}
            setImageError={setImageError}
          />
          {imageError && <p className="text-red-500">{imageError}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VendorsForm;
