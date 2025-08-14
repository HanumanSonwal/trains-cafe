"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, Input, Row, Col, Divider } from "antd";
import {
  fetchStations,
  fetchVendorsByStation,
  fetchCategoriesByVendor,
  clearVendors,
  clearCategories,
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
  const { stations, vendors, categories, loading } = useSelector(
    (state) => state.menu
  );

  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);
  const [categoriesManuallySelected, setCategoriesManuallySelected] =
    useState(false);
  const [cartInitializedFromProps, setCartInitializedFromProps] =
    useState(false);

  const initializedRef = useRef(false);
  const lastUpdateRef = useRef(null);

  const handleUpdate = useCallback(() => {
    const currentState = {
      station: selectedStation,
      vendor: selectedVendor,
      categories: selectedCategories,
      cart,
    };

    const stateString = JSON.stringify(currentState);
    if (lastUpdateRef.current !== stateString) {
      lastUpdateRef.current = stateString;
      onUpdate?.(currentState);
    }
  }, [selectedStation, selectedVendor, selectedCategories, cart, onUpdate]);

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  const handleStationSearch = (searchTerm) => {
    dispatch(fetchStations(searchTerm));
  };

  useEffect(() => {
    if (initializedRef.current || !initialStation || !initialVendor) return;

    initializedRef.current = true;
    setSelectedStation(initialStation);
    setSelectedVendor(initialVendor);

    dispatch(fetchVendorsByStation(initialStation.code || initialStation.name));
    dispatch(
      fetchCategoriesByVendor({ vendorId: initialVendor._id, isVeg: true })
    );

    if (initialCart?.length) {
      setCart(initialCart);
      setCartInitializedFromProps(true);
    }

    if (initialCategory?.length) {
      setSelectedCategories(initialCategory);
      setCategoriesInitialized(true);
    }
  }, [initialStation, initialVendor, initialCart, initialCategory, dispatch]);

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
      cart.length &&
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
    handleUpdate();
  }, [handleUpdate]);

  const handleStationChange = (id) => {
    const station = stations.find((s) => s._id === id);

    dispatch(clearVendors());
    dispatch(clearCategories());

    setSelectedStation(station);
    setSelectedVendor(null);
    resetVendorData();

    if (station) {
      dispatch(fetchVendorsByStation(station.code || station.name));
    }
  };

  const handleVendorChange = (id) => {
    const vendor = vendors.find((v) => v._id === id);

    dispatch(clearCategories());

    setSelectedVendor(vendor);
    resetVendorData();

    if (vendor) {
      dispatch(fetchCategoriesByVendor({ vendorId: vendor._id, isVeg: true }));
    }
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
    setCart((prev) => [
      ...prev,
      { itemId: null, quantity: 1, price: 0, name: "" },
    ]);
  };

  const handleItemChange = (index, id) => {
    const item = menuItems.find((i) => (i._id || i.Item_Id) === id);
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index] = {
        ...newCart[index],
        itemId: id,
        price: item?.price || item?.Price || 0,
        name: item?.name || item?.Item_Name || "",
      };
      return newCart;
    });
  };

  const handleQtyChange = (index, qty) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = qty || 1;
      return newCart;
    });
  };

  const incrementQty = (index) =>
    handleQtyChange(index, cart[index].quantity + 1);
  const decrementQty = (index) =>
    handleQtyChange(index, Math.max(1, cart[index].quantity - 1));
  const handleRemove = (index) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const resetVendorData = () => {
    setSelectedCategories([]);
    setMenuItems([]);
    setCart([]);
    setCategoriesInitialized(false);
    setCategoriesManuallySelected(false);
    setCartInitializedFromProps(false);
  };

  useEffect(() => {
    const isEditMode =
      !!initialStation && !!initialVendor && !!initialCart?.length;

    if (!isEditMode) {
      setSelectedStation(null);
      setSelectedVendor(null);
      resetVendorData();
    } else {
      setSelectedStation(initialStation);
      setSelectedVendor(initialVendor);
      setCart(initialCart || []);
      setCartInitializedFromProps(true);
    }

    setCategoriesInitialized(false);
    setCategoriesManuallySelected(false);
    initializedRef.current = false;
  }, [resetKey]);

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <label>Station</label>
          <Select
            showSearch
            value={
              selectedStation
                ? {
                    value: selectedStation._id,
                    label: selectedStation.Station_Name || selectedStation.name,
                  }
                : undefined
            }
            labelInValue
            placeholder="Select station"
            style={{ width: "100%" }}
            onChange={(val) => handleStationChange(val.value)}
            onSearch={(value) => handleStationSearch(value)}
            loading={loading}
            filterOption={false}
            notFoundContent={loading ? "Loading..." : "No stations found"}
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
            value={selectedVendor?._id || undefined}
            placeholder="Select vendor"
            style={{ width: "100%" }}
            onChange={handleVendorChange}
            loading={loading || !selectedStation}
            filterOption={(input, option) =>
              (option.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={!selectedStation}
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
            value={selectedCategories.map((c) => c._id)}
            placeholder="Select categories"
            style={{ width: "100%" }}
            onChange={handleCategoryChange}
            loading={loading || !selectedVendor}
            filterOption={(input, option) =>
              (option.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={!selectedVendor}
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
              value={
                row.itemId
                  ? {
                      value: row.itemId,
                      label: `${row.name}  -   ₹${row.price?.toFixed(2) || 0}`,
                    }
                  : undefined
              }
              labelInValue
              style={{ width: "100%" }}
              onChange={(val) => handleItemChange(index, val.value)}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {menuItems.map((item) => {
                const itemId = item._id || item.Item_Id;
                const itemName = item.name || item.Item_Name || "";
                const itemPrice = item.price || item.Price || 0;

                return (
                  <Option
                    key={itemId}
                    value={itemId}
                    label={`${itemName} (₹${itemPrice.toFixed(2)})`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{itemName}</span>
                      <span style={{ color: "#16ADA8", fontWeight: "bold" }}>
                        ₹{itemPrice.toFixed(2)}
                      </span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col flex="0 0 auto">
            <Button size="small" onClick={() => decrementQty(index)}>
              -
            </Button>
            <Input
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
            ₹{((row.price || 0) * (row.quantity || 0)).toFixed(2)}
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
