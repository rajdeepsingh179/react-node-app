import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchOverlay from "./SearchOverlay";

function Navbar({ cart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="lv-navbar">

        {/* LEFT */}
        <div className="lv-left">
          <button className="menu-btn" onClick={() => setIsOpen(true)}>☰</button>
        </div>

        {/* CENTER */}
        <div className="lv-logo">
          <Link to="/" className="brand-text brand-md">
            FABORNAS
          </Link>
        </div>

        {/* RIGHT */}
        <div className="lv-right">
          <span className="nav-icon" onClick={() => setSearchOpen(true)}>🔍</span>

          <span className="nav-icon" onClick={() => navigate("/cart")}>
            🛒 {cart?.length || 0}
          </span>

          {token ? (
            <span className="nav-icon" onClick={logout}>👤</span>
          ) : (
            <Link to="/login" className="nav-icon">🔐</Link>
          )}
        </div>

      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <SearchOverlay isOpen={searchOpen} setIsOpen={setSearchOpen} />
    </>
  );
}

export default Navbar;