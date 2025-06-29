import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, message, Select, Col, Row } from 'antd';
const { Option } = Select;
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });

const SattionPageModal = ({ visible, onCancel, onSubmit, initialValues, mode }) => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('/api/station?search=&page=0');
        const data = await res.json();
        setStationList(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        title: initialValues.title,
        description: initialValues.description,
        keywords: initialValues.keywords.join(', '),
        status: initialValues.status || 'published',
        Station: initialValues.Station || undefined,
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
        status: mode === 'add' ? 'draft' : values.status,
        pageData: editorContent,
        Station: values.Station,
      };

      let response;
      if (mode === 'add') {
        response = await fetch('/api/web-station/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch(`/api/web-station/update/${initialValues._id}`, {
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
      title={mode === 'add' ? "Add Station Page" : "Edit Station Page"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >


<Form form={form} layout="vertical">
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="name"
        label="Page name"
        rules={[{ required: true, message: 'Please input the page name!' }]}
      >
        <Input />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="keywords"
        label="Keywords"
        rules={[{ required: true, message: 'Please input the keywords!' }]}
      >
        <Input placeholder="Enter keywords separated by commas" />
      </Form.Item>
    </Col>
    <Col span={12}>
  <Form.Item
    name="Station"
    label="Select Station"
    rules={[{ required: true, message: 'Please select a station!' }]}
  >
    <Select
      placeholder="Select station"
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
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
    name="description"
    label="Description"
    rules={[{ required: true, message: 'Please input the description!' }]}
  >
    <Input.TextArea rows={4} />
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

export default SattionPageModal;
