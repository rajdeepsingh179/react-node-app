import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>

      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">FABORNAS ✨</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart 🛒 ({cart.length})</Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      </Routes>

    </Router>
  );
}

export default App;