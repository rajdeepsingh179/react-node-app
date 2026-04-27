import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(resData => {
        const orders = resData.orders || resData;

        // 🔥 group by date
        const map = {};

        orders.forEach(order => {
          const date = new Date(order.createdAt).toLocaleDateString();

          if (!map[date]) map[date] = 0;
          map[date] += order.total;
        });

        const chartData = Object.keys(map).map(date => ({
          date,
          revenue: map[date]
        }));

        setData(chartData);
      });
  }, []);

  return (
    <div className="container">
      <h1>Dashboard 📊</h1>

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
  );
}

export default AdminDashboard;