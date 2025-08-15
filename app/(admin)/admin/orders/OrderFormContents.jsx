"use client";
import React from "react";
import { Form, Input, Radio, Row, Col, Divider, Card, Typography } from "antd";
import MenuSelector from "./MenuSelector";

export default function OrderFormContents({
  form,
  cart,
  station,
  vendor,
  categories,
  adminDiscountPercent,
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
  advanced,
  setAdvance,
  remainingAmount,
  couponAmount = 0,
  handleFinish,
}) {
  const { Text } = Typography;

  const hasAdminDiscount = discountAmount > 0;
  const hasCouponDiscount = couponAmount > 0;

  let totalDiscount = 0;
  if (hasAdminDiscount && hasCouponDiscount) {
    totalDiscount = discountAmount + couponAmount;
  } else if (hasAdminDiscount) {
    totalDiscount = discountAmount;
  } else if (hasCouponDiscount) {
    totalDiscount = couponAmount;
  }

  const discountedSubtotal = subTotal - totalDiscount;
  const calculatedTax = discountedSubtotal * 0.05;
  const calculatedTotal = discountedSubtotal + calculatedTax;
  const calculatedRemaining = calculatedTotal - advanced;

  let discountLabel = "";
  if (hasAdminDiscount && hasCouponDiscount) {
    discountLabel = "Admin + Coupon Discount";
  } else if (hasAdminDiscount) {
    discountLabel = "Admin Discount";
  } else if (hasCouponDiscount) {
    discountLabel = "Coupon Discount";
  }

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
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          handleFinish({ ...values, advanced });
        }}
      >
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
              name="pnr"
              label="PNR Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="PNR Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="seatNo"
              label="Seat Number"
              rules={[{ required: true }]}
            >
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
            <Form.Item name="alternateMobile" label="Alternate Mobile">
              <Input placeholder="Alternate Mobile Number" />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">Order Details</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Admin Discount %" name="adminDiscountPercent">
              <Input
                min={0}
                max={100}
                style={{ width: "100%" }}
                value={adminDiscountPercent}
                onChange={(e) => {
                  const val = parseFloat(e.target.value || "0");
                  setDiscountPercentage(val);
                  form.setFieldValue("adminDiscountPercent", val);
                }}
              />
            </Form.Item>

            <Form.Item name="advanced" label="Advance Payment (₹)">
              <Input
                type="number"
                min={0}
                placeholder="Advance amount"
                value={advanced}
                onChange={(e) => {
                  const val = parseFloat(e.target.value || "0");
                  setAdvance(isNaN(val) ? 0 : val);
                }}
              />
            </Form.Item>

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

          <Col span={12}>
            <Card size="small" bordered style={{ marginTop: 8 }}>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Col>
                  <Text>Subtotal:</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: "green" }}>
                    ₹{subTotal.toFixed(2)}
                  </Text>
                </Col>
              </Row>
              {totalDiscount > 0 && (
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>
                    <Text>
                      Discount{" "}
                      <span style={{ fontSize: 12, color: "#888" }}>
                        ({discountLabel})
                      </span>
                      :
                    </Text>
                  </Col>
                  <Col>
                    <Text type="danger">- ₹{totalDiscount.toFixed(2)}</Text>
                  </Col>
                </Row>
              )}

              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Col>
                  <Text>Tax (5%):</Text>
                </Col>
                <Col>
                  <Text style={{ color: "green" }}>
                    ₹{calculatedTax.toFixed(2)}
                  </Text>
                </Col>
              </Row>

              <Divider style={{ margin: "8px 0" }} />

              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Col>
                  <Text strong>Total:</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: "#1677ff" }}>
                    ₹{calculatedTotal.toFixed(2)}
                  </Text>
                </Col>
              </Row>

              <Row justify="space-between" style={{ marginBottom: 4 }}>
                <Col>
                  <Text>Advance:</Text>
                </Col>
                <Col>
                  <Text type="danger">- ₹{advanced.toFixed(2)}</Text>
                </Col>
              </Row>

              <Divider style={{ margin: "8px 0" }} />

              <Row justify="space-between">
                <Col>
                  <Text strong>Remaining:</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: "green" }}>
                    ₹{calculatedRemaining.toFixed(2)}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea
                placeholder="Any special instructions..."
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
