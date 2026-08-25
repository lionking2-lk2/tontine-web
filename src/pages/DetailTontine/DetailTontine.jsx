import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Home, Users, Wallet, Target, History, Vote, Key, X } from "lucide-react";
import {
    getGroupe,
    getMembresGroupe,
    getValidateursGroupe,
    getCotisationsGroupe,
    getStatistiquesGroupe,
    getDemandesAdhesion,
    inviterMembre,
    quitterGroupe,
    modererMembre,
    designerValidateur,
    supprimerValidateur,
} from "../../services/groupeService";
import { getMesDemandesPret, getHistoriqueRemboursements, getDemandesPretGroupe, voterDemandePret } from "../../services/loanService";
import CotisationForm from "../../components/CotisationForm";
import DemanderPretForm from "../../components/DemanderPretForm";
import GestionValidateurs from "../../components/GestionValidateurs";
import ModerationMembres from "../../components/ModerationMembres";
import QuitterGroupe from "../../components/QuitterGroupe";

// Composant inline pour l'historique du groupe
function HistoriqueGroupe({ groupeId }) {
    const [txs, setTxs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import("../../services/loanService").then(({ getHistoriqueTransactions }) => {
            getHistoriqueTransactions(groupeId)
                .then((res) => setTxs(res.data?.results || res.data || []))
                .finally(() => setLoading(false));
        });
    }, [groupeId]);

    const TYPE_COLORS = { Cotisation: "var(--vert-dark)", Pret: "var(--bleu)", Remboursement: "var(--ambre)" };

    return (
        <div className="dt-card">
            <div className="dt-card-title">📜 Historique des transactions</div>
            {loading ? (
                <p className="dt-empty-state">Chargement...</p>
            ) : txs.length === 0 ? (
                <p className="dt-empty-state">Aucune transaction enregistrée pour ce groupe.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {txs.map((t, i) => (
                        <div key={t.id || i} className="dt-cotisation-row">
                            <span style={{ color: TYPE_COLORS[t.type] || "var(--texte)", fontWeight: 600 }}>{t.type || "Transaction"}</span>
                            <span style={{ color: "var(--texte-clair)", fontSize: 12 }}>
                                {t.dateTransaction ? new Date(t.dateTransaction).toLocaleDateString("fr-FR") : "—"}
                            </span>
                            <span style={{ fontWeight: 700, color: TYPE_COLORS[t.type] || "var(--texte)" }}>
                                {Number(t.montant || 0).toLocaleString()} FCFA
                            </span>
                            <span className={`mt-badge ${t.statut === "SUCCESS" || t.statut === "VALIDE" ? "active" : "inactive"}`}>
                                {t.statut || "—"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
function DetailTontine() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [groupe, setGroupe] = useState(null);
    const [membres, setMembres] = useState([]);
    const [validateurs, setValidateurs] = useState([]);
    const [cotisations, setCotisations] = useState([]);
    const [stats, setStats] = useState({
    nombreMembresActifs: 0,
    nombreTotalMembres: 0,
    montantTotalCollecte: 0,
    cotisationsEnAttente: 0,
    });
    const [demandesEnAttente, setDemandesEnAttente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ongletActif, setOngletActif] = useState("accueil");

    const currentUserId = Number(localStorage.getItem("userId"));
    const currentUsername = localStorage.getItem("username");
    const [demandesPret, setDemandesPret] = useState([]);
    const [remboursements, setRemboursements] = useState([]);
    
    const [demandesAVoter, setDemandesAVoter] = useState([]);
    const [afficherInvitation, setAfficherInvitation] = useState(false);
    const [identifiantInvite, setIdentifiantInvite] = useState("");
    const [messageInvitation, setMessageInvitation] = useState("");

    // UC08 — Gestion des 3 clés (validateurs)
    const [afficherAjoutValidateur, setAfficherAjoutValidateur] = useState(false);
    const [identifiantValidateur, setIdentifiantValidateur] = useState("");
    const [ordreValidateur, setOrdreValidateur] = useState(2);
    const [messageValidateur, setMessageValidateur] = useState("");

    const handleDesignerValidateur = async (e) => {
        e.preventDefault();
        setMessageValidateur("");
        try {
            await designerValidateur({
                groupe: Number(id),
                identifiant: identifiantValidateur,
                ordre: ordreValidateur,
            });
            setMessageValidateur("✅ Validateur désigné avec succès.");
            setIdentifiantValidateur("");
            setAfficherAjoutValidateur(false);
            getValidateursGroupe(id).then((res) => setValidateurs(res.data));
        } catch (err) {
            setMessageValidateur(
                err.response?.data?.detail || "Impossible de désigner ce validateur."
            );
        }
    };

    const handleSupprimerValidateur = async (validateurId) => {
        if (!window.confirm("Retirer ce validateur du groupe ?")) return;
        try {
            await supprimerValidateur(validateurId);
            setValidateurs((prev) => prev.filter((v) => v.id !== validateurId));
        } catch (err) {
            alert(err.response?.data?.detail || "Impossible de retirer ce validateur.");
        }
    };

const handleInviter = async (event) => {
    event.preventDefault();
    setMessageInvitation("");
    try {
        await inviterMembre(id, identifiantInvite);
        setMessageInvitation("Invitation envoyée avec succès.");
        setIdentifiantInvite("");
    } catch (err) {
        setMessageInvitation(err.response?.data?.detail || "Impossible d'envoyer l'invitation.");
    }
};

    useEffect(() => {
        if (ongletActif === "votes" && groupe) {
            getDemandesPretGroupe()
                .then((res) => setDemandesAVoter(res.data.filter((d) => d.groupe === groupe.nomGroupe && d.statut !== "APPROUVEE" && d.statut !== "REFUSEE")))
                .catch(() => {});
        }
    }, [ongletActif, groupe]);

    const handleVoter = async (demandeId, decision) => {
        try {
            await voterDemandePret(demandeId, decision);
            setDemandesAVoter((prev) => prev.filter((d) => d.id !== demandeId));
        } catch (err) {
            alert(err.response?.data?.detail || "Impossible d'enregistrer le vote.");
        }
    };
    useEffect(() => {
        if (ongletActif === "remboursements") {
            getHistoriqueRemboursements(id)
                .then((res) => setRemboursements(res.data.results || []))
                .catch(() => {});
        }
    }, [ongletActif]);

    useEffect(() => {
        if (ongletActif === "prets" && !estRotative) {
            getMesDemandesPret()
                .then((res) => setDemandesPret(res.data.filter((d) => d.groupe === Number(id))))
                .catch(() => {});
        }
    }, [ongletActif]);

    useEffect(() => {
        Promise.all([
            getGroupe(id),
            getMembresGroupe(id),
            getValidateursGroupe(id),
            getCotisationsGroupe(id),
        ])
            .then(([groupeRes, membresRes, validateursRes, cotisationsRes]) => {
                setGroupe(groupeRes.data);
                setMembres(membresRes.data);
                setValidateurs(validateursRes.data);
                setCotisations(cotisationsRes.data);
            })
            .catch(() => setError("Impossible de charger cette tontine."))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!groupe) return;
        const estResponsable = groupe.createurId === currentUserId;
        const estValidateur = validateurs.some(
            (v) => v.user === currentUsername && v.statut === "Actif"
        );

        if (estResponsable) {
            getStatistiquesGroupe(id).then((res) => setStats(res.data)).catch(() => {});
        }
        if (estResponsable || estValidateur) {
            getDemandesAdhesion()
                .then((res) => setDemandesEnAttente(res.data.filter((d) => d.groupe?.id === Number(id))))
                .catch(() => {});
        }
    }, [groupe, validateurs]);

    if (loading) {
        return <div className="dt-page"><p>Chargement...</p></div>;
    }

    if (error || !groupe) {
        return (
            <div className="dt-page">
                <p className="form-message error">{error || "Tontine introuvable."}</p>
                <Link to="/dashboard">← Retour à Mes tontines</Link>
            </div>
        );
    }

    const estResponsable = groupe.createurId === currentUserId;
    const estValidateur = validateurs.some(
        (v) => v.user === currentUsername && v.statut === "Actif"
    );
    const monRole = estResponsable ? "Responsable" : estValidateur ? "Validateur" : "Membre";
    const estRotative = groupe.typeTontine === "Rotative";

    const maCotisation = cotisations.find((c) => c.membre === membres.find(m => m.user === currentUsername)?.id);
    const monMembre = membres.find((m) => m.user === currentUsername);

    const onglets = estRotative
        ? [
              { key: "accueil", label: "Accueil", icon: Home },
              { key: "membres", label: "Membres", icon: Users },
              { key: "cotisations", label: "Cotisations", icon: Wallet },
              { key: "tours", label: "Tours", icon: Target },
              { key: "historique", label: "Historique", icon: History },
              ...(estResponsable ? [{ key: "validateurs", label: "Les 3 clés", icon: Key }] : []),
          ]
        : [
              { key: "accueil", label: "Accueil", icon: Home },
              { key: "membres", label: "Membres", icon: Users },
              { key: "epargne", label: "Épargne", icon: Wallet },
              { key: "prets", label: "Prêts", icon: Wallet },
              { key: "remboursements", label: "Remboursements", icon: History },
              { key: "votes", label: "Votes", icon: Vote },
              ...(estResponsable ? [{ key: "validateurs", label: "Les 3 clés", icon: Key }] : []),
          ];

    return (
        <div className="dt-page">
            <Link to="/dashboard" className="dt-back">
                <ArrowLeft size={16} /> Mes tontines
            </Link>

            <div className="dt-header">
                <h1>{estRotative ? "🔄" : "💰"} {groupe.nomGroupe}</h1>
                <span className={`mt-badge ${groupe.statut === "ACTIF" ? "active" : "inactive"}`}>
                    {groupe.statut === "ACTIF" ? "🟢 Active" : "⚪ Inactive"}
                </span>

                <div className="dt-header-info">
                    <span>💰 {Number(groupe.montantCotisation).toLocaleString()} FCFA / {groupe.frequence?.toLowerCase()}</span>
                    <span>👥 {membres.length} membres</span>
                    <span>👤 Votre rôle : <strong>{monRole}</strong></span>
                </div>

                <nav className="dt-nav">
                    {onglets.map((o) => (
                        <button
                            key={o.key}
                            className={`dt-nav-item ${ongletActif === o.key ? "active" : ""}`}
                            onClick={() => setOngletActif(o.key)}
                        >
                            <o.icon size={16} /> {o.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="dt-content">
                {ongletActif === "accueil" && (
                    <>
                        {estRotative && maCotisation && maCotisation.statut !== "PAYEE" && (
                            <div className="dt-alert">
                                <div>
                                    <strong>⚠️ Action requise</strong>
                                    <p>
                                        Votre cotisation de {Number(maCotisation.montantDu).toLocaleString()} FCFA
                                        {" "}n'est pas encore réglée.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="dt-card">
                            <div className="dt-card-title">👤 Ma situation</div>
                            <div className="dt-grid">
                                <div className="dt-grid-item">
                                    <span>Rôle</span>
                                    <strong>{monRole}</strong>
                                </div>
                                <div className="dt-grid-item">
                                    <span>État</span>
                                    <strong>{monMembre ? monMembre.statutMembre : "—"}</strong>
                                </div>
                                <div className="dt-grid-item">
                                    <span>Cotisation</span>
                                    <strong>{Number(groupe.montantCotisation).toLocaleString()} FCFA</strong>
                                </div>
                                {estRotative && monMembre && (
                                    <>
                                        <div className="dt-grid-item">
                                            <span>Total cotisé</span>
                                            <strong>{Number(monMembre.totalCotise).toLocaleString()} FCFA</strong>
                                        </div>
                                        <div className="dt-grid-item">
                                            <span>Ordre du tour</span>
                                            <strong>{monMembre.ordreTour ?? "Non défini"}</strong>
                                        </div>
                                        <div className="dt-grid-item">
                                            <span>Tour reçu</span>
                                            <strong>{monMembre.tourRecu ? "✅ Oui" : "⏳ Pas encore"}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {(estValidateur || estResponsable) && (
                            <div className="dt-card">
                                <div className="dt-card-title">
                                    🗳️ Validations en attente
                                    <span className="mt-badge inactive">{demandesEnAttente.length}</span>
                                </div>
                                <p>
                                    {demandesEnAttente.length > 0
                                        ? `${demandesEnAttente.length} demande(s) nécessitent votre décision.`
                                        : "Aucune demande en attente pour le moment."}
                                </p>
                                {demandesEnAttente.length > 0 && (
                                    <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                                        Voir les demandes
                                    </button>
                                )}
                            </div>
                        )}

                        {estResponsable &&  (                            <div className="dt-responsable-card">
                                <div className="dt-card-title" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.15)" }}>
                                    👑 Vue de la tontine
                                </div>
                                <div className="dt-grid">
                                    <div className="dt-grid-item">
                                        <span>Membres actifs</span>
                                        <strong>{stats.nombreMembresActifs} / {stats.nombreTotalMembres}</strong>
                                    </div>
                                    <div className="dt-grid-item">
                                        <span>Total collecté</span>
                                        <strong>{Number(stats.montantTotalCollecte).toLocaleString()} FCFA</strong>
                                    </div>
                                    <div className="dt-grid-item">
                                        <span>Cotisations en attente</span>
                                        <strong>{stats.cotisationsEnAttente}</strong>
                                    </div>
                                </div>

                                <div className="dt-responsable-actions">
                                    <button
                                        className="dt-action-vert"
                                        onClick={() => setAfficherInvitation(!afficherInvitation)}
                                    >
                                        + Inviter un membre
                                    </button>
                                    <GestionValidateurs groupeId={id} estResponsable={estResponsable} />
                                </div>

                                {afficherInvitation && (
                                    <form onSubmit={handleInviter} className="dt-invite-form">
                                        <input
                                            type="text"
                                            placeholder="Email, téléphone ou nom d'utilisateur"
                                            value={identifiantInvite}
                                            onChange={(e) => setIdentifiantInvite(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="dt-action-vert">Envoyer</button>
                                    </form>
                                )}

                                {messageInvitation && (
                                    <p className="dt-invite-message">{messageInvitation}</p>
                                )}
                            </div>
                        )}

                        {!estResponsable && (
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <QuitterGroupe groupeId={id} nomGroupe={groupe.nomGroupe} estResponsable={estResponsable} />
                            </div>
                        )}
                    </>
                )}

                {ongletActif === "membres" && (
                    <div className="dt-card">
                        <div className="dt-card-title">
                            👥 Membres de la tontine ({membres.length})
                        </div>
                        <div className="dt-membres-list">
                            {membres.map((m) => {
                                const estCeResponsable = m.userId === groupe.createurId;
                                const estCeValidateur = validateurs.some(
                                    (v) => v.user === m.user && v.statut === "Actif"
                                );
                                const roleAffiche = estCeResponsable
                                    ? "Responsable"
                                    : estCeValidateur
                                    ? "Validateur"
                                    : "Membre";

                                return (
                                    <div className="dt-membre-row" key={m.id}>
                                        <div className="dt-membre-avatar">
                                            {m.user.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="dt-membre-info">
                                            <strong>
                                                {m.user}
                                                {m.user === currentUsername ? " (Vous)" : ""}
                                            </strong>
                                            <span>Adhésion : {new Date(m.dateAdhesion).toLocaleDateString("fr-FR")}</span>
                                        </div>
                                        <span className={`dt-role-badge ${roleAffiche.toLowerCase()}`}>
                                            {roleAffiche}
                                        </span>
                                        <span className={`mt-badge ${m.statutMembre === "Actif" ? "active" : "inactive"}`}>
                                            {m.statutMembre === "Actif" ? "🟢 Actif" : m.statutMembre === "Suspendu" ? "🔴 Suspendu" : "⚪ Parti"}
                                        </span>
                                        {m.user !== currentUsername && (
                                            <ModerationMembres
                                                membre={m}
                                                estResponsable={estResponsable}
                                                onMaj={() => getMembresGroupe(id).then((r) => setMembres(r.data))}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {ongletActif === "cotisations" && (
    <>
        {estResponsable && (
            <div className="dt-card">
                <div className="dt-card-title">💰 Vue globale des cotisations</div>
                <div className="dt-grid">
                    <div className="dt-grid-item">
                        <span>Total collecté</span>
                        <strong>
                            {cotisations.reduce((sum, c) => sum + Number(c.montantVerse || 0), 0).toLocaleString()} FCFA
                        </strong>
                    </div>
                    <div className="dt-grid-item">
                        <span>Cotisations payées</span>
                        <strong>{cotisations.filter((c) => c.statut === "PAYEE").length} / {cotisations.length}</strong>
                    </div>
                    <div className="dt-grid-item">
                        <span>En attente</span>
                        <strong>{cotisations.filter((c) => c.statut === "EN_ATTENTE").length}</strong>
                    </div>
                </div>

                <div className="dt-cotisation-list">
                    {cotisations.map((c) => (
                        <div className="dt-cotisation-row" key={c.id}>
                            <span>Membre #{c.membre}</span>
                            <span>{Number(c.montantVerse).toLocaleString()} / {Number(c.montantDu).toLocaleString()} FCFA</span>
                            <span className={`mt-badge ${c.statut === "PAYEE" ? "active" : "inactive"}`}>
                                {c.statut === "PAYEE" ? "🟢 Payée" : c.statut === "PARTIELLE" ? "🟡 Partielle" : "🔴 En attente"}
                            </span>
                        </div>
                    ))}
                    {cotisations.length === 0 && <p>Aucune cotisation enregistrée pour ce groupe.</p>}
                </div>
            </div>
        )}

        <div className="dt-card">
            <div className="dt-card-title">💰 Ma cotisation</div>
            {maCotisation ? (
                <div className="dt-grid">
                    <div className="dt-grid-item">
                        <span>Montant récurrent</span>
                        <strong>{Number(groupe.montantCotisation).toLocaleString()} FCFA</strong>
                    </div>
                    <div className="dt-grid-item">
                        <span>État actuel</span>
                        <strong>
                            {maCotisation.statut === "PAYEE" ? "🟢 Payée" : maCotisation.statut === "PARTIELLE" ? "🟡 Partielle" : "🔴 En attente"}
                        </strong>
                    </div>
                    <div className="dt-grid-item">
                        <span>Échéance</span>
                        <strong>{new Date(maCotisation.dateEcheance).toLocaleDateString("fr-FR")}</strong>
                    </div>
                </div>
            ) : (
                <>
                    <p>Aucune cotisation enregistrée pour vous dans ce groupe pour le moment.</p>
                    {monMembre && (
                        <CotisationForm
                            membreId={monMembre.id}
                            montantDu={groupe.montantCotisation}
                            onSuccess={() => window.location.reload()}
                        />
                    )}
                </>
            )}
        </div>
    </>
)}

                {ongletActif === "tours" && (
                    <div className="dt-card">
                        <div className="dt-card-title">🎯 Ordre des tours</div>

                        {membres.filter((m) => m.ordreTour != null).length === 0 ? (
                            <p>L'ordre des tours n'a pas encore été défini pour ce groupe.</p>
                        ) : (
                            <div className="dt-tours-list">
                                {[...membres]
                                    .filter((m) => m.ordreTour != null)
                                    .sort((a, b) => a.ordreTour - b.ordreTour)
                                    .map((m) => {
                                        const estMoi = m.user === currentUsername;
                                        return (
                                            <div
                                                className={`dt-tour-row ${estMoi ? "moi" : ""} ${m.tourRecu ? "recu" : ""}`}
                                                key={m.id}
                                            >
                                                <div className="dt-tour-pos">{m.ordreTour}</div>
                                                <div className="dt-membre-info">
                                                    <strong>{m.user}{estMoi ? " (Vous)" : ""}</strong>
                                                    {m.dateTourRecu && (
                                                        <span>Reçu le {new Date(m.dateTourRecu).toLocaleDateString("fr-FR")}</span>
                                                    )}
                                                </div>
                                                <span className={`mt-badge ${m.tourRecu ? "active" : "inactive"}`}>
                                                    {m.tourRecu ? "✅ Bénéficié" : estMoi ? "⭐ Mon tour" : "⏳ À venir"}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}

                {ongletActif === "historique" && (
                    <HistoriqueGroupe groupeId={id} />
                )}

                {ongletActif === "epargne" && (
    <div className="dt-card">
        <div className="dt-card-title">💰 Mon épargne cumulée</div>

        {monMembre ? (
            <div className="dt-epargne-box">
                <span>Solde total épargné</span>
                <strong>{Number(monMembre.totalCotise).toLocaleString()} FCFA</strong>
                <p className="dt-epargne-sub">
                    Solde disponible : {Number(monMembre.soldeDisponible).toLocaleString()} FCFA
                </p>
            </div>
        ) : (
            <p className="dt-empty-state">Aucune donnée d'épargne disponible pour vous dans ce groupe.</p>
        )}

        {monMembre && (!maCotisation || maCotisation.statut !== "PAYEE") && (
            <CotisationForm
                membreId={monMembre.id}
                montantDu={maCotisation?.montantDu || groupe.montantCotisation}
                onSuccess={() => window.location.reload()}
            />
        )}
    </div>
)}

                {ongletActif === "prets" && (
    <div className="dt-card">
        <div className="dt-card-title">
            💳 Prêts en cours

            <DemanderPretForm
                groupeId={Number(id)}
                onSuccess={(nouvelleDemande) => {
                    setDemandesPret((prev) => [
                        nouvelleDemande,
                        ...prev,
                    ]);
                }}
            />
        </div>

        {demandesPret.length === 0 ? (
            <p className="dt-empty-state">
                Aucun prêt en cours. Vous pouvez en demander un.
            </p>
        ) : (
            <div className="dt-list">
                {demandesPret.map((d) => (
                    <div
                        className="dt-cotisation-row"
                        key={d.id}
                    >
                        <span>
                            {d.objet || "Prêt"}
                        </span>

                        <span>
                            {Number(
                                d.montantDemande
                            ).toLocaleString()} FCFA
                        </span>

                        <span className="mt-badge inactive">
                            {d.statut}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
)}

                {ongletActif === "remboursements" && (
                    <div className="dt-card">
                        <div className="dt-card-title">💸 Remboursements</div>

                        {remboursements.length === 0 ? (
                            <p className="dt-empty-state">Aucun remboursement enregistré pour le moment.</p>
                        ) : (
                            <div className="dt-list">
                                {remboursements.map((r, index) => (
                                    <div className="dt-cotisation-row" key={r.id || index}>
                                        <span>{r.description || "Remboursement"}</span>
                                        <span>{Number(r.montant || 0).toLocaleString()} FCFA</span>
                                        <span className="mt-badge inactive">{r.statut || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {ongletActif === "votes" && (
                    <div className="dt-card">
                        <div className="dt-card-title">🗳️ Session de vote</div>

                        {!(estValidateur || estResponsable) ? (
                            <p className="dt-empty-state">Seuls les validateurs peuvent voter sur les demandes de prêt.</p>
                        ) : demandesAVoter.length === 0 ? (
                            <p className="dt-empty-state">Aucune demande en attente de vote.</p>
                        ) : (
                            <div className="dt-list">
                                {demandesAVoter.map((d) => (
                                    <div className="dt-vote-item" key={d.id}>
                                        <p><strong>{d.objet}</strong></p>
                                        <p>{d.user} — {Number(d.montantDemande).toLocaleString()} FCFA sur {d.duree} mois</p>
                                        <div className="dt-vote-buttons">
                                            <button className="dt-vote-pour" onClick={() => handleVoter(d.id, "FAVORABLE")}>Pour</button>
                                            <button className="dt-vote-contre" onClick={() => handleVoter(d.id, "DEFAVORABLE")}>Contre</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {ongletActif === "validateurs" && estResponsable && (
                    <div className="dt-card">
                        <div className="dt-card-title">
                            🗝️ Les 3 clés — Validateurs du groupe
                            <button
                                className="dt-action-vert dt-small-btn"
                                onClick={() => setAfficherAjoutValidateur(!afficherAjoutValidateur)}
                            >
                                {afficherAjoutValidateur ? "Annuler" : "+ Ajouter une clé"}
                            </button>
                        </div>

                        {/* Explication */}
                        <div style={{
                            background: "var(--bleu-bg)",
                            border: "1px solid var(--bleu-border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "12px 14px",
                            marginBottom: "16px",
                            fontSize: "13px",
                            color: "var(--bleu-dark, #1d4ed8)",
                            lineHeight: "1.6",
                        }}>
                            <strong>Comment ça fonctionne ?</strong> Pour approuver un prêt,
                            les 3 validateurs désignés doivent chacun voter favorablement.
                            Un seul vote défavorable suffit à rejeter la demande.
                        </div>

                        {/* Formulaire d'ajout */}
                        {afficherAjoutValidateur && (
                            <form
                                onSubmit={handleDesignerValidateur}
                                style={{
                                    background: "var(--slate-50)",
                                    border: "1px solid var(--slate-200)",
                                    borderRadius: "var(--radius-md)",
                                    padding: "16px",
                                    marginBottom: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", alignItems: "flex-end" }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Membre à désigner (email, tél. ou username)</label>
                                        <input
                                            type="text"
                                            value={identifiantValidateur}
                                            onChange={(e) => setIdentifiantValidateur(e.target.value)}
                                            placeholder="Ex : marie@email.com ou +22890000001"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Numéro de clé</label>
                                        <select
                                            value={ordreValidateur}
                                            onChange={(e) => setOrdreValidateur(Number(e.target.value))}
                                            style={{ minWidth: "100px" }}
                                        >
                                            <option value={1}>🗝️ Clé 1</option>
                                            <option value={2}>🗝️ Clé 2</option>
                                            <option value={3}>🗝️ Clé 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => {
                                            setAfficherAjoutValidateur(false);
                                            setMessageValidateur("");
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Désigner comme validateur
                                    </button>
                                </div>
                                {messageValidateur && (
                                    <div className={`form-message ${messageValidateur.includes("✅") ? "success" : "error"}`}>
                                        {messageValidateur}
                                    </div>
                                )}
                            </form>
                        )}

                        {/* Liste des validateurs actuels */}
                        {validateurs.length === 0 ? (
                            <div style={{
                                textAlign: "center",
                                padding: "32px 20px",
                                color: "var(--slate-400)",
                                border: "1px dashed var(--slate-200)",
                                borderRadius: "var(--radius-md)",
                            }}>
                                <Key size={32} style={{ marginBottom: "10px", opacity: 0.4 }} />
                                <p style={{ fontSize: "14px" }}>Aucun validateur désigné.</p>
                                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                                    Ajoutez les 3 clés pour activer la validation des prêts.
                                </p>
                            </div>
                        ) : (
                            <div className="dt-membres-list">
                                {/* Indicateur de progression */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "12px",
                                    padding: "10px 12px",
                                    background: validateurs.filter(v => v.statut === "Actif").length === 3
                                        ? "var(--vert-bg)"
                                        : "var(--ambre-bg)",
                                    border: `1px solid ${validateurs.filter(v => v.statut === "Actif").length === 3
                                        ? "var(--vert-border)"
                                        : "var(--ambre-border)"}`,
                                    borderRadius: "var(--radius-sm)",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: validateurs.filter(v => v.statut === "Actif").length === 3
                                        ? "var(--vert-dark)"
                                        : "var(--ambre)",
                                }}>
                                    {validateurs.filter(v => v.statut === "Actif").length === 3
                                        ? "✅ Les 3 clés sont désignées — la validation des prêts est activée."
                                        : `⚠️ ${validateurs.filter(v => v.statut === "Actif").length}/3 clé(s) désignée(s) — validation des prêts incomplète.`}
                                </div>

                                {[1, 2, 3].map((ordre) => {
                                    const val = validateurs.find((v) => v.ordre === ordre);
                                    return (
                                        <div
                                            key={ordre}
                                            className="dt-membre-row"
                                            style={{
                                                border: "1px solid var(--slate-200)",
                                                borderRadius: "var(--radius-sm)",
                                                padding: "12px 14px",
                                                marginBottom: "6px",
                                                background: val ? "var(--blanc)" : "var(--slate-50)",
                                            }}
                                        >
                                            <div style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                background: val ? "var(--vert)" : "var(--slate-200)",
                                                color: val ? "var(--blanc)" : "var(--slate-400)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                fontSize: "13px",
                                                flexShrink: 0,
                                            }}>
                                                {ordre}
                                            </div>

                                            {val ? (
                                                <>
                                                    <div className="dt-membre-avatar" style={{ background: "var(--slate-800)" }}>
                                                        {(val.user || "?")[0].toUpperCase()}
                                                    </div>
                                                    <div className="dt-membre-info">
                                                        <strong>{val.user}</strong>
                                                        <span>
                                                            Désigné le {new Date(val.dateDesignation).toLocaleDateString("fr-FR")}
                                                        </span>
                                                    </div>
                                                    <span className={`mt-badge ${val.statut === "Actif" ? "active" : "inactive"}`}>
                                                        {val.statut === "Actif" ? "🟢 Actif" : "⚪ Inactif"}
                                                    </span>
                                                    {val.user !== currentUsername && (
                                                        <button
                                                            onClick={() => handleSupprimerValidateur(val.id)}
                                                            title="Retirer ce validateur"
                                                            style={{
                                                                background: "none",
                                                                border: "1px solid var(--rouge-border)",
                                                                color: "var(--rouge)",
                                                                borderRadius: "var(--radius-sm)",
                                                                padding: "5px 10px",
                                                                fontSize: "11px",
                                                                fontWeight: 600,
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <X size={12} /> Retirer
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="dt-membre-info">
                                                        <strong style={{ color: "var(--slate-400)" }}>
                                                            Clé {ordre} — non désignée
                                                        </strong>
                                                        <span>Cliquez sur "+ Ajouter une clé" pour désigner</span>
                                                    </div>
                                                    <button
                                                        className="dt-action-vert dt-small-btn"
                                                        onClick={() => {
                                                            setOrdreValidateur(ordre);
                                                            setAfficherAjoutValidateur(true);
                                                        }}
                                                    >
                                                        + Désigner
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {ongletActif !== "accueil" && ongletActif !== "membres" && ongletActif !== "cotisations" && ongletActif !== "tours" && ongletActif !== "historique" && ongletActif !== "epargne" && ongletActif !== "prets" && ongletActif !== "remboursements" && ongletActif !== "votes" && ongletActif !== "validateurs" && (
                    <div className="dt-card">
                        <p>Section « {ongletActif} » à venir.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailTontine; 