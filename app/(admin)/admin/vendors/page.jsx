"use client";
import { useEffect, useState } from 'react';
import { Table, Button, Input as AntdInput, message, Switch, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import VendorsForm from './VendorsForm';
import axios from 'axios';
import { updateData , deleteData } from '@/app/lib/ApiFuntions';

const VendorsManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '30'],
      showSizeChanger: true,
      total: 0,
    },
  });

  const [searchText, setSearchText] = useState('');

  const loadVendors = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/vendors?page=${page}&limit=${pageSize}&search=${search}`);
      const { data, total, success } = response.data;

      if (success) {
        setVendors(data);
        setFilteredVendors(data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total,
          },
        }));
      } else {
        message.error('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { current, pageSize } = tableParams.pagination;
    loadVendors(current, pageSize, searchText);
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, searchText]);

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (record) => {
    setEditingVendor(record);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = async (id) => {
    try {
      const result = await deleteData(`/api/vendors`, { id });
      if (result.success) {
        setVendors(vendors.filter(vendor => vendor._id !== id));
        setFilteredVendors(filteredVendors.filter(vendor => vendor._id !== id));
        message.success('Vendor deleted successfully');
      } else {
        message.error('Failed to delete vendor');
      }
    } catch (error) {
      console.error(error);
      message.error('Error deleting vendor');
    }
  };

  const handleVendorFormSubmit = (values) => {
    if (editingVendor) {
      const updatedVendors = vendors.map(vendor =>
        vendor._id === editingVendor._id ? { ...values, _id: editingVendor._id } : vendor
      );
      setVendors(updatedVendors);
      setFilteredVendors(updatedVendors);
      message.success('Vendor updated successfully');
    } else {
      const newVendor = { ...values, _id: `${vendors.length + 1}` }; 
      const updatedVendors = [...vendors, newVendor];
      setVendors(updatedVendors);
      setFilteredVendors(updatedVendors);
      message.success('Vendor added successfully');
    }
    setIsVendorModalOpen(false);
  };

  const handleStatusChange = async (checked, _id) => {
    try {
      const status = checked ? 'Active' : 'Inactive';
      const response = await updateData(`/api/vendors/?id=${_id}`, { Status: status });

      if (response.ok) {
        const updatedVendors = vendors.map(vendor =>
          vendor._id === _id ? { ...vendor, Status: status } : vendor
        );
        setVendors(updatedVendors);
        setFilteredVendors(updatedVendors);
        message.success('Vendor status updated successfully');
      } else {
        message.error('Failed to update vendor status');
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
      message.error('An error occurred while updating vendor status');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = vendors.filter(vendor =>
      vendor.Vendor_Name.toLowerCase().includes(value)
    );
    setFilteredVendors(filtered);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      sortOrder: sorter.order || null,
      sortField: sorter.field || null,
    }));

    loadVendors(pagination.current, pagination.pageSize, searchText);
  };

  const vendorColumns = [
    {
      title: 'Vendor Name',
      dataIndex: 'Vendor_Name',
      key: 'vendor_name',
      sorter: (a, b) => a.Vendor_Name.localeCompare(b.Vendor_Name),
    },
    {
      title: 'Contact No',
      dataIndex: 'Contact_No',
      key: 'contact_no',
      render: (contact) => Array.isArray(contact) ? contact.join(', ') : contact,
    },
    {
      title: 'Alternate Contact No',
      dataIndex: 'Alternate_Contact_No',
      key: 'alternate_contact_no',
      render: (contact) => contact || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'status',
      render: (Status, record) => (
        <Switch
          checked={Status === 'Active'}
          onChange={(checked) => handleStatusChange(checked, record._id)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditFilled />}
            onClick={() => handleEditVendor(record)}
            style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteVendor(record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ backgroundColor: '#FAF3CC', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#6F4D27' }}>Vendors Management</h2>
      <div className="flex items-center mb-4 justify-between">
        <AntdInput
          placeholder="Search"
          style={{ width: 300, borderColor: '#D6872A' }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button
          type="primary"
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
          icon={<PlusOutlined />}
          onClick={handleAddVendor}
        >
          Add Vendor
        </Button>
      </div>

      <Table
        columns={vendorColumns}
        dataSource={filteredVendors}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <VendorsForm
        open={isVendorModalOpen}
        onCancel={() => setIsVendorModalOpen(false)}
        onSubmit={handleVendorFormSubmit}
        initialValues={editingVendor}
      />
    </div>
  );
};

export default VendorsManagement;
