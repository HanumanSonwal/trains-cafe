import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Input, Form, message, Select, Col, Row, Button } from "antd";
import dynamic from "next/dynamic";

const { Option } = Select;
const TextEditor = dynamic(
  () => import("@/app/componants/TextEditor").then((mod) => mod.default),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);


const SattionPageModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  mode,
}) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [stationList, setStationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stationLoading, setStationLoading] = useState(false);

  const fetchStations = useCallback(async (search = "") => {
    setStationLoading(true);
    try {
      const res = await fetch(
        `/api/station?search=${encodeURIComponent(search)}&page=1&limit=50`
      );
      const data = await res.json();
      setStationList(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    } finally {
      setStationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) fetchStations();
  }, [visible, fetchStations]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: initialValues?.name || "",
        title: initialValues?.title || "",
        description: initialValues?.description || "",
        keywords: initialValues?.keywords?.join(", ") || "",
        status: initialValues?.status || "published",
        Station: initialValues?.Station || undefined,
      });
      setEditorContent(initialValues?.pageData || "");
    } else {
      form.resetFields();
      setEditorContent("");
    }
  }, [visible, initialValues, form]);

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
          ? "/api/web-station/add"
          : `/api/web-station/update/${initialValues._id}`;

      const method = mode === "add" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      message.success(
        mode === "add" ? "Page added successfully" : "Page updated successfully"
      );
      onSubmit(data);
    } catch (error) {
      message.error(
        mode === "add" ? "Failed to add page" : "Failed to update page"
      );
    } finally {
      setLoading(false);
    }
  }, [form, editorContent, mode, initialValues, onSubmit]);

  const modalFooter = useMemo(
    () => [
      <Button key="cancel" onClick={onCancel}>
        Cancel
      </Button>,
      <Button
        key="submit"
        type="primary"
        style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        loading={loading}
        onClick={handleSubmit}
      >
        {mode === "add" ? "Add Page" : "Update Page"}
      </Button>,
    ],
    [loading, handleSubmit, onCancel, mode]
  );

  return (
    <Modal
      title={mode === "add" ? "Add Station Page" : "Edit Station Page"}
      open={visible}
      onCancel={onCancel}
      footer={modalFooter}
      width={800}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Page name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="keywords"
              label="Keywords"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter keywords separated by commas" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Station"
              label="Select Station"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Search and select station"
                showSearch
                onSearch={fetchStations}
                loading={stationLoading}
                filterOption={false}
              >
                {stationList.map((station) => (
                  <Option key={station._id} value={station._id}>
                    {station.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {mode !== "add" && (
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Page data" rules={[{ required: true }]}>
          <TextEditor
            value={editorContent}
            onChange={setEditorContent}
            height={250}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(SattionPageModal);
