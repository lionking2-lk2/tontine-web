import { useEffect, useState } from "react";
import "./GroupBalances.css";
import { getMesGroupesEtSoldes } from "../../../services/groupeService";

const GroupBalances = () => {
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const response = await getMesGroupesEtSoldes();
        setGroupes(response.data);
      } catch (error) {
        console.log("========== ERREUR GROUPES ==========");
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

    fetchGroupes();
  }, []);

  if (loading) {
    return (
      <section className="group-balances">
        <h2>Mes groupes</h2>
        <p className="group-balances-status">Chargement...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="group-balances">
        <h2>Mes groupes</h2>
        <p className="group-balances-status">
          Impossible de charger vos groupes.
        </p>
      </section>
    );
  }

  if (groupes.length === 0) {
    return (
      <section className="group-balances">
        <h2>Mes groupes</h2>
        <p className="group-balances-status">
          Vous n'appartenez à aucun groupe.
        </p>
      </section>
    );
  }

  return (
    <section className="group-balances">
      <div className="group-balances-header">
        <h2>Mes groupes</h2>
        <p>Consultez votre solde dans chacun de vos groupes.</p>
      </div>

      <div className="group-balances-list">
        {groupes.map((item) => (
          <div className="group-balance-card" key={item.groupe.id}>
            <div className="group-balance-header">
              <h3>{item.groupe.nomGroupe}</h3>

              {item.isGestionnaire && (
                <span className="group-manager-badge">
                  Gestionnaire
                </span>
              )}
            </div>

            <div className="group-balance-details">
              <div>
                <span>Solde disponible</span>
                <strong>
                  {parseFloat(
                    item.solde?.soldeDisponible || 0
                  ).toLocaleString("fr-FR")}{" "}
                  FCFA
                </strong>
              </div>

              <div>
                <span>Total cotisé</span>
                <strong>
                  {parseFloat(
                    item.solde?.totalCotise || 0
                  ).toLocaleString("fr-FR")}{" "}
                  FCFA
                </strong>
              </div>

              <div>
                <span>Prêts en cours</span>
                <strong>
                  {item.solde?.pretsEnCours?.length || 0}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupBalances;