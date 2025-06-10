"use client";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  SendOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { TextArea } = Input;

const BulkOrderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact?slug=BulkOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: "BulkOrder",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          "Thank you! Your bulk order request has been sent successfully."
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
      <div className="relative h-60 md:h-72">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Bulk Order Request
          </h1>
        </div>
      </div>
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
          <div className=" mb-8">
            <h1 className="text-3xl font-bold text-coffee-600 mb-4">
              Group Food Ordering in Train
            </h1>
            <div className="mb-4">
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
                placeholder="Describe your bulk order requirements, station name, and any other details."
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
            <h4 className="mb-2">
              Are you traveling with your family or friends? Don’t worry
              Traincafe provides <b>group food ordering in train </b>
              hassle-free. Call us on{" "}
              <Link
                href="tel:+918696963496"
                className="font-bold text-blue-600 hover:text-blue-800 underline"
              >
                +91-8696963496
              </Link>
              . to place your order.
            </h4>
            <p className="text-gray-700 mb-2">
              People like to travel in a group such as with their family,
              friends, or relatives or perhaps you are traveling to a different
              place for a wedding or you are taking a summer vacation with your
              kids and family. The first image that comes to mind when we think
              of group train travel is of a group of people interacting, sharing
              tales, laughing, and enjoying meals. Fortunately, with the advent
              of <b>group food ordering in train</b> services by Traincafe,
              dining on trains has become more convenient and enjoyable than
              ever before. Imagine when you arrive at the train stations of your
              choice, picture a dish of freshly prepared, hot meals, much like
              you would find at a restaurant. You should{" "}
              <b>order food in train</b> using Traincafe platform instead of
              train food if you detest boring, tasteless pantry food that is
              prepared in an unclean manner. It would be a delightful pleasure.
              Traincafe provides fresh <b>order food in train</b> and the{" "}
              <b>best food delivery in train</b>. Get{" "}
              <b>group food ordering in train</b> with superb discounts. Visit
              our website for more detail.
            </p>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                color: "#704d25",
                marginBottom: "1rem",
              }}
            >
              Types of Groups travel in train
            </h2>
            <p className="text-gray-700">
              There's nothing better than gathering with loved ones, friends, or
              coworkers to share a meal while taking in the view of the outdoors
              via the window. Organizing <b>train food</b> in bulk for a group,
              train ride has been simpler and easier for passengers after the
              introduction of Traincafe. Get <b>food on train </b>without any
              tension by Traincafe Here are some common types of groups that you
              may encounter on trains:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <b>Family Group -</b>Families including parents, and children
                often choose train travel for its affordability, convenience,
                and the opportunity to spend quality time together.
              </li>
              <li>
                <b> Tour Group -</b>Tour groups comprise individuals who have
                come together to explore a particular destination or itinerary.
                Traincafe provides group food orderings in train with best
                discounts.
              </li>
              <li>
                <b>School Groups -</b>School groups consist of students and
                teachers traveling for educational purposes, field trips, or
                extracurricular activities.
              </li>
              <li>
                <b>Social and friend Groups -</b>
                Groups of friends or social organizations often choose train
                travel for leisure trips, weekend getaways, or special events.
                <b> Order food on train</b> for your friends and loved ones.
                Call us on{" "}
                <Link
                  href="tel:+918696963496"
                  className="font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  +91-8696963496
                </Link>{" "}
                to place your order.
              </li>
              <li>
                <b> Special Needs Groups -</b>Groups traveling with special
                needs individuals, such as those with disabilities or medical
                conditions, may opt for train travel due to its accessibility
                and accommodation options.
              </li>
            </ul>
            <div className="py-2">
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  color: "#704d25",
                  marginBottom: "1rem",
                }}
              >
                Order Pure veg/Non-veg Food delivery in train for group
              </h2>
              <p className="text-gray-700">
                Whether you enjoy pure veg food or Non-veg food and miss its
                delicious flavor while traveling by rail in a group, simply give
                your travel companion Traincafe a call, and they will transport{" "}
                <b>pure veg/Non-veg food delivery in train</b> for your group
                right to your seat at any station along the way.
                <b>Pure veg food delivery in train </b>includes 100% pure veg
                thali, north/south Indian food etc for a group. If you are Jain
                and travelling in a group, don’t worry, we also have option of{" "}
                <b>jain food delivery in train</b> for your family in bulk.
                Traincafe provides fresh <b>online food in train</b> and the
                best <b>food delivery in train</b> for travelers at all popular
                stations. For non-veg lovers, Traincafe provides a variety of
                non-veg food such as Tandoori or grilled kebabs, Non-veg thali,
                non-veg biryani, butter chicken and lots more. Now get your
                favorite veg/non-veg pizza at your seat by ordering from{" "}
                <b>Domino’s pizza delivery</b> or <b>Pizza hut delivery</b>{" "}
                options available on traincafe. Traincafe provides best non-veg
                food delivery in train. For group food order in train,call us
                on………….
              </p>
              <p>
                Is there a longer reservation period for{" "}
                <b>group food ordering in train?</b>
              </p>
              <p>
                Yes, there is a longer reservation window available for making
                large reservations on trains. Orders for large quantities of
                food must be reserved at least 12 or 24 hours in advance. By
                doing this, the eateries that are listed on the platform are
                guaranteed adequate time to cook and wrap their food before it
                is delivered. Making a reservation for a large meal on a train
                is not the same as ordering takeout. The restaurants must
                prepare more food for bulk orders because they are intended for
                larger groups of patrons, which takes more time. Furthermore,
                logistical factors like the train's arrival and departure times
                must be taken into account because the food will be supplied by
                train. Therefore, if you intend to get a large quantity of food
                for your train ride, be sure to schedule your order well in
                advance. This will guarantee that the meal you order is
                delivered on schedule and that it is what you desire.{" "}
                <b>Order food on train</b>, contact us at{" "}
                <Link
                  href="tel:+918696963496"
                  className="font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  +91-8696963496
                </Link>{" "}.
                Traincafe provides best <b>train food delivery</b> for all the
                groups.
              </p>
              <h4>How to do Group Food Ordering in Train</h4>
              <p>
                You can easily order <b>food on train</b> by simply following
                simple steps-
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <b>Visit Website -</b> Go to our website{" "}
                  <Link
                    href="www.traincafe.com"
                    className="font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    www.traincafe.com
                  </Link>{" "}
                  for online food order in train.
                </li>
                <li>
                  <b>Select the Station -</b> Choose your respective railway
                  station for <b>group food ordering in train.</b>
                </li>
                <li>
                  <b>Choose Your Train -</b>Identify the train you'll be
                  traveling on from the available options.
                </li>
                <li>
                  <b>Enter Seat Number -</b> For precise delivery, let the train
                  staff know what seat you are in.
                </li>
                <li>
                  <b>Browse and select a Restaurant and Dish -</b>Browse through
                  the nearest restaurants and select your preferred{" "}
                  <b>train food order</b> options. Traincafe provides various
                  options of restaurants that provide{" "}
                  <b>veg/Non veg food delivery in train</b>.
                </li>
                <li>
                  <b>Customize Your Order -</b>Please mention any special
                  requests or preferences you may have in the customized note.
                  Traincafe provides best <b>food delivery in train</b> services
                  whether it is <b>Jain food delivery</b> or{" "}
                  <b>pizza delivery in train</b>. Call us on …….to place your
                  order.
                </li>
                <li>
                  <b>Delivery Details -</b>Fill in essential information like
                  Train running status, PNR number, and any other relevant
                  details for efficient delivery.
                </li>
                <li>
                  <b>Payment Process -</b>Complete the transaction securely to
                  confirm your order. Select your preferred mode of payment from
                  options like Net banking, credit card, or Cash on Delivery.
                </li>
                <li>
                  <b>Place and track your order -</b>Once your order is
                  confirmed, track its status to know when your delicious meal
                  will be delivered to your seat. <b>Order food on train</b>,
                  contact us at{" "}
                  <Link
                    href="tel:+918696963496"
                    className="font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    +91-8696963496
                  </Link>{" "}
                  . Traincafe provides fresh <b>online food in train</b> and the{" "}
                  <b>best food delivery in train</b> for travelers at all
                  popular stations.
                </li>
              </ul>
            </div>
            <h4 className="font-bold text-[#704d25] py-2 underline">Conclusion :</h4>
            <p>
             <b> Group food ordering in train</b> has undoubtedly revolutionized the
              dining experience during train journeys, offering passengers
              unparalleled convenience, variety, and efficiency. So, the next
              time you embark on a train journey with friends or family,
              consider harnessing the power of group food ordering for a truly
              enjoyable dining experience on the rails.
            </p>
            <h2 className="my-2"
  style={{
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#704d25",
    marginBottom: "1rem",
  }}
