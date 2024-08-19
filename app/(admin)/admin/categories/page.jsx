"use client";
import { useState } from 'react';
import { Table, Button, Input as AntdInput, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import CategoriesForm from './CategriesForm';


const initialCategories = [
    { key: '1', thumbnail: '/food/brooke-lark--F_5g8EEHYE-unsplash.jpg', title: 'Breakfast', categoryId: '2' },
    { key: '2', thumbnail: '/food/brooke-lark-R18ecx07b3c-unsplash.jpg', title: 'Snacks', categoryId: '3' },
    { key: '3', thumbnail: '/food/eaters-collective-ddZYOtZUnBk-unsplash.jpg', title: 'SOUTH INDIAN', categoryId: '4' },
    { key: '4', thumbnail: '/food/taylor-kiser-6RJct18G_3I-unsplash.jpg', title: 'VEG ITEMS', categoryId: '5' },
    { key: '5', thumbnail: '/food/wikisleep-app-qvIrI4ueqzY-unsplash.jpg', title: 'Beverages', categoryId: '10' },
    { key: '6', thumbnail: '/food/brooke-lark--F_5g8EEHYE-unsplash.jpg', title: 'Indian Main Course', categoryId: '11' },
    { key: '7', thumbnail: '/food/brooke-lark-R18ecx07b3c-unsplash.jpg', title: 'Indian Breads', categoryId: '12' },
    // { key: '8', thumbnail: '/food/eaters-collective-ddZYOtZUnBk-unsplash.jpg', title: 'Curd & Raita', categoryId: '13' },
    // { key: '9', thumbnail: '/food/taylor-kiser-6RJct18G_3I-unsplash.jpg', title: 'Combo Meal', categoryId: '14' },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [filteredCategories, setFilteredCategories] = useState(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (key) => {
    setCategories(categories.filter(category => category.key !== key));
    setFilteredCategories(filteredCategories.filter(category => category.key !== key));
    message.success('Category deleted successfully');
  };

  const handleCategoryFormSubmit = (values) => {
    const newCategoryId = categories.length > 0 ? `${Math.max(...categories.map(c => parseInt(c.categoryId))) + 1}` : '1';
    if (editingCategory) {
      setCategories(categories.map(category => category.key === editingCategory.key ? { ...values, key: editingCategory.key, categoryId: editingCategory.categoryId } : category));
      setFilteredCategories(filteredCategories.map(category => category.key === editingCategory.key ? { ...values, key: editingCategory.key, categoryId: editingCategory.categoryId } : category));
      message.success('Category updated successfully');
    } else {
      const newCategory = { ...values, key: `${categories.length + 1}`, categoryId: newCategoryId };
      setCategories([...categories, newCategory]);
      setFilteredCategories([...filteredCategories, newCategory]);
      message.success('Category added successfully');
    }
    setIsCategoryModalOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = categories.filter(category => category.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredCategories(filteredData);
  };

  const columns = [
    {
      title: 'Category Index',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
    
    },
    {
      title: 'Category Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
  
      render: (thumbnail) => <img src={thumbnail} alt="thumbnail" style={{ width: '70px', height: '50px', borderRadius: '8px' }} />,
    },
    {
      title: 'Category Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
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
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#6F4D27' }}> Categories Management</h2>
      <div className="flex justify-between items-center mb-4">
        <AntdInput
          placeholder="Search Categories"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ maxWidth: 300,borderColor: '#D6872A' }}
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
      <Table columns={columns} dataSource={filteredCategories} pagination={{ pageSize: 10 }} />
      <CategoriesForm
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategoryFormSubmit}
        initialValues={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;
