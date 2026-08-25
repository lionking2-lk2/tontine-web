import { useState, useEffect } from "react";
import { X, Smartphone, CreditCard, Banknote, Wallet, Check } from "lucide-react";
import { getMoyensPaiement, payerCotisation } from "../services/groupeService";

function iconePourMoyen(moyen) {
    const nom = `${moyen.nom} ${moyen.typeAPI || ""}`.toLowerCase();

    if (
        nom.includes("mobile") ||
        nom.includes("momo") ||
        nom.includes("orange") ||
        nom.includes("moov") ||
        nom.includes("fedapay")
    ) {
        return Smartphone;
    }

    if (nom.includes("carte") || nom.includes("card") || nom.includes("stripe")) {
        return CreditCard;
    }

    if (nom.includes("espece") || nom.includes("cash")) {
        return Banknote;
    }

    return Wallet;
}

function estFedapayMobile(moyen) {
    if (!moyen) return false;

    const texte = `${moyen.nom || ""} ${moyen.typeAPI || ""}`.toLowerCase();

    return (
        texte.includes("fedapay") ||
        texte.includes("mobile money") ||
        texte.includes("mobilemoney")
    );
}

export default function CotisationForm({ membreId, montantDu, onSuccess }) {
    const [ouvert, setOuvert] = useState(false);
    const [moyensPaiement, setMoyensPaiement] = useState([]);
    const [moyenPaiement, setMoyenPaiement] = useState(null);
    const [montant, setMontant] = useState(montantDu || "");
    const [operateur, setOperateur] = useState("");
    const [telephone, setTelephone] = useState("");
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        if (!ouvert) return;

        setErreur("");

        getMoyensPaiement()
            .then((res) => {
                setMoyensPaiement(res.data.results || res.data);
            })
            .catch(() => {
                setErreur("Impossible de charger les moyens de paiement.");
            });
    }, [ouvert]);

    const moyenSelectionne = moyensPaiement.find(
        (m) => m.id === moyenPaiement
    );

    const paiementMobile = estFedapayMobile(moyenSelectionne);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!moyenPaiement) {
            setErreur("Choisissez un moyen de paiement.");
            return;
        }

        if (paiementMobile) {
            if (!operateur) {
                setErreur("Choisissez votre opérateur Mobile Money.");
                return;
            }

            if (!telephone.trim()) {
                setErreur("Saisissez votre numéro Mobile Money.");
                return;
            }
        }

        setErreur("");
        setChargement(true);

        try {
            const aujourdHui = new Date().toISOString().split("T")[0];

            const data = {
                membre: membreId,
                montantDu: montantDu,
                montantVerse: montant,
                moyenPaiement,
                dateEcheance: aujourdHui,
                datePaiement: aujourdHui,
            };

            // Fedapay Mobile Money :
            // le backend attend operateur + telephone
            if (paiementMobile) {
                data.operateur = operateur;
                data.telephone = telephone.trim();
            }

            const res = await payerCotisation(data);

            setOuvert(false);
            setOperateur("");
            setTelephone("");

            onSuccess?.(res.data);
        } catch (err) {
            setErreur(
                err.response?.data?.detail ||
                "Le paiement n'a pas abouti, veuillez réessayer."
            );
        } finally {
            setChargement(false);
        }
    };

    return (
        <>
            <button className="ct-trigger" onClick={() => setOuvert(true)}>
                <span className="ct-trigger-icon">💳</span>

                <span>
                    <strong>Cotiser maintenant</strong>
                    <small>
                        {Number(montantDu).toLocaleString()} FCFA
                    </small>
                </span>
            </button>

            {ouvert && (
                <div
                    className="ct-overlay"
                    onClick={() => setOuvert(false)}
                >
                    <div
                        className="ct-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="ct-modal-head">
                            <div>
                                <span className="ct-eyebrow">
                                    Paiement de cotisation
                                </span>

                                <h3>Cotiser</h3>
                            </div>

                            <button
                                className="ct-close"
                                onClick={() => setOuvert(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="ct-form">
                            <label className="ct-label">
                                Montant à verser

                                <div className="ct-amount-input">
                                    <input
                                        type="number"
                                        value={montant}
                                        onChange={(e) =>
                                            setMontant(e.target.value)
                                        }
                                        required
                                        min="1"
                                    />

                                    <span>FCFA</span>
                                </div>
                            </label>

                            <label className="ct-label">
                                Moyen de paiement
                            </label>

                            <div className="ct-payment-grid">
                                {moyensPaiement.map((m) => {
                                    const Icone = iconePourMoyen(m);
                                    const selectionne =
                                        moyenPaiement === m.id;

                                    return (
                                        <button
                                            type="button"
                                            key={m.id}
                                            className={`ct-payment-option ${
                                                selectionne ? "selected" : ""
                                            }`}
                                            onClick={() => {
                                                setMoyenPaiement(m.id);
                                                setErreur("");
                                                setOperateur("");
                                                setTelephone("");
                                            }}
                                        >
                                            {selectionne && (
                                                <span className="ct-payment-check">
                                                    <Check size={12} />
                                                </span>
                                            )}

                                            <Icone size={22} />

                                            <span>{m.nom}</span>
                                        </button>
                                    );
                                })}

                                {moyensPaiement.length === 0 && !erreur && (
                                    <p className="ct-empty">
                                        Chargement des moyens de paiement...
                                    </p>
                                )}
                            </div>

                            {paiementMobile && (
                                <>
                                    <label className="ct-label">
                                        Opérateur Mobile Money

                                        <select
                                            value={operateur}
                                            onChange={(e) =>
                                                setOperateur(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">
                                                Choisir un opérateur
                                            </option>

                                            <option value="togocel">
                                                T-Money
                                            </option>

                                            <option value="moov_tg">
                                                Moov Money
                                            </option>
                                        </select>
                                    </label>

                                    <label className="ct-label">
                                        Numéro Mobile Money

                                        <input
                                            type="tel"
                                            value={telephone}
                                            onChange={(e) =>
                                                setTelephone(e.target.value)
                                            }
                                            placeholder="Ex : 64000001"
                                            required
                                            maxLength="15"
                                        />

                                        <small>
                                            Pour le test FedaPay Sandbox :
                                            64000001 ou 66000001
                                        </small>
                                    </label>
                                </>
                            )}

                            {erreur && (
                                <p className="ct-erreur">
                                    {erreur}
                                </p>
                            )}

                            <div className="ct-modal-footer">
                                <button
                                    type="button"
                                    className="ct-btn-ghost"
                                    onClick={() => setOuvert(false)}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="ct-btn-primary"
                                    disabled={chargement}
                                >
                                    {chargement
                                        ? "Traitement..."
                                        : "Confirmer le paiement"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
