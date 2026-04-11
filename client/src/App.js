import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./Home.js";
import Products from "./Products";
import Cart from "./Cart";
import Contact from "./Contact";
import Admin from "./Admin";   // 🔥 ADD THIS

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>

      {/* NAVBAR */}
      <div className="navbar">

        {/* LEFT SIDE */}
        <div className="logo-container">
          <div className="logo-circle">FO</div>

          <h2 className="logo">
            <Link to="/" className="logo-link">
              FABORNAS ✨
            </Link>
          </h2>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Admin</Link> {/* 🔥 ADD THIS */}
          <Link to="/cart">Cart 🛒 ({cart.length})</Link>
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

        <Route path="/admin" element={<Admin />} /> {/* 🔥 ADD THIS */}

      </Routes>

    </Router>
  );
}

export default App;