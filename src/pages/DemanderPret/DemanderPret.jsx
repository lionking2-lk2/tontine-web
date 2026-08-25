import { useState } from "react";
import { X } from "lucide-react";
import { creerDemandePret } from "../../services/loanService";

export default function DemanderPretForm({ groupeId, onSuccess }) {
    const [ouvert, setOuvert] = useState(false);
    const [montantDemande, setMontantDemande] = useState("");
    const [duree, setDuree] = useState("");
    const [objet, setObjet] = useState("");
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur("");
        setChargement(true);
        try {
            const res = await creerDemandePret({
                groupe: groupeId,
                montantDemande,
                duree,
                objet,
            });
            setOuvert(false);
            setMontantDemande("");
            setDuree("");
            setObjet("");
            onSuccess?.(res.data);
        } catch (err) {
            const data = err.response?.data;
            const premierMessage = data ? Object.values(data).flat()[0] : null;
            setErreur(premierMessage || "Impossible d'enregistrer la demande. Réessayez.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <>
            <button className="btn-primary dt-small-btn" onClick={() => setOuvert(true)}>
                + Demander un prêt
            </button>

            {ouvert && (
                <div className="ct-overlay" onClick={() => setOuvert(false)}>
                    <div className="ct-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ct-modal-head">
                            <div>
                                <span className="ct-eyebrow">Nouvelle demande</span>
                                <h3>Demander un prêt</h3>
                            </div>
                            <button className="ct-close" onClick={() => setOuvert(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="ct-form">
                            <label className="ct-label">
                                Montant souhaité
                                <div className="ct-amount-input">
                                    <input
                                        type="number"
                                        value={montantDemande}
                                        onChange={(e) => setMontantDemande(e.target.value)}
                                        required
                                        min="1"
                                    />
                                    <span>FCFA</span>
                                </div>
                            </label>

                            <label className="ct-label">
                                Durée de remboursement
                                <div className="ct-amount-input">
                                    <input
                                        type="number"
                                        value={duree}
                                        onChange={(e) => setDuree(e.target.value)}
                                        required
                                        min="1"
                                    />
                                    <span>mois</span>
                                </div>
                            </label>

                            <label className="ct-label">
                                Motif du prêt
                                <textarea
                                    className="ct-textarea"
                                    value={objet}
                                    onChange={(e) => setObjet(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Expliquez brièvement la raison de votre demande..."
                                />
                            </label>

                            {erreur && <p className="ct-erreur">{erreur}</p>}

                            <div className="ct-modal-footer">
                                <button type="button" className="ct-btn-ghost" onClick={() => setOuvert(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="ct-btn-primary" disabled={chargement}>
                                    {chargement ? "Envoi..." : "Envoyer la demande"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}