import "./Hero.css";
import HeroIllustration from "./HeroIllustration";
import { Link } from "react-router-dom";
function Hero() {

    return (

        <section className="hero">

            <div className="hero-left">

                <h1>

                    Gérez votre argent simplement,
                    rapidement et en toute sécurité.

                </h1>

                <p>

                    Trois Clés est votre plateforme digitale de
                    microfinance permettant d'épargner,
                    demander des prêts et suivre vos finances
                    partout.

                </p>

                <div className="hero-buttons">

                    <Link to="/connexion" className="primary">
                        Se connecter
                    </Link>

                    <Link to="/inscription" className="secondary">
                        Créer un compte
                    </Link>

                </div>

            </div>

            <div className="hero-right">
                <HeroIllustration />
            </div>

        </section>

    )

}

export default Hero