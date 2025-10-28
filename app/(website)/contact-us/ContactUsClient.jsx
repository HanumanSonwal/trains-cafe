"use client";

import React from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import InfoSection from "@/app/componants/InfoSection";
import Link from "next/link";

const { Title } = Typography;
const { TextArea } = Input;

const ContactUsClient = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await fetch("/api/contact?slug=ContactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slug: "ContactUs" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error();

      message.success(data.message || "Message sent successfully!");
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Failed to send your message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-40 md:h-60 mb-4">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="food delivery in train"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">Contact Us</h1>
        </div>
      </div>

      <div className="flex flex-col items-center py-4 px-3">
        <div className="p-5 text-center max-w-2xl">
          <h2
            style={{ color: "#704D25", fontWeight: "bold" }}
            className="text-xl mb-4"
          >
            Contact Us - We’re Here to Help
          </h2>
          <p>
            At <b>Trainscafe</b>, your satisfaction is our priority. Whether you
            have questions about your order, want to know more about our
            services, or need help with group bookings — we’re just a call,
            message, or email away. Our support team is available 24×7 to help
            you enjoy a smooth train food delivery experience.
          </p>
        </div>

        <h3
          style={{ color: "#704D25", fontWeight: "bold" }}
          className="text-xl mb-2"
        >
          📞 Customer Support
        </h3>
        <div className="text-center mb-4 p-4">
          <p>
            <strong>Call Us:</strong>{" "}
            <Link
              href="tel:+918696963496"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              +91-8696963496
            </Link>{" "}
            (Available from 7 AM to 10 PM)
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <Link
              href="mailto:support@trainscafe.in"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              support@trainscafe.in
            </Link>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            <Link
              href="https://maps.app.goo.gl/hY9eo2kAij9PPqzi6"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              8, Paschim Vihar, D, Bhakrota, Jaipur, Rajasthan 302026
            </Link>
          </p>
        </div>

        <div className="text-center p-4">
          <h3
            style={{ color: "#704D25", fontWeight: "bold" }}
            className="text-xl mb-2"
          >
            Business / Partner Inquiries
          </h3>
          <p>
            Want to partner or become a vendor on trains? Write to us at:{" "}
            <Link
              href="mailto:info@trainscafe.in"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              info@trainscafe.in
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-6 px-3 shadow-lg bg-gray-50">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
          <Title
            style={{ color: "#704D25" }}
            level={2}
            className="text-3xl font-semibold mb-6 text-center"
          >
            Get in Touch
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            validateMessages={{
              required: "${label} is required!",
              types: { email: "${label} is not a valid email!" },
            }}
          >
            <Form.Item
              label="Name"
              name="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="ContactNumber"
              rules={[
                { required: true, message: "Please input your contact number!" },
              ]}
            >
              <Input placeholder="Your Contact Number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Your Email" />
            </Form.Item>

            <Form.Item
              label="Message"
              name="Message"
              rules={[{ required: true, message: "Please input your message!" }]}
            >
              <TextArea placeholder="Your Message" rows={4} />
            </Form.Item>

            <Form.Item>
              <div className="text-center">
                <Button type="primary" htmlType="submit" className="order-btn">
                  Send Message
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      <InfoSection />
      <Divider className="m-0" />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-2">
          <Title
            level={3}
            style={{ color: "#704D25" }}
            className="text-2xl font-semibold mb-4 text-center"
          >
            Our Location
          </Title>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.7475753554404!2d75.69229787450367!3d26.879759861507655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4b3e9fbcc449%3A0x80d5fe523ff88297!2s8%2C%20Paschim%20vihar%2C%20D%2C%20Bhakrota%2C%20Jaipur%2C%20Rajasthan%20302026!5e0!3m2!1sen!2sin!4v1749540150046!5m2!1sen!2sin"
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

export default ContactUsClient;
