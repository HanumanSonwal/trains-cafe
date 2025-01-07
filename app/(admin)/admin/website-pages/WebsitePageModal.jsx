import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, message, Select } from 'antd';

const { Option } = Select;
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });

const WebsitePageModal = ({ visible, onCancel, onSubmit, initialValues, mode }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        title: initialValues.title,
        description: initialValues.description,
        keywords: initialValues.keywords.join(', '),
        status: initialValues.status || 'published',
      });
      setEditorContent(initialValues.pageData || '');
    } else {
      form.resetFields();
      setEditorContent('');
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        name: values.name,
        title: values.title,
        description: values.description,
        keywords: values.keywords.split(',').map(keyword => keyword.trim()),
        status: mode === 'add' ? 'draft' : values.status,  // Default to "draft" on add
        pageData: editorContent,
      };

      console.log('Submit Data:', submitData); // Debugging

      let response;
      if (mode === 'add') {
        response = await fetch('/api/web-pages/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(`/api/web-pages/update/${initialValues._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        message.success(mode === 'add' ? 'Page added successfully' : 'Page updated successfully');
        onSubmit(responseData);
      } else {
        throw new Error(mode === 'add' ? 'Failed to add page' : 'Failed to update page');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(mode === 'add' ? 'Failed to add page' : 'Failed to update page');
    }
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
          name="name"
          label="Page name"
          rules={[{ required: true, message: 'Please input the page name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="keywords"
          label="Keywords"
          rules={[{ required: true, message: 'Please input the keywords!' }]}
        >
          <Input placeholder="Enter keywords separated by commas" />
        </Form.Item>

        {/* Only show the status selection during edit mode */}
        {mode !== 'add' && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>
        )}

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
