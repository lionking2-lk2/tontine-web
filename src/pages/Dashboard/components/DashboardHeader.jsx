import "./DashboardHeader.css";
import { useUser } from "../../../context/useUser.js";
const DashboardHeader = () => {
  const { user } = useUser();

  const today = new Date();
  const date = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName = user?.first_name || user?.username || "Utilisateur";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>Bonjour {displayName} 👋</h1>
        <p>Bon retour sur votre espace Trois Clés</p>
        <span>
          Aujourd'hui : {date}
        </span>
      </div>
      <div className="header-right">
        <button
          className="notification-btn"
          aria-label="Notifications"
        >
          🔔
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;