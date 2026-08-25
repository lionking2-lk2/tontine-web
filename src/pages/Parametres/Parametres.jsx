import { useState } from "react";
import {
  FaUser,
  FaBell,
  FaShieldAlt,
  FaGlobe,
  FaLock,
  FaQuestionCircle,
  FaInfoCircle,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./Parametres.css";

import Compte from "./components/Compte";
import Notifications from "./components/Notifications";
import Securite from "./components/Securite";
import Preferences from "./components/Preferences";
import Confidentialite from "./components/Confidentialite";
import Assistance from "./components/Assistance";
import APropos from "./components/APropos";

const Parametres = () => {
  const [sectionActive, setSectionActive] = useState("compte");
  const [menuOuvert, setMenuOuvert] = useState(false);

  const sections = [
    {
      id: "compte",
      label: "Mon compte",
      description: "Gérez vos informations personnelles",
      icon: <FaUser />,
      color: "blue",
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Gérez vos préférences de notification",
      icon: <FaBell />,
      color: "orange",
    },
    {
      id: "securite",
      label: "Sécurité",
      description: "Protégez votre compte",
      icon: <FaShieldAlt />,
      color: "green",
    },
    {
      id: "preferences",
      label: "Préférences",
      description: "Langue et apparence de l'application",
      icon: <FaGlobe />,
      color: "purple",
    },
    {
      id: "confidentialite",
      label: "Confidentialité",
      description: "Gérez vos données personnelles",
      icon: <FaLock />,
      color: "violet",
    },
    {
      id: "assistance",
      label: "Aide & Assistance",
      description: "Besoin d'aide ou signaler un problème",
      icon: <FaQuestionCircle />,
      color: "cyan",
    },
    {
      id: "apropos",
      label: "À propos",
      description: "Informations sur l'application",
      icon: <FaInfoCircle />,
      color: "teal",
    },
  ];

  const changerSection = (id) => {
    setSectionActive(id);
    setMenuOuvert(false);
  };

  const renderSection = () => {
    switch (sectionActive) {
      case "compte":
        return <Compte />;

      case "notifications":
        return <Notifications />;

      case "securite":
        return <Securite />;

      case "preferences":
        return <Preferences />;

      case "confidentialite":
        return <Confidentialite />;

      case "assistance":
        return <Assistance />;

      case "apropos":
        return <APropos />;

      default:
        return <Compte />;
    }
  };

  const sectionCourante = sections.find(
    (section) => section.id === sectionActive
  );

  return (
    <div className="parametres-page">

      {/* HEADER */}
      <div className="parametres-header">
        <div>
          <h1>Paramètres</h1>
          <p>Gérez votre compte et vos préférences</p>
        </div>

        <button
          className="parametres-mobile-btn"
          onClick={() => setMenuOuvert(!menuOuvert)}
          aria-label="Ouvrir le menu des paramètres"
        >
          {menuOuvert ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="parametres-layout">

        {/* MENU */}
        <aside
          className={`parametres-sidebar ${
            menuOuvert ? "parametres-sidebar-open" : ""
          }`}
        >
          <div className="parametres-sidebar-title">
            <span>Paramètres</span>
          </div>

          <nav>
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`parametres-nav-item ${
                  sectionActive === section.id ? "active" : ""
                }`}
                onClick={() => changerSection(section.id)}
              >
                <span
                  className={`parametres-nav-icon ${section.color}`}
                >
                  {section.icon}
                </span>

                <span className="parametres-nav-text">
                  <strong>{section.label}</strong>
                  <small>{section.description}</small>
                </span>

                <FaChevronRight className="parametres-nav-arrow" />
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENU */}
        <main className="parametres-content">

          <div className="parametres-content-header">

            <div
              className={`parametres-content-icon ${sectionCourante?.color}`}
            >
              {sectionCourante?.icon}
            </div>

            <div>
              <h2>{sectionCourante?.label}</h2>
              <p>{sectionCourante?.description}</p>
            </div>

          </div>

          <div className="parametres-section">
            {renderSection()}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Parametres;