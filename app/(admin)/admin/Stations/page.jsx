"use client";
import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Input as AntdInput } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const initialStations = [
    { key: '1', name: 'Aligarh Junction', code: 'ALJN', location: 'Aligarh', address: 'Aligarh Junction, Aligarh, Uttar Pradesh, India' },
    { key: '2', name: 'Prayagraj Chheoki', code: 'PCOI', location: 'Prayagraj', address: 'Naini Gaon, Naini, Chak Imam Ali, Uttar Pradesh 211008' },
    { key: '3', name: 'Zawar', code: 'ZW', location: 'Zawar', address: '' },
    { key: '4', name: 'Zarap', code: 'ZARP', location: 'Zarap', address: '' },
    { key: '5', name: 'Zangalapalle', code: 'ZPL', location: 'Zangalapalle', address: '' },
    { key: '6', name: 'Zampini', code: 'ZPI', location: 'Zampini', address: '' },
    { key: '7', name: 'Zamania', code: 'ZNA', location: 'Zamania', address: '' },
    { key: '8', name: 'Zahirabad', code: 'ZB', location: 'Zahirabad', address: '' },
    { key: '9', name: 'Zafarabad Junction', code: 'ZBD', location: 'Zafarabad Junction', address: '' },
    { key: '10', name: 'Yusufpur', code: 'YFP', location: 'Yusufpur', address: '' },
    { key: '11', name: 'Yevat', code: 'YT', location: 'Yevat', address: '' }
  ];
  

const StationManagement = () => {
  const [stations, setStations] = useState(initialStations);
  const [filteredStations, setFilteredStations] = useState(initialStations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleAdd = () => {
    form.resetFields();
    setEditingStation(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingStation(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setStations(stations.filter(station => station.key !== key));
    setFilteredStations(filteredStations.filter(station => station.key !== key));
    message.success('Station deleted successfully');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingStation) {
        setStations(stations.map(station => station.key === editingStation.key ? { ...values, key: editingStation.key } : station));
        setFilteredStations(filteredStations.map(station => station.key === editingStation.key ? { ...values, key: editingStation.key } : station));
        message.success('Station updated successfully');
      } else {
        const newStation = { ...values, key: `${stations.length + 1}` };
        setStations([...stations, newStation]);
        setFilteredStations([...filteredStations, newStation]);
        message.success('Station added successfully');
      }
      setIsModalVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = stations.filter(station =>
      Object.values(station).some(val => val.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredStations(filtered);
  };

  const columns = [
    {
      title: 'Station Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: 'ascend',
    },
    {
      title: 'Station Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }} type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button style={{ backgroundColor: '#6F4D27', borderColor: '#D6872A' }} type="primary" onClick={() => handleDelete(record.key)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ backgroundColor: '#FAF3CC', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#6F4D27' }}>Station Management</h2>
      <div className="flex items-center mb-4 justify-between">
        <AntdInput
          placeholder="Search"
          style={{ width: 200, borderColor: '#D6872A' }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button type="primary" style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }} icon={<PlusOutlined />} onClick={handleAdd}>
          Add Station
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredStations} />

      <Modal title={editingStation ? "Edit Station" : "Add Station"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Station Name" rules={[{ required: true, message: 'Please enter the station name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Station Code" rules={[{ required: true, message: 'Please enter the station code' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter the location' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter the address' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement;
