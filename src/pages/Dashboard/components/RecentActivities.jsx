import "./RecentActivities.css";

const activities = [
  {
    title: "Vous avez payé 20 000 FCFA",
    date: "Aujourd'hui à 10:30",
  },
  {
    title: 'Jean a rejoint "Famille"',
    date: "Hier à 18:20",
  },
  {
    title: "Votre retrait a été validé",
    date: "Il y a 2 jours",
  },
  {
    title: 'Vous avez créé "Étudiants"',
    date: "Il y a 3 jours",
  },
  {
    title: "Nouvelle invitation reçue",
    date: "Il y a 5 jours",
  },
];

const RecentActivities = () => {
  return (
    <section className="recent-activities">
      <div className="section-header">
        <h2>🕒 Activités récentes</h2>

        <button>Voir tout</button>
      </div>

      <div className="activities-list">
        {activities.map((activity, index) => (
          <div className="activity-item" key={index}>
            <div className="activity-icon">✓</div>

            <div className="activity-content">
              <h4>{activity.title}</h4>
              <span>{activity.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentActivities;