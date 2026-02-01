import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Button, Input, Row, Select, Col, message, Form } from "antd";
import axios from "axios";
import slugify from "slugify";
import FileUploadComponent from "@/app/componants/ImageUpload";
import TextEditor from "@/app/componants/TextEditor";

const { Option } = Select;

const BlogForm = ({ open, onCancel, initialValues = {}, fetchBlogs }) => {
  const [form] = Form.useForm();
  const [url, setUrl] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());

  const categories = useMemo(() => ["Food", "Health", "Travel"], []);

  const resetAll = useCallback(() => {
    form.resetFields();
    setUrl("");
    setIsReset(true);
    setEditorKey(Date.now());
    setTimeout(() => setIsReset(false), 100);
  }, [form]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: "",
        description: "",
        content: "",
        status: "",
        metakeyword: "",
        metatitle: "",
        metadescription: "",
        image: "",
        slug: "",
        category: "",
        ...initialValues,
      });
      setUrl(initialValues?.image || "");
      setEditorKey(Date.now());
    }
  }, [initialValues, open, form]);

  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        values.slug = slugify(values.title, { lower: true, strict: true });
        values.image = url;

        if (initialValues?._id) {
          await axios.put(`/api/blog?id=${initialValues._id}`, values);
          message.success("Blog updated successfully");
        } else {
          await axios.post("/api/blog", values);
          message.success("Blog added successfully");
        }

        fetchBlogs();
        resetAll();
        onCancel();
      } catch (error) {
        console.error("Failed to submit the form:", error);
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save the blog";
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [url, initialValues, fetchBlogs, onCancel, resetAll]
  );

  return (
    <Modal
      title={initialValues?._id ? "Edit Blog" : "Add Blog"}
      open={open}
      width={800}
      onCancel={onCancel}
      afterClose={resetAll}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues?._id ? "Save" : "Submit"}
        </Button>,
      ]}
      bodyStyle={{
        maxHeight: "65vh",
        overflowY: "auto",
        paddingRight: "8px",
      }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
        initialValues={{
          title: "",
          description: "",
          content: "",
          status: "",
          metakeyword: "",
          metatitle: "",
          metadescription: "",
          image: "",
          slug: "",
          category: "",
          ...initialValues,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Blog Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the blog title" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select Status">
                <Option value="publish">Publish</Option>
                <Option value="draft">Draft</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Category">
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Thumbnail Image" name="image">
              <FileUploadComponent
                url={url}
                isReset={isReset}
                setUrl={setUrl}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter the description" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Meta Keywords"
              name="metakeyword"
              rules={[
                { required: true, message: "Please enter meta keywords" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Meta Title"
              name="metatitle"
              rules={[{ required: true, message: "Please enter meta title" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please enter the content" }]}
            >
              <TextEditor
                key={editorKey}
                value={form.getFieldValue("content")}
                onChange={(value) => form.setFieldsValue({ content: value })}
                height={250}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Meta Description"
              name="metadescription"
              rules={[
                { required: true, message: "Please enter meta description" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BlogForm;
