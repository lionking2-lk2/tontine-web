import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService";

function Connexion() {
    const navigate = useNavigate();

    const [identifiant, setIdentifiant] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        try {
            const response = await login({ identifiant, motDePasse });

            localStorage.setItem("token", response.data.token);

            setMessage("Connexion réussie !");
            setIsError(false);

            setTimeout(() => {
                navigate("/dashboard");
            }, 600);

        } catch (error) {
            const data = error.response?.data;
            const errorMessage = data?.detail
                ? (Array.isArray(data.detail) ? data.detail[0] : data.detail)
                : "Identifiant ou mot de passe incorrect.";

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
                    <LogIn size={32} color="#ffffff" />
                </div>

                <h1>Se connecter</h1>
                <p className="auth-subtitle">Heureux de vous revoir sur PTontine</p>

                <div className="auth-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="identifiant">Identifiant</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="identifiant"
                                    placeholder="Nom d'utilisateur"
                                    value={identifiant}
                                    onChange={(e) => setIdentifiant(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="motDePasse">Mot de passe</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="motDePasse"
                                    placeholder="••••••••"
                                    value={motDePasse}
                                    onChange={(e) => setMotDePasse(e.target.value)}
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

                        <div className="form-group-link">
                            <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
                        </div>

                        {message && (
                            <div className={isError ? "form-message error" : "form-message success"}>
                                {message}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            <LogIn size={18} />
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
                    </p>
                </div>

                <Link to="/" className="auth-back-link">← Retour à l'accueil</Link>
            </div>
        </div>
    );
}

export default Connexion;