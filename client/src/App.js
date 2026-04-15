import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Contact from "./Contact";
import Admin from "./Admin";
import Login from "./Login";
import Checkout from "./Checkout";
import AdminOrders from "./AdminOrders";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const updateToken = () => {
      setToken(localStorage.getItem("token"));
    };

    // initial load
    updateToken();

    // listen for login/logout changes
    window.addEventListener("storage", updateToken);

    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    // 🔥 trigger UI update
    window.dispatchEvent(new Event("storage"));

    window.location.href = "/login";
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

          {/* 📦 ORDERS */}
          {token && <Link to="/orders">Orders 📦</Link>}

          {/* 🛒 CART */}
          <Link to="/cart">
            Cart 🛒 ({cart.length})
          </Link>

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

        <Route
          path="/checkout"
          element={<Checkout cart={cart} setCart={setCart} />}
        />

        <Route path="/contact" element={<Contact />} />

        {/* 🔐 ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 🔐 ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

      </Routes>

    </Router>
  );
}

export default App;