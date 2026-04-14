import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Contact from "./Contact";
import Admin from "./Admin";
import Login from "./Login";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null); // 🔥 state based

  // 🔐 Load token on start
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // 🔥 UI instantly update
  };

  return (
    <Router>

      {/* NAVBAR */}
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

          {/* 🔐 ADMIN */}
          {token && <Link to="/admin">Admin</Link>}

          <Link to="/cart">Cart 🛒 ({cart.length})</Link>

          {/* 🔐 LOGIN / LOGOUT */}
          {token ? (
            <button onClick={logout}>Logout 🔓</button>
          ) : (
            <Link to="/login">Login 🔐</Link>
          )}
        </div>

      </div>

      {/* ROUTES */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={<Products cart={cart} setCart={setCart} />}
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route path="/contact" element={<Contact />} />

        {/* 🔐 ADMIN PROTECTED */}
        <Route
          path="/admin"
          element={token ? <Admin /> : <Login />}
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

      </Routes>

    </Router>
  );
}

export default App;