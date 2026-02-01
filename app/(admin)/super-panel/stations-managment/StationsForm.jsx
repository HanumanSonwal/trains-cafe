import React, { useEffect } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import axios from "axios";

const StationsForm = ({ open, onCancel, initialValues, fetchStations }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFormSubmit = async (values) => {
    try {
      let response;
      if (initialValues && initialValues._id) {
        response = await axios.put(`/api/station?id=${initialValues._id}`, values);
      } else {
        response = await axios.post("/api/station", values);
      }
      message.success(response.data?.message || "Saved successfully");
      fetchStations();
      onCancel();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to save station";
      message.error(errMsg);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Station" : "Add Station"}
      open={open}
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={initialValues || {}}
      >
        <Form.Item
          label="Station Name"
          name="name"
          rules={[{ required: true, message: "Please enter station name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Station Code"
          name="code"
          rules={[{ required: true, message: "Please enter station code" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StationsForm;
