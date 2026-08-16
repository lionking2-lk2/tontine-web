import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import QuickActions from "./components/QuickActions";
import RecentActivities from "./components/RecentActivities";
import PriorityNotifications from "./components/PriorityNotifications";

function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <SummaryCards />
      <QuickActions />
      <RecentActivities />
      <PriorityNotifications />
    </>
  );
}

export default Dashboard;