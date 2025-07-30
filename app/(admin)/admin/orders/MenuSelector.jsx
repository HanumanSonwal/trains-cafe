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
  resetKey,
}) {
  const dispatch = useDispatch();
  const { stations, vendors, categories } = useSelector((state) => state.menu);

  console.log(vendors, "vendors-data");

  const [selectedStation, setSelectedStation] = useState(
    initialStation || null
  );
  const [selectedVendor, setSelectedVendor] = useState(initialVendor || null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);
  const [categoriesManuallySelected, setCategoriesManuallySelected] =
    useState(false);
  const [cartInitializedFromProps, setCartInitializedFromProps] =
    useState(false);

  console.log(selectedVendor, "selected-Vendor");

  const initializedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchStations());
  }, []);

  useEffect(() => {
    if (
      initializedRef.current ||
      !initialStation ||
      !initialVendor ||
      !initialCategory
    )
      return;

    initializedRef.current = true;

    setSelectedStation(initialStation);
    dispatch(fetchVendorsByStation(initialStation.code || initialStation.name));

    setSelectedVendor(initialVendor);
    dispatch(
      fetchCategoriesByVendor({ vendorId: initialVendor._id, isVeg: true })
    );

    if (initialCategory?.length) {
      setSelectedCategories(initialCategory);

      const allItems = initialCategory.flatMap((cat) => cat.items || []);
      setMenuItems(allItems);

      if (allItems?.length) {
        const derivedCart = allItems.map((item) => ({
          itemId: item._id,
          quantity: item.quantity || 1,
          price: item.price || item.Price || 0,
          name: item.name || item.Item_Name || "",
        }));

        setCart(derivedCart);
        setCartInitializedFromProps(true);
      }
    }
  }, [initialStation, initialVendor, initialCategory]);

  useEffect(() => {
    const allItems = selectedCategories.flatMap(
      (cat) => cat.items || cat.menuItems || []
    );
    setMenuItems(allItems);
  }, [selectedCategories]);

  useEffect(() => {
    if (
      categories.length &&
      !categoriesInitialized &&
      !categoriesManuallySelected &&
      !cartInitializedFromProps
    ) {
      const cartItemIds = new Set(cart.map((item) => item.itemId));
      const matched = categories.filter((cat) =>
        (cat.items || cat.menuItems || []).some((i) =>
          cartItemIds.has(i._id || i.Item_Id)
        )
      );
      setSelectedCategories(matched);
      setCategoriesInitialized(true);
    }
  }, [
    categories,
    cart,
    categoriesInitialized,
    categoriesManuallySelected,
    cartInitializedFromProps,
  ]);

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
    const selected = categories.filter((c) =>
      ids.includes(c._id || c.Category_Id)
    );
    setSelectedCategories(selected);
    setCategoriesManuallySelected(true);
    setCartInitializedFromProps(false);
  };

  const handleAddItem = () => {
    setCart([...cart, { itemId: null, quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, id) => {
    const item = menuItems.find((i) => i._id === id || i.Item_Id === id);
    const newCart = [...cart];
    newCart[index] = {
      ...newCart[index],
      itemId: id,
      price: item?.price || item?.Price || 0,
      name: item?.name || item?.Item_Name || "",
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
    setSelectedCategories([]);
    setMenuItems([]);
    setCart([]);
    setCategoriesInitialized(false);
    setCategoriesManuallySelected(false);
    setCartInitializedFromProps(false);
    initializedRef.current = false;
  };

  useEffect(() => {
    const isEditMode =
      !!initialStation && !!initialVendor && !!initialCart?.length;

    if (!isEditMode) {
      resetAll();
      setSelectedStation(null);
      setSelectedVendor(null);
      setCart([]);
    } else {
      setSelectedStation(initialStation);
      setSelectedVendor(initialVendor);
      setCart(initialCart || []);
    }

    setCategoriesInitialized(false);
    setCategoriesManuallySelected(false);
    setCartInitializedFromProps(false);
    initializedRef.current = false;
  }, [resetKey]);

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
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
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
              <Option
                key={c._id || c.Category_Id}
                value={c._id || c.Category_Id}
              >
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
                <Option
                  key={item._id || item.Item_Id}
                  value={item._id || item.Item_Id}
                >
                  <b>{item.name || item.Item_Name}</b> — ₹
                  {item.price || item.Price}
                </Option>
              ))}
            </Select>
          </Col>

          <Col flex="0 0 auto">
            <Button size="small" onClick={() => decrementQty(index)}>
              -
            </Button>
            <InputNumber
              min={1}
              value={row.quantity}
              onChange={(val) => handleQtyChange(index, val)}
              style={{ width: 50, margin: "0 8px" }}
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
