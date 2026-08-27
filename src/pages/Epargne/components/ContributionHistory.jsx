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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistorique();

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setTransactions(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 5);

  return (
    <section className="contribution-history">

      <div className="section-header">
        <div>
          <h2>Historique des transactions</h2>
          <p>Consultez vos dernières opérations.</p>
        </div>

        {!loading && !error && transactions.length > 5 && (
          <button
            className="view-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Voir moins" : "Voir tout"}
          </button>
        )}
      </div>

      {loading && (
        <p className="contribution-status">
          Chargement...
        </p>
      )}

      {!loading && error && (
        <p className="contribution-status">
          Impossible de charger l'historique pour le moment.
        </p>
      )}

      {!loading && !error && transactions.length === 0 && (
        <p className="contribution-status">
          Aucune transaction enregistrée.
        </p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="contribution-table-container">
          <table className="contribution-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Tontine</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr key={transaction.id}>

                  <td>
                    {formatDate(transaction.dateTransaction)}
                  </td>

                  <td>
                    {transaction.type}
                  </td>

                  <td className="tontine-name">
                    {transaction.groupe || "—"}
                  </td>

                  <td className="contribution-amount">
                    {transaction.montant} FCFA
                  </td>

                  <td>
                    {transaction.statut === "REUSSIE" ? (
                      <span className="status validated">
                        <FaCheckCircle />
                        Validée
                      </span>
                    ) : (
                      <span className="status pending">
                        <FaClock />
                        {transaction.statut === "EN_ATTENTE"
                          ? "En attente"
                          : transaction.statut || "Inconnu"}
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