"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Collapse } from "antd";
import {
  SendOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { postData, fetchData } from "@/app/lib/ApiFuntions";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchStations } from "@/app/redux/menuSlice";
import { debounce } from "lodash";
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const steps = [
  {
    image: "/images/register-1.png",
  },
  {
    image: "/images/kyc-approved-2.png",
  },
  {
    image: "/images/orders-3.png",
  },
  {
    image: "/images/delivery-4.png",
  },
];

const steps1 = [
  {
    image: "/images/all-railway-stations-1.png",
  },
  {
    image: "/images/restaurants-listings-2.png",
  },
  {
    image: "/images/fssai-approved-3.png",
  },
  {
    image: "/images/real-time-order-tracking-4.png",
  },
];
const VendorRegistration = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

    const { stations, loading: stationsLoading } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);
const handleStationSearch = debounce((searchTerm) => {
  dispatch(fetchStations(searchTerm));
}, 500);

  const onFinish = async (values) => {
    setLoading(true);
    const data = await postData("/api/vendorregistration", values);

    if (data.success) {
      message.success("Vendor registered successfully!");
      form.resetFields();
    } else {
      message.error("Failed to register vendor. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-40 md:h-60">
        <div>
          <img
            src="/images/Trainscafe-Banner.webp"
            alt="food in train by traincafe"
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white  text-xl md:text-4xl font-bold text-center px-4">
            Vendor Registration
          </h1>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10 gap-3">
          <div className="mb-6">
            <h2
              className="text-center text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: "#704d25" }}
            >
              Vendor Tie-Up With Restaurants
            </h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-6"
              requiredMark={false}
            >
              <Form.Item
                name="Vendor_Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Vendor Name"
                  size="large"
                  className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                />
              </Form.Item>

              <Form.Item
                name="Restaurant_Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your restaurant name",
                  },
                ]}
              >
                <Input
                  placeholder="Restaurant Name"
                  size="large"
                  className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                />
              </Form.Item>

              <Form.Item
                name="Contact_No"
                rules={[
                  {
                    required: true,
                    message: "Please enter your contact number",
                  },
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
                name="Station"
                rules={[{ required: true, message: "Please select a station" }]}
              >
           <Select
  showSearch
  placeholder={loading ? "Loading stations..." : "Select Station"}
  size="large"
  loading={loading}
  onSearch={handleStationSearch}   // 👈 important
  filterOption={false}             // 👈 use backend filtering
  notFoundContent={loading ? "Loading..." : "No stations found"}
>

                  {stations && stations.length > 0 ? (
                    stations.map((station) => (
                      <Option key={station._id} value={station._id}>
                        {station.name}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No stations found</Option>
                  )}
                </Select>
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
                name="Distance"
                rules={[
                  {
                    required: true,
                    message: "Please enter distance from station",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Distance (in km)"
                  size="large"
                  className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                  min={0}
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
                  {loading ? "Submitting..." : "Register"}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <p className="text-gray-600 mb-4 text-justify">
              In the ever-evolving landscape of the food industry, restaurants
              are constantly seeking innovative ways to enhance their offerings
              and provide unique experiences to their customers. One such
              strategy that has gained traction in recent years is the concept
              of vendor tie-ups. <br></br> <br></br> These partnerships between
              restaurants and vendors offer a range of benefits to both parties
              involved, ultimately leading to an enriched dining experience for
              patrons. To register your restaurant for online order food
              delivery via train, click this link. You will be able to sell food
              for e-Catering services if you adhere to the IRCTC's agreed rules.
              To get your restaurant featured and grow your business, kindly
              fill out this form………
            </p>

            <h3
              className="text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: "#704d25" }}
            >
              What is vendor Tie-up with Restaurants means?
            </h3>

            <p className="text-gray-600 mt-4">
              <b> Vendor tie-ups with Restaurants</b> involve collaborations
              between restaurants and various suppliers or service providers.
              These partnerships can take many forms, including agreements with
              food suppliers, beverage companies, technology firms, and even
              entertainment providers. The primary goal of these collaborations
              is to add value to the dining experience by offering high-quality
              products and services that complement the restaurant's core
              offerings. <br></br>
              <br></br>
              All restaurant operators are invited to join our network as an
              Authorized IRCTC E-Catering Partner Trainscafe in order to expand
              their food business. We are aware of your outstanding business and
              your cutting-edge services, which allow you to serve your clients
              the best, most delicious cuisine possible. Join the Trainscafe
              food delivery network as an Authorized IRCTC E-Catering Partner to
              expand your business beyond just foot traffic. Please visit our
              website or call us at
              <Link
                href="tel:+918696963496"
                className="font-bold text-blue-600 hover:text-blue-800 underline"
              >
                +91-8696963496
              </Link>{" "}
              for <b>online food order in train.</b>
            </p>
            <div className="py-4">
              <h3
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: "#704d25" }}
              >
                Why Should You Partner With Trainscafe?
              </h3>
              <p className="pb-3">
                Trainscafe helps you increase your revenue, attract new
                customers, and enhance your brand visibility by offering
                seamless food delivery services to train passengers across
                India.
              </p>
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps1.map((step1, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={step1.image}
                      alt={step1.title}
                      className="img-fluid"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="py-4">
              <h3
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: "#704d25" }}
              >
                HOW IT WORKS?
              </h3>

              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="img-fluid"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="py-4 ">
              <h3
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: "#704d25" }}
              >
                Benefits of vendor tie-up with restaurants by Trainscafe
              </h3>

              <ul className="list-disc list-inside">
                <li className="mb-2">
                  <b>Diversified Menu Offerings : </b>Partnering with vendors
                  allows restaurants to expand their menu offerings without the
                  need for extensive in-house resources. Whether it's sourcing
                  specialty ingredients or introducing new culinary concepts,
                  vendor tie-ups enable restaurants to offer a diverse range of
                  options to their customers. Get{" "}
                  <b>
                    vendor tie-ups with restaurants and start delivering food on
                    train.
                  </b>
                </li>
                <li className="mb-2">
                  ️<b>Quality Assurance : </b> Collaborating with reputable
                  vendors ensures that restaurants can maintain high standards
                  of quality across their menu items. Whether it's fresh
                  produce, premium cuts of meat, or artisanal ingredients,
                  working with trusted suppliers helps restaurants deliver
                  consistently delicious meals to their patrons. Trainscafe
                  provides fresh <b>online food in train</b> and the{" "}
                  <b>best food delivery in train.</b>
                </li>
                <li className="mb-2">
                  <b>Operational Efficiency :</b>{" "}
                  <b>Vendor tie-ups with restaurants</b> can streamline the
                  procurement process for restaurants, allowing them to focus on
                  their core operations. By outsourcing certain aspects of
                  ingredient sourcing or inventory management to vendors,
                  restaurants can improve efficiency and reduce overhead costs.
                </li>
                <li className="mb-2">
                  <b>Marketing Opportunities : </b>Partnering with well-known
                  vendors can also provide restaurants with valuable marketing
                  opportunities. Co-branded promotions, sponsored events, and
                  collaborative marketing campaigns can help restaurants
                  increase their visibility and attract new customers.
                </li>
                <li className="mb-2">
                  <b>Boost Revenue : </b>You may increase your revenue and reach
                  a wider audience by signing up as a vendor with Trainscafe.
                  When traveling by train, passengers frequently look for
                  wholesome and practical meal options. You can meet this demand
                  and boost your income potential by selling your food on
                  Trainscafe platform.
                </li>
              </ul>
            </div>
            <h3
              className="text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: "#704d25" }}
            >
              Eligibility of restaurants for becoming food vendor on Trainscafe
            </h3>
            <p>
              To sell food at the IRCTC, a hotel or restaurant must have an
              FSSAI license. All food vendors, whether they are merchants,
              hawkers, proprietors of temporary food stalls, or other
              small-scale food business operators, must have an annual turnover
              surpassing Rs. 12 lakhs or a daily production capacity over 100
              kg/litres in order to obtain an authorization certificate from the
              Food Safety and Standards Authority of India (FSSAI). <br></br>
              <br></br>They must first register with the FSSAI in order to be
              eligible to apply for IRCTC catering services if their yearly
              sales is less than Rs. 12 lakhs.{" "}
              <b>Get vendor tie-ups with restaurants</b> and start delivering
              <b>
                {" "}
                food on train. Online food order in Train is provided by
                Trainscafe.
              </b>
            </p>

            <div className="py-4">
              <h3
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: "#704d25" }}
              >
                How to Join Trainscafe as Restaurants?
              </h3>
              <p>
                Getting on board and expanding your business is quite simple.
                The following is all you need to know to order food on trains,
                planes, or major bus routes:
                <br></br>
                <br></br>A valid FSSAI license aids in verifying that the
                partners are approved food and beverage providers.
              </p>
              <br></br>
              <ul className="list-disc list-inside">
                <li className="mb-2">
                  <b>GST Registration : </b>We need you to have a GST
                  registration in order to guarantee transaction transparency.
                  If you don't already have one, you can easily obtain one
                  online and join the process.{" "}
                </li>
                <li className="mb-2">
                  ️<b>Agreement : </b> In order to maintain long-term business
                  compliance, you must submit it. · More options on the menu: A
                  larger menu will improve the flow of orders for food on the
                  train.
                </li>
                <li className="mb-2">
                  <b>Group food delivery :</b> Large parties traveling by train,
                  plane, or bus can have their group food orders fulfilled by
                  Authorized IRCTC E-Catering Partner Trainscafe. Get group food
                  ordering in train with superb discounts. Visit our website for
                  more details.Simply fill out the sign-up form to become a part
                  of our train food delivery network and we'll deliver meals on
                  trains, at the airport, and on buses.
                </li>
                <li className="mb-2">
                  <b>Conclusion : </b>Vendor tie-ups with restaurants represent
                  a strategic approach for restaurants to enhance their
                  offerings, improve operational efficiency, and create
                  memorable dining experiences for their customers. By
                  collaborating with trusted vendors across various sectors,
                  restaurants can access a wide range of benefits, from
                  diversified menu offerings to increased brand visibility.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-4 px-2">
          {" "}
          <h2 className="font-bold text-[#704D25] mb-2">
            Frequently Asked Questions (FAQs)
          </h2>
              <Collapse accordion>
      <Panel
        header={
          <h3>
            Q1. How you can tie-up as vendor with restaurants on train?
          </h3>
        }
        key="1"
      >
        <p>
          For vendor tie-up with restaurants on train, there is always the
          submission of some important documents such as a valid FSSAI
          certificate and GST-registered shop.{" "}
          <b>Get vendor tie-ups with restaurants</b> and start delivering{" "}
          <b>food on train through Trainscafe</b>.
        </p>
      </Panel>

      <Panel
        header={<h3>Q2. Is local vendors allowed in train?</h3>}
        key="2"
      >
        <p>
          As trespassers or encroachers of railway land, any unauthorized
          vendors or hawkers on trains and station property must be removed
          in accordance with applicable laws (Sections 144 & 147) of the
          Railways Act, 1989.
        </p>
      </Panel>

      <Panel
        header={<h3>Q3. What is the method of getting vendor licence in train?</h3>}
        key="3"
      >
        <p>
          To get a vendor license in train, you must have certain documents
          verified by Indian Railways. Trainscafe provides the opportunity
          to get registered with them as a new vendor.
        </p>
      </Panel>

      <Panel
        header={<h3>Q4. How can I become vendor for railways?</h3>}
        key="4"
      >
        <p>
          To become a vendor for railways, you need to research first the
          company you want to run and ensure your business is registered with
          all required documents submitted.
        </p>
      </Panel>

      <Panel
        header={<h3>Q5. How can I become authorised IRCTC partner?</h3>}
        key="5"
      >
        <p>
          In order to become an authorised IRCTC partner, you must fill out
          the registration form for IRCTC agents and upload the required
          documents. After verification, you will receive an ID and password
          to log in to the portal.{" "}
          <b>Get vendor tie-ups with restaurants</b> and start delivering{" "}
          <b>food on train through Trainscafe.</b>
        </p>
      </Panel>
    </Collapse>
        </div>
      </div>

      <footer className="bg-coffee-600 text-white py-4">
        <div style={{ color: "#704d25" }} className="text-center text-sm">
          <p>
            Need help? Reach us at{" "}
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
          <p className="mt-2">
            &copy; {new Date().getFullYear()} trainscafe.in. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VendorRegistration;
