import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email & password ❗");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login Success ✅");
        navigate("/admin");
      } else {
        alert(data.message || "Login Failed ❌");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login 🔐</h2>

      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;