>
  FAQs
</h2>

<div>
  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
  <li style={{ marginBottom: "14px", fontSize: "14px" }}>
    <strong>Q1:</strong> <strong>How can I order Group food in train?
</strong>
    <br />
    <strong>Ans.</strong> You can order group food in train simply by calling us on{" "}
    <Link
                    href="tel:+918696963496"
                    className="font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    +91-8696963496
                  </Link>{" "}  or you can visit our <Link className="font-bold text-blue-600 hover:text-blue-800 underline" href="https://www.trainscafe.in">
       website.
    </Link>{" "}
   
  </li>

  <li style={{ marginBottom: "14px", fontSize: "14px" }}>
    <strong>Q2:</strong> <strong>Is COD available for Group food ordering in train?</strong>
    <br />
    <strong>Ans.</strong> Yes, call{" "}
    Yes, You can also do cash on delivery for <b>group food ordering in train</b> through Traincafe.

  </li>

  <li style={{ marginBottom: "14px", fontSize: "14px" }}>
    <strong>Q3:</strong> <strong>Can we order group food in train from multiple resturants ?
</strong>
    <br />
    <strong>Ans.</strong> Orders from different restaurants cannot be placed in the same order, but you may place numerous orders from the same restaurant. Traincafe provides fresh online food in train and the best food delivery in train for travelers at all popular stations.

  </li>

  <li style={{ marginBottom: "14px", fontSize: "14px" }}>
    <strong>Q4:</strong> <strong>What is the minimum order we can do for group food in train?
