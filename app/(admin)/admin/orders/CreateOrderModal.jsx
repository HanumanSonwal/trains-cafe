"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  Radio,
  Button,
  InputNumber,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";

const { Option } = Select;

const CreateOrderModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [stations, setStations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (open) fetchStations();
  }, [open]);

  const fetchStations = async () => {
    try {
      const res = await fetch("/api/station?search=&page=0");
      const data = await res.json();
      if (data.success) setStations(data.data);
      else message.error("Failed to fetch stations");
    } catch (err) {
      message.error("Error fetching stations");
    }
  };

  const fetchVendors = async (stationCode) => {
    try {
      const res = await fetch(`/api/vendors?stationcode=${stationCode}`);
      const data = await res.json();
      if (data.success) setVendors(data.data);
      else message.error("Failed to fetch vendors");
    } catch (err) {
      message.error("Error fetching vendors");
    }
  };

  const fetchCategories = useCallback(async (vendorId) => {
    if (!vendorId) return;
    const response = await getVendorCategoriesAndMenuItems(vendorId, true);
    if (response && Array.isArray(response)) {
      setCategories(response);
      if (response.length) {
        setMenuItems(response[0].items || []);
      }
    } else {
      setCategories([]);
      setMenuItems([]);
    }
  }, []);

  const handleStationChange = (stationId) => {
    const station = stations.find((s) => s._id === stationId);
    if (station) fetchVendors(station.code || station.name);
    setVendors([]);
    setCategories([]);
    setMenuItems([]);
    form.setFieldsValue({ vendor: undefined, category: undefined });
    setCart([]);
  };

  const handleVendorChange = (vendorId) => {
    fetchCategories(vendorId);
    setCart([]);
    form.setFieldsValue({ category: undefined });
  };

  const handleCategoryChange = (categoryId) => {
    const cat = categories.find(
      (c) => c._id === categoryId || c.categoryName === categoryId
    );
    setMenuItems(cat?.items || []);
    setCart([]);
  };

  const handleAddItem = () => {
    setCart([...cart, { itemId: null, quantity: 1, price: 0, name: "" }]);
  };

  const handleItemChange = (index, itemId) => {
    const item = menuItems.find((m) => m._id === itemId);
    const newCart = [...cart];
    newCart[index].itemId = itemId;
    newCart[index].price = item?.price || 0;
    newCart[index].name = item?.name || "";
    setCart(newCart);
  };

  const handleQtyChange = (index, qty) => {
    const newCart = [...cart];
    newCart[index].quantity = qty || 1;
    setCart(newCart);
  };

  const incrementQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const decrementQty = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    }
  };

  const handleRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const subTotal = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  const tax = subTotal * 0.05;
  const total = subTotal + tax;

  const handleFinish = async (values) => {
    const stationObj = stations.find((s) => s._id === values.station);
    const vendorObj = vendors.find((v) => v._id === values.vendor);

    if (!stationObj || !vendorObj) {
      message.error("Please select valid station and vendor");
      return;
    }

    const body = {
      vendor: vendorObj,
      station: stationObj,
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
      total: total,
      subTotal: subTotal,
      user_details: {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
      },
    };

    try {
      const res = await fetch("/api/orders/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.success) {
        message.success("Order placed successfully!");
        form.resetFields();
        setCart([]);
        onSuccess?.();
      } else {
        message.error(result.message || "Failed to place order");
      }
    } catch (err) {
      message.error("Error placing order");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Create New Order"
      footer={   <Button
            type="primary"
            htmlType="submit"
            disabled={cart.length === 0}
          >
            Place Order
          </Button>}
      width={900}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        // paddingBottom: 120,
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="station" label="Select Station" rules={[{ required: true }]}>
              <Select
                placeholder="Search station"
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleStationChange}
              >
                {stations.map((s) => (
                  <Option
                    key={s._id}
                    value={s._id}
                    label={`${s.Station_Name || s.name}`}
                  >
                    {s.Station_Name || s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="vendor" label="Select Vendor" rules={[{ required: true }]}>
              <Select
                placeholder="Select vendor"
                showSearch
                onChange={handleVendorChange}
              >
                {vendors.map((v) => (
                  <Option key={v._id} value={v._id}>
                    {v.Vendor_Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="category" label="Select Category" rules={[{ required: true }]}>
              <Select placeholder="Select category" onChange={handleCategoryChange}>
                {categories.map((c) => (
                  <Option key={c._id || c.categoryName} value={c._id || c.categoryName}>
                    {c.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>Items</Divider>

        <div
          style={{
            maxHeight: cart.length > 3 ? 300 : "auto",
            overflowY: cart.length > 3 ? "auto" : "visible",
            border: "1px solid #eee",
            padding: 10,
            borderRadius: 4,
          }}
        >
          {cart.map((row, index) => (
            <Row gutter={8} align="middle" key={index} style={{ marginBottom: 8 }}>
              <Col flex="1 1 auto">
                <Select
                  placeholder="Select item"
                  value={row.itemId}
                  onChange={(val) => handleItemChange(index, val)}
                  style={{ width: "100%" }}
                >
                  {menuItems.map((item) => (
                    <Option key={item._id} value={item._id}>
                      <b>{item.name}</b> — ₹{item.price}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col flex="0 0 auto" style={{ display: "flex", alignItems: "center" }}>
                <Button size="small" onClick={() => decrementQty(index)}>-</Button>
                <InputNumber
                  min={1}
                  value={row.quantity}
                  onChange={(val) => handleQtyChange(index, val)}
                  style={{ width: 50, margin: "0 8px" }}
                />
                <Button size="small" onClick={() => incrementQty(index)}>+</Button>
              </Col>
              <Col flex="0 0 80px">₹{(row.price || 0) * (row.quantity || 0)}</Col>
              <Col flex="0 0 auto">
                <Button danger size="small" onClick={() => handleRemoveItem(index)}>
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={handleAddItem} block>
            + Add Item
          </Button>
        </div>

        {cart.length > 0 && (
          <>
            <Divider />
            <Row justify="space-between">
              <Col><b>Subtotal:</b></Col>
              <Col>₹{subTotal.toFixed(2)}</Col>
            </Row>
            <Row justify="space-between">
              <Col><b>Tax (5%):</b></Col>
              <Col>₹{tax.toFixed(2)}</Col>
            </Row>
            <Row justify="space-between">
              <Col><b>Total:</b></Col>
              <Col><b>₹{total.toFixed(2)}</b></Col>
            </Row>
          </>
        )}

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="trainNo" label="Train Number" rules={[{ required: true }]}>
              <Input placeholder="Train Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="trainName" label="Train Name" rules={[{ required: true }]}>
              <Input placeholder="Train Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Passenger Name" rules={[{ required: true }]}>
              <Input placeholder="Full Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
              <Input placeholder="Mobile Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="COD">Cash on Delivery</Radio>
                <Radio value="Online">Online</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrderModal;
