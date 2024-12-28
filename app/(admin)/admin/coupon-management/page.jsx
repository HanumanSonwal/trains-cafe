"use client";
import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Switch,
  Popconfirm,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import CouponsForm from './CouponsForm';
import axios from 'axios';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
        const response = await axios.get(
            `/api/coupon?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}`
        );

        console.log(response.data.docs, "response");
        const { docs, totalDocs } = response.data; 
        setCoupons(docs);
        setFilteredCoupons(docs);
        setPagination((prev) => ({
            ...prev,
            total: totalDocs, 
        }));
    } catch (error) {
        console.error('Failed to fetch coupons:', error);
        message.error('Failed to fetch coupons');
    } finally {
        setLoading(false);
    }
};


  const handleAdd = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCoupon(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupon/delete/${id}`);
      message.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      message.error('Failed to delete coupon');
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = coupons.filter((coupon) =>
      coupon.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCoupons(filtered);
  };

  const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date) => new Date(date).toLocaleDateString(), 
    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (date) => new Date(date).toLocaleDateString(), 
    },
    {
        title: 'Discount',
        dataIndex: 'discount', 
        key: 'discount',
        render: (discount) => `${discount.value}%`, 
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
            <Switch
                checked={record.status === 'published'}
                onChange={async (checked) => {
                    try {
                        await axios.put(`/api/coupon/update/${record._id}`, {
                            status: checked ? 'published' : 'draft',
                        });
                        message.success(`Coupon ${checked ? 'published' : 'drafted'}`);
                        fetchCoupons();
                    } catch (error) {
                        console.error('Failed to update status:', error);
                        message.error('Failed to update status');
                    }
                }}
            />
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <div className="flex space-x-2">
                <Button
                    type="primary"
                    icon={<EditFilled />}
                    onClick={() => handleEdit(record)}
                />
                <Popconfirm
                    title="Are you sure to delete this coupon?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteFilled />} />
                </Popconfirm>
            </div>
        ),
    },
];
const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <>
      <div
        className="p-4"
        style={{
          backgroundColor: "#FAF3CC",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >

<h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
          Coupen Management
        </h2>
        <div className="flex items-center my-5 justify-between">
          <div style={{ display: "flex", alignItems: "center" }}>
        
        <AntdInput
          placeholder="Search by title"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
         </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          Add Coupon
        </Button>

        </div>
        <Spin spinning={loading} color="#D6872A" indicator={antIcon}>
        <Table
          columns={columns}
          dataSource={filteredCoupons}
          rowKey="_id"
          pagination={pagination}
          onChange={(pagination) =>
            setPagination({ ...pagination, current: pagination.current })
          }
        />
      </Spin>

      <CouponsForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialValues={editingCoupon}
        fetchCoupons={fetchCoupons}
      />
            </div>
    </>
  );
};

export default CouponManagement;
