"use client";

import { Table, Switch, Button, Input, Modal, Popconfirm, Spin } from 'antd';
import { EditFilled, DeleteOutlined, PlusOutlined, DeleteFilled , LoadingOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import WebsitePageModal from './WebsitePageModal';

const { Search } = Input;

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
      const response = await fetch(
        `/api/web-pages?page=${currentPage}&limit=${pageSize}&search=${searchText}`
      );
      const data = await response.json();
      setPages(data.docs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
    setLoading(false);
  };

  const handleToggleChange = async (record) => {
    const newStatus = record.status === 'published' ? 'draft' : 'published';
    const updatedPage = { ...record, status: newStatus };

    try {
      await fetch(`/api/web-pages/update/${record._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPage),
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
        await fetch('/api/web-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } else {
        await fetch(`/api/web-pages/${editingPage._id}`, {
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

  const handleDelete = async (pageId) => {
    try {
      await fetch(`/api/web-pages/delete/${pageId}`, {
        method: 'DELETE',
      });
      fetchPages(); // Refresh the page list
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const clearSearch = () => {
    setSearchText('');
    setCurrentPage(1); // Reset to first page
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status, record) => (
        <div className="flex space-x-4">
          <Switch
            checked={status === 'published'}
            onChange={() => handleToggleChange(record)}
         
          />
          <span>{status === 'published' ? 'Published' : 'Draft'}</span>
        </div>
      ),
    },
    
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <div className="flex space-x-2">
           <Button
            icon={<EditFilled />}
            onClick={() => showModal('edit', record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
            <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete( record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
      Website Pages Management
      </h2>
      <div className="flex items-center my-5 justify-between">
      <Input
          placeholder="Search"
          style={{ width: 300, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          suffix={
            searchText && (
              <CloseCircleOutlined
                onClick={clearSearch}
                style={{ color: "rgba(0, 0, 0, 0.45)", cursor: "pointer" }}
              />
            )
          }
          value={searchText}
          onChange={handleSearch}
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
      <Spin spinning={loading} indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={pages}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPages * pageSize, // Correctly set the total count
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="_id"
        />
      </Spin>

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
