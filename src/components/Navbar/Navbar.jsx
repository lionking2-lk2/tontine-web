import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="logo">
        Trois <span>Clés</span>
      </div>
      <nav>
        <a href="#">Accueil</a>
        <a href="#">Fonctionnalités</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </nav>
      <div className="nav-buttons">
        <button className="btn-login" onClick={() => navigate("/connexion")}>
          Se connecter
        </button>
        <button className="btn-register" onClick={() => navigate("/inscription")}>
          Créer un compte
        </button>
      </div>
    </header>
  );
}

export default Navbar;