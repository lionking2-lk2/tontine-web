import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";import { RefreshCw, PiggyBank, X, Check } from "lucide-react";
import { creerGroupe, configurerRotative, configurerEpargneCredit } from "../../services/groupeService";
import { useUser } from "../../context/useUser.js";
function CreerTontine() {
    const navigate = useNavigate();

    const { user, loading: userLoading } = useUser();

    const [etape, setEtape] = useState(1); // 1 = identité, 2 = type + config

    const [nomGroupe, setNomGroupe] = useState("");
    const [description, setDescription] = useState("");
    const [typeTontine, setTypeTontine] = useState("Rotative");
    const [montantCotisation, setMontantCotisation] = useState("");
    const [frequence, setFrequence] = useState("Mensuelle");
    const [nombreMaxMembres, setNombreMaxMembres] = useState("");

    const [modeAttribution, setModeAttribution] = useState("Ordre");
    const [typeCotisation, setTypeCotisation] = useState("Fixe");
    const [dateRedistribution, setDateRedistribution] = useState("");
    const [tauxInteret, setTauxInteret] = useState("");
    const [dureeMaxRemboursement, setDureeMaxRemboursement] = useState("");
    const [modeDecision, setModeDecision] = useState("DecisionBureau");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (userLoading) {
    return null;
}

if (!user?.a_kyc_valide) {
    return <Navigate to="/profile?kyc=required" replace />;
}

    const allerEtape2 = (event) => {
        event.preventDefault();
        setError("");
        if (!nomGroupe || !montantCotisation) {
            setError("Le nom et le montant de cotisation sont obligatoires.");
            return;
        }
        setEtape(2);
    };

    const handleCreer = async (event) => {
    event.preventDefault();
    setError("");

    if (userLoading) {
        return;
    }

    if (!user?.a_kyc_valide) {
        navigate("/profile?kyc=required");
        return;
    }

    setLoading(true);

    try {
            const response = await creerGroupe({
                nomGroupe,
                description,
                montantCotisation: Number(montantCotisation),
                frequence,
                nombreMaxMembres: nombreMaxMembres ? Number(nombreMaxMembres) : 0,
            });

            const groupeId = response.data.id;

            if (typeTontine === "Rotative") {
                await configurerRotative(groupeId, {
                    typeTontine: "Rotative",
                    montantCotisation: Number(montantCotisation),
                    frequence,
                    nombreMaxMembres: nombreMaxMembres ? Number(nombreMaxMembres) : 0,
                    montantMise: Number(montantCotisation),
                    modeAttribution,
                });
            } else {
                await configurerEpargneCredit(groupeId, {
                    typeTontine: "EpargneCredit",
                    montantCotisation: Number(montantCotisation),
                    frequence,
                    nombreMaxMembres: nombreMaxMembres ? Number(nombreMaxMembres) : 0,
                    typeCotisation,
                    dateRedistribution: dateRedistribution || null,
                    tauxInteret: tauxInteret ? Number(tauxInteret) : 0,
                    dureeMaxRemboursement: dureeMaxRemboursement ? Number(dureeMaxRemboursement) : 0,
                    modeDecision,
                });
            }

            navigate("/dashboard");

        } catch (err) {
            const data = err.response?.data;
            setError(data?.detail || "Impossible de créer la tontine.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ct-overlay">
            <div className="ct-modal-wizard">
                <div className="ct-wizard-header">
                    <div>
                        <span className="ct-wizard-eyebrow">Assistant de création</span>
                        <h2>Nouvelle tontine</h2>
                    </div>
                    <button className="ct-close-btn" onClick={() => navigate("/dashboard")}>
                        <X size={20} />
                    </button>
                </div>

                <div className="ct-wizard-steps">
                    <div className={`ct-wizard-step ${etape >= 1 ? "done" : ""}`}>
                        {etape > 1 ? <Check size={14} /> : "1"} Identité
                    </div>
                    <div className={`ct-wizard-step ${etape >= 2 ? "active" : ""}`}>
                        2. Type & Configuration
                    </div>
                </div>

                {etape === 1 && (
                    <form onSubmit={allerEtape2} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="nomGroupe">Nom du groupe *</label>
                            <input
                                type="text"
                                id="nomGroupe"
                                placeholder="ex : Tontine Entreprise Lomé 2026"
                                value={nomGroupe}
                                onChange={(e) => setNomGroupe(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="ct-row">
                            <div className="form-group">
                                <label htmlFor="montantCotisation">Cotisation / membre (FCFA) *</label>
                                <input
                                    type="number"
                                    id="montantCotisation"
                                    placeholder="25000"
                                    value={montantCotisation}
                                    onChange={(e) => setMontantCotisation(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="frequence">Fréquence *</label>
                                <select
                                    id="frequence"
                                    value={frequence}
                                    onChange={(e) => setFrequence(e.target.value)}
                                >
                                    <option value="Journaliere">Journalière</option>
                                    <option value="Hebdomadaire">Hebdomadaire</option>
                                    <option value="Mensuelle">Mensuelle</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombreMaxMembres">Nombre maximum de membres</label>
                            <input
                                type="number"
                                id="nombreMaxMembres"
                                placeholder="15"
                                value={nombreMaxMembres}
                                onChange={(e) => setNombreMaxMembres(e.target.value)}
                            />
                        </div>

                        {error && <div className="form-message error">{error}</div>}

                        <div className="ct-wizard-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
                                Annuler
                            </button>
                            <button type="submit" className="btn-primary">
                                Continuer
                            </button>
                        </div>
                    </form>
                )}

                {etape === 2 && (
                    <form onSubmit={handleCreer} className="auth-form">
                        <div className="form-group">
                            <label>Type de tontine *</label>
                            <div className="ct-type-cards ct-type-cards-compact">
                                <div
                                    className={`ct-type-card-mini ${typeTontine === "Rotative" ? "selected" : ""}`}
                                    onClick={() => setTypeTontine("Rotative")}
                                >
                                    <RefreshCw size={22} color={typeTontine === "Rotative" ? "#16a34a" : "#94a3b8"} />
                                    <strong>Rotative</strong>
                                    <p>Tirage ou attribution du lot par tour</p>
                                </div>

                                <div
                                    className={`ct-type-card-mini ${typeTontine === "EpargneCredit" ? "selected" : ""}`}
                                    onClick={() => setTypeTontine("EpargneCredit")}
                                >
                                    <PiggyBank size={22} color={typeTontine === "EpargneCredit" ? "#16a34a" : "#94a3b8"} />
                                    <strong>Épargne-Crédit</strong>
                                    <p>Caisse d'épargne avec possibilité de prêt</p>
                                </div>
                            </div>
                        </div>

                        {typeTontine === "Rotative" ? (
                            <div className="form-group">
                                <label>Mode d'attribution *</label>
                                <div className="ct-radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            checked={modeAttribution === "Ordre"}
                                            onChange={() => setModeAttribution("Ordre")}
                                        />
                                        Ordre défini
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            checked={modeAttribution === "TirageAuSort"}
                                            onChange={() => setModeAttribution("TirageAuSort")}
                                        />
                                        Tirage au sort
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="ct-row">
                                    <div className="form-group">
                                        <label htmlFor="typeCotisation">Type de cotisation *</label>
                                        <select
                                            id="typeCotisation"
                                            value={typeCotisation}
                                            onChange={(e) => setTypeCotisation(e.target.value)}
                                        >
                                            <option value="Fixe">Fixe</option>
                                            <option value="Libre">Libre</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="tauxInteret">Taux d'intérêt (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            max="999.99"
                                            id="tauxInteret"
                                            value={tauxInteret}
                                            onChange={(e) => setTauxInteret(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="ct-row">
                                    <div className="form-group">
                                        <label htmlFor="dureeMaxRemboursement">Durée max remboursement (mois)</label>
                                        <input
                                            type="number"
                                            id="dureeMaxRemboursement"
                                            value={dureeMaxRemboursement}
                                            onChange={(e) => setDureeMaxRemboursement(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="modeDecision">Mode de décision</label>
                                        <select
                                            id="modeDecision"
                                            value={modeDecision}
                                            onChange={(e) => setModeDecision(e.target.value)}
                                        >
                                            <option value="DecisionBureau">Décision du bureau</option>
                                            <option value="VoteMembres">Vote des membres</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateRedistribution">Date de redistribution</label>
                                    <input
                                        type="date"
                                        id="dateRedistribution"
                                        value={dateRedistribution}
                                        onChange={(e) => setDateRedistribution(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {error && <div className="form-message error">{error}</div>}

                        <div className="ct-wizard-actions">
                            <button type="button" className="btn-secondary" onClick={() => setEtape(1)}>
                                ← Retour
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? "Création..." : "Valider & créer la tontine"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default CreerTontine;