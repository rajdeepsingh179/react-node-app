import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔐 If no token → redirect
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ IMPORTANT
          },
        });

        // 🔥 handle non-json safely
        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Non-JSON response:", text);
          return;
        }

        // 🔐 Unauthorized check
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        console.log("ORDERS:", data);
        setOrders(data);

      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="container">
      <h1>Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No orders found ❌</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card">
            <h3>{order.customerName || "No Name"}</h3>
            <p><b>Address:</b> {order.address || "N/A"}</p>
            <p><b>Total:</b> ₹{order.total || 0}</p>
            <p><b>Status:</b> {order.status || "Pending"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;