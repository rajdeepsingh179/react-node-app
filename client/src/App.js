import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Contact from "./Contact";
import Admin from "./Admin";
import Login from "./Login";
import Checkout from "./Checkout";
import AdminOrders from "./AdminOrders";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const updateToken = () => {
      setToken(localStorage.getItem("token"));
    };

    updateToken();
    window.addEventListener("storage", updateToken);

    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  return (
    <Router>

      <Navbar cart={cart} />

      <Routes>

        <Route path="/" element={<Home />} />

        {/* 🔥 ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔥 ADMIN PRODUCTS PANEL */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 🔥 ADMIN ORDERS PANEL */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

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

        <Route path="/login" element={<Login />} />

      </Routes>

    </Router>
  );
}

export default App;