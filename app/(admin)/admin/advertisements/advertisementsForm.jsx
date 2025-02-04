import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, message, Select } from "antd";
import { postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";

const { Option } = Select;

const AdvertisementsForm = ({
  open,
  onCancel,
  initialValues,
  fetchAdvertisements,
}) => {
  const [url, setUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFormSubmit = async (values) => {
    if (!url) {
      setImageError("Please upload an image.");
      return;
    } else {
      setImageError("");
    }

    const data = {
      slug: values.slug,
      title: values.title,
      image: url,
      description: values.description,
    };

    const id = initialValues ? initialValues.id : null;
    postAdvertisement(data, id);
  };

  const postAdvertisement = async (data, id) => {
    const url = initialValues
      ? `/api/advertisements?id=${initialValues?._id}`
      : "/api/advertisements";
    const method = initialValues ? updateData : postData;

    try {
      const response = await method(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.success !== false) {
        message.success(
          id
            ? "Advertisement updated successfully!"
            : "Advertisement added successfully!"
        );
        fetchAdvertisements();
        form.resetFields();
        onCancel();
      } else {
        throw new Error(response.err || "Failed to save advertisement");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      width={600}
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
        {initialValues ? "Edit Advertisement" : "Add Advertisement"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Slug is required" }]}
        >
          <Select placeholder="Select slug">
            <Option value="advertisements">Advertisement</Option>
            <Option value="Banner">Banner</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item label="Image" name="image">
          <FileUploadComponent
            url={url}
            setUrl={setUrl}
            setImageError={setImageError}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdvertisementsForm;
