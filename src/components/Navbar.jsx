import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/navbar.css"; // Make sure this file includes the styles below

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check localStorage for the initial state of the navbar
  const initialNavbarState = localStorage.getItem("navbarState") === "open" ? true : false;
  const [isOpen, setIsOpen] = useState(initialNavbarState);

  // Store the state of the navbar in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("navbarState", isOpen ? "open" : "closed");
  }, [isOpen]);

  // Automatically close the navbar on route change
  useEffect(() => {
    setIsOpen(false); // Close the navbar whenever the route changes
  }, [location]);

  // Adding the Notifications button to navItems
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies" },
    { label: "TV Shows", path: "/tvshows" },
    { label: "Books", path: "/books" },
    { label: "Watchlist", path: "/watchlist" },
    { label: "Friends", path: "/friends" },
   
  ];

  return (
    <div className={`navbar-container ${isOpen ? "open" : "closed"}`}>
      <nav className="navbar">
        <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
          {"☰"}
        </button>

        {isOpen && (
          <div className="navbar-links">
            {navItems.map(({ label, path }) => (
              <button
                key={path}
                className={`navbar-button ${location.pathname === path ? "active" : ""}`}
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
            
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;