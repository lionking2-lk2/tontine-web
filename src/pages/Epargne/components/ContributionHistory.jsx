import { useEffect, useState } from "react";
import "./ContributionHistory.css";

import { FaCheckCircle, FaClock } from "react-icons/fa";
import { getHistorique } from "../../../services/loanService";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ContributionHistory = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistorique();
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        const cotisations = data.filter((t) => t.type === "Cotisation");
        setContributions(cotisations);
      } catch  {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      {loading && <p className="contribution-status">Chargement...</p>}

      {!loading && error && (
        <p className="contribution-status">
          Impossible de charger l'historique pour le moment.
        </p>
      )}

      {!loading && !error && contributions.length === 0 && (
        <p className="contribution-status">Aucune cotisation enregistrée.</p>
      )}

      {!loading && !error && contributions.length > 0 && (
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
              {contributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td>{formatDate(contribution.dateTransaction)}</td>

                  <td className="tontine-name">
                    {contribution.groupe}
                  </td>

                  <td className="contribution-amount">
                    {contribution.montant} FCFA
                  </td>

                  <td>
                    {contribution.statut === "REUSSIE" ? (
                      <span className="status validated">
                        <FaCheckCircle />
                        Validée
                      </span>
                    ) : (
                      <span className="status pending">
                        <FaClock />
                        {contribution.statut === "EN_ATTENTE" ? "En attente" : contribution.statut}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </section>
  );
};

export default ContributionHistory;