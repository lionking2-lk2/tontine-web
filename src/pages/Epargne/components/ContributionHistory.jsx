import "./ContributionHistory.css";

import { FaCheckCircle, FaClock } from "react-icons/fa";

const contributions = [
  {
    date: "05/08/2026",
    tontine: "Tontine Famille",
    amount: "20 000 FCFA",
    status: "Validée",
  },
  {
    date: "28/07/2026",
    tontine: "Tontine Famille",
    amount: "20 000 FCFA",
    status: "Validée",
  },
  {
    date: "20/07/2026",
    tontine: "Tontine Étudiants",
    amount: "10 000 FCFA",
    status: "En attente",
  },
  {
    date: "12/07/2026",
    tontine: "Tontine Famille",
    amount: "20 000 FCFA",
    status: "Validée",
  },
];

const ContributionHistory = () => {
  return (
    <section className="contribution-history">

      <div className="section-header">
        <div>
          <h2>Historique des cotisations</h2>
          <p>Consultez vos dernières cotisations.</p>
        </div>

        <button className="view-all-btn">
          Voir tout
        </button>
      </div>

      <div className="contribution-table-container">

        <table className="contribution-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Tontine</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {contributions.map((contribution, index) => (
              <tr key={index}>

                <td>{contribution.date}</td>

                <td className="tontine-name">
                  {contribution.tontine}
                </td>

                <td className="contribution-amount">
                  {contribution.amount}
                </td>

                <td>
                  {contribution.status === "Validée" ? (
                    <span className="status validated">
                      <FaCheckCircle />
                      Validée
                    </span>
                  ) : (
                    <span className="status pending">
                      <FaClock />
                      En attente
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </section>
  );
};

export default ContributionHistory;