import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PriorityNotifications.css";
import { getNotifications, markAsRead } from "../../../services/notificationService";

const PriorityNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        // On n'affiche ici que les notifications non lues
        const nonLues = response.data.filter(
          (n) => n.statutLecture !== "LUE"
        );
        setNotifications(nonLues);
      } catch  {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleVoir = async (id) => {
  try {
    await markAsRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    navigate("/notifications");
  } catch {
    // On laisse la notification affichée si le marquage échoue
  }
};

  return (
    <section className="priority-notifications">
      <div className="section-header">
        <h2>🔔 Notifications prioritaires</h2>
      </div>

      {loading && <p className="notifications-status">Chargement...</p>}

      {!loading && error && (
        <p className="notifications-status">
          Impossible de charger les notifications pour le moment.
        </p>
      )}

      {!loading && !error && notifications.length === 0 && (
        <p className="notifications-status">
          Aucune notification prioritaire pour le moment.
        </p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div className="notification-card" key={notification.id}>
              <div className="notification-icon">⚠️</div>
              <div className="notification-content">
                <h4>{notification.titre}</h4>
                <span>{notification.type}</span>
              </div>
              <button
                className="notification-action"
                onClick={() => handleVoir(notification.id)}
              >
                Voir
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PriorityNotifications;