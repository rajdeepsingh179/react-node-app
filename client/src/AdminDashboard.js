import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { API_BASE_URL } from "./config";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    fetch(`${API_BASE_URL}/api/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setStats({
          totalRevenue: res.totalRevenue,
          totalOrders: res.totalOrders
        });

        setData(res.revenueData);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Analytics Dashboard 📊</h2>

      {/* 🔥 CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
      </div>

      {/* 🔥 GRAPH */}
      <div className="chart-box">
        <h3>Revenue Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#d4af37" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;