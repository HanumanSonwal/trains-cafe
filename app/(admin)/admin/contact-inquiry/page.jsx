"use client";

import { Table, Input, Button, message, Modal, Dropdown, Menu, Spin, Popconfirm } from 'antd';
import { SearchOutlined, CloseCircleOutlined, DownOutlined, LoadingOutlined, DeleteFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';

export default function BulkOrderDetails() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [displayText, setDisplayText] = useState('All');

  useEffect(() => {
    fetchBulkOrders();
  }, [currentPage, pageSize, searchText, selectedSlug]);

  const fetchBulkOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact?slug=${selectedSlug}`);
      const data = await response.json();

      if (data.success) {
        setBulkOrders(data.data);
        setTotalOrders(data.data.length);
      } else {
        message.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Error fetching orders');
    }
    setLoading(false);
  };

  const handleDelete = async (slug, id) => {
    console.log(id,"hhhhhhhhkkkk")
    setLoading(true);
    try {
      const response = await fetch(`/api/contact?slug=${slug}&id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        message.success('Order deleted successfully');
        fetchBulkOrders(); // Refresh orders after deletion
      } else {
        message.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Error deleting order');
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const handleMenuClick = (e) => {
    setSelectedSlug(e.key);
    setDisplayText(e.key === "" ? "All" : e.key);
    setCurrentPage(1); 
  };

  const filteredOrders = bulkOrders.filter((order) =>
    searchText ? order.Name.toLowerCase().includes(searchText.toLowerCase()) : true
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  const columns = [
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
    },
    {
      title: 'Category',
      dataIndex: 'slug',
      key: 'slug',
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
            <Button
              style={{ color: '#D6872A', textDecoration: 'underline' }}
              type="link"
              onClick={() => handleReadMore(record)}
            >
              Read More
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete( record.slug , record._id)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="">All</Menu.Item>
      <Menu.Item key="Hotel">Hotel</Menu.Item>
      <Menu.Item key="Coolie">Coolie</Menu.Item>
      <Menu.Item key="BulkOrder">BulkOrder</Menu.Item>
      <Menu.Item key="ContactUs">ContactUs</Menu.Item>
    </Menu>
  );

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
      Contact-Inquiry Management
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

        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            type="primary"
            style={{ backgroundColor: '#D6872A', borderColor: '#D6872A'  ,width:"150px"}}
          >
            {displayText} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <Spin spinning={loading} color="#D6872A" indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalOrders,
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
