"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Row,
  Col,
  Divider,
  message,
  Card,
} from "antd";
import MenuSelector from "./ongoing/MenuSelector";

export default function CreateOrderModal({
  open,
  onCancel,
  onSuccess,
  initialData,
}) {
  const [form] = Form.useForm();
  const [station, setStation] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  console.log( initialData ,"initial-Data")

  const isEditMode = !!initialData?.orderID;

  console.log(isEditMode ,"is-Edit-Mode")

  const resetAll = () => {
    form.resetFields();
    setStation(null);
    setVendor(null);
    setCategories([]);
    setCart([]);
  };

  useEffect(() => {
    if (initialData && isEditMode) {
      form.setFieldsValue({
        trainNo: initialData.train?.trainNo,
        trainName: initialData.train?.trainName,
        name: initialData.user_details?.name,
        email: initialData.user_details?.email,
        mobile: initialData.user_details?.mobile,
        paymentMethod: initialData.payment?.method,
      });

      setStation(initialData.station || null);
      setVendor(initialData.vendor || null);
      setCategories(initialData.categories || []);
      setCart(initialData.cart || []);
    } else {
      resetAll();
    }
  }, [initialData, isEditMode, open]);

  const subTotal = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  const tax = subTotal * 0.05;
  const total = subTotal + tax;

  const handleFinish = async (values) => {
    if (!station || !vendor || !cart.length) {
      message.error("Please select station, vendor and add at least 1 item!");
      return;
    }

    const body = {
      vendor,
      station,
      categories,
      train: {
        trainNo: values.trainNo,
        trainName: values.trainName,
      },
      payment: {
        method: values.paymentMethod,
        amount: total,
        tax: tax,
      },
      cart: cart.map((i) => ({
        _id: i.itemId,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
      subTotal,
      user_details: {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
      },
    };

    try {
      const url = isEditMode
        ? `/api/orders/${initialData._id}/edit`
        : `/api/orders/place-order`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        message.success(
          `Order ${isEditMode ? "updated" : "placed"} successfully!`
        );
        onSuccess?.();
        resetAll();
      } else {
        message.error(result.message || "Something went wrong");
      }
    } catch (err) {
      message.error("Server error");
    }
  };

  const handleCancel = () => {
    resetAll();
    onCancel?.();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={isEditMode ? "Edit Order" : "Create Order"}
      footer={
        <Button

          type="primary"
          onClick={() => form.submit()}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          disabled={cart.length === 0}
        >
          {isEditMode ? "Update Order" : "Place Order"}
        </Button>
      }
      width={900}
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          paddingRight: 8,
          paddingBottom: 24,
        }}
      >
        <Divider
          style={{
            fontSize: 14,
            borderColor: "#6f4d27",
            fontWeight: 600,
            color: "#555",
            margin: "24px 0",
          }}
          orientation="left"
        >
          Menu Details
        </Divider>

        <MenuSelector
          onUpdate={(data) => {
            setStation(data.station);
            setVendor(data.vendor);
            setCategories(data.categories);
            setCart(data.cart);
          }}
          initialStation={station}
          initialVendor={vendor}
          initialCategory={categories}
          initialCart={cart}
        />

        <Divider
          style={{
            fontSize: 14,
            borderColor: "#6f4d27",
            fontWeight: 600,
            color: "#555",
            margin: "24px 0",
          }}
          orientation="left"
        >
          Train Details
        </Divider>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="trainNo"
                label="Train Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Train Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trainName"
                label="Train Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Train Name" />
              </Form.Item>
            </Col>
          </Row>

          <Divider
            style={{
              fontSize: 14,
              borderColor: "#6f4d27",
              fontWeight: 600,
              color: "#555",
              margin: "24px 0",
            }}
            orientation="left"
          >
            Passenger Details
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Passenger Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="Mobile"
                rules={[{ required: true }]}
              >
                <Input placeholder="Mobile Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value="COD">Cash on Delivery</Radio>
                  <Radio value="Online">Online</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider
            style={{
              fontSize: 14,
              borderColor: "#6f4d27",
              fontWeight: 600,
              color: "#555",
              margin: "24px 0",
            }}
            orientation="left"
          >
            Order Summary
          </Divider>
          <Card
            size="small"
            bordered
            style={{
              maxWidth: 400,
              marginTop: 8,
            }}
          >
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Col>Subtotal:</Col>
              <Col>₹{subTotal.toFixed(2)}</Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Col>Tax (5%):</Col>
              <Col>₹{tax.toFixed(2)}</Col>
            </Row>
            <Divider style={{ margin: "8px 0" }} />
            <Row justify="space-between">
              <Col>
                <b>Total:</b>
              </Col>
              <Col>
                <b>₹{total.toFixed(2)}</b>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </Modal>
  );
}
