"use client";

import { Table, Input, Button, message, Modal } from 'antd';
import { useState, useEffect } from 'react';

const { Search } = Input;

export default function BulkOrderDetails() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchBulkOrders();
  }, [currentPage, pageSize, searchText]);

  const fetchBulkOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/contact?slug=BulkOrder`
      );

      const data = await response.json();

      if (data.success) {
        setBulkOrders(data.data);
        setTotalOrders(data.data.length);
      } else {
        message.error('Failed to fetch bulk orders');
      }
    } catch (error) {
      console.error('Error fetching bulk orders:', error);
      message.error('Error fetching bulk orders');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  const handleReadMore = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const filteredOrders = bulkOrders.filter(order => 
    searchText ? order.Name.toLowerCase().includes(searchText.toLowerCase()) : true
  );

  const columns = [
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Contact Number',
      dataIndex: 'ContactNumber',
      key: 'ContactNumber',
    },
    {
      title: 'Email Address',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'Message',
      render: (text, record) => (
        <div>
          {text.split(' ').slice(0, 5).join(' ') + (text.split(' ').length > 5 ? '...' : '')}
          {text.split(' ').length > 5 && (
            <Button style={{ color: '#D6872A', textDecoration: 'underline' }} type="link" onClick={() => handleReadMore(record)}>
              Read More
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center my-5">
        <Search
          placeholder="Search by name"
          onSearch={(value) => {
            setSearchText(value);
            setCurrentPage(1); 
          }}
          style={{ width: 200 }}
          allowClear
          onClear={() => setCurrentPage(1)} // Reset to first page when input is cleared
        />
        <Button
          type="primary"
          onClick={fetchBulkOrders}
          className="bg-brown-600 text-white"
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders} // Use filtered orders instead of bulkOrders
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredOrders.length, // Update total to filtered length
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        rowKey="_id"
        loading={loading}
      />

      {selectedOrder && (
        <Modal
          title="Order Details"
          visible={modalVisible}
          onCancel={handleCloseModal}
          footer={null}
        >
          <h3>Name : {selectedOrder.Name}</h3>
          <p>Contact Number : {selectedOrder.ContactNumber}</p>
          <p>Email : {selectedOrder.Email}</p>
          <p>Message : {selectedOrder.Message}</p>
        </Modal>
      )}
    </div>
  );
}
