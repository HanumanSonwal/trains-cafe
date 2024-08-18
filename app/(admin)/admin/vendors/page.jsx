"use client";
import { useState } from 'react';
import { Table, Button, Input as AntdInput, message, Switch } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteFilled, EditFilled, FileAddOutlined } from '@ant-design/icons';
import VendorsForm from './VendorsForm';
import GenerateInvoice from './GenerateInvoice';

const initialVendors = [
  { key: '1', name: 'Eat Repeat', vendorId: '45', contact: ['9988196160', '9877746540', '7982718282'], stations: 'PTKC', foodType: 'Veg & Non-veg', status: '1' },
  { key: '2', name: 'Lasya Catering services', vendorId: '44', contact: ['8341346809', '9704967930', '824578502'], stations: 'GY', foodType: 'Veg & Non-veg', status: '0' },
  { key: '3', name: 'Neelam food centre', vendorId: '43', contact: ['8975998876'], stations: 'MMR', foodType: 'Veg & Non-veg', status: '0' },
  { key: '4', name: 'Apki apni rasoi', vendorId: '42', contact: ['9999492052', '9813981109', '7404749495'], stations: 'GGN', foodType: 'Veg', status: '1' },
  { key: '5', name: 'Welcome Restro', vendorId: '41', contact: ['9096261626', '9175777121'], stations: 'SUR', foodType: 'Veg & Non-veg', status: '0' },
  { key: '6', name: 'Shukla Kitchen', vendorId: '40', contact: ['9098273635'], stations: 'NAD', foodType: 'Veg', status: '1' },
  { key: '7', name: 'jai ambey fast food', vendorId: '39', contact: ['9925305986'], stations: 'MSH', foodType: 'Veg', status: '0' },
  { key: '8', name: 'jai hind restaurant', vendorId: '38', contact: ['9414002738', '9251407011'], stations: 'AII', foodType: 'Veg', status: '1' },
  { key: '9', name: 'Ms Gauri Hotel', vendorId: '37', contact: ['9921289518', '7385105518'], stations: 'KWV', foodType: 'Veg', status: '0' },
  { key: '10', name: 'Ms Gauri Hotel', vendorId: '36', contact: ['9921289518'], stations: 'PUNE', foodType: 'Veg & Non-veg', status: '1' },
];

const VendorsManagement = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [filteredVendors, setFilteredVendors] = useState(initialVendors);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (record) => {
    setEditingVendor(record);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = (key) => {
    setVendors(vendors.filter(vendor => vendor.key !== key));
    setFilteredVendors(filteredVendors.filter(vendor => vendor.key !== key));
    message.success('Vendor deleted successfully');
  };

  const handleVendorFormSubmit = (values) => {
    if (editingVendor) {
      setVendors(vendors.map(vendor => vendor.key === editingVendor.key ? { ...values, key: editingVendor.key } : vendor));
      setFilteredVendors(filteredVendors.map(vendor => vendor.key === editingVendor.key ? { ...values, key: editingVendor.key } : vendor));
      message.success('Vendor updated successfully');
    } else {
      const newVendor = { ...values, key: `${vendors.length + 1}` };
      setVendors([...vendors, newVendor]);
      setFilteredVendors([...filteredVendors, newVendor]);
      message.success('Vendor added successfully');
    }
    setIsVendorModalOpen(false);
  };

  const handleGenerateInvoice = (vendor) => {
    setEditingVendor(vendor);
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = (invoice) => {
    message.success('Invoice generated successfully');
    setIsInvoiceModalOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = vendors.filter(vendor =>
      Object.values(vendor).some(val => Array.isArray(val) ? val.some(item => item.toLowerCase().includes(value.toLowerCase())) : val.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredVendors(filtered);
  };

  const handleStatusChange = (checked, key) => {
    setVendors(vendors.map(vendor => vendor.key === key ? { ...vendor, status: checked ? '1' : '0' } : vendor));
    setFilteredVendors(filteredVendors.map(vendor => vendor.key === key ? { ...vendor, status: checked ? '1' : '0' } : vendor));
    message.success('Vendor status updated successfully');
  };

  const vendorColumns = [
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Vendor Id',
      dataIndex: 'vendorId',
      key: 'vendorId',
    },
    {
      title: 'Contact No',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact) => Array.isArray(contact) ? contact.join(', ') : contact,
    },
    {
      title: 'Station(s)',
      dataIndex: 'stations',
      key: 'stations',
    },
    {
      title: 'Food Type',
      dataIndex: 'foodType',
      key: 'foodType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === '1'}
          onChange={(checked) => handleStatusChange(checked, record.key)}
          className={status === '1' ? 'ant-switch-checked' : 'ant-switch'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="flex space-x-2">
          <EditFilled style={{ color: "#D6872A", fontSize: "22px" }} onClick={() => handleEditVendor(record)} />
          <DeleteFilled style={{ color: "#6F4D27", fontSize: "22px" }} onClick={() => handleDeleteVendor(record.key)} />
          {/* <FileAddOutlined style={{ color: "#6F4D27", fontSize: "22px" }} onClick={() => handleGenerateInvoice(record)} /> */}
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
          style={{ width: 200, borderColor: '#D6872A' }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button type="primary" style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }} icon={<PlusOutlined />} onClick={handleAddVendor}>
          Add Vendor
        </Button>
      </div>

      <Table
        columns={vendorColumns}
        dataSource={filteredVendors}
        pagination={{ pageSize: 10 }}
      />

      <VendorsForm
        open={isVendorModalOpen}
        onCancel={() => setIsVendorModalOpen(false)}
        onSubmit={handleVendorFormSubmit}
        initialValues={editingVendor}
      />

      <GenerateInvoice
        visible={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </div>
  );
};

export default VendorsManagement;