</strong>
    <br />
    <strong>Ans.</strong> Food orders that total INR 400 or more are regarded as group orders. <b>Order online food in train</b> with Traincafe.

  </li>

  <li style={{ marginBottom: "14px", fontSize: "14px" }}>
    <strong>Q5:</strong> <strong> How to order bulk food in train on call?</strong>
    <br />
    <strong>Ans.</strong> Order food on train with Traincafe, contact us at 8696963496 to place your order.

  </li>

  
</ul>
</div>
          </div>
          
        </div>
      </div>
      <footer className=" text-white py-2">
        <div className="text-center">
          <p style={{ color: "#704d25" }} className="text-sm">
            Need help? Contact us at:
            <br />
            <span className="font-semibold hover:underline cursor-pointer">
              
              
               <Link href="tel:+918696963496" className="font-bold text-blue-600 hover:text-blue-800 underline">
                    +91-8696963496
                  </Link> | <Link href="support@traincafe.com" className="font-bold text-blue-600 hover:text-blue-800 underline">
                   support@trainscafe.com
                  </Link>
            </span>
          </p>
        </div>
      </footer>

      <style jsx>{`
        .text-coffee-600 {
          color: #704d25;
        }
        .bg-coffee-600 {
          background-color: #704d25;
        }
        .border-coffee-500 {
          border-color: #704d25;
        }
        .focus:ring-coffee-600 {
          outline-color: #704d25;
        }
      `}</style>
    </div>
  );
};

export default BulkOrderForm;
