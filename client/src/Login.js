import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter email & password");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/login", { email, password });
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate("/admin");
      }
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      console.log("LOGIN ERROR:", err);
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login 🔐</h2>

      <form onSubmit={login}>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;