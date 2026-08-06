import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, User, Phone, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { register } from "../services/authService";

function Inscription() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsError(false);

        if (!email && !phone) {
            setMessage("Veuillez renseigner un email ou un numéro de téléphone.");
            setIsError(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            await register({ username, email, phone, password });

            sessionStorage.setItem("otpUsername", username);

            setMessage("Compte créé. Redirection vers la vérification...");
            setIsError(false);

            setTimeout(() => {
                navigate("/verification-otp");
            }, 1000);

        } catch (error) {
            const data = error.response?.data;
            let errorMessage = "Impossible de créer le compte.";

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

                <h1>Créer un compte</h1>
                <p className="auth-subtitle">Rejoignez PTontine gratuitement</p>

                <div className="auth-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Nom complet</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Jean Dupont"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Téléphone</label>
                            <div className="input-with-icon">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="+228 90 00 00 00"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="jean@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <UserPlus size={18} />
                            {loading ? "Création du compte..." : "Créer un compte"}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
                    </p>
                </div>

                <Link to="/" className="auth-back-link">← Retour à l'accueil</Link>
            </div>
        </div>
    );
}

export default Inscription;