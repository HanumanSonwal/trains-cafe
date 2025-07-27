"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, Button, InputNumber, Row, Col, Divider, message } from "antd";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";

const { Option } = Select;

export default function MenuSelector({
  onUpdate,
  initialStation,
  initialVendor,
  initialCategory,
  initialCart,
}) {
  const [stations, setStations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(initialCart || []);
  const [selectedStation, setSelectedStation] = useState(
    initialStation || null
  );
  const [selectedVendor, setSelectedVendor] = useState(initialVendor || null);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory || []
  );

  console.log(selectedCategories, "selected-Categories");

  useEffect(() => {
    setSelectedStation(initialStation || null);
    setSelectedVendor(initialVendor || null);
    setSelectedCategories(initialCategory || []);
    setCart(initialCart || []);
  }, [initialStation, initialVendor, initialCategory, initialCart]);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    onUpdate({
      station: selectedStation,
      vendor: selectedVendor,
      categories: selectedCategories,
      cart,
    });
  }, [selectedStation, selectedVendor, selectedCategories, cart]);

  const fetchStations = async () => {
    const res = await fetch("/api/station?search=&page=0");
    const data = await res.json();
    if (data.success) setStations(data.data);
    else message.error("Failed to load stations");
  };

  const fetchVendors = async (stationCode) => {
    const res = await fetch(`/api/vendors?stationcode=${stationCode}`);
    const data = await res.json();
    if (data.success) setVendors(data.data);
    else message.error("Failed to load vendors");
  };

  const fetchCategories = useCallback(async (vendorId) => {
    try {
      const response = await getVendorCategoriesAndMenuItems(vendorId, true);
      console.log(response, "category-response");

      if (response) {
        setCategories(response);
      } else {
        console.warn("No valid category data found");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const handleStationChange = (id) => {
    const s = stations.find((s) => s._id === id);
    setSelectedStation(s);
    setSelectedVendor(null);
    setSelectedCategories([]);
    setVendors([]);
    setCategories([]);
    setMenuItems([]);
    setCart([]);
    if (s) fetchVendors(s.code || s.name);
  };

  const handleVendorChange = (id) => {
    const v = vendors.find((v) => v._id === id);
    setSelectedVendor(v);
    setSelectedCategories([]);
    setCategories([]);
    setMenuItems([]);
    setCart([]);
    if (v) fetchCategories(v._id);
  };

  const handleCategoryChange = (ids) => {
    const selected = categories.filter(
      (c) => ids.includes(c._id) || ids.includes(c.categoryName)
    );
    setSelectedCategories(selected);
    const mergedItems = selected.flatMap((c) => c.items || []);
    setMenuItems(mergedItems);
  };

  const handleAddItem = () => {
    setCart([...cart, { itemId: null, quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, id) => {
    const item = menuItems.find((m) => m._id === id);
    const newCart = [...cart];
    newCart[index].itemId = id;
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
    if (newCart[index].quantity > 1) newCart[index].quantity -= 1;
    setCart(newCart);
  };

  const handleRemove = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <label>Station</label>
          <Select
            showSearch
            value={selectedStation?._id}
            placeholder="Select station"
            style={{ width: "100%" }}
            onChange={handleStationChange}
            filterOption={(input, option) => {
              const label = option?.children;
              return label
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            {stations.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.Station_Name || s.name || ""}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <label>Vendor</label>
          <Select
            showSearch
            value={selectedVendor?._id}
            placeholder="Select vendor"
            style={{ width: "100%" }}
            onChange={handleVendorChange}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {vendors.map((v) => (
              <Option key={v._id} value={v._id}>
                {v.Vendor_Name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <label>Category</label>
          <Select
            mode="multiple"
            showSearch
            value={selectedCategories.map((c) => c._id || c.categoryName)}
            placeholder="Select categories"
            style={{ width: "100%" }}
            onChange={handleCategoryChange}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {categories.map((c) => (
              <Option
                key={c._id || c.categoryName}
                value={c._id || c.categoryName}
              >
                {c.categoryName}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Divider />

      {cart.map((row, index) => (
        <Row key={index} align="middle" gutter={20} style={{ marginBottom: 8 }}>
          <Col flex="0 0 500px">
            <Select
              placeholder="Select item"
              value={row.itemId}
              style={{ width: "100%" }}
              onChange={(val) => handleItemChange(index, val)}
            >
              {menuItems.map((item) => (
                <Option key={item._id} value={item._id}>
                  <b>{item.name}</b> — ₹{item.price}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            flex="0 0 auto"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button size="small" onClick={() => decrementQty(index)}>
              -
            </Button>
            <InputNumber
              className="no-arrows"
              min={1}
              value={row.quantity}
              onChange={(val) => handleQtyChange(index, val)}
              style={{ width: 50, margin: "0 8px", textAlign: "center" }}
            />
            <Button size="small" onClick={() => incrementQty(index)}>
              +
            </Button>
          </Col>
          <Col flex="0 0 auto" style={{ fontWeight: "bold", color: "#16ADA8" }}>
            ₹{(row.price || 0) * (row.quantity || 0)}
          </Col>
          <Col flex="0 0 auto">
            <Button danger size="small" onClick={() => handleRemove(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}

      <Button type="dashed" onClick={handleAddItem} block>
        + Add Item
      </Button>
    </>
  );
}
