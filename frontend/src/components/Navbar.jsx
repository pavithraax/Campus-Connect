import React, { useState } from "react";
import { User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Navbar({ user, onLogout, setPage, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const profilePicUrl = user?.profilePicture
    ? `${API_BASE}${user.profilePicture}`
    : null;

  const navLinks = [
    { label: "Home", key: "home" },
    { label: "Events", key: "events" },
    { label: "Explore", key: "explore" },
    { label: "Calendar", key: "calendar" },
    { label: "Profile", key: "profile" },
  ];

  const handleNav = (key) => {
    setPage(key);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 onClick={() => handleNav("home")}>Campus Connect</h2>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        {navLinks.map((link) => (
          <button
            key={link.key}
            onClick={() => handleNav(link.key)}
            className={currentPage === link.key ? "nav-active" : ""}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <span className="user-info" onClick={() => handleNav("profile")}>
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Avatar" className="navbar-avatar" />
          ) : (
            <User size={16} style={{ marginRight: "6px" }} />
          )}
          {user?.name || user?.email}
        </span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
        {/* Mobile hamburger */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown (animated) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNav(link.key)}
                className={currentPage === link.key ? "nav-active" : ""}
              >
                {link.label}
              </button>
            ))}
            <button className="logout-btn-mobile" onClick={() => { onLogout(); setMenuOpen(false); }}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
