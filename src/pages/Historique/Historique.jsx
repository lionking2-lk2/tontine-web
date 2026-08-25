import { useState, useEffect } from "react";
import { History, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { getHistoriqueTransactions } from "../../services/loanService";
import "./Historique.css";

const TYPE_LABELS = {
    Cotisation: { label: "Cotisation", color: "vert", icon: ArrowUpRight },
    Pret: { label: "Prêt reçu", color: "bleu", icon: ArrowDownLeft },
    Remboursement: { label: "Remboursement", color: "ambre", icon: ArrowUpRight },
};

export default function Historique() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtre, setFiltre] = useState("");
    const [erreur, setErreur] = useState("");

    const charger = (type = "") => {
        setLoading(true);
        setErreur("");
        const params = {};
        if (type) params.type = type;
        getHistoriqueTransactions(params)
            .then((res) => setTransactions(res.data.results || res.data))
            .catch(() => setErreur("Impossible de charger l'historique."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        charger(filtre);
    }, [filtre]);

    const total = transactions.reduce((s, t) => s + Number(t.montant || 0), 0);

    return (
        <div className="historique-page">
            <div className="historique-header">
                <div>
                    <h1>
                        <History size={20} /> Historique
                    </h1>
                    <p>
                        {transactions.length} opération
                        {transactions.length > 1 ? "s" : ""} ·{" "}
                        {total.toLocaleString()} FCFA au total
                    </p>
                </div>
                <div className="historique-filtres">
                    {["", "Cotisation", "Pret", "Remboursement"].map((t) => (
                        <button
                            key={t}
                            className={`hist-filtre-btn ${filtre === t ? "active" : ""}`}
                            onClick={() => setFiltre(t)}
                        >
                            {t === "" ? "Tout" : t === "Pret" ? "Prêts" : t + "s"}
                        </button>
                    ))}
                </div>
            </div>

            {erreur && <div className="form-message error">{erreur}</div>}

            {loading ? (
                <div className="historique-loading">
                    <RefreshCw size={20} className="spin" /> Chargement...
                </div>
            ) : transactions.length === 0 ? (
                <div className="historique-empty">
                    <History size={40} />
                    <p>Aucune opération enregistrée pour le moment.</p>
                </div>
            ) : (
                <div className="historique-list">
                    {transactions.map((t) => {
                        const conf = TYPE_LABELS[t.type] || TYPE_LABELS.Cotisation;
                        const Icon = conf.icon;
                        return (
                            <div className="hist-item" key={t.id}>
                                <div className={`hist-icon hist-icon-${conf.color}`}>
                                    <Icon size={16} />
                                </div>
                                <div className="hist-info">
                                    <strong>{conf.label}</strong>
                                    <span>
                                        {t.groupe?.nomGroupe || t.groupe || "—"}
                                    </span>
                                </div>
                                <div className="hist-right">
                                    <strong className={`hist-montant ${conf.color}`}>
                                        {Number(t.montant || 0).toLocaleString()} FCFA
                                    </strong>
                                    <span>
                                        {t.dateTransaction
                                            ? new Date(t.dateTransaction).toLocaleDateString(
                                                  "fr-FR"
                                              )
                                            : "—"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
