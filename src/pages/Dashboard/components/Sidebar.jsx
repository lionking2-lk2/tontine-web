import { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaWallet,
  FaEnvelope,
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
          <h2>Trois Clés</h2>
        </div>
        <nav onClick={closeSidebar}>
          <NavLink to="/dashboard">
            <FaHome />
            <span>Tableau de bord</span>
          </NavLink>
          <NavLink to="/groups">
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
          <NavLink to="/invitations">
            <FaEnvelope />
            <span>Invitations</span>
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