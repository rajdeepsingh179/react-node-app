import React from "react";
import { Link } from "react-router-dom";

function Navbar({ cart }) {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="logo-container">
        <div className="logo-circle">FO</div>

        <h2 className="logo">
          <Link to="/" className="logo-link">
            FABORNAS ✨
          </Link>
        </h2>
      </div>

      {/* RIGHT */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>

        {/* 🔐 ADMIN ONLY */}
        {token && <Link to="/admin">Admin</Link>}

        {/* 🛒 CART */}
        <Link to="/cart">
          Cart 🛒 ({cart?.length || 0})
        </Link>

        {/* 🔐 LOGIN / LOGOUT */}
        {token ? (
          <button onClick={logout}>Logout 🔓</button>
        ) : (
          <Link to="/login">Login 🔐</Link>
        )}
      </div>

    </div>
  );
}

export default Navbar;