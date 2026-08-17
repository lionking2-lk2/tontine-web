import "./DashboardTopbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useUser } from "../../../context/useUser.js";
const DashboardTopbar = ({ pageTitle = "Tableau de bord" }) => {
  const { user } = useUser();

  const today = new Date();
  const date = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName = user?.first_name || user?.username || "Utilisateur";

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <h2>{pageTitle}</h2>
        <span className="topbar-date">Aujourd'hui : {date}</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-notification-btn" aria-label="Notifications">
          <FaBell />
        </button>
        <div className="topbar-profile">
          <FaUserCircle size={32} />
          <span>{displayName}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;