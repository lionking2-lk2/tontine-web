import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../../services/userService";

const Securite = () => {
    const [form, setForm] = useState({
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirm: "",
    });
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (form.nouveauMotDePasse !== form.confirm) {
            setMessage({
                type: "error",
                text: "Les mots de passe ne correspondent pas.",
            });
            return;
        }
        if (form.nouveauMotDePasse.length < 8) {
            setMessage({
                type: "error",
                text: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
            });
            return;
        }

        setLoading(true);
        try {
            await changePassword({
                ancienMotDePasse: form.ancienMotDePasse,
                nouveauMotDePasse: form.nouveauMotDePasse,
            });
            setMessage({
                type: "success",
                text: "✅ Mot de passe modifié avec succès.",
            });
            setForm({ ancienMotDePasse: "", nouveauMotDePasse: "", confirm: "" });
        } catch (err) {
            const data = err.response?.data;
            const msg =
                data?.detail ||
                Object.values(data || {}).flat()[0] ||
                "Erreur lors du changement de mot de passe.";
            setMessage({ type: "error", text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                maxWidth: "440px",
            }}
        >
            <div className="form-group">
                <label>Mot de passe actuel</label>
                <div className="input-with-icon">
                    <input
                        name="ancienMotDePasse"
                        type={showOld ? "text" : "password"}
                        value={form.ancienMotDePasse}
                        onChange={handleChange}
                        placeholder="Votre mot de passe actuel"
                        required
                    />
                    <button
                        type="button"
                        className="input-icon-button"
                        onClick={() => setShowOld(!showOld)}
                        tabIndex={-1}
                    >
                        {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label>Nouveau mot de passe</label>
                <div className="input-with-icon">
                    <input
                        name="nouveauMotDePasse"
                        type={showNew ? "text" : "password"}
                        value={form.nouveauMotDePasse}
                        onChange={handleChange}
                        placeholder="Au moins 8 caractères"
                        required
                    />
                    <button
                        type="button"
                        className="input-icon-button"
                        onClick={() => setShowNew(!showNew)}
                        tabIndex={-1}
                    >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Répéter le nouveau mot de passe"
                    required
                />
            </div>

            {message && (
                <div className={`form-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? "Changement en cours..." : "Changer le mot de passe"}
                </button>
            </div>
        </form>
    );
};

export default Securite;
