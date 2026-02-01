import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Input, Form, message, Select, Row, Col, Button } from "antd";
import dynamic from "next/dynamic";

const { Option } = Select;
const TextEditor = dynamic(() => import("../../../componants/TextEditor"), { ssr: false });

const TrainPageModal = ({ visible, onCancel, onSubmit, initialValues, mode }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: "",
      title: "",
      description: "",
      keywords: "",
      trainnumber: "",
      trainname: "",
      status: "published",
    }),
    []
  );

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          keywords: Array.isArray(initialValues.keywords)
            ? initialValues.keywords.join(", ")
            : "",
          status: initialValues.status || "published",
        });
        setEditorContent(initialValues.pageData || "");
      } else {
        form.setFieldsValue(defaultValues);
        setEditorContent("");
      }
    }
  }, [visible, initialValues, defaultValues, form]);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const submitData = {
        ...values,
        keywords: values.keywords.split(",").map((k) => k.trim()),
        status: mode === "add" ? "draft" : values.status,
        pageData: editorContent,
      };

      const url =
        mode === "add"
          ? "/api/web-train/add"
          : `/api/web-train/update/${initialValues._id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      message.success(mode === "add" ? "Page added successfully" : "Page updated successfully");
      onSubmit(data);
    } catch (err) {
      message.error(mode === "add" ? "Failed to add page" : "Failed to update page");
    } finally {
      setLoading(false);
    }
  }, [form, editorContent, mode, initialValues, onSubmit]);

  return (
    <Modal
      title={mode === "add" ? "Add Station Page" : "Edit Station Page"}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="name" label="Page Name" rules={[{ required: true }]}>
              <Input placeholder="Enter page name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="trainname" label="Train Name" rules={[{ required: true }]}>
              <Input placeholder="Enter train name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="trainnumber" label="Train Number" rules={[{ required: true }]}>
              <Input placeholder="Enter train number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}>
              <Input placeholder="Enter keywords separated by commas" />
            </Form.Item>
          </Col>

          {mode !== "add" && (
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select placeholder="Select status">
                  <Option value="published">Published</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Page Data" required>
              <TextEditor
                previousValue={editorContent}
                updatedValue={setEditorContent}
                height={250}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={loading}
            style={{
              backgroundColor: "#D6872A", 
              borderColor: "#D6872A",
            }}
            onClick={handleSubmit}
          >
            {mode === "add" ? "Add Page" : "Update Page"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TrainPageModal;
