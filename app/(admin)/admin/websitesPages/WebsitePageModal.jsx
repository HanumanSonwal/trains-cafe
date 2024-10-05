import React, { useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });

const WebsitePageModal = ({ visible, onCancel, onSubmit, initialValues, mode }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        pageName: initialValues.name,
        metaTitle: initialValues.metaTitle,
        metaDescription: initialValues.metaDescription,
        metaKeywords: initialValues.metaKeywords,
      });
      setEditorContent(initialValues.pageData || '');
    } else {
      form.resetFields();
      setEditorContent('');
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        pageData: editorContent,
      });
    });
  };

  return (
    <Modal
      title={mode === 'add' ? "Add Website Page" : "Edit Website Page"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="pageName"
          label="Page name"
          rules={[{ required: true, message: 'Please input the page name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="metaTitle"
          label="Meta title"
          rules={[{ required: true, message: 'Please input the meta title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="metaDescription"
          label="Meta description"
          rules={[{ required: true, message: 'Please input the meta description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="metaKeywords"
          label="Meta keywords"
          rules={[{ required: true, message: 'Please input the meta keywords!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Page data"
          rules={[{ required: true, message: 'Please input the page content!' }]}
        >
          <TextEditor
            previousValue={editorContent}
            updatedValue={(content) => setEditorContent(content)}
            height={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WebsitePageModal;