import { useEffect, useState } from "react";
import "./RecentActivities.css";
import { getHistorique } from "../../../services/loanService";

const ICONS_PAR_TYPE = {
  Cotisation: "✓",
  Pret: "💰",
  Remboursement: "↩️",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await getHistorique();
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        // On garde les 5 plus récentes pour l'aperçu du dashboard
        setActivities(data.slice(0, 5));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorique();
  }, []);

  return (
    <section className="recent-activities">
      <div className="section-header">
        <h2>🕒 Activités récentes</h2>
        <button className="see-all-btn">Voir tout</button>
      </div>

      {loading && <p className="activities-status">Chargement...</p>}

      {!loading && error && (
        <p className="activities-status">
          Impossible de charger vos activités pour le moment.
        </p>
      )}

      {!loading && !error && activities.length === 0 && (
        <p className="activities-status">Aucune activité récente.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="activities-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <div className="activity-icon">
                {ICONS_PAR_TYPE[activity.type] || "•"}
              </div>
              <div className="activity-content">
                <h4>
                  {activity.type} — {activity.montant} FCFA
                  {activity.groupe ? ` (${activity.groupe})` : ""}
                </h4>
                <span>{formatDate(activity.dateTransaction)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentActivities;