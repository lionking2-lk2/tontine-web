import { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
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

  const closeSidebar = () => setOpen(false);

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {open && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

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
        <button className="logout-btn">
          <FaSignOutAlt />
          Déconnexion
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
