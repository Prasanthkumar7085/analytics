import DashboardOverview from "@/components/DashboardPage";
import { Suspense } from "react";

const Dashboard = () => {
  return (
    <Suspense>
      <DashboardOverview />
    </Suspense>
  );
};

export default Dashboard;
