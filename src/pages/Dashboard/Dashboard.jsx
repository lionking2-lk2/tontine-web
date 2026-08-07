import "./Dashboard.css";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import QuickActions from "./components/QuickActions";
import RecentActivities from "./components/RecentActivities";
import UpcomingEvents from "./components/UpcomingEvents";
import PriorityNotifications from "./components/PriorityNotifications";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <DashboardHeader />

        <SummaryCards />

        <QuickActions />

        <RecentActivities />

        <UpcomingEvents />

        <PriorityNotifications />
      </main>
    </div>
  );
};

export default Dashboard;