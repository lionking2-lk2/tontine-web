import "./SummaryCards.css";

const cards = [
  {
    title: "Mes tontines",
    value: 4,
    icon: "👥",
  },
  {
    title: "Cotisations dues",
    value: 2,
    icon: "💰",
  },
  {
    title: "Notifications",
    value: 5,
    icon: "🔔",
  },
];

const SummaryCards = () => {
  return (
    <section className="summary-cards">
      {cards.map((card, index) => (
        <div className="summary-card" key={index}>
          <div className="card-icon">
            {card.icon}
          </div>

          <div className="card-content">
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;