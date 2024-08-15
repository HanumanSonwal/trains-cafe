"use client";
import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const initialVendors = [
  { key: '1', name: 'Eat Repeat', id: '45', contact: '9988196160, 9877746540, 7982718282', station: '(PTKC) Pathankot Cantt', foodType: 'Veg & Non-veg', status: '' },
  { key: '2', name: 'Lasya Catering services', id: '44', contact: '8341346809, 9704967930, 824578502', station: '(GY) Gooty', foodType: 'Veg & Non-veg', status: '' },
  { key: '3', name: 'Neelam food centre', id: '43', contact: '8975998876', station: '(MMR) Manmad Junction', foodType: 'Veg & Non-veg', status: '' },
  { key: '4', name: 'Apki apni rasoi', id: '42', contact: '9999492052, 9813981109, 7404749495', station: '(GGN) Gurgaon', foodType: 'Veg', status: '' },
  { key: '5', name: 'Welcome Restro', id: '41', contact: '9096261626 , 9175777121', station: '(SUR) Solapur Junction', foodType: 'Veg & Non-veg', status: '' },
  { key: '6', name: 'Shukla Kitchen', id: '40', contact: '9098273635', station: '(NAD) Nagda Junction', foodType: 'Veg', status: '' },
  { key: '7', name: 'jai ambey fast food', id: '39', contact: '9925305986', station: '(MSH) Mahesana Junction', foodType: 'Veg', status: '' },
  { key: '8', name: 'jai hind restaurant', id: '38', contact: '94140 02738, 92514 07011', station: '(AII) Ajmer Junction', foodType: 'Veg', status: '' },
  { key: '9', name: 'Ms Gauri Hotel', id: '37', contact: '9921289518 , 7385105518', station: '(KWV) Kurduvadi', foodType: 'Veg', status: '' },
  { key: '10', name: 'Ms Gauri Hotel', id: '36', contact: '9921289518', station: '(PUNE) Pune Junction', foodType: 'Veg & Non-veg', status: '' },
];

const VendorsManagement = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [filteredVendors, setFilteredVendors] = useState(initialVendors);
  const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [vendorForm] = Form.useForm();
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleAddVendor = () => {
    vendorForm.resetFields();
    setEditingVendor(null);
    setIsVendorModalVisible(true);
  };

  const handleEditVendor = (record) => {
    vendorForm.setFieldsValue(record);
    setEditingVendor(record);
    setIsVendorModalVisible(true);
  };

  const handleDeleteVendor = (key) => {
    setVendors(vendors.filter(vendor => vendor.key !== key));
    message.success('Vendor deleted successfully');
  };

  const handleVendorOk = () => {
    vendorForm.validateFields().then(values => {
      if (editingVendor) {
        setVendors(vendors.map(vendor => vendor.key === editingVendor.key ? { ...values, key: editingVendor.key } : vendor));
        message.success('Vendor updated successfully');
      } else {
        const newVendor = { ...values, key: `${vendors.length + 1}` };
        setVendors([...vendors, newVendor]);
        message.success('Vendor added successfully');
      }
      setIsVendorModalVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = vendors.filter(vendor =>
      Object.values(vendor).some(val => val.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredVendors(filtered);
  };

  const handleResetSearch = () => {
    setSearchText('');
    setFilteredVendors(initialVendors); 
  };

  const columns = [
    {
      title: 'Vendor Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vendor Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Contact No',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Station(s)',
      dataIndex: 'station',
      key: 'station',
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
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button type="primary" onClick={() => handleEditVendor(record)} style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}>Edit</Button>
          <Button type="danger" onClick={() => handleDeleteVendor(record.key)} style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Vendors Management</h2>
      <div className="flex items-center mb-4 justify-between">
        <Input
          placeholder="Search Vendors"
          style={{ width: 300, backgroundColor: '#FAF3CC', borderColor: '#6F4D27' }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVendor} style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}>
          Add Vendor
        </Button>
    
      </div>
      <Table columns={columns} dataSource={filteredVendors} />

      <Modal title={editingVendor ? "Edit Vendor" : "Add Vendor"} visible={isVendorModalVisible} onOk={handleVendorOk} onCancel={() => setIsVendorModalVisible(false)}>
        <Form form={vendorForm} layout="vertical">
          <Form.Item name="name" label="Vendor Name" rules={[{ required: true, message: 'Please enter the vendor name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="id" label="Vendor ID" rules={[{ required: true, message: 'Please enter the vendor ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="Contact No" rules={[{ required: true, message: 'Please enter the contact number' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="station" label="Station(s)" rules={[{ required: true, message: 'Please enter the station(s)' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="foodType" label="Food Type" rules={[{ required: true, message: 'Please enter the food type' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please enter the status' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorsManagement;
