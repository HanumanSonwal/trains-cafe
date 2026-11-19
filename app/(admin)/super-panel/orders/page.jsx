"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Table, Button, DatePicker, Select, Input, message, Dropdown } from "antd";
import { PlusOutlined, DownloadOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import CreateOrderModal from "./CreateOrderModal";
import OrderTableColumns from "./OrderTableColumns";
import { CancelReasonModal, OrderNotesModal } from "./OrderNotes";
import { PageHeader, Panel } from "@/app/componants/admin/ui";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "All", label: "All statuses" },
  { value: "placed", label: "Placed" },
  { value: "confirm", label: "Confirm" },
  { value: "cancel", label: "Cancel" },
  { value: "dispatch", label: "Dispatch" },
  { value: "delivered", label: "Delivered" },
];

const OrdersTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalResetKey, setModalResetKey] = useState(0);
  const [notesFor, setNotesFor] = useState(null); // order id whose notes are open
  const [cancelling, setCancelling] = useState(null); // row being cancelled
  const [cancelBusy, setCancelBusy] = useState(false);

  const [filters, setFilters] = useState({ status: "All", from: null, to: null });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalDocs, setTotalDocs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const latest = useRef(0); // ignore answers from older requests

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const buildQueryParams = useCallback((f, extra = {}) => {
    const query = [];
    if (f.status && f.status !== "All") query.push(`status=${encodeURIComponent(f.status)}`);
    if (f.from) query.push(`from=${encodeURIComponent(f.from)}`);
    if (f.to) query.push(`to=${encodeURIComponent(f.to)}`);
    Object.keys(extra).forEach((key) => {
      if (extra[key] !== undefined && extra[key] !== "") query.push(`${key}=${encodeURIComponent(extra[key])}`);
    });
    return query.length > 0 ? `?${query.join("&")}` : "";
  }, []);

  const fetchData = useCallback(
    async (page = 1) => {
      const ticket = ++latest.current;
      setLoading(true);
      try {
        const query = buildQueryParams(filters, { page, limit: PAGE_SIZE, search: debouncedSearch });
        const response = await fetch(`/api/orders${query}`);
        const result = await response.json();
        if (ticket !== latest.current) return;

        if (result.success) {
          setDataSource(
            result.docs.map((order) => ({
              key: order._id,
              orderID: order._id,
              order_id: order.order_id,
              date: new Date(order.createdAt || order.updatedAt).toLocaleString(),
              Vendor_Name: order?.Vendor_Name || "N/A",
              Vendor_Details: order?.Vendor_Details || {},
              Items: order?.Items || [],
              subTotal: order?.subTotal || 0,
              tax: order?.payment?.tax || 0,
              couponAmount: order?.couponAmount || 0,
              adminDiscountValue: order?.adminDiscountValue || 0,
              advancedAmount: order?.payment?.advanced || 0,
              remainingAmount: order?.remainingAmount || 0,
              total: order?.total || 0,
              userDetails: order?.user_details || {},
              trainDetails: order?.train || {},
              station: order?.station?.name || "N/A",
              status: order?.status || "Pending",
              payment: order.payment || {},
              paymentStatus: order?.payment?.payment_status || "N/A",
              paymentMethod: order?.payment?.payment_method || "N/A",
              deliveryDateTime: order?.deliveryDateTime || order?.delivery_date || null,
              orderSource: order?.orderSource || null,
              notes: order?.notes || [],
              cancelReason: order?.cancelReason || "",
            }))
          );
          setTotalDocs(result.totalDocs || 0);
        } else {
          setDataSource([]);
          setTotalDocs(0);
          if (result.message && result.message !== "Orders not found") message.error(result.message);
        }
      } catch (error) {
        if (ticket === latest.current) message.error("Error fetching data");
      } finally {
        if (ticket === latest.current) setLoading(false);
      }
    },
    [filters, debouncedSearch, buildQueryParams]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const patchStatus = useCallback(
    async (record, status, reason) => {
      const res = await fetch(`/api/orders/status/${record.orderID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Failed to update order status");
    },
    []
  );

  const handleStatusChange = useCallback(
    async (value, record) => {
      // cancelling asks for a reason first
      if (value === "cancel") return setCancelling(record);
      try {
        await patchStatus(record, value);
        message.success("Order status updated");
        fetchData(currentPage);
      } catch (error) {
        message.error(error.message || "Error updating order status");
      }
    },
    [patchStatus, fetchData, currentPage]
  );

  const confirmCancel = async (reason) => {
    setCancelBusy(true);
    try {
      await patchStatus(cancelling, "cancel", reason);
      message.success("Order cancelled");
      setCancelling(null);
      fetchData(currentPage);
    } catch (error) {
      message.error(error.message || "Could not cancel the order");
    } finally {
      setCancelBusy(false);
    }
  };

  const handlePaymentStatusChange = useCallback(
    async (value, record) => {
      try {
        const res = await fetch(`/api/orders/paymentstatus/${record.orderID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_status: value }),
        });
        const result = await res.json();
        if (result.success) {
          message.success("Payment status updated");
          fetchData(currentPage);
        } else message.error(result.message || "Failed to update payment status");
      } catch (error) {
        message.error("Error updating payment status");
      }
    },
    [fetchData, currentPage]
  );

  const handleExport = useCallback(
    (format) => {
      window.open(`/api/orders/export${buildQueryParams(filters, { format })}`, "_blank");
    },
    [filters, buildQueryParams]
  );

  const columns = useMemo(
    () =>
      OrderTableColumns({
        handleStatusChange,
        handlePaymentStatusChange,
        setEditingOrder,
        setIsModalOpen,
        fetchData,
        currentPage,
        openNotes: (record) => setNotesFor(record.orderID),
      }),
    [handleStatusChange, handlePaymentStatusChange, fetchData, currentPage]
  );

  const notesOrder = useMemo(() => dataSource.find((o) => o.orderID === notesFor) || null, [dataSource, notesFor]);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Track, update and add notes to every order."
        actions={
          <>
            <Dropdown
              menu={{
                items: [
                  { key: "pdf", label: "Export as PDF" },
                  { key: "xlsx", label: "Export as Excel" },
                ],
                onClick: ({ key }) => handleExport(key),
              }}
            >
              <Button icon={<DownloadOutlined />}>
                Download <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingOrder(null);
                setIsModalOpen(true);
              }}
            >
              New order
            </Button>
          </>
        }
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search order ID, name, mobile, train, PNR"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320, maxWidth: "100%" }}
          />
          <Select
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, status: value }));
              setCurrentPage(1);
            }}
            style={{ width: 150 }}
          />
          <RangePicker
            onChange={(dates) => {
              setFilters((prev) => ({
                ...prev,
                from: dates?.[0]?.format("YYYY-MM-DD") || null,
                to: dates?.[1]?.format("YYYY-MM-DD") || null,
              }));
              setCurrentPage(1);
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            total: totalDocs,
            onChange: setCurrentPage,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            showTotal: (t) => `${t} orders`,
          }}
        />
      </Panel>

      <CreateOrderModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
          setModalResetKey((prev) => prev + 1);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
          fetchData(currentPage);
          setModalResetKey((prev) => prev + 1);
        }}
        initialData={editingOrder}
      />

      <CancelReasonModal open={!!cancelling} order={cancelling} loading={cancelBusy} onCancel={() => setCancelling(null)} onConfirm={confirmCancel} />
      <OrderNotesModal open={!!notesOrder} order={notesOrder} onClose={() => setNotesFor(null)} onChanged={() => fetchData(currentPage)} />
    </div>
  );
};

export default OrdersTable;
