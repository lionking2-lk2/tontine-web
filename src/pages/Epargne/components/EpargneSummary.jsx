import "./EpargneSummary.css";

import {
  FaWallet,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaHandHoldingUsd,
} from "react-icons/fa";

const summaryCards = [
  {
    title: "Solde disponible",
    value: "125 000 FCFA",
    icon: <FaWallet />,
  },
  {
    title: "Total cotisé",
    value: "300 000 FCFA",
    icon: <FaMoneyBillWave />,
  },
  {
    title: "Cotisations",
    value: "15",
    icon: <FaCalendarCheck />,
  },
  {
    title: "Prêts en cours",
    value: "1",
    icon: <FaHandHoldingUsd />,
  },
];

const EpargneSummary = () => {
  return (
    <section className="epargne-summary">
      {summaryCards.map((card, index) => (
        <div className="epargne-summary-card" key={index}>
          <div className="epargne-card-icon">
            {card.icon}
          </div>

          <div className="epargne-card-info">
            <p>{card.title}</p>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </section>
  );
};

export default EpargneSummary;