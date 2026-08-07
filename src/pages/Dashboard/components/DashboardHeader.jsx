import "./DashboardHeader.css";
const DashboardHeader = () => {
  const today = new Date();
  const date = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>Bonjour Prudence 👋</h1>
        <p>Bon retour !</p>
        <span>Aujourd'hui : {date}</span>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔
        </button>
      </div>
    </header>
  );
};
export default DashboardHeader;