"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Select, Input, Space, Tag } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    startDate: null,
    endDate: null,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const { status, startDate, endDate } = filters;
      const start = startDate ? `&startDate=${startDate}` : '';
      const end = endDate ? `&endDate=${endDate}` : '';
      const statusQuery = status && status !== 'All' ? `&status=${status}` : '';
      const response = await fetch(`/api/orders/get?page=${page}&limit=${limit}${statusQuery}${start}${end}`);
      const result = await response.json();

      if (result.success) {
        const mappedData = result.docs.map(order => ({
          key: order._id,
          orderID: order._id,
          date: new Date(order.createdAt || order.updatedAt).toLocaleString(),
          admin: "Admin",
          vendor: order?.vendor || 'N/A',
          amount: order.total,
          contact: order?.user_details?.mobile || 'N/A',
          details: `${order?.subTotal || 0} (₹)`,
          deliveryDetails: {
            name: order?.user_details?.name || 'N/A',
            mobile: order?.user_details?.mobile || 'N/A',
            train: order?.user_details?.pnr || 'N/A',
            pnr: order?.user_details?.pnr || 'N/A',
            deliveryTime: "TBD",
            station: order?.stationDetails?.stationName || 'TBD',
          },
          status: order?.status || 'Pending',
          paymentStatus: order?.payment?.payment_status || 'N/A',
          paymentMethod: order?.payment?.payment_method || 'N/A',
        }));

        setDataSource(mappedData);
        setTotalPages(result.totalPages);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [filters, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      render: (text, record) => (
        <>
          <p>{`(${record.date})`}</p>
          <p>{text}</p>
          <p>({record.admin})</p>
        </>
      ),
    },
    {
      title: 'Order Details',
      dataIndex: 'vendor',
      key: 'vendor',
      render: (text, record) => (
        <div>
          <p>Vendor: {text}</p>
          <p>Contact: {record.contact}</p>
          <p>{record.details}</p>
        </div>
      ),
    },
    {
      title: 'Delivery Details',
      dataIndex: 'deliveryDetails',
      key: 'deliveryDetails',
      render: (details) => (
        <div>
          <p>Name: {details.name}</p>
          <p>Mobile: {details.mobile}</p>
          <p>Train No: {details.train}</p>
          <p>PNR: {details.pnr}</p>
          <p>Delivery: {details.deliveryTime}</p>
          <p>Station: {details.station}</p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span>{`₹ ${amount}`}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Space>
          <Tag color={status === 'pending' ? 'orange' : 'green'}>{status}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text, record) => (
        <Space>
          <Tag color="blue">{record.paymentStatus}</Tag>
          <Tag color="purple">{record.paymentMethod}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-table">
      <div className="filters flex justify-between mb-4">
        <div className="flex space-x-4">
          <RangePicker
            onChange={(dates) => {
              setFilters({
                ...filters,
                startDate: dates?.[0]?.format('YYYY-MM-DD') || null,
                endDate: dates?.[1]?.format('YYYY-MM-DD') || null,
              });
            }}
          />
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 140 }}
          >
            <Option value="All">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
          </Select>
          <Input placeholder="Search" disabled /> 
        </div>
        <div className="flex space-x-2">
          <Button type="primary" icon={<PlusOutlined />} className="bg-brown">
            Add New Orders
          </Button>
          <Button icon={<DownloadOutlined />}>Download</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: currentPage,
          total: totalPages * 10, // assuming 10 per page
          onChange: handlePageChange,
          pageSize: 10,
        }}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.details}</p>,
        }}
      />
    </div>
  );
};

export default OrdersTable;
