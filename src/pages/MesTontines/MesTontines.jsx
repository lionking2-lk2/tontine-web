import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Plus, UserPlus, Wallet, Calendar, Users2, MapPin } from "lucide-react";
import { getMesTontines } from "../../services/groupeService"

function MesTontines() {
    const navigate = useNavigate();

    const [tontines, setTontines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [recherche, setRecherche] = useState("");
    const [filtre, setFiltre] = useState("toutes");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/connexion");
            return;
        }

        getMesTontines()
            .then((response) => setTontines(response.data))
            .catch(() => setError("Impossible de charger vos tontines."))
            .finally(() => setLoading(false));
    }, [navigate]);

    const currentUserId = Number(localStorage.getItem("userId"));

    const tontinesFiltrees = tontines.filter((t) => {
        const nom = t.groupe.nomGroupe.toLowerCase();
        const correspondRecherche = nom.includes(recherche.toLowerCase());

        const estResponsable = t.groupe.createurId === currentUserId;

        let correspondFiltre = true;
        if (filtre === "actives") correspondFiltre = t.groupe.statut === "ACTIF";
        if (filtre === "terminees") correspondFiltre = t.groupe.statut !== "ACTIF";
        if (filtre === "responsable") correspondFiltre = estResponsable;
        if (filtre === "membre") correspondFiltre = !estResponsable;

        return correspondRecherche && correspondFiltre;
    });

    if (loading) {
        return <div className="mes-tontines-page"><p>Chargement...</p></div>;
    }

    return (
        <div className="mes-tontines-page">
            <header className="mt-header">
                <div>
                    <h1>👥 Mes tontines</h1>
                    <p>Vous participez à {tontines.length} tontine{tontines.length > 1 ? "s" : ""}</p>
                </div>

                <div className="mt-header-actions">
                    <div className="mt-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une tontine..."
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>

                    <select
                        className="mt-filter"
                        value={filtre}
                        onChange={(e) => setFiltre(e.target.value)}
                    >
                        <option value="toutes">Toutes</option>
                        <option value="actives">Actives</option>
                        <option value="terminees">Terminées</option>
                        <option value="responsable">Responsable</option>
                        <option value="membre">Membre</option>
                    </select>
                </div>
            </header>

            {error && <div className="form-message error">{error}</div>}

            {!error && tontinesFiltrees.length === 0 && (
                <p className="mt-empty">Aucune tontine ne correspond à votre recherche.</p>
            )}

            <div className="mt-list">
                {tontinesFiltrees.map((t) => {
                    const estResponsable = t.groupe.createurId === currentUserId;
                    return (
                        <div className="mt-card" key={t.id}>
                            <div className="mt-card-header">
                                <h3>🏦 {t.groupe.nomGroupe}</h3>
                                <span className={`mt-badge ${t.groupe.statut === "ACTIF" ? "active" : "inactive"}`}>
                                    {t.groupe.statut === "ACTIF" ? "🟢 Active" : "⚪ Inactive"}
                                </span>
                            </div>

                            <div className="mt-card-info">
                                <span><Wallet size={16} /> {Number(t.groupe.montantCotisation).toLocaleString()} FCFA</span>
                                <span><Calendar size={16} /> {t.groupe.frequence}</span>
                                <span><Users2 size={16} /> Max {t.groupe.nombreMaxMembres} membres</span>
                                <span><MapPin size={16} /> {estResponsable ? "Responsable" : "Membre"}</span>
                            </div>

                            <button
                                className="mt-open-btn"
                                onClick={() => navigate(`/tontines/${t.groupe.id}`)}
                            >
                                Ouvrir
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-actions-bar">
                <button
                    className="mt-action-btn mt-action-create"
                    onClick={() => navigate("/tontines/creer")}
                >
                     <Plus size={18} /> Créer une tontine
                </button>

                <button
                    className="mt-action-btn mt-action-join"
                    onClick={() => navigate("/tontines/rejoindre")}
                >
                    <UserPlus size={18} /> Rejoindre une tontine
                </button>
            </div>
        </div>
    );
}

export default MesTontines;