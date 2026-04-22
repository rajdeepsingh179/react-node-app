import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <div 
        className={`overlay ${isOpen ? "show" : ""}`} 
        onClick={() => setIsOpen(false)}
      />

      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          <h2 className="brand-text brand-md">FABORNAS</h2>
          <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
        </div>

        {/* 🔥 CONTENT */}
        <div className="sidebar-content">

          <ul className="menu">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>

            <hr />

            <li>Jewelry</li>
            <li>Men</li>
            <li>Women</li>
            <li>Decor</li>
          </ul>

        </div>

        {/* 🔥 FOOTER (UPPER POSITIONED) */}
        <div className="sidebar-footer">
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
        </div>

      </div>
    </>
  );
}

export default Sidebar;