"use client";
import React ,{useEffect} from "react";
import CODonlineChart from "@/app/componants/CODonlineChart";
import { useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DeliveredVsCancelChart from "@/app/componants/DeliveredVsCancelChart";
import OngoingOrdersChart from "@/app/componants/OngoingOrdersChart";
import SalesAnalyticsChart from "@/app/componants/SalesAnalyticsChart";
import VendorPerformanceChart from "@/app/componants/VendorPerformanceChart";
import CustomerInsightsChart from "@/app/componants/CustomerInsightsChart";
import DashboardCard from "@/app/componants/DashboardCard";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session,"data")

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) router.push('/admin-auth');
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>ggggg</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 mt-4">
          <SalesAnalyticsChart />
        </div>
        <div className="col-span-1 mt-4">
          <CustomerInsightsChart />
        </div>
      </div>
      <div className="mt-4">
        <VendorPerformanceChart />
      </div>
    </div>
  );
};

export default Dashboard;
