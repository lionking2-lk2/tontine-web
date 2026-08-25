import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Dashboard/components/Sidebar";
import DashboardTopbar from "../pages/Dashboard/components/DashboardTopbar";
import { UserProvider } from "../context/UserContext.jsx";
import "../pages/Dashboard/Dashboard.css";

const DashboardLayout = () => {
  return (
    <UserProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <DashboardTopbar />
          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default DashboardLayout;