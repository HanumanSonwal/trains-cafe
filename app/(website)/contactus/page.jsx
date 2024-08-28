'use client'
import React from 'react';
import { Form, Input, Button, Typography, Divider } from 'antd';

const { Title } = Typography;

const ContactUsPage = () => {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.865751258791!2d-74.0059740846814!3d40.71277597933168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1ffdb26f47%3A0x3a69f9de2fa2cfb1!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1631874711768!5m2!1sen!2sin"; // Replace with your map link

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


      {/* Form Section */}
      <div className="flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white p-4 rounded-lg shadow-lg">
          <Title level={2} className="text-3xl font-semibold mb-6 text-center">Get in Touch</Title>
          <Form
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
            >
              <Input placeholder="Your Email" type="email" />
            </Form.Item>
            
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: 'Please input your message!' }]}
            >
              <Input.TextArea placeholder="Your Message" rows={4} />
            </Form.Item>

            <Form.Item>
              <div className="text-center">
                <Button type="btn" className='order-btn' htmlType="submit">Send Message</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="flex flex-col items-center py-8">
        <Title level={3} className="text-xl font-semibold mb-4">Company Contact Details</Title>
        <div className="text-center">
          <p className='text-sm'><strong>Phone:</strong> +123 456 7890</p>
          <p className='text-sm'><strong>Email:</strong> contact@company.com</p>
          <p className='text-sm'><strong>Address:</strong> 123 Business Rd, Business City, BC 12345</p>
        </div>
      </div>

      {/* Map Section */}
      <Divider className='m-0' />
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl">
          <Title level={3} className="text-2xl font-semibold mb-4 text-center">Our Location</Title>
          <iframe
            title="Company Location"
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
