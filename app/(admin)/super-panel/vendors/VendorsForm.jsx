"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Spin,
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
  const [form] = Form.useForm();
  const [stations, setStations] = useState([]);
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchStations = useCallback(async (search = "", page = 1) => {
    setLoadingStations(true);
    try {
      const response = await fetchData(
        `/api/station?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=50`
      );
      if (response.success) {
        setStations(response.data);
      } else {
        message.error("Failed to fetch stations");
      }
    } catch {
      message.error("Error fetching stations");
    } finally {
      setLoadingStations(false);
    }
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchStations = useMemo(
    () => debounce(fetchStations, 500),
    [fetchStations]
  );

  useEffect(() => {
    if (open) {
      fetchStations();
      form.setFieldsValue({
        ...initialValues,
        Working_Time: initialValues?.Working_Time
          ? initialValues.Working_Time.split(" - ").map((time) =>
              dayjs(time, "hh:mm A")
            )
          : [],
        Weekly_Off: initialValues?.Weekly_Off || "",
      });
      setImage(initialValues?.image || "");
    } else {
      form.resetFields();
      setImage("");
      setIsReset(true);
    }
  }, [open, initialValues, fetchStations, form]);

  const handleFinish = useCallback(
    async (values) => {
      if (!image) {
        setImageError("Please upload an image");
        return;
      }

      setSubmitLoading(true);

      const payload = {
        ...values,
        image,
        Working_Time:
          values.Working_Time?.length === 2
            ? `${values.Working_Time[0].format(
                "hh:mm A"
              )} - ${values.Working_Time[1].format("hh:mm A")}`
            : "",
      };

      try {
        let response;
        if (initialValues?._id) {
          response = await updateData(
            `/api/vendors/?id=${initialValues._id}`,
            payload
          );
        } else {
          response = await postData("/api/vendors", payload);
        }

        if (response && response.success !== false) {
          form.resetFields();
          setImage("");
          onSubmit?.(payload);
          onCancel();
        } else {
          message.warning(response?.message || "Something went wrong!");
        }
      } catch (error) {
        console.error(error);
        message.error("Server error occurred.");
      } finally {
        setSubmitLoading(false);
      }
    },
    [image, initialValues, form, onSubmit, onCancel]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setImage("");
    onCancel();
  }, [form, onCancel]);

  return (
    <Modal
      title={initialValues?._id ? "Edit Vendor" : "Add Vendor"}
      open={open}
      onCancel={handleCancel}
      width={800}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        paddingRight: "10px",
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={submitLoading}
          onClick={() => form.submit()}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues?._id ? "Save" : "Submit"}
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
                  message: "Must be exactly 10 digits",
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

          <Col span={8}>
            <Form.Item
              name="Alternate_Contact_No"
              label="Alternate Contact No."
              rules={[
                {
                  pattern: /^$|^[0-9]{10}$/,
                  message: "Must be exactly 10 digits",
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

     <Col span={8}>
  <Form.Item
    name="trainscafeCommision"
    label="Trainscafe Commission (%)"
    rules={[
      {
        required: true,
        message: "Commission is required",
      },
      {
        validator: (_, value) => {
          if (value === undefined || value === "") {
            return Promise.resolve();
          }
          if (value < 0 || value > 100) {
            return Promise.reject(
              new Error("Commission must be between 0 and 100")
            );
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    <Input
      type="number"
      min={0}
      max={100}
      placeholder="Enter commission"
      addonAfter="%"
    />
  </Form.Item>
</Col>


          <Col span={8}>
            <Form.Item
              name="Station"
              label="Station"
              rules={[{ required: true, message: "Please select a station" }]}
            >
              <Select
                showSearch
                placeholder="Search for a station"
                onSearch={(value) => debouncedFetchStations(value, 1)}
                filterOption={false}
                notFoundContent={loadingStations ? <Spin size="small" /> : null}
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
            <Form.Item name="Weekly_Off" label="Weekly Off">
              <Select placeholder="Select weekly off">
                {[
                  "No_Weekly_Off",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="Food_Type"
              label="Food Type"
              rules={[{ required: true, message: "Food type is required" }]}
            >
              <Select mode="multiple" placeholder="Select food type" allowClear>
                <Option value="Vegetarian">Vegetarian</Option>
                <Option value="Non-Vegetarian">Non-Vegetarian</Option>
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
            value={form.getFieldValue("Description")}
            onChange={(content) => form.setFieldValue("Description", content)}
            height={250}
          />
        </Form.Item>

        <Form.Item label="Upload Image" required>
          <FileUploadComponent
            url={image}
            setUrl={setImage}
            isreset={isReset}
            setImageError={setImageError}
          />
          {imageError && <p style={{ color: "red" }}>{imageError}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VendorsForm;
