// "use client";

// import { Table, Tag, Button, Card, Spin, message } from "antd";
// import { useEffect, useState } from "react";
// import dayjs from "dayjs";

// const cardStyle = {
//   borderRadius: "14px",
//   backgroundColor: "#FFF9E6",
//   border: "1.5px solid #D6872A",
//   height: "100%",
//   transition: "all 0.3s ease",
//   boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// };

// const formatDate = (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "-");

// const formatAmount = (val) =>
//   val !== null && val !== undefined && !isNaN(val)
//     ? Number(val).toFixed(2)
//     : "0.00";

// export default function SettlementHistory({ vendorId }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [tableParams, setTableParams] = useState({
//     pagination: {
//       current: 1,
//       pageSize: 10,
//       showSizeChanger: true,
//       pageSizeOptions: ["5", "10", "20"],
//       showTotal: (total) => `Total ${total} settlements`,
//     },
//   });

//   const fetchHistory = async (pagination = tableParams.pagination) => {
//     if (!vendorId) return;

//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/settlement/history?vendorid=${vendorId}&page=${pagination.current}&limit=${pagination.pageSize}`
//       );

//       const result = await res.json();

//       if (!result.success) {
//         throw new Error(result.message);
//       }

//       setData(result.data || []);
//       setTableParams({
//         pagination: {
//           ...pagination,
//           total: result.pagination?.total || 0,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to load settlement history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, [vendorId]);

//   const handleTableChange = (pagination) => {
//     fetchHistory(pagination);
//   };

//   const columns = [
//     {
//       title: "Settlement Period",
//       render: (_, r) => (
//         <b>
//           {formatDate(r.startDate)} → {formatDate(r.endDate)}
//         </b>
//       ),
//     },
//     {
//       title: "Amount ₹",
//       dataIndex: "settlementAmount",
//       align: "right",
//       render: (v) => <b>₹{formatAmount(v)}</b>,
//     },
//     {
//       title: "Settlement Status",
//       dataIndex: "settlementStatus",
//       render: (v) => {
//         let color = "green";
//         if (v === "Cafe Should Pay") color = "orange";
//         if (v === "Cafe Should Receive") color = "red";

//         return (
//           <Tag color={color} style={{ fontWeight: 500 }}>
//             {v}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Payment",
//       dataIndex: "isPaid",
//       render: (v) =>
//         v ? <Tag color="green">PAID</Tag> : <Tag color="red">UNPAID</Tag>,
//     },
//    {
//   title: "Invoice",
//   align: "center",
//   render: (_, r) => (
//     <Button
//   type="link"
//   style={{ color: "#D6872A", fontWeight: 500 }}
//   onClick={async () => {
//     try {
//       const res = await fetch("/api/settlement/invoice", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           vendorName: "Vendor", // fallback
//           startDate: formatDate(r.startDate),
//           endDate: formatDate(r.endDate),
//           settlementAmount: r.settlementAmount,
//           settlementStatus: r.settlementStatus,
//         }),
//       });

//       if (!res.ok) throw new Error();

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "vendor_settlement_invoice.pdf";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);
//     } catch {
//       message.error("Failed to download invoice");
//     }
//   }}
// >
//   Download
// </Button>

//   ),
// }

//   ];

//   return (
//     <Card
//       title="Settlement History"
//       style={cardStyle}
//       headStyle={{ fontWeight: 600 }}
//     >
//       <Spin spinning={loading}>
//         <Table
//           rowKey="_id"
//           columns={columns}
//           dataSource={data}
//           pagination={tableParams.pagination}
//           onChange={handleTableChange}
//           locale={{
//             emptyText: "No settlement history found",
//           }}
//         />
//       </Spin>
//     </Card>
//   );
// }


"use client";

