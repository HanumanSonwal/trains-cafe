"use client";
import React from "react";
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Divider,
  Card,
} from "antd";
import MenuSelector from "./MenuSelector";

export default function OrderFormContents({
  form,
  cart,
  station,
  vendor,
  categories,
  discountPercentage,
  setDiscountPercentage,
  resetKey,
  setStation,
  setVendor,
  setCart,
  setCategories,
  subTotal,
  discountAmount,
  tax,
  total,
  handleFinish,
}) {
  return (
    <div
      style={{
        maxHeight: "65vh",
        overflowY: "auto",
        paddingRight: 8,
        paddingBottom: 24,
      }}
    >
      <Divider orientation="left">Menu Details</Divider>
      <MenuSelector
        onUpdate={({ station, vendor, categories, cart }) => {
          setStation(station);
          setVendor(vendor);
          setCategories(categories);
          setCart(cart);
        }}
        initialStation={station}
        initialVendor={vendor}
        initialCategory={categories}
        initialCart={cart}
        resetKey={resetKey}
      />

      <Divider orientation="left">Train Details</Divider>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="trainNo" label="Train Number" rules={[{ required: true }]}>
              <Input placeholder="Train Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pnr" label="PNR Number" rules={[{ required: true }]}>
              <Input placeholder="PNR Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="seatNo" label="Seat Number" rules={[{ required: true }]}>
              <Input placeholder="Seat Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="coach" label="Coach" rules={[{ required: true }]}>
              <Input placeholder="Coach (e.g. S1, A3)" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Passenger Details</Divider>
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
          <Col span={12}>
            <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
              <Input placeholder="Mobile Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="alternateMobile" label="Alternate Mobile">
              <Input placeholder="Alternate Mobile Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="COD">Cash on Delivery</Radio>
                <Radio value="Online">Online</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="adminDiscount" label="Discount (%)">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Optional (e.g. 10)"
                value={discountPercentage}
                onChange={(e) => {
                  const val = parseFloat(e.target.value || "0");
                  setDiscountPercentage(isNaN(val) ? 0 : val);
                  form.setFieldsValue({ adminDiscount: val });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea placeholder="Any special instructions..." rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Order Summary</Divider>
        <Card size="small" bordered style={{ maxWidth: 400, marginTop: 8 }}>
          <Row justify="space-between" style={{ marginBottom: 8 }}>
            <Col>Subtotal:</Col>
            <Col>₹{subTotal.toFixed(2)}</Col>
          </Row>
          <Row justify="space-between" style={{ marginBottom: 8 }}>
            <Col>Discount ({discountPercentage}%):</Col>
            <Col>- ₹{discountAmount.toFixed(2)}</Col>
          </Row>
          <Row justify="space-between" style={{ marginBottom: 8 }}>
            <Col>Tax (5%):</Col>
            <Col>₹{tax.toFixed(2)}</Col>
          </Row>
          <Divider style={{ margin: "8px 0" }} />
          <Row justify="space-between">
            <Col><b>Total:</b></Col>
            <Col><b>₹{total.toFixed(2)}</b></Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
