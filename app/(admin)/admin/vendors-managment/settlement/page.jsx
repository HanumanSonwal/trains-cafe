"use client";

import SettlementHistory from "@/app/componants/SettlementHistory";
import SettlementPreview from "@/app/componants/SettlementPreview";
import { Divider, Card } from "antd";
import { useSearchParams } from "next/navigation";

const pageStyle = {
  background: "linear-gradient(135deg, #FFF7D6, #FFFDF4)",
  padding: 24,
  borderRadius: 16,
  minHeight: "100vh",
};

const headerStyle = {
  color: "#6F4D27",
  fontWeight: 700,
  marginBottom: 16,
};

export default function VendorSettlementPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");

  if (!vendorId) {
    return (
      <Card style={{ margin: 40 }}>
        <h3 style={{ color: "red" }}>⚠ Vendor ID missing</h3>
      </Card>
    );
  }

  return (
    <div style={pageStyle}>
      <h2 style={headerStyle}>Vendor Settlement</h2>

      <SettlementPreview vendorId={vendorId} />

      <Divider
        style={{
          borderColor: "#D6872A",
          margin: "32px 0",
        }}
      />

      <SettlementHistory vendorId={vendorId} />
    </div>
  );
}
