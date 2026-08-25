import { useNavigate } from "react-router-dom";
import "./SummaryCards.css";

const cards = [
  {
    title: "Mes tontines",
    icon: "👥",
    path: "/tontines",
  },
  {
    title: "Cotisations dues",
    icon: "💰",
    path: "/epargne",
  },
  {
    title: "Notifications",
    icon: "🔔",
    path: "/notifications",
  },
];

const SummaryCards = () => {
  const navigate = useNavigate();

  return (
    <section className="summary-cards">
      {cards.map((card, index) => (
        <div
          className="summary-card"
          key={index}
          onClick={() => navigate(card.path)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate(card.path);
            }
          }}
        >
          <div className="card-icon">
            {card.icon}
          </div>

          <div className="card-content">
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;