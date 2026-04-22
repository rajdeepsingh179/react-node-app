import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Contact from "./Contact";
import Admin from "./Admin";
import Login from "./Login";
import Checkout from "./Checkout";
import AdminOrders from "./AdminOrders";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar"; // ✅ USE THIS (IMPORTANT)

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

      {/* ✅ ONLY THIS NAVBAR */}
      <Navbar cart={cart} />

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

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