import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Mail, CreditCard, Users, Target, Info, ShieldCheck } from "lucide-react";
import { getNotifications, marquerCommeLue } from "../../services/notificationService";
import { getMesInvitations, repondreInvitation } from "../../services/groupeService";

const ICONES_TYPE = {
    INFO: { icon: Info, bg: "bleu" },
    ALERTE: { icon: ShieldCheck, bg: "ambre" },
    PRET: { icon: CreditCard, bg: "bleu" },
    COTISATION: { icon: Target, bg: "vert" },
    GROUPE: { icon: Users, bg: "vert" },
    SUPPORT: { icon: Info, bg: "slate" },
};

function grouperParJour(dateStr) {
    const date = new Date(dateStr);
    const aujourdhui = new Date();
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);

    if (date.toDateString() === aujourdhui.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === hier.toDateString()) return "Hier";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function Notifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtre, setFiltre] = useState("toutes");

    useEffect(() => {
        Promise.all([getNotifications(), getMesInvitations()])
            .then(([notifRes, invitRes]) => {
                setNotifications(notifRes.data);
                setInvitations(invitRes.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleRepondreInvitation = async (demandeId, action) => {
        try {
            await repondreInvitation(demandeId, action);
            setInvitations((prev) => prev.filter((i) => i.id !== demandeId));
        } catch (err) {
            alert(err.response?.data?.detail || "Impossible de répondre à l'invitation.");
        }
    };

    const handleMarquerLue = async (notifId) => {
        try {
            await marquerCommeLue(notifId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notifId ? { ...n, statutLecture: "LUE" } : n))
            );
        } catch (err) {}
    };

    const handleToutMarquerLu = async () => {
        const nonLues = notifications.filter((n) => n.statutLecture === "NON_LUE");
        await Promise.all(nonLues.map((n) => marquerCommeLue(n.id).catch(() => {})));
        setNotifications((prev) => prev.map((n) => ({ ...n, statutLecture: "LUE" })));
    };

    if (loading) {
        return <div className="notif-page"><p>Chargement...</p></div>;
    }

    const notifsNonLuesAction = notifications.filter((n) => n.statutLecture === "NON_LUE" && n.lien);
    const totalActionsRequises = invitations.length + notifsNonLuesAction.length;
    const totalNonLues = notifications.filter((n) => n.statutLecture === "NON_LUE").length + invitations.length;

    let notifsAffichees = notifications;
    if (filtre === "non-lues") {
        notifsAffichees = notifications.filter((n) => n.statutLecture === "NON_LUE");
    }

    const notifsInfo = notifsAffichees.filter((n) => !(n.statutLecture === "NON_LUE" && n.lien));
    const groupes = {};
    notifsInfo.forEach((n) => {
        const g = grouperParJour(n.dateEnvoi);
        if (!groupes[g]) groupes[g] = [];
        groupes[g].push(n);
    });

    const rienDuTout = invitations.length === 0 && notifications.length === 0;
    const rienAvecFiltre = filtre === "non-lues" && totalNonLues === 0;
    const rienEnActions = filtre === "actions" && totalActionsRequises === 0;

    return (
        <div className="notif-page">
            <div className="notif-header">
                <div className="notif-header-title">
                    <h1><Bell size={20} /> Notifications</h1>
                    {totalNonLues > 0 && (
                        <span className="notif-total-badge">{totalNonLues} non lue{totalNonLues > 1 ? "s" : ""}</span>
                    )}
                </div>
                <button className="notif-mark-all" onClick={handleToutMarquerLu}>
                    <Check size={14} /> Tout marquer comme lu
                </button>
            </div>

            <div className="notif-filters">
                <button className={filtre === "toutes" ? "active" : ""} onClick={() => setFiltre("toutes")}>
                    Tout <span className="notif-tab-count">{notifications.length + invitations.length}</span>
                </button>
                <button className={filtre === "non-lues" ? "active" : ""} onClick={() => setFiltre("non-lues")}>
                    Non lues <span className="notif-tab-count notif-tab-count-vert">{totalNonLues}</span>
                </button>
                <button className={filtre === "actions" ? "active" : ""} onClick={() => setFiltre("actions")}>
                    Actions requises <span className="notif-tab-count notif-tab-count-rouge">{totalActionsRequises}</span>
                </button>
            </div>

            {rienDuTout || rienAvecFiltre || rienEnActions ? (
                <div className="notif-empty">
                    <Bell size={36} />
                    <h3>Tout est à jour !</h3>
                    <p>Vous n'avez aucune notification correspondant à ce filtre pour le moment.</p>
                    {filtre !== "toutes" && (
                        <button className="btn-secondary" onClick={() => setFiltre("toutes")}>
                            Afficher toutes les notifications
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {(filtre === "toutes" || filtre === "actions") && totalActionsRequises > 0 && (
                        <div className="notif-section">
                            <h2 className="notif-section-title actions">🔴 Actions requises ({totalActionsRequises})</h2>

                            {invitations.map((inv) => (
                                <div className="notif-card action" key={`inv-${inv.id}`}>
                                    <div className="notif-card-icon bg-bleu"><Mail size={17} /></div>
                                    <div className="notif-card-body">
                                        <strong>Invitation à rejoindre une tontine</strong>
                                        <p>Vous êtes invité(e) à rejoindre « {inv.groupe?.nomGroupe} ».</p>
                                        <div className="notif-card-actions">
                                            <button className="notif-btn-refuse" onClick={() => handleRepondreInvitation(inv.id, "refuser")}>
                                                Refuser
                                            </button>
                                            <button className="notif-btn-accept" onClick={() => handleRepondreInvitation(inv.id, "accepter")}>
                                                Accepter
                                            </button>
                                        </div>
                                        <span className="notif-date">{new Date(inv.dateDemande).toLocaleString("fr-FR")}</span>
                                    </div>
                                </div>
                            ))}

                            {notifsNonLuesAction.map((n) => {
                                const conf = ICONES_TYPE[n.type] || ICONES_TYPE.INFO;
                                const Icon = conf.icon;
                                return (
                                    <div className="notif-card action" key={`notif-${n.id}`}>
                                        <div className={`notif-card-icon bg-${conf.bg}`}><Icon size={17} /></div>
                                        <div className="notif-card-body">
                                            <strong>{n.titre}</strong>
                                            <p>{n.message}</p>
                                            <div className="notif-card-actions">
                                                <button
                                                    className="notif-btn-accept"
                                                    onClick={() => {
                                                        handleMarquerLue(n.id);
                                                        navigate(n.lien);
                                                    }}
                                                >
                                                    Voir
                                                </button>
                                            </div>
                                            <span className="notif-date">{new Date(n.dateEnvoi).toLocaleString("fr-FR")}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filtre !== "actions" && Object.keys(groupes).map((jour) => (
                        <div className="notif-section" key={jour}>
                            <h2 className="notif-section-title">ℹ️ {jour}</h2>
                            {groupes[jour].map((n) => {
                                const conf = ICONES_TYPE[n.type] || ICONES_TYPE.INFO;
                                const Icon = conf.icon;
                                return (
                                    <div
                                        className={`notif-card ${n.statutLecture === "NON_LUE" ? "non-lue" : ""}`}
                                        key={n.id}
                                        onClick={() => handleMarquerLue(n.id)}
                                    >
                                        <div className={`notif-card-icon bg-${conf.bg}`}><Icon size={17} /></div>
                                        <div className="notif-card-body">
                                            <div className="notif-card-title-row">
                                                <strong>{n.titre}</strong>
                                                {n.statutLecture === "NON_LUE" && <span className="notif-dot" />}
                                            </div>
                                            <p>{n.message}</p>
                                            <span className="notif-date">{new Date(n.dateEnvoi).toLocaleString("fr-FR")}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default Notifications;