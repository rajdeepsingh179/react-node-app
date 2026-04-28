import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchOverlay from "./SearchOverlay";

function Navbar({ cart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  // 🔥 listen for token change
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    checkToken();

    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
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

          {/* 🔍 Search */}
          <span
            className="nav-icon"
            title="Search"
            onClick={() => setSearchOpen(true)}
          >
            🔍
          </span>

          {/* 🛒 Cart */}
          <span
            className="nav-icon"
            title="Cart"
            onClick={() => navigate("/cart")}
          >
            🛒 {cart?.length || 0}
          </span>

          {token ? (
            <>
              {/* 📊 Dashboard */}
              <span
                className="nav-icon"
                title="Dashboard"
                onClick={() => navigate("/admin")}
              >
                📊
              </span>

              {/* 📦 Orders */}
              <span
                className="nav-icon"
                title="Orders"
                onClick={() => navigate("/admin/orders")}
              >
                📦
              </span>

              {/* 🚪 Logout */}
              <span
                className="nav-icon"
                title="Logout"
                onClick={logout}
              >
                🚪
              </span>
            </>
          ) : (
            <Link to="/login" className="nav-icon" title="Login">
              🔐
            </Link>
          )}

        </div>
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <SearchOverlay isOpen={searchOpen} setIsOpen={setSearchOpen} />
    </>
  );
}

export default Navbar;