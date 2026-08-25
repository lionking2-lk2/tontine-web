import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

const actions = [
  {
    title: "Créer une tontine",
    icon: "➕",
    path: "/tontines/creer",
  },
  {
    title: "Rejoindre une tontine",
    icon: "👥",
    path: "/tontines",
  },
  {
    title: "Payer une cotisation",
    icon: "💰",
    path: "/epargne",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <div className="section-header">
        <h2>⚡ Actions rapides</h2>
      </div>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            className="action-card"
            key={index}
            onClick={() => navigate(action.path)}
          >
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