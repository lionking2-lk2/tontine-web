import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { resetPassword } from "../services/authService";

function ReinitialiserMotDePasse() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("resetUsername");
        if (!stored) {
            navigate("/mot-de-passe-oublie");
        } else {
            setUsername(stored);
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsError(false);

        if (nouveauMotDePasse !== confirmation) {
            setMessage("Les mots de passe ne correspondent pas.");
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            await resetPassword({ username, code, nouveauMotDePasse });

            sessionStorage.removeItem("resetUsername");

            setMessage("Mot de passe réinitialisé ! Redirection...");
            setIsError(false);

            setTimeout(() => {
                navigate("/connexion");
            }, 1200);

        } catch (error) {
            const data = error.response?.data;
            const errorMessage = data?.detail
                ? (Array.isArray(data.detail) ? data.detail[0] : data.detail)
                : "Code incorrect ou expiré.";

            setMessage(errorMessage);
            setIsError(true);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-icon-badge">
                    <ShieldCheck size={32} color="#ffffff" />
                </div>

                <h1>Réinitialiser le mot de passe</h1>
                <p className="auth-subtitle">
                    Entrez le code reçu et votre nouveau mot de passe
                </p>

                <div className="auth-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="code">Code de vérification</label>
                            <input
                                type="text"
                                id="code"
                                placeholder="123456"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nouveauMotDePasse">Nouveau mot de passe</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="nouveauMotDePasse"
                                    placeholder="••••••••"
                                    value={nouveauMotDePasse}
                                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="input-icon-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmation">Confirmer le mot de passe</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmation"
                                    placeholder="••••••••"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={isError ? "form-message error" : "form-message success"}>
                                {message}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReinitialiserMotDePasse;