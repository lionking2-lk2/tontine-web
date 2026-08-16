import "./NextContribution.css";

import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

const NextContribution = () => {
  return (
    <section className="next-contribution">

      <div className="next-contribution-header">
        <h2>Prochaine cotisation</h2>
        <FaCalendarAlt />
      </div>

      <div className="next-contribution-group">
        <span>Tontine</span>
        <strong>Tontine Famille</strong>
      </div>

      <div className="next-contribution-info">

        <div className="contribution-detail">
          <FaMoneyBillWave />
          <div>
            <span>Montant</span>
            <strong>20 000 FCFA</strong>
          </div>
        </div>

        <div className="contribution-detail">
          <FaClock />
          <div>
            <span>Échéance</span>
            <strong>10 août 2026</strong>
          </div>
        </div>

      </div>

      <div className="next-contribution-alert">
        <FaClock />
        <span>Votre cotisation est prévue dans 2 jours.</span>
      </div>

      <button className="pay-contribution-btn">
        Payer ma cotisation
      </button>

    </section>
  );
};

export default NextContribution;