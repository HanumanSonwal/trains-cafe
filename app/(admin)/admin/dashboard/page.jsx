"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CODonlineChart from "@/app/componants/CODonlineChart";
import DeliveredVsCancelChart from "@/app/componants/DeliveredVsCancelChart";
import OngoingOrdersChart from "@/app/componants/OngoingOrdersChart";
import SalesAnalyticsChart from "@/app/componants/SalesAnalyticsChart";
import DashboardCard from "@/app/componants/DashboardCard";
import { Skeleton, Card, Row, Col } from "antd";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/sales", {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.log("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading || !dashboardData) {
    return (
      <div className="p-4">
        <Row className="mb-5" gutter={[16, 16]}>
          {[1,2,3,4].map((i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Skeleton.Input style={{ width: "100%" }} active />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="my-4">
          {[1,2].map((i) => (
            <Col xs={24} md={12} key={i}>
              <Card><Skeleton title={false} paragraph={{ rows: 8 }} active /></Card>
            </Col>
          ))}
        </Row>

        <Card className="mt-4"><Skeleton paragraph={{ rows: 5 }} active /></Card>

        <Row gutter={[16, 16]} className="mt-4">
          {[1,2].map((i) => (
            <Col xs={24} md={12} key={i}>
              <Card><Skeleton paragraph={{ rows: 8 }} active /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <DashboardCard summary={dashboardData.summary} totals={dashboardData.totals} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CODonlineChart paymentStats={dashboardData.paymentStats} />
        <DeliveredVsCancelChart orderStatusStats={dashboardData.orderStatusStats} />
      </div>

      <div className="mt-4">
        <OngoingOrdersChart />
      </div>

      <div className="mt-4">
        <SalesAnalyticsChart />
      </div>
    </div>
  );
};

export default Dashboard;
