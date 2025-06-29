"use client";
import React, { useState } from "react";
import { Form, Input, Button, message, Collapse } from "antd";
import {
  SendOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Link from "next/link";
const { Panel } = Collapse;

const { TextArea } = Input;

const OnlineCoolieBooking = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact?slug=Coolie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: "Coolie",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          "Thank you! Your coolie booking request has been sent successfully."
        );
        form.resetFields();
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner Section */}
      <div className="relative h-40 md:h-60">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="food delivery in your seat"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Online Coolie Booking
          </h1>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
          <div className="text-center mb-6">
            <h2
              style={{ color: "#704d25" }}
              className="text-2xl sm:text-3xl font-bold text-coffee-600 mb-2"
            >
              Book a Coolie for Your Journey
            </h2>
            <p className="text-gray-600 text-justify">
              Travelling with heavy luggage through crowded railway stations can
              be problematic and exhausting. Whether you’re a regular traveler,
              tour operator, or business commuter, managing luggage and
              belongings while going through a busy station is a big challenging
              task especially for senior citizens. <br></br> <br></br> But what if we say that you
              can get rid of this carrying luggage thing? Trainscafe can solve
              this problem while introducing hassle-free online coolie booking
              service, designed to smother your travel experience.
            </p>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            requiredMark={false}
          >
            <Form.Item
              name="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Your Name"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="ContactNumber"
              rules={[
                { required: true, message: "Please enter your contact number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Contact Number"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                maxLength={10}
              />
            </Form.Item>

            <Form.Item
              name="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email Address"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="Message"
              rules={[
                { required: true, message: "Please enter your message" },
                { min: 10, message: "Message must be at least 10 characters" },
              ]}
            >
              <TextArea
                placeholder="Tell us about your coolie booking requirements..."
                size="large"
                rows={5}
                className="rounded-lg resize-none border-coffee-500 focus:ring-2 focus:ring-coffee-600"
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
                {loading ? "Sending..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="py-2 px-4">
        <h2 className="font-bold text-[#704D25] mb-2">
          Why Trainscafe’s Online Coolie Booking Service?
        </h2>
        <ul className="list-disc list-inside">
          <li>
            <b>Instant Coolie Availability :</b> Skip the process of finding out
            the coolie at stations. If you are carrying heavy luggage with
            yourself you can pre book the coolie at the selected station.
          </li>
          <li>
            <b>Transparent and Fixed Pricing :</b> We always take care of the
            pricing in terms of services. Passengers don’t need to negotiate
            with the coolie. Choose coolie with affordable prices with various
            options.
          </li>
          <li>
            <b>Verified and Professional Porters :</b> Safety of Luggage is our
            top most priority. Coolies are registered with aadhar card,
            residential proof, police verification, and with proper training to
            ensure passenger’s luggage safety.
          </li>
          <li>
            <b>Convenience and Time-Saving :</b> Pre-book your coolie on your
            mobile and the coolie will come to your seat when the train arrives
            at the station. Enjoy the journey and let us take care of your
            Luggage.
          </li>
          <li>
            <b>Personalized Assistance :</b> Senior citizens, differently abled,
            or travelling with family our coolie’s are available to offer
            supportive instruction and take care of the smoother experience.
          </li>
        </ul>
      </div>
      <div className="py-4 px-4">
        <h2 className="font-bold text-[#704D25] mb-2">
          How to Book a Coolie Online with Trainscafe?
        </h2>
        <p className="pb-2">
          Book coolie online with Trainscafe is quick and easy:
        </p>
        <p>Booking is quick and easy:</p>
        <ul className="list-disc list-inside">
          <li>
            Visit{" "}
            <Link
              className="font-bold text-blue-600 hover:text-blue-800 underline"
              href="https://www.trainscafe.in"
            >
              www.trainscafe.com
            </Link>
          </li>
          <li>
            {" "}
            Navigate to the <b>Coolie Booking Page</b>
          </li>
          <li>Choose service type - Luggage, Passenger Assistance, or Both</li>
          <li>
            Enter <b>PNR, seat number, station, and contact details</b>{" "}
          </li>
          <li>
            Pay securely via <b>Personalized Assistance :</b> Cash on Delivery
            or Online Payment
          </li>
        </ul>
      </div>
      <div className="py-4 px-4">
        <h2 className="font-bold text-[#704D25] mb-2">
          Why do we recommend to book coolie in advance?
        </h2>

        <ul className="list-disc list-inside">
          <li>
            <b>Avoid Last-Minute Rush :</b> Everything gets stressful while
            reached the station and finding coolies at crowded platforms.
          </li>
          <li>
            <b>Fixed, Transparent Pricing :</b> Skip the stress of bargaining at
            station.
          </li>
          <li>
            <b>Assured Availability :</b> Guaranteed services during the season
            of travel times.
          </li>
          <li>
            <b> Safety and Reliability :</b> Trained coolie’s to handle your
            luggage with care and safety.
          </li>
        </ul>
      </div>
      <div className="py-4 px-4">
        {" "}
        <h2 className="font-bold text-[#704D25] mb-2">
          Frequently Asked Questions (FAQs)
        </h2>
        <Collapse accordion>
          <Panel
            header="Q1. How early should I book my coolie service in train?"
            key="1"
          >
            <p>
              You can book your coolie before 45 minutes of reaching the
              station. Booking before reaching the station gives a seamless
              experience and a smoother journey.
            </p>
          </Panel>
          <Panel
            header="Q2. Can I book a coolie for both boarding and deboarding? "
            key="2"
          >
            <p>
              Yes, you can book coolie service for both boarding and return
              journeys.
            </p>
          </Panel>
          <Panel header="Q3. Is my online payment secure?" key="3">
            <p>
              Absolutely, the payment is secure and accurate. Incase if you find
              out any issue you can contact to our customer support team which
              is available for 24*7 to resolve any issue under 10-15 minutes.
            </p>
          </Panel>

          <Panel
            header="Q4. How will I identify my coolie at the station?"
            key="4"
          >
            <p>
              After booking, you can check the details of the assigned coolie,
              his name, mobile number, and location. He will call you once the
              booking has been done so you can directly coordinate with the
              coolie on call.
            </p>
          </Panel>

          <Panel header="Q5. Can I cancel my booking? " key="5">
            <p>
              Yes, you can cancel your booking, but cancellation policies may
              apply. Please refer to our terms and conditions for more details.
            </p>
          </Panel>
        </Collapse>
      </div>

      <div className="py-4 px-4">
        <h3 className="font-bold text-[#704D25] mb-2">
          Experience Stress-Free Travel with Trainscafe
        </h3>
        <p className="mb-2">
          Ready to experience stressful travel? Book your coolie online with
          Trainscafe today and make your journey smoother from start to finish!
          For more information or assistance, feel free to reach out to our
          commendable customer support team which is ready to give on time
          solutions.
        </p>
        <p>
          Fill Above Form 🕒
          <b> Our support team is available 24x7 to assist you.</b>
        </p>
      </div>
      <footer className="bg-coffee-600 text-white py-6 px-4">
        <div className="text-center">
          <p style={{ color: "#704d25" }} className="text-sm">
            Need immediate assistance? Call us at:{" "}
            <Link
              href="tel:+918696963496"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              +91-8696963496
            </Link>{" "}
            |{" "}
            <Link
              href="support@trainscafe.in"
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              support@trainscafe.in
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnlineCoolieBooking;