import { Table, Tag, Button, Card, Spin, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  DownloadOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const cardStyle = {
  borderRadius: "16px",
  backgroundColor: "#FFF9E6",
  border: "2px solid #D6872A",
  boxShadow: "0 6px 16px rgba(214, 135, 42, 0.12)",
  transition: "all 0.3s ease",
};

const formatDate = (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "-");

const formatDateTime = (date) =>
  date ? dayjs(date).format("DD-MMM-YYYY hh:mm A") : "-";

const formatAmount = (val) =>
  val !== null && val !== undefined && !isNaN(val)
    ? Number(val).toFixed(2)
    : "0.00";

export default function SettlementHistory({ vendorId, refreshKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => 
        `${range[0]}-${range[1]} of ${total} settlement${total !== 1 ? "s" : ""}`,
    },
  });

  const fetchHistory = async (pagination = tableParams.pagination) => {
    if (!vendorId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/settlement/history?vendorid=${vendorId}&page=${pagination.current}&limit=${pagination.pageSize}`
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setData(result.data || []);
      setTableParams({
        pagination: {
          ...pagination,
          total: result.pagination?.total || 0,
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to load settlement history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [vendorId, refreshKey]);

  const handleTableChange = (pagination) => {
    fetchHistory(pagination);
  };

  const handleDownloadInvoice = async (record) => {
    setDownloadingId(record._id);
    try {
      const res = await fetch("/api/settlement/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName: record.vendor?.Vendor_Name || "Vendor",
          startDate: formatDate(record.startDate),
          endDate: formatDate(record.endDate),
          settlementAmount: record.settlementAmount,
          settlementStatus: record.settlementStatus,
          onlineAmount: record.onlineAmount,
          codAmount: record.codAmount,
          vendorShare: record.vendorShare,
          cafeShare: record.cafeShare,
          tax: record.tax,
          cafeNet: record.cafeNet,
        }),
      });

      if (!res.ok) {
        throw new Error("Invoice generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `settlement_${record.vendor?.Vendor_Name}_${formatDate(
        record.startDate
      )}_to_${formatDate(record.endDate)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      message.success("Invoice downloaded successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    {
      title: (
        <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarOutlined /> Settlement Period
        </span>
      ),
      width: 200,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#6F4D27" }}>
            {formatDate(r.startDate)}
          </div>
          <div style={{ fontSize: 12, color: "#999" }}>to</div>
          <div style={{ fontWeight: 600, color: "#6F4D27" }}>
            {formatDate(r.endDate)}
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Settlement Details</span>,
      children: [
        {
          title: "Vendor Share",
          dataIndex: "vendorShare",
          align: "right",
          width: 120,
          render: (v) => (
            <span style={{ color: "#389e0d", fontWeight: 600 }}>
              ₹{formatAmount(v)}
            </span>
          ),
        },
        {
          title: "Cafe Net",
          dataIndex: "cafeNet",
          align: "right",
          width: 120,
          render: (v) => (
            <span style={{ color: "#096dd9", fontWeight: 600 }}>
              ₹{formatAmount(v)}
            </span>
          ),
        },
        {
          title: "Settlement Amount",
          dataIndex: "settlementAmount",
          align: "right",
          width: 140,
          render: (v) => (
            <span style={{ fontSize: 15, fontWeight: 700, color: "#D6872A" }}>
              ₹{formatAmount(Math.abs(v))}
            </span>
          ),
        },
      ],
    },
    {
      title: <span style={{ fontWeight: 600 }}>Status</span>,
      dataIndex: "settlementStatus",
      width: 160,
      align: "center",
      render: (v) => {
        let color = "green";
        let icon = "✓";
        if (v === "Cafe Should Pay") {
          color = "orange";
          icon = "💰";
        } else if (v === "Cafe Should Receive") {
          color = "red";
          icon = "💵";
        } else if (v === "Clear") {
          color = "blue";
          icon = "✓";
        }

        return (
          <Tag
            color={color}
            style={{
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {icon} {v}
          </Tag>
        );
      },
    },
    {
      title: <span style={{ fontWeight: 600 }}>Payment</span>,
      dataIndex: "isPaid",
      width: 150,
      align: "center",
      render: (v, record) => (
        <div>
          <Tag
            icon={v ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            color={v ? "success" : "error"}
            style={{
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 8,
            }}
          >
            {v ? "PAID" : "UNPAID"}
          </Tag>
          {v && record.paidAt && (
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
              {formatDateTime(record.paidAt)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Invoice</span>,
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<DownloadOutlined />}
          loading={downloadingId === record._id}
          onClick={() => handleDownloadInvoice(record)}
          style={{
            background: "#D6872A",
            borderColor: "#D6872A",
            fontWeight: 600,
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  // Calculate summary - ab sirf table footer ke liye
  const totalPaid = data.filter(d => d.isPaid).length;
  const totalUnpaid = data.filter(d => !d.isPaid).length;
  const totalSettlementAmount = data.reduce((sum, d) => sum + Math.abs(d.settlementAmount || 0), 0);

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HistoryOutlined style={{ fontSize: 20, color: "#D6872A" }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>
              Settlement History
            </span>
          </div>
          
          {/* Quick Stats in Header */}
          {data.length > 0 && (
            <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircleOutlined style={{ color: "#52C41A" }} />
                <span style={{ color: "#666" }}>Paid:</span>
                <b style={{ color: "#52C41A" }}>{totalPaid}</b>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ClockCircleOutlined style={{ color: "#FF4D4F" }} />
                <span style={{ color: "#666" }}>Unpaid:</span>
                <b style={{ color: "#FF4D4F" }}>{totalUnpaid}</b>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#666" }}>Total Amount:</span>
                <b style={{ color: "#D6872A" }}>₹{formatAmount(totalSettlementAmount)}</b>
              </div>
            </div>
          )}
        </div>
      }
      style={cardStyle}
      headStyle={{
        background: "linear-gradient(135deg, #FFF4D6 0%, #FFEDCC 100%)",
        borderBottom: "2px solid #D6872A",
        borderRadius: "16px 16px 0 0",
        fontWeight: 700,
        padding: "16px 24px",
      }}
    >
      <Spin spinning={loading} size="large">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
          locale={{
            emptyText: (
              <div style={{ padding: "60px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.2 }}>
                  📋
                </div>
                <div style={{ fontSize: 18, color: "#999", fontWeight: 500 }}>
                  No settlement history found
                </div>
                <div style={{ fontSize: 14, color: "#bbb", marginTop: 8 }}>
                  Settlements will appear here once they are created
                </div>
              </div>
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          summary={() => (
            data.length > 0 && (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: "#FFF4D6", fontWeight: 700 }}>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6F4D27" }}>
                      <HistoryOutlined />
                      <span>Total Summary</span>
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <span style={{ color: "#389e0d" }}>
                      ₹{formatAmount(data.reduce((sum, d) => sum + (d.vendorShare || 0), 0))}
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <span style={{ color: "#096dd9" }}>
                      ₹{formatAmount(data.reduce((sum, d) => sum + (d.cafeNet || 0), 0))}
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <span style={{ color: "#D6872A", fontSize: 16 }}>
                      ₹{formatAmount(totalSettlementAmount)}
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center" colSpan={2}>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        Paid: {totalPaid}
                      </Tag>
                      <Tag color="error" icon={<ClockCircleOutlined />}>
                        Unpaid: {totalUnpaid}
                      </Tag>
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          )}
        />
        <style jsx global>{`
          .table-row-light {
            background-color: #fffbf0;
          }
          .table-row-dark {
            background-color: #fff9e6;
          }
          .ant-table-thead > tr > th {
            background: #fff4d6 !important;
            color: #6f4d27 !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #d6872a !important;
          }
          .ant-table-summary {
            background: #FFF4D6 !important;
          }
        `}</style>
      </Spin>
    </Card>
  );
}