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
import MenuSelector from "./MenuSelector";

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
  const [resetKey, setResetKey] = useState(0);
const [submitting, setSubmitting] = useState(false);

  console.log(station, vendor, "initial-Data-categories");

  const isEditMode = !!initialData?.orderID;

  console.log(isEditMode, "is-Edit-Mode");

  const resetAll = () => {
    form.resetFields();
    setStation(null);
    setVendor(null);
    setCategories([]);
    setCart([]);
  };
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!initialData?.orderID) {
        resetAll();
        return;
      }

      try {
        const res = await fetch(`/api/orders/get?id=${initialData.orderID}`);
        const { success, order } = await res.json();

        if (!success || !order) {
          message.error("Failed to load order");
          return;
        }

        const vendorObj = {
          Vendor_Name: order.Vendor_Name,
          ...order.Vendor_Details,
        };

        const stationObj = {
          ...order.Station_Details,
        };

        form.setFieldsValue({
          name: order.user_details?.name || "",
          email: order.user_details?.email || "",
          mobile: order.user_details?.mobile || "",
          alternateMobile: order.user_details?.alternateMobile || "",
          pnr: order.user_details?.pnr || "",
          coach: order.user_details?.coach || "",
          seatNo: order.user_details?.seatNo || "",
          instructions: order.user_details?.instructions || "",
          paymentMethod: order.payment?.payment_method || "",
          trainNo: order.train?.train_number || "",
          trainName: order.train?.train_name || "",
        });

        const categoryMap = {};

        order.Items?.forEach((item) => {
          const cat = item.MenuItem?.Category;
          if (!cat?.Category_Id) return;

          const categoryId = cat.Category_Id;

          if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = {
              _id: categoryId,
              categoryId: categoryId,
              categoryName: cat.Title,
              categoryImage: cat.Image,
              station: stationObj,
              vendor: vendorObj,
              items: [],
            };
          }

          categoryMap[categoryId].items.push({
            _id: item.MenuItem.Item_Id,
            name: item.MenuItem.Item_Name,
            price: item.MenuItem.Price,
            description: item.MenuItem.Description,
            vendor: vendorObj,
            foodType: item.MenuItem.Food_Type,
            image: item.MenuItem.image,
            quantity: item.Quantity || 1,
          });
        });

        const formattedCategoryList = Object.values(categoryMap);

        setStation(stationObj);
        setVendor(vendorObj);
        setCategories(formattedCategoryList);

        const fullCart = formattedCategoryList.flatMap((cat) => cat.items);
        setCart(fullCart);
      } catch (error) {
        console.error("Order fetch error:", error);
        message.error("Error fetching order details");
      }
    };

    if (open) {
      fetchOrderDetails();
    }
  }, [initialData?.orderID, open]);

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
  setSubmitting(true);
    const body = {
      vendor,
      station,
      train: {
        trainNo: values.trainNo,
        pnr: values.pnr,
        seatNo: values.seatNo,
        coach: values.coach,
      },
      payment: {
        method: values.paymentMethod,
      },
      cart: cart.map((i) => ({
        _id: i.itemId,
        name: i.name,
        price: i.price,
        description: i.description,
        vendor: i.vendor,
        foodType: i.foodType,
        image: i.image,
        quantity: i.quantity,
      })),
      user_details: {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        alternateMobile: values.alternateMobile || "",
        instructions: values.notes || "",
        pnr: values.pnr,
        trainNo: values.trainNo,
        coach: values.coach,
        seatNo: values.seatNo,
        instructions: values.instructions,
      },
      couponCode: "",
      discount: 0,
    };

    try {
      const url = isEditMode
        ? `/api/orders/update/${initialData.orderID}`
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
        setResetKey((prev) => prev + 1);
      } else {
        message.error(result.message || "Something went wrong");
      }
  } catch (err) {
    message.error("Server error");
  } finally {
    setSubmitting(false); // ✅ Stop loading
  }
};

  const handleCancel = () => {
    resetAll();
    setResetKey((prev) => prev + 1);

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
  loading={submitting} // 🔁 Here is the change
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
          resetKey={resetKey}
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="pnr"
                label="PNR Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="PNR Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="seatNo"
                label="Seat Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Seat Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="coach"
                label="Coach"
                rules={[{ required: true }]}
              >
                <Input placeholder="Coach (e.g. S1, A3)" />
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
            <Col span={12}>
              <Form.Item name="alternateMobile" label="Alternate Mobile">
                <Input placeholder="Alternate Mobile Number" />
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="instructions"
                label="Instructions"
                rules={[{ required: false }]}
              >
                <Input.TextArea
                  placeholder="Any special instructions..."
                  rows={4}
                />
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
