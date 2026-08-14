import "./QuickActions.css";

const actions = [
  {
    title: "Créer une tontine",
    icon: "➕",
  },
  {
    title: "Rejoindre une tontine",
    icon: "👥",
  },
  {
    title: "Payer une cotisation",
    icon: "💰",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <div className="section-header">
        <h2>⚡ Actions rapides</h2>
      </div>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button className="action-card" key={index}>
            <div className="action-icon">
              {action.icon}
            </div>

            <div className="action-content">
              <h3>{action.title}</h3>
              <span>Accéder</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;