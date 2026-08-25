import { useState } from "react";
import api from "../../../api/axios";

const CATEGORIES = [
    { value: "TECHNIQUE", label: "Problème technique" },
    { value: "PAIEMENT", label: "Problème de paiement" },
    { value: "COMPTE", label: "Mon compte" },
    { value: "ABONNEMENT", label: "Abonnement / Plan" },
    { value: "GROUPE", label: "Groupe / Tontine" },
    { value: "AUTRE", label: "Autre" },
];

const Assistance = () => {
    const [form, setForm] = useState({
        sujet: "",
        message: "",
        categorie: "TECHNIQUE",
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);
        try {
            await api.post("/users/tickets/", form);
            setFeedback({
                type: "success",
                text: "✅ Votre ticket a été envoyé. Notre équipe vous répondra sous 24h.",
            });
            setForm({ sujet: "", message: "", categorie: "TECHNIQUE" });
        } catch (err) {
            setFeedback({
                type: "error",
                text:
                    err.response?.data?.detail ||
                    "Impossible d'envoyer le ticket. Réessayez.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p
                style={{
                    color: "var(--slate-600)",
                    fontSize: "14px",
                    marginBottom: "20px",
                    lineHeight: "1.6",
                }}
            >
                Vous rencontrez un problème ? Soumettez un ticket et notre équipe
                support vous contactera dans les meilleurs délais.
            </p>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    maxWidth: "520px",
                }}
            >
                <div className="form-group">
                    <label>Catégorie</label>
                    <select
                        name="categorie"
                        value={form.categorie}
                        onChange={handleChange}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Sujet</label>
                    <input
                        name="sujet"
                        value={form.sujet}
                        onChange={handleChange}
                        placeholder="Résumez votre problème en quelques mots"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Décrivez votre problème en détail..."
                        required
                        style={{ resize: "vertical" }}
                    />
                </div>

                {feedback && (
                    <div className={`form-message ${feedback.type}`}>
                        {feedback.text}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Envoi en cours..." : "Envoyer le ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Assistance;
