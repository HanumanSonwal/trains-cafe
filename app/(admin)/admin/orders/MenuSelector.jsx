"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, InputNumber, Row, Col, Divider } from "antd";
import {
  fetchStations,
  fetchVendorsByStation,
  fetchCategoriesByVendor,
} from "@/app/redux/menuSlice";

const { Option } = Select;

export default function MenuSelector({
  onUpdate,
  initialStation,
  initialVendor,
  initialCart,
  initialCategory,
}) {
  const dispatch = useDispatch();
  const { stations, vendors, categories } = useSelector((state) => state.menu);

  const [selectedStation, setSelectedStation] = useState(initialStation || null);
  const [selectedVendor, setSelectedVendor] = useState(initialVendor || null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);
  const [categoriesManuallySelected, setCategoriesManuallySelected] = useState(false);
  const [cartInitializedFromProps, setCartInitializedFromProps] = useState(false); // NEW

  console.log(initialCart ,"initial-Cart-data")

  // Load stations
  useEffect(() => {
    dispatch(fetchStations());
  }, []);


  const initializedRef = useRef(false);

useEffect(() => {
  // Wait for props to be available
  if (
    initializedRef.current ||
    !initialStation ||
    !initialVendor ||
    !initialCart ||
    !initialCategory
  )
    return;

  initializedRef.current = true;

  if (initialStation?._id) {
    setSelectedStation(initialStation);
    dispatch(fetchVendorsByStation(initialStation.code || initialStation.name));
  }

  if (initialVendor?._id) {
    setSelectedVendor(initialVendor);
    dispatch(fetchCategoriesByVendor({ vendorId: initialVendor._id, isVeg: true }));
  }

  if (initialCart?.length) {
    const items = initialCart.map(({ Item_Id, Item_Name, Price }) => ({
      Item_Id,
      Item_Name,
      Price,
    }));

    const cartItems = initialCart.map(({ Item_Id, Quantity, Price, Item_Name }) => ({
      itemId: Item_Id,
      quantity: Quantity || 1,
      price: Price || 0,
      name: Item_Name,
    }));

    setMenuItems((prev) => {
      const ids = new Set(prev.map((i) => i.Item_Id));
      return [...prev, ...items.filter((i) => !ids.has(i.Item_Id))];
    });

    setCart(cartItems);
    setCartInitializedFromProps(true);
  }

  if (initialCategory?.length) {
    setSelectedCategories(initialCategory);
    setMenuItems(initialCategory.flatMap((cat) => cat.menuItems || []));
  }
}, [initialStation, initialVendor, initialCart, initialCategory]); // dependencies added


  // Auto-select categories based on cart
  useEffect(() => {
    if (
      categories.length &&
      !categoriesInitialized &&
      !categoriesManuallySelected &&
      !cartInitializedFromProps
    ) {
      const cartItemIds = new Set(cart.map((item) => item.itemId));
      const matched = categories.filter((cat) =>
        (cat.menuItems || []).some((i) => cartItemIds.has(i.Item_Id))
      );
      if (!matched.length && selectedCategories.length) return;
      setSelectedCategories(matched);
      setMenuItems(matched.flatMap((cat) => cat.menuItems || []));
      setCategoriesInitialized(true);
    }
  }, [categories, cart, categoriesInitialized, categoriesManuallySelected, cartInitializedFromProps]);

  // Update parent on change
  useEffect(() => {
    onUpdate({
      station: selectedStation,
      vendor: selectedVendor,
      categories: selectedCategories,
      cart,
    });
  }, [selectedStation, selectedVendor, selectedCategories, cart]);

  const handleStationChange = (id) => {
    const station = stations.find((s) => s._id === id);
    setSelectedStation(station);
    resetAll();
    dispatch(fetchVendorsByStation(station.code || station.name));
  };

  const handleVendorChange = (id) => {
    const vendor = vendors.find((v) => v._id === id);
    setSelectedVendor(vendor);
    resetAll();
    dispatch(fetchCategoriesByVendor({ vendorId: vendor._id, isVeg: true }));
  };

  const handleCategoryChange = (ids) => {
    const selected = categories.filter((c) => ids.includes(c._id || c.Category_Id));
    setSelectedCategories(selected);
    setMenuItems(selected.flatMap((c) => c.menuItems || []));
    setCategoriesManuallySelected(true);
    setCartInitializedFromProps(false); // now allow auto changes
  };

  const handleAddItem = () => {
    setCart([...cart, { itemId: null, quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, id) => {
    const item = menuItems.find((i) => i.Item_Id === id);
    const newCart = [...cart];
    newCart[index] = {
      ...newCart[index],
      itemId: id,
      price: item?.Price || 0,
      name: item?.Item_Name || "",
    };
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

  const resetAll = () => {
    setSelectedVendor(null);
    setSelectedCategories([]);
    setMenuItems([]);
    setCart([]);
    setCategoriesInitialized(false);
    setCategoriesManuallySelected(false);
    setCartInitializedFromProps(false);
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
          >
            {stations.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.Station_Name || s.name}
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
            value={selectedCategories.map((c) => c._id || c.Category_Id)}
            placeholder="Select categories"
            style={{ width: "100%" }}
            onChange={handleCategoryChange}
          >
            {categories.map((c) => (
              <Option key={c._id || c.Category_Id} value={c._id || c.Category_Id}>
                {c.Title || c.categoryName}
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
                <Option key={item.Item_Id} value={item.Item_Id}>
                  <b>{item.Item_Name}</b> — ₹{item.Price}
                </Option>
              ))}
            </Select>
          </Col>

          <Col flex="0 0 auto">
            <Button size="small" onClick={() => decrementQty(index)}>-</Button>
            <InputNumber
              min={1}
              value={row.quantity}
              onChange={(val) => handleQtyChange(index, val)}
              style={{ width: 50, margin: "0 8px" }}
            />
            <Button size="small" onClick={() => incrementQty(index)}>+</Button>
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
