import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("ORDERS DATA:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      })
      .catch(err => console.log("ORDER ERROR:", err));
  }, []);

  return (
    <div className="container">
      <h1>Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No orders found ❌</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card">
            <h3>{order.customerName}</h3>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <p><b>Status:</b> {order.status || "Pending"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;