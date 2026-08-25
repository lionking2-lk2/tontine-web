import { useState, useEffect } from "react";
import {
    CreditCard,
    ChevronRight,
    Check,
    X,
    FileText,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import {
    getMesDemandesPret,
    getDemandesAApprouver,
    enregistrerDecisionExamen,
    approuverDemandePret,
    refuserDemandePret,
    getDetailDemandePret,
} from "../../services/loanService";
import "./GestionPrets.css";

const STATUT_LABELS = {
    EN_ATTENTE_EXAMEN: { label: "En attente d'examen", color: "ambre" },
    EN_ATTENTE_VALIDATION: { label: "En validation", color: "bleu" },
    EN_ATTENTE_INFOS_COMPLEMENTAIRES: { label: "Infos complémentaires requises", color: "ambre" },
    EN_ATTENTE_PIECES_JUSTIFICATIVES: { label: "Pièces requises", color: "ambre" },
    APPROUVEE: { label: "Approuvée", color: "vert" },
    REFUSEE: { label: "Refusée", color: "rouge" },
};

function StatutBadge({ statut }) {
    const conf = STATUT_LABELS[statut] || { label: statut, color: "slate" };
    return (
        <span className={`gp-badge gp-badge-${conf.color}`}>{conf.label}</span>
    );
}

export default function GestionPrets() {
    const [onglet, setOnglet] = useState("mesDemandes");
    const [mesDemandes, setMesDemandes] = useState([]);
    const [demandesAApprouver, setDemandesAApprouver] = useState([]);
    const [loading, setLoading] = useState(true);
    const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [actionEnCours, setActionEnCours] = useState("");
    const [motif, setMotif] = useState("");
    const [loadingAction, setLoadingAction] = useState(false);
    const [message, setMessage] = useState(null);

    const chargerDonnees = () => {
        setLoading(true);
        Promise.all([getMesDemandesPret(), getDemandesAApprouver()])
            .then(([mesRes, approuverRes]) => {
                setMesDemandes(mesRes.data.results || mesRes.data);
                setDemandesAApprouver(approuverRes.data.results || approuverRes.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    const ouvrirDetail = (demande) => {
        setDemandeSelectionnee(demande);
        setDetail(null);
        setActionEnCours("");
        setMotif("");
        setMessage(null);
        setLoadingDetail(true);
        getDetailDemandePret(demande.id)
            .then((res) => setDetail(res.data))
            .catch(() => setDetail(demande))
            .finally(() => setLoadingDetail(false));
    };

    const fermerDetail = () => {
        setDemandeSelectionnee(null);
        setDetail(null);
    };

    const handleAction = async (typeAction) => {
        if (!demandeSelectionnee) return;
        if (
            ["refuser", "demander_infos", "demander_pieces"].includes(typeAction) &&
            !motif.trim()
        ) {
            setMessage({ type: "error", text: "Le motif est obligatoire." });
            return;
        }
        setLoadingAction(true);
        setMessage(null);
        try {
            if (typeAction === "approuver") {
                await approuverDemandePret(demandeSelectionnee.id);
                setMessage({ type: "success", text: "✅ Prêt approuvé avec succès." });
            } else if (typeAction === "refuser") {
                await refuserDemandePret(demandeSelectionnee.id, { motif });
                setMessage({ type: "success", text: "Demande refusée." });
            } else {
                await enregistrerDecisionExamen(demandeSelectionnee.id, {
                    action: typeAction,
                    commentaire: motif,
                });
                setMessage({ type: "success", text: "Décision enregistrée." });
            }
            setTimeout(() => {
                fermerDetail();
                chargerDonnees();
            }, 1400);
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.detail || "Erreur lors de l'action.",
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const listeActive =
        onglet === "mesDemandes" ? mesDemandes : demandesAApprouver;

    return (
        <div className="gp-page">
            <div className="gp-header">
                <h1>
                    <CreditCard size={20} /> Gestion des prêts
                </h1>
                <p>Suivez et gérez les demandes de prêt</p>
            </div>

            <div className="gp-tabs">
                <button
                    className={onglet === "mesDemandes" ? "active" : ""}
                    onClick={() => setOnglet("mesDemandes")}
                >
                    Mes demandes{" "}
                    <span className="gp-tab-count">{mesDemandes.length}</span>
                </button>
                <button
                    className={onglet === "aApprouver" ? "active" : ""}
                    onClick={() => setOnglet("aApprouver")}
                >
                    À examiner / approuver{" "}
                    <span className="gp-tab-count gp-tab-count-ambre">
                        {demandesAApprouver.length}
                    </span>
                </button>
            </div>

            {loading ? (
                <div className="gp-loading">
                    <RefreshCw size={18} className="spin" /> Chargement...
                </div>
            ) : listeActive.length === 0 ? (
                <div className="gp-empty">
                    <CreditCard size={36} />
                    <p>Aucune demande pour le moment.</p>
                </div>
            ) : (
                <div className="gp-list">
                    {listeActive.map((d) => (
                        <div
                            className="gp-item"
                            key={d.id}
                            onClick={() => ouvrirDetail(d)}
                        >
                            <div className="gp-item-left">
                                <div className="gp-item-icon">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <strong>{d.objet || "Demande de prêt"}</strong>
                                    <span>
                                        {d.groupe?.nomGroupe || d.groupe || "—"} ·{" "}
                                        {Number(d.montantDemande).toLocaleString()} FCFA
                                    </span>
                                </div>
                            </div>
                            <div className="gp-item-right">
                                <StatutBadge statut={d.statut} />
                                <ChevronRight size={14} className="gp-chevron" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Panneau détail latéral */}
            {demandeSelectionnee && (
                <div className="gp-overlay" onClick={fermerDetail}>
                    <div
                        className="gp-detail-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="gp-detail-header">
                            <div>
                                <span className="gp-eyebrow">Détail de la demande</span>
                                <h2>{demandeSelectionnee.objet || "Demande de prêt"}</h2>
                            </div>
                            <button className="gp-close" onClick={fermerDetail}>
                                <X size={18} />
                            </button>
                        </div>

                        {loadingDetail ? (
                            <div className="gp-loading">
                                <RefreshCw size={16} className="spin" /> Chargement...
                            </div>
                        ) : detail ? (
                            <>
                                <div className="gp-detail-grid">
                                    <div className="gp-detail-item">
                                        <span>Montant demandé</span>
                                        <strong>
                                            {Number(detail.montantDemande).toLocaleString()} FCFA
                                        </strong>
                                    </div>
                                    <div className="gp-detail-item">
                                        <span>Durée</span>
                                        <strong>{detail.duree} mois</strong>
                                    </div>
                                    <div className="gp-detail-item">
                                        <span>Groupe</span>
                                        <strong>
                                            {detail.groupe?.nomGroupe || detail.groupe || "—"}
                                        </strong>
                                    </div>
                                    <div className="gp-detail-item">
                                        <span>Statut</span>
                                        <StatutBadge statut={detail.statut} />
                                    </div>
                                    <div className="gp-detail-item gp-full">
                                        <span>Motif</span>
                                        <strong>{detail.objet || "—"}</strong>
                                    </div>
                                    {detail.commentaireExamen && (
                                        <div className="gp-detail-item gp-full">
                                            <span>Commentaire examinateur</span>
                                            <strong>{detail.commentaireExamen}</strong>
                                        </div>
                                    )}
                                </div>

                                {/* Votes des validateurs */}
                                {detail.validations && detail.validations.length > 0 && (
                                    <div className="gp-section">
                                        <div className="gp-section-title">
                                            Votes des validateurs
                                        </div>
                                        {detail.validations.map((v) => (
                                            <div className="gp-validation-row" key={v.id}>
                                                <div className="gp-avatar">
                                                    {(v.user || "?")[0].toUpperCase()}
                                                </div>
                                                <span>
                                                    {v.user} — Clé {v.ordreValidation}
                                                </span>
                                                <span
                                                    className={`gp-badge ${
                                                        v.decision === "APPROUVEE"
                                                            ? "gp-badge-vert"
                                                            : "gp-badge-rouge"
                                                    }`}
                                                >
                                                    {v.decision === "APPROUVEE"
                                                        ? "✓ Approuvé"
                                                        : "✗ Rejeté"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions gestionnaire */}
                                {onglet === "aApprouver" && (
                                    <div className="gp-section">
                                        <div className="gp-section-title">Actions disponibles</div>

                                        {[
                                            "EN_ATTENTE_EXAMEN",
                                            "EN_ATTENTE_INFOS_COMPLEMENTAIRES",
                                            "EN_ATTENTE_PIECES_JUSTIFICATIVES",
                                        ].includes(detail.statut) && (
                                            <div className="gp-action-btns">
                                                <button
                                                    className="gp-btn gp-btn-bleu"
                                                    onClick={() => handleAction("transmettre")}
                                                    disabled={loadingAction}
                                                >
                                                    <Check size={14} /> Transmettre pour vote
                                                </button>
                                                <button
                                                    className="gp-btn gp-btn-ambre"
                                                    onClick={() => setActionEnCours("demander_infos")}
                                                >
                                                    <AlertCircle size={14} /> Demander des infos
                                                </button>
                                                <button
                                                    className="gp-btn gp-btn-rouge"
                                                    onClick={() => setActionEnCours("refuser")}
                                                >
                                                    <X size={14} /> Refuser
                                                </button>
                                            </div>
                                        )}

                                        {detail.statut === "EN_ATTENTE_VALIDATION" && (
                                            <button
                                                className="gp-btn gp-btn-vert gp-btn-full"
                                                onClick={() => handleAction("approuver")}
                                                disabled={loadingAction}
                                            >
                                                <Check size={14} />
                                                {loadingAction
                                                    ? "Approbation..."
                                                    : "Approuver définitivement"}
                                            </button>
                                        )}

                                        {["refuser", "demander_infos", "demander_pieces"].includes(
                                            actionEnCours
                                        ) && (
                                            <div className="gp-motif-form">
                                                <textarea
                                                    placeholder={
                                                        actionEnCours === "refuser"
                                                            ? "Motif de refus obligatoire..."
                                                            : "Informations ou documents requis..."
                                                    }
                                                    value={motif}
                                                    onChange={(e) => setMotif(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="gp-motif-footer">
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={() => {
                                                            setActionEnCours("");
                                                            setMotif("");
                                                        }}
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        className="btn-primary"
                                                        onClick={() => handleAction(actionEnCours)}
                                                        disabled={loadingAction}
                                                    >
                                                        {loadingAction ? "Envoi..." : "Confirmer"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {message && (
                                    <div className={`form-message ${message.type}`}>
                                        {message.text}
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
