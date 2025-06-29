import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, message, Select, Row, Col } from "antd";
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
      alt: values.alt,
      link_url: values.link_url,
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
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Alt Tag"
              name="alt"
              rules={[{ required: true, message: "Alt tag is required" }]}
            >
              <Input placeholder="Enter image alt text" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Link URL"
              name="link_url"
              rules={[{ required: true, message: "Link URL is required" }]}
            >
              <Input placeholder="Enter target URL" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Image" name="image">
              <FileUploadComponent
                url={url}
                setUrl={setUrl}
                setImageError={setImageError}
              />
              {imageError && (
                <div style={{ color: "red", marginTop: "4px" }}>
                  {imageError}
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AdvertisementsForm;
