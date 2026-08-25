import { useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUser";

import {
  FaHome,
  FaUsers,
  FaWallet,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const { logout } = useUser();

  const closeSidebar = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    closeSidebar();
    navigate("/connexion");
  };

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">
          <img src="/Logo_3Keys.jpeg" alt="Logo Trois Clés" />

          <div className="logo-text">
            <h2>Trois Clés</h2>
            <span>Gestion intelligente</span>
          </div>
        </div>

        <nav onClick={closeSidebar}>
          <NavLink to="/dashboard">
            <FaHome />
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/tontines">
            <FaUsers />
            <span>Mes tontines</span>
          </NavLink>

          <NavLink to="/epargne">
            <FaWallet />
            <span>Épargne</span>
          </NavLink>

          <NavLink to="/notifications">
            <FaBell />
            <span>Notifications</span>
          </NavLink>

          <NavLink to="/profile">
            <FaUser />
            <span>Profil</span>
          </NavLink>

          <NavLink to="/settings">
            <FaCog />
            <span>Paramètres</span>
          </NavLink>
        </nav>

        <button
  className="logout-btn"
  onClick={() => setShowLogoutModal(true)}
>
  <FaSignOutAlt />
  Déconnexion
</button>
      </aside>

      {showLogoutModal && (
  <div
    className="logout-modal-overlay"
    onClick={() => setShowLogoutModal(false)}
  >
    <div
      className="logout-modal"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <h3 id="logout-modal-title">
        Confirmer la déconnexion
      </h3>

      <p>
        Voulez-vous vraiment vous déconnecter ?
      </p>

      <div className="logout-modal-actions">
        <button
          className="logout-cancel-btn"
          onClick={() => setShowLogoutModal(false)}
        >
          Annuler
        </button>

        <button
          className="logout-confirm-btn"
          onClick={handleLogout}
        >
          Oui, me déconnecter
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Sidebar;