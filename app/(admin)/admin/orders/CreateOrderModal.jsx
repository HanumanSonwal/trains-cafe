"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, message, Form, Spin } from "antd";
import OrderFormContents from "./OrderFormContents";
import { LoadingOutlined } from "@ant-design/icons";

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
  const [adminDiscountPercent, setDiscountPercentage] = useState(0);
  const [advanced, setAdvance] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // These hold fetched values directly from API when editing
  const [subTotal, setSubTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const isEditMode = !!initialData?.orderID;

  const resetAll = () => {
    form.resetFields();
    setStation(null);
    setVendor(null);
    setCategories([]);
    setCart([]);
    setDiscountPercentage(0);
    setAdvance(0);
    setSubTotal(0);
    setDiscountAmount(0);
    setTax(0);
    setTotal(0);
    setRemainingAmount(0);
  };

  useEffect(() => {
    if (cart.length === 0 && !isEditMode) {
      setDiscountPercentage(0);
      form.setFieldsValue({ adminDiscount: 0 });
    }
  }, [cart, isEditMode]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!initialData?.orderID) {
        resetAll();
        return;
      }
      setLoadingOrder(true);
      try {
        const res = await fetch(`/api/orders/get?id=${initialData.orderID}`);
        const { success, order } = await res.json();
        if (!success || !order) return message.error("Failed to load order");

        const vendorObj = {
          Vendor_Name: order.Vendor_Name,
          ...order.Vendor_Details,
        };
        const stationObj = { ...order.Station_Details };

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
          adminDiscountPercent: order?.adminDiscountPercent || "",
          couponAmount: order?.couponAmount || 0,
          advanced: order?.payment?.advanced || "",
          remainingAmount: order?.remainingAmount || "",
        });

        // Set calculation fields directly from API response
        setSubTotal(order.subTotal || 0);
        setDiscountPercentage(order?.adminDiscountPercent || 0);
        setDiscountAmount(order?.adminDiscountValue || 0);
        setTax(order?.payment?.tax || order.tax || 0);
        setTotal(order?.total || 0);
        setAdvance(order?.payment?.advanced || 0);
        setRemainingAmount(order?.remainingAmount || 0);

        // Build categories & cart
        const categoryMap = {};
        order.Items?.forEach((item) => {
          const cat = item.MenuItem?.Category;
          if (!cat?.Category_Id) return;

          const categoryId = cat.Category_Id;
          if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = {
              _id: categoryId,
              categoryId,
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
        setCart(formattedCategoryList.flatMap((cat) => cat.items));
      } catch (error) {
        console.error("Order fetch error:", error);
        message.error("Error fetching order details");
      } finally {
        setLoadingOrder(false);
      }
    };

    if (open) fetchOrderDetails();
  }, [initialData?.orderID, open]);

  // For create mode, calculate locally
  const calculatedSubTotal = !isEditMode
    ? cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0)
    : subTotal;
  const calculatedDiscountAmount = !isEditMode
    ? (calculatedSubTotal * adminDiscountPercent) / 100
    : discountAmount;
  const calculatedDiscountedSubtotal =
    calculatedSubTotal - calculatedDiscountAmount;
  const calculatedTax = !isEditMode
    ? calculatedDiscountedSubtotal * 0.05
    : tax;
  const calculatedTotal = !isEditMode
    ? calculatedDiscountedSubtotal + calculatedTax
    : total;
  const calculatedRemainingAmount = !isEditMode
    ? calculatedTotal - advanced
    : remainingAmount;

  const handleFinish = async (values) => {
    if (!station || !vendor || !cart.length)
      return message.error("Please select station, vendor and at least 1 item");

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
        advanced,
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
        instructions: values.instructions,
        pnr: values.pnr,
        trainNo: values.trainNo,
        coach: values.coach,
        seatNo: values.seatNo,
      },
      couponCode: "",
      discount: 0,
      adminDiscountPercent: adminDiscountPercent,
    };
    try {
      const url = isEditMode
        ? `/api/orders/update/${initialData.orderID}`
        : `/api/orders/place-order`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetAll();
    setResetKey((prev) => prev + 1);
    onCancel?.();
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

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
          loading={submitting || loadingOrder}
        >
          {isEditMode ? "Update Order" : "Place Order"}
        </Button>
      }
      width={900}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Spin spinning={loadingOrder} indicator={antIcon}>
        <OrderFormContents
          form={form}
          cart={cart}
          station={station}
          vendor={vendor}
          categories={categories}
          adminDiscountPercent={adminDiscountPercent}
          setDiscountPercentage={setDiscountPercentage}
          resetKey={resetKey}
          setStation={setStation}
          setVendor={setVendor}
          setCart={setCart}
          setCategories={setCategories}
          subTotal={calculatedSubTotal}
          discountAmount={calculatedDiscountAmount}
          tax={calculatedTax}
          total={calculatedTotal}
          advanced={advanced}
          setAdvance={setAdvance}
          remainingAmount={calculatedRemainingAmount}
          handleFinish={handleFinish}
        />
      </Spin>
    </Modal>
  );
}
