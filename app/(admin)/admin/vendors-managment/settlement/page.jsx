"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Card } from "antd";
import VendorSettlementClient from "../VendorSettlementClient";

export default function VendorSettlementPage() {
  return (
    <Suspense
      fallback={
        <Card style={{ margin: 40 }}>
          <h3>Loading settlement data...</h3>
        </Card>
      }
    >
      <VendorSettlementClient />
    </Suspense>
  );
}
