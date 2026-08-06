import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, User } from "lucide-react";
import { forgotPassword } from "../services/authService";

function MotDePasseOublie() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        try {
            await forgotPassword({ username });

            sessionStorage.setItem("resetUsername", username);

            setMessage("Code envoyé. Redirection...");
            setIsError(false);

            setTimeout(() => {
                navigate("/reinitialiser-mot-de-passe");
            }, 1000);

        } catch (error) {
            const data = error.response?.data;
            let errorMessage = "Une erreur est survenue.";

            if (data) {
                const errors = Object.values(data).flat();
                if (errors.length > 0) {
                    errorMessage = errors.join(" ");
                }
            }

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
                    <KeyRound size={32} color="#ffffff" />
                </div>

                <h1>Mot de passe oublié</h1>
                <p className="auth-subtitle">
                    Entrez votre nom d'utilisateur pour recevoir un code
                </p>

                <div className="auth-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Votre nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                            {loading ? "Envoi en cours..." : "Envoyer le code"}
                        </button>
                    </form>
                </div>

                <Link to="/connexion" className="auth-back-link">← Retour à la connexion</Link>
            </div>
        </div>
    );
}

export default MotDePasseOublie;