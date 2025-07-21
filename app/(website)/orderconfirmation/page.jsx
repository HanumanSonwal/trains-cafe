"use client"

import React, { useEffect, useState } from 'react';
import { Card, Button, Spin, Typography, Divider } from 'antd';
import { CheckCircleFilled, DownloadOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
 


const { Title, Text } = Typography;

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  console.log( orderData ,"orderData")


  useEffect(() => {
    const data = localStorage.getItem("orderData");
    if (data) {
      setOrderData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const handleDownload = () => {
    const invoiceContent = `
Order Confirmation
-----------------
Date: ${new Date().toLocaleDateString()}
Order ID: ${orderData?._id}
Station ID: ${orderData?.station}

User Details:
Name: ${orderData?.user_details?.name}
Mobile: ${orderData?.user_details?.mobile}
Email: ${orderData?.user_details?.email}
PNR No.: ${orderData?.user_details?.pnr}
Coach: ${orderData?.user_details?.pnr}
Seat No: ${orderData?.user_details?.seatNo}

Payment Details:
Subtotal: ₹${orderData?.subTotal}
Discount: ₹${orderData?.couponAmount}
Tax: ₹${orderData?.payment?.tax}
Total: ₹${orderData?.total}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderData?._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        No order data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-4">
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <Card className="shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-center mb-2 sm:mb-3">
              <CheckCircleFilled className="text-3xl sm:text-3xl text-[#704d25] animate-bounce" />
            </div>
            <Title level={2} className="!mb-0 !text-xl sm:!text-xl">
              Thank you for your order!
            </Title>
          </div>

          {/* Order Details Section */}
          <Card className="mb-4 sm:mb-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Text type="secondary" className="text-sm">Date of Order</Text>
                <div className="font-medium text-sm ">{new Date().toLocaleDateString()}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Order ID</Text>
                <div className="font-medium text-sm  break-all">{orderData._id}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Station ID</Text>
                <div className="font-medium text-sm ">{orderData.station}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Payment Method</Text>
                <div className="font-medium text-sm ">{orderData.payment.payment_method}</div>
              </div>
            </div>
          </Card>

          {/* User Details Section */}
          <Card className="mb-4 sm:mb-6 bg-gray-50">
            <Title level={4} className="!text-lg sm:!text-xl mb-3 sm:mb-4">User Details</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Name</Text>
                <div className="font-medium text-sm ">{orderData.user_details.name}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Email</Text>
                <div className="font-medium text-sm  break-all">{orderData.user_details.email}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Mobile</Text>
                <div className="font-medium text-sm ">{orderData.user_details.mobile}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">PNR No.</Text>
                <div className="font-medium text-sm ">{orderData.user_details.pnr}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Coach</Text>
                <div className="font-medium text-sm ">{orderData.user_details.pnr}</div>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="text-sm ">Seat No</Text>
                <div className="font-medium text-sm ">{orderData.user_details.seatNo}</div>
              </div>
            </div>
          </Card>

          {/* Payment Summary Section */}
   <Card className="mb-4 sm:mb-6 bg-gray-50">
  <Title level={4} className="!text-lg sm:!text-xl mb-3 sm:mb-4">Payment Summary</Title>
  <div className="space-y-2 sm:space-y-3">
    <div className="flex justify-between text-sm ">
      <Text>Subtotal</Text>
      <Text>₹{Number(orderData.subTotal).toFixed(2)}</Text>
    </div>
    <div className="flex justify-between text-sm ">
      <Text>Coupon Discount</Text>
      <Text className="text-green-600">-₹{Number(orderData.couponAmount).toFixed(2)}</Text>
    </div>
    <div className="flex justify-between text-sm ">
      <Text>Tax</Text>
      <Text>₹{Number(orderData.payment.tax).toFixed(2)}</Text>
    </div>
    <Divider className="my-2 sm:my-3" />
    <div className="flex justify-between text-sm ">
      <Text strong>Total</Text>
      <Text strong>₹{Number(orderData.total).toFixed(2)}</Text>
    </div>
  </div>
</Card>

          {/* Action Buttons */}
          <div className="flex flex-col mt-2 sm:flex-row gap-3 sm:gap-4">
            <Button 
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="flex-1 order-btn text-sm "
            >
              Download Invoice
            </Button>
            
            <Button
              icon={<ShoppingOutlined />}
              onClick={() => router.push('/')}
              className="flex-1 common-btn-outline text-sm"
            >
              Go Back to Shopping
            </Button>
          </div>
        </Card>
      </div>

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;