"use client";
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SendOutlined, UserOutlined, PhoneOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const BulkOrderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/contact?slug=BulkOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: 'BulkOrder'  // Use the `slug` field to indicate it's a BulkOrder
        })
      });

      const data = await response.json();

      if (data.success) {
        message.success('Thank you! Your bulk order request has been sent successfully.');
        form.resetFields();
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-[575px] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-xl font-bold text-gray-800 mb-2">
              Drop Us A Message For Bulk Order
            </h1>
            <p className="text-gray-600">
              We'll get back to you with the best bulk order options
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
            requiredMark={false}
          >
            <Form.Item
              name="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Your Name"
                size="large"
                className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
              />
            </Form.Item>

            <Form.Item
              name="ContactNumber"
              rules={[
                { required: true, message: 'Please enter your contact number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Contact Number"
                size="large"
                className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
                maxLength={10}
              />
            </Form.Item>

            <Form.Item
              name="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email Address"
                size="large"
                className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
              />
            </Form.Item>

            <Form.Item
              name="Message"
              rules={[
                { required: true, message: 'Please enter your message' },
                { min: 10, message: 'Message must be at least 10 characters' }
              ]}
            >
              <TextArea
                placeholder="Tell us about your bulk order requirements..."
                size="large"
                rows={4}
                className="rounded-lg resize-none hover:border-cyan-500 focus:border-cyan-500 mb-2"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={loading}
                className="w-full h-12 order-btn text-base transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? 'Sending...' : 'Submit'}
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="mt-6 text-center text-white">
          <p className="text-sm">
            Need immediate assistance? Call us at: <br />
            <span className="font-semibold hover:underline cursor-pointer">
              +91 1234567890
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;
