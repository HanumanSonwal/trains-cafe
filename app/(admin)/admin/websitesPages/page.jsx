'use client'

import { Table, Switch, Button, Input, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import WebsitePageModal from './WebsitePageModal';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default function WebsitesPages() {
  const [pages, setPages] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, [currentPage, pageSize, searchText]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/web-pages?page=${currentPage}&limit=${pageSize}&search=${searchText}`);
      const data = await response.json();
      setPages(data.docs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
    setLoading(false);
  };

  const handleToggleChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await fetch(`http://localhost:3000/api/web-pages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPages(); // Refresh the page list
    } catch (error) {
      console.error('Error updating page status:', error);
    }
  };

  const showModal = (mode, page = null) => {
    setModalMode(mode);
    setEditingPage(page);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPage(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (modalMode === 'add') {
        await fetch('http://localhost:3000/api/web-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } else {
        await fetch(`http://localhost:3000/api/web-pages/${editingPage._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      }
      fetchPages(); // Refresh the page list
      setIsModalVisible(false);
      setEditingPage(null);
    } catch (error) {
      console.error('Error submitting page:', error);
    }
  };

  const handleDelete = (pageId) => {
    confirm({
      title: 'Are you sure you want to delete this page?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await fetch(`http://localhost:3000/api/web-pages/delete/${pageId}`, {
            method: 'DELETE',
          });
          fetchPages(); // Refresh the page list
        } catch (error) {
          console.error('Error deleting page:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
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
      render: (status, record) => (
        <div className="flex space-x-4">
          <Switch
            checked={status === 'published'}
            onChange={() => handleToggleChange(record._id, status)}
            size="small"
          />
          <span>{status === 'published' ? 'Published' : 'Draft'}</span>
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
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} type="danger" style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }} />
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
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
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
          onSearch={(value) => {
            setSearchText(value);
            setCurrentPage(1);
          }}
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
        dataSource={pages}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages * pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="_id"
        loading={loading}
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