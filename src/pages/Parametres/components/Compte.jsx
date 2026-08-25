import { useState, useEffect } from "react";
import { getMe, updateMe } from "../../../services/userService";

const Compte = () => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        username: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getMe()
            .then((res) => {
                const u = res.data;
                setForm({
                    first_name: u.first_name || "",
                    last_name: u.last_name || "",
                    phone: u.phone || "",
                    username: u.username || "",
                });
            })
            .catch(() =>
                setMessage({ type: "error", text: "Impossible de charger votre profil." })
            )
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateMe(form);
            setMessage({ type: "success", text: "Profil mis à jour avec succès." });
            localStorage.setItem("username", form.username);
        } catch (err) {
            const data = err.response?.data;
            const msg =
                data?.detail ||
                Object.values(data || {}).flat()[0] ||
                "Erreur lors de la mise à jour.";
            setMessage({ type: "error", text: msg });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <p style={{ color: "var(--slate-400)", padding: "20px" }}>
                Chargement...
            </p>
        );

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                }}
            >
                <div className="form-group">
                    <label>Prénom</label>
                    <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="Votre prénom"
                    />
                </div>
                <div className="form-group">
                    <label>Nom</label>
                    <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Votre nom de famille"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>
                    Nom d'utilisateur{" "}
                    <span style={{ color: "var(--slate-400)", fontWeight: 400 }}>
                        (modifiable 1×/7 jours)
                    </span>
                </label>
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Nom d'utilisateur unique"
                />
            </div>

            <div className="form-group">
                <label>Téléphone</label>
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+228 xx xx xx xx"
                />
            </div>

            {message && (
                <div className={`form-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
                </button>
            </div>
        </form>
    );
};

export default Compte;
