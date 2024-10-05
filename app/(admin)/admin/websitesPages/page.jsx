"use client";

import { Table, Switch, Button, Input, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import WebsitePageModal from './WebsitePageModal';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default function WebsitesPages() {
  const [pages, setPages] = useState([
    { id: 1, name: 'About us', header: false, footer: false, metaTitle: 'About Us', metaDescription: 'Learn about our company', metaKeywords: 'about, company', pageData: '<p>About us content</p>' },
    { id: 2, name: 'Privacy Policy', header: false, footer: true, metaTitle: 'Privacy Policy', metaDescription: 'Our privacy policy', metaKeywords: 'privacy, policy', pageData: '<p>Privacy policy content</p>' },
    { id: 3, name: 'Terms & Conditions', header: false, footer: false, metaTitle: 'Terms and Conditions', metaDescription: 'Our terms and conditions', metaKeywords: 'terms, conditions', pageData: '<p>Terms and conditions content</p>' },
  ]);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const handleToggleChange = (id, field) => {
    const updatedPages = pages.map((page) =>
      page.id === id ? { ...page, [field]: !page[field] } : page
    );
    setPages(updatedPages);
  };

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (mode, page = null) => {
    setModalMode(mode);
    setEditingPage(page);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPage(null);
  };

  const handleSubmit = (values) => {
    if (modalMode === 'add') {
      const newPage = {
        id: pages.length + 1,
        name: values.pageName,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaKeywords: values.metaKeywords,
        pageData: values.pageData,
        header: false,
        footer: false,
      };
      setPages([...pages, newPage]);
    } else {
      const updatedPages = pages.map((page) =>
        page.id === editingPage.id ? {
          ...page,
          name: values.pageName,
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
          metaKeywords: values.metaKeywords,
          pageData: values.pageData,
        } : page
      );
      setPages(updatedPages);
    }
    setIsModalVisible(false);
    setEditingPage(null);
  };

  const handleDelete = (pageId) => {
    confirm({
      title: 'Are you sure you want to delete this page?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const updatedPages = pages.filter(page => page.id !== pageId);
        setPages(updatedPages);
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (_, record) => (
        <div className="flex space-x-4">
          <Switch
            checked={record.header}
            onChange={() => handleToggleChange(record.id, 'header')}
            size="small"
          />
          <span>Header</span>
          <Switch
            checked={record.footer}
            onChange={() => handleToggleChange(record.id, 'footer')}
            size="small"
          />
          <span>Footer</span>
        </div>
      ),
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<EditOutlined />} onClick={() => showModal('edit', record)} type="primary" style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}/>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} type="danger" style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label>Show</label>
          <Select
            defaultValue={pageSize}
            onChange={(value) => setPageSize(value)}
            className="w-24"
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={15}>15</Option>
            <Option value={20}>20</Option>
          </Select>
          <label>entries</label>
        </div>

        <Search
          placeholder="Search by name"
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal('add')}
          className="bg-brown-600 text-white"
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          Add New Page
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPages}
        pagination={{ pageSize }}
        rowKey="id"
      />

      <WebsitePageModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingPage}
        mode={modalMode}
      />
    </div>
  );
}