import React from 'react';
import { Card, Button, Divider } from 'antd';
import { CheckCircleFilled, DownloadOutlined, ShoppingOutlined } from '@ant-design/icons';

const OrderConfirmation = ({ orderData }) => {
  // Format date for display
  const formatDate = (date) => {
    return new Date().toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[575px] mx-auto p-4 sm:p-6">
        {/* Success Header */}
        <div className="text-center mb-6">
          <CheckCircleFilled className="text-4xl text-green-500 mb-3" />
          <h1 className="text-xl sm:text-2xl font-semibold text-rose-700">
            Thank you for your order!
          </h1>
        </div>

        {/* Order Info Card */}
        <Card className="mb-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-sm">
              <div className="text-gray-500">Date of order:</div>
              <div>{formatDate(new Date())}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Order ID:</div>
              <div className="break-all">{orderData._id}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Payment Method:</div>
              <div>{orderData.payment.payment_method}</div>
            </div>
          </div>
        </Card>

        {/* Customer Details Card */}
        <Card className="mb-4 shadow-sm" title="Customer Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name: </span>
                {orderData.user_details.name}
              </div>
              <div>
                <span className="text-gray-500">Mobile: </span>
                {orderData.user_details.mobile}
              </div>
              <div>
                <span className="text-gray-500">Email: </span>
                {orderData.user_details.email}
              </div>
              <div>
                <span className="text-gray-500">Alt. Mobile: </span>
                {orderData.user_details.alternateMobile}
              </div>
            </div>
            <Divider className="sm:hidden my-2" />
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">PNR: </span>
                {orderData.user_details.pnr}
              </div>
              <div>
                <span className="text-gray-500">Coach: </span>
                {orderData.user_details.coach}
              </div>
              <div>
                <span className="text-gray-500">Seat No: </span>
                {orderData.user_details.seatNo}
              </div>
              {orderData.user_details.instructions && (
                <div>
                  <span className="text-gray-500">Instructions: </span>
                  {orderData.user_details.instructions}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Order Summary Card */}
        <Card className="mb-6 shadow-sm" title="Order Summary">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{orderData.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span>₹{orderData.payment.tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Coupon Discount</span>
              <span>-₹{orderData.couponAmount}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between font-medium text-base">
              <span>Total</span>
              <span>₹{orderData.total}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            icon={<DownloadOutlined />}
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            Download Invoice
          </Button>
          <Button 
            type="primary"
            icon={<ShoppingOutlined />}
            className="w-full sm:w-auto bg-rose-700 hover:bg-rose-800"
            onClick={() => window.location.href = '/'}
          >
            GO Back To Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;