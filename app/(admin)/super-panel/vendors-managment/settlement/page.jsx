"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Spin } from "antd";
import VendorSettlementClient from "../VendorSettlementClient";

export default function VendorSettlementPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #FFF7D6, #FFFDF4)",
          }}
        >
          <Spin size="large" />
          <div
            style={{
              marginTop: 20,
              fontSize: 16,
              fontWeight: 600,
              color: "#6F4D27",
            }}
          >
            Loading settlement data...
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "#999",
            }}
          >
            Please wait while we fetch the data
          </div>
        </div>
      }
    >
      <VendorSettlementClient />
    </Suspense>
  );
}