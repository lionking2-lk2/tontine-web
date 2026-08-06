import "./Footer.css";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-top">

                <div className="footer-brand">
                    <h3>Trois <span>Clés</span></h3>
                    <p>
                        Votre plateforme digitale de microfinance :
                        épargnez, empruntez et suivez vos finances
                        en toute sécurité.
                    </p>
                </div>

                <div className="footer-links">
                    <h4>Navigation</h4>
                    <a href="#">Accueil</a>
                    <a href="#">Fonctionnalités</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                </div>

                <div className="footer-contact">
                    <h4>Contact</h4>
                    <p>contact@troisclefs.com</p>
                    <p>+228 XX XX XX XX</p>
                </div>

            </div>

            <div className="footer-bottom">
                © 2026 Trois Clés • Tous droits réservés
            </div>

        </footer>

    )

}

export default Footer