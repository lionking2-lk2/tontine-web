import { Link } from "react-router-dom";
import { HandCoins, ShieldCheck, Users } from "lucide-react";

function Home() {
    return (
        <div className="home-page">
            <section className="hero">
                <h1>Gérez vos tontines simplement</h1>
                <p>
                    PTontine vous aide à organiser, suivre et sécuriser vos
                    tontines entre membres, en toute confiance.
                </p>

                <div className="hero-buttons">
                    <Link to="/inscription" className="btn-primary">
                        Créer un compte
                    </Link>
                    <Link to="/connexion" className="btn-secondary">
                        Se connecter
                    </Link>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <Users size={28} color="#16a34a" />
                    <h3>Groupes simplifiés</h3>
                    <p>Créez et gérez vos groupes de tontine en quelques clics.</p>
                </div>

                <div className="feature-card">
                    <ShieldCheck size={28} color="#2563eb" />
                    <h3>Sécurité renforcée</h3>
                    <p>Validation à plusieurs niveaux pour chaque décision importante.</p>
                </div>

                <div className="feature-card">
                    <HandCoins size={28} color="#16a34a" />
                    <h3>Suivi transparent</h3>
                    <p>Consultez cotisations, prêts et historique en temps réel.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;