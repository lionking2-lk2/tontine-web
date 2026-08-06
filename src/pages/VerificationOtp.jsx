import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { verifyOtp } from "../services/authService";

function VerificationOtp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("otpUsername");
        if (!stored) {
            navigate("/inscription");
        } else {
            setUsername(stored);
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        try {
            const response = await verifyOtp({
                username,
                code,
                typeCode: "INSCRIPTION",
            });

            localStorage.setItem("token", response.data.token);
            sessionStorage.removeItem("otpUsername");

            setMessage("Compte vérifié avec succès !");
            setIsError(false);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

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
                    <MailCheck size={32} color="#ffffff" />
                </div>

                <h1>Vérifiez votre compte</h1>
                <p className="auth-subtitle">
                    Entrez le code reçu pour activer votre compte
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

                        {message && (
                            <div className={isError ? "form-message error" : "form-message success"}>
                                {message}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Vérification..." : "Vérifier mon compte"}
                        </button>
                    </form>
                </div>

                <Link to="/connexion" className="auth-back-link">← Retour à la connexion</Link>
            </div>
        </div>
    );
}

export default VerificationOtp;