'use client';
import React from 'react';
import { Form, Input, Button, Typography, Divider, App } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

const ContactUsPage = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.865751258791!2d-74.0059740846814!3d40.71277597933168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1ffdb26f47%3A0x3a69f9de2fa2cfb1!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1631874711768!5m2!1sen!2sin";

  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/contact?slug=ContactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values, 
          slug: 'ContactUs' 
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      message.success('Your message has been sent successfully!');
      form.resetFields();
    } catch (error) {
      // message.error('Failed to send your message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative md:h-60 h-40 mb-4">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold">Contact Us</h1>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="flex flex-col items-center py-8">
        <Title level={3} style={{ color: '#704D25', fontWeight: 'bold' }} className="text-xl mb-4">
          Company Contact Details
        </Title>
        <div className="text-center">
          <p className="text-sm"><strong>Phone:</strong> +123 456 7890</p>
          <p className="text-sm"><strong>Email:</strong> contact@company.com</p>
          <p className="text-sm"><strong>Address:</strong> 123 Business Rd, Business City, BC 12345</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center py-4 px-2 shadow-lg">
        <div className="max-w-md w-full bg-white p-4 rounded-lg ">
          <Title style={{ color: '#704D25' }} level={2} className="text-3xl font-semibold mb-6 text-center">
            Get in Touch
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            validateMessages={{
              required: '${label} is required!',
              types: {
                email: '${label} is not a valid email!',
              }
            }}
          >
            <Form.Item
              label="Name"
              name="Name"
              rules={[{ required: true, min: 2, message: 'Please input your name!' }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            
            <Form.Item
              label="Contact Number"
              name="ContactNumber"
              rules={[{ required: true, message: 'Please input your contact number!' }]}
            >
              <Input placeholder="Your Contact Number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Your Email" type="email" />
            </Form.Item>
            
            <Form.Item
              label="Message"
              name="Message"
              rules={[{ required: true, message: 'Please input your message!' }]}
            >
              <TextArea placeholder="Your Message" rows={4} />
            </Form.Item>

            <Form.Item>
              <div className="text-center">
                <Button type="primary" className="order-btn" htmlType="submit">
                  Send Message
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* Map Section */}
      <Divider className="m-0" />
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-4xl p-2">
          <Title level={3} style={{ color: '#704D25' }} className="text-2xl font-semibold mb-4 text-center">
            Our Location
          </Title>
          <iframe
            title="Company Location"
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;