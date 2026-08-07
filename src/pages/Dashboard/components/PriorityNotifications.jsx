import "./PriorityNotifications.css";

const notifications = [
  {
    title: "Vous devez voter pour une demande de retrait",
    type: "Action requise",
  },
  {
    title: "Une cotisation est en retard",
    type: "Paiement",
  },
  {
    title: "Une invitation expire demain",
    type: "Invitation",
  },
];

const PriorityNotifications = () => {
  return (
    <section className="priority-notifications">
      <h2>🔔 Notifications prioritaires</h2>

      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div className="notification-card" key={index}>
            <div className="notification-icon">
              ⚠️
            </div>

            <div className="notification-content">
              <h4>{notification.title}</h4>
              <span>{notification.type}</span>
            </div>

            <button className="notification-btn">
              Voir
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriorityNotifications;