import React from 'react';
import CODonlineChart from '@/app/componants/CODonlineChart';
import DeliveredVsCancelChart from '@/app/componants/DeliveredVsCancelChart';
import OngoingOrdersChart from '@/app/componants/OngoingOrdersChart';
import SalesAnalyticsChart from '@/app/componants/SalesAnalyticsChart';
import VendorPerformanceChart from '@/app/componants/VendorPerformanceChart';
import CustomerInsightsChart from '@/app/componants/CustomerInsightsChart';
import DashboardCard from '@/app/componants/DashboardCard';

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className='mb-4'>
      <DashboardCard/>
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
        <SalesAnalyticsChart />
      </div>
      <div className="mt-4">
        <VendorPerformanceChart />
      </div>
      <div className="mt-4">
        <CustomerInsightsChart />
      </div>
    </div>
  );
};

export default Dashboard;

