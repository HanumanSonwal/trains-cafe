"use client";
import { useState, useEffect } from 'react';
import { Table, Button, Input as AntdInput, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import CategoriesForm from './CategriesForm';
import Spinner from '@/app/componants/spinner/Spinner';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/categories?page=${page}&limit=${pageSize}&search=${search}`);
      const { data, total, success } = response.data;

      if (success) {
        setCategories(data);
        setPagination((prev) => ({
          ...prev,
          total,
        }));
      } else {
        message.error('Failed to fetch categories');
      }
    } catch (error) {
      message.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (key) => {
    try {
      await axios.delete('/api/categories', {
        data: { id: key },
      });
      message.success('Category deleted successfully');
      fetchCategories(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleCategoryFormSubmit = () => {
    setIsCategoryModalOpen(false);
    fetchCategories(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  const columns = [
    {
      title: 'Category Thumbnail',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img src={image} alt="thumbnail" style={{ width: '70px', height: '50px', borderRadius: '8px' }} />
      ),
    },
    {
      title: 'Category Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditFilled />}
            onClick={() => handleEditCategory(record)}
            style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
          />
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDeleteCategory(record.key)}>
            <Button
              icon={<DeleteFilled />}
              danger
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ backgroundColor: '#FAF3CC', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#6F4D27' }}>Categories Management</h2>
      <div className="flex justify-between items-center my-5">
        <AntdInput
          placeholder="Search Categories"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ maxWidth: 300, borderColor: '#D6872A' }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          Add Category
        </Button>
      </div>

      {loading ? (
        <Spinner color="#D6872A" />
      ) : (
        <Table
          columns={columns}
          dataSource={categories.map((category) => ({ ...category, key: category._id }))}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30],  // Keep these as numbers
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      )}
      <CategoriesForm
        fetchCategories={fetchCategories}
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategoryFormSubmit}
        initialValues={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;
