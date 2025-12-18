"use client";

import SettlementHistory from "@/app/componants/SettlementHistory";
import SettlementPreview from "@/app/componants/SettlementPreview";
import { Divider } from "antd";
import { useSearchParams } from "next/navigation";

export default function VendorSettlementPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");

  if (!vendorId) return <h3>Vendor ID missing</h3>;

  return (
    <div style={{ background: "#FAF3CC", padding: 16, borderRadius: 8 }}>
      <h2 style={{ color: "#6F4D27" }}>Vendor Settlement</h2>

      <SettlementPreview vendorId={vendorId} />

      <Divider />

      <SettlementHistory vendorId={vendorId} />
    </div>
  );
}
