import React, { useEffect, useState } from "react";
import { Modal, Input, Form, message, Select, Row, Col, Button } from "antd";
import dynamic from "next/dynamic";

const { Option } = Select;
const TextEditor = dynamic(() => import("../../../componants/TextEditor"), {
  ssr: false,
});

const WebsitePageModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = {},
  mode,
}) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: initialValues?.name || "",
        title: initialValues?.title || "",
        description: initialValues?.description || "",
        keywords: Array.isArray(initialValues?.keywords)
          ? initialValues.keywords.join(", ")
          : "",
        status: initialValues?.status || "published",
      });
      setEditorContent(initialValues?.pageData || "");
    } else {
      form.resetFields();
      setEditorContent("");
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const submitData = {
        ...values,
        keywords: values.keywords?.split(",").map((k) => k.trim()) || [],
        status: mode === "add" ? "draft" : values.status,
        pageData: editorContent || "",
      };

      const url =
        mode === "add"
          ? "/api/web-pages/add"
          : `/api/web-pages/update/${initialValues?._id || ""}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error("Failed to submit page");

      const data = await response.json();
      message.success(
        mode === "add" ? "Page added successfully" : "Page updated successfully"
      );
      onSubmit(data);
      onCancel();
    } catch (error) {
      console.error(error);
      message.error(
        mode === "add" ? "Failed to add page" : "Failed to update page"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === "add" ? "Add Website Page" : "Edit Website Page"}
      visible={visible}
      onCancel={onCancel}
      footer={
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {mode === "add" ? "Add Page" : "Update Page"}
        </Button>
      }
      width={800}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 10 }}
      centered
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {["name", "title"].map((field) => (
            <Col span={12} key={field}>
              <Form.Item
                name={field}
                label={field === "name" ? "Page Name" : "Title"}
                rules={[
                  {
                    required: true,
                    message: `Please input the ${
                      field === "name" ? "page name" : "title"
                    }!`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}
        </Row>

        {["description", "keywords"].map((field) => (
          <Form.Item
            key={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            rules={[{ required: true, message: `Please input the ${field}!` }]}
          >
            {field === "description" ? (
              <Input.TextArea rows={3} />
            ) : (
              <Input placeholder="Enter keywords separated by commas" />
            )}
          </Form.Item>
        ))}

        {mode !== "add" && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          rules={[
            { required: true, message: "Please input the page content!" },
          ]}
        >
          <TextEditor
            previousValue={editorContent}
            updatedValue={setEditorContent}
            height={150}
            label="Page Data"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WebsitePageModal;
