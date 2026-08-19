import { useEffect, useState } from "react";
import "./EpargneSummary.css";

import {
  FaWallet,
  FaMoneyBillWave,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { getMesGroupesEtSoldes } from "../../../services/groupeService";

const EpargneSummary = () => {
  const [summaryCards, setSummaryCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const groupesRes = await getMesGroupesEtSoldes();

      const groupes = groupesRes.data;

      const totalSoldeDisponible = groupes.reduce(
        (sum, g) => sum + parseFloat(g.solde.soldeDisponible || 0),
        0
      );

      const totalCotise = groupes.reduce(
        (sum, g) => sum + parseFloat(g.solde.totalCotise || 0),
        0
      );

      const pretsEnCours = groupes.reduce(
        (sum, g) => sum + (g.solde.pretsEnCours?.length || 0),
        0
      );

      setSummaryCards([
        {
          title: "Solde disponible",
          value: `${totalSoldeDisponible.toLocaleString("fr-FR")} FCFA`,
          icon: <FaWallet />,
        },
        {
          title: "Total cotisé",
          value: `${totalCotise.toLocaleString("fr-FR")} FCFA`,
          icon: <FaMoneyBillWave />,
        },
        {
          title: "Prêts en cours",
          value: pretsEnCours,
          icon: <FaHandHoldingUsd />,
        },
      ]);
    } catch (error) {
      console.log("========== ERREUR EPARGNE ==========");
      console.log("URL :", error.config?.url);
      console.log("METHOD :", error.config?.method);
      console.log("STATUS :", error.response?.status);
      console.log("DATA :", error.response?.data);
      console.log("====================================");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading) {
    return <section className="epargne-summary"><p className="epargne-status">Chargement...</p></section>;
  }

  if (error) {
    return <section className="epargne-summary"><p className="epargne-status">Impossible de charger vos données.</p></section>;
  }

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