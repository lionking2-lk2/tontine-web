import "./QuickActions.css";

const actions = [
  {
    title: "Créer une tontine",
    icon: "➕",
  },
  {
    title: "Rejoindre une tontine",
    icon: "📨",
  },
  {
    title: "Payer une cotisation",
    icon: "💰",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <h2>⚡ Actions rapides</h2>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button className="action-card" key={index}>
            <span>{action.icon}</span>
            <p>{action.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;