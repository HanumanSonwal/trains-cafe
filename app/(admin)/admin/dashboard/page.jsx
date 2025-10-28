"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CODonlineChart from "@/app/componants/CODonlineChart";
import DeliveredVsCancelChart from "@/app/componants/DeliveredVsCancelChart";
import OngoingOrdersChart from "@/app/componants/OngoingOrdersChart";
import SalesAnalyticsChart from "@/app/componants/SalesAnalyticsChart";
import VendorPerformanceChart from "@/app/componants/VendorPerformanceChart";
import CustomerInsightsChart from "@/app/componants/CustomerInsightsChart";
import DashboardCard from "@/app/componants/DashboardCard";
import { Skeleton, Card, Row, Col } from "antd";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();


  if (status === "loading") {
    return (
      <div className="p-4">
        {/* Top Statistic Cards Skeleton */}
        <Row className="mb-5" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Skeleton.Input style={{ width: '100%' }} active />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Skeleton.Input style={{ width: '100%' }} active />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Skeleton.Input style={{ width: '100%' }} active />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Skeleton.Input style={{ width: '100%' }} active />
          </Col>
        </Row>

        {/* Chart Skeletons */}
        <Row gutter={[16, 16]} className="my-4">
          <Col xs={24} md={12}>
            <Card>
              <Skeleton title={false} paragraph={{ rows: 8 }} active />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Skeleton title={false} paragraph={{ rows: 8 }} active />
            </Card>
          </Col>
        </Row>

        {/* Ongoing Orders Table Skeleton */}
        <Card className="mt-4">
          <Skeleton title={false} paragraph={{ rows: 5 }} active />
        </Card>

        {/* Other Charts Skeletons */}
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={12}>
            <Card>
              <Skeleton title={false} paragraph={{ rows: 8 }} active />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Skeleton title={false} paragraph={{ rows: 8 }} active />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }


  return (
    <div className="">
      <div className="mb-4">
        <DashboardCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <CODonlineChart />
        </div>
        <div className="col-span-1">
          <DeliveredVsCancelChart />
        </div>
      </div>
      <div className="mt-4">
        <OngoingOrdersChart />
      </div>
  
      <div className="mt-4">
        {/* <VendorPerformanceChart /> */}
          <SalesAnalyticsChart />
      </div>
    </div>
  );
};

export default Dashboard;
