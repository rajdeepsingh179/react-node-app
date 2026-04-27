import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    fetchOrders();

    // 🔥 auto refresh every 5 sec
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        let newOrders = [];

        if (Array.isArray(data)) {
          newOrders = data;
        } else if (data.orders) {
          newOrders = data.orders;
        }

        // 🔔 NEW ORDER NOTIFICATION
        if (lastCount !== 0 && newOrders.length > lastCount) {
          alert("New Order Received 🛒");

          const audio = new Audio(
            "https://www.soundjay.com/buttons/sounds/button-3.mp3"
          );
          audio.play();
        }

        setLastCount(newOrders.length);
        setOrders(newOrders);
      })
      .catch(err => console.log("ORDER ERROR:", err));
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  // 📥 EXPORT CSV
  const exportCSV = () => {
    const rows = [["Name", "Address", "Total", "Status"]];

    orders.forEach(o => {
      rows.push([o.customerName, o.address, o.total, o.status]);
    });

    const csv =
      "data:text/csv;charset=utf-8," +
      rows.map(r => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "orders.csv";
    link.click();
  };

  // 🎨 STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0ad4e";
      case "Accepted":
        return "#28a745";
      case "Processing":
        return "#5bc0de";
      case "Shipped":
        return "#0275d8";
      case "Delivered":
        return "#5cb85c";
      case "Cancelled":
        return "#d9534f";
      default:
        return "#999";
    }
  };

  // 🔍 FILTER LOGIC
  const filteredOrders = orders.filter(order => {
    const matchStatus =
      statusFilter === "All" || order.status === statusFilter;

    const matchSearch =
      order.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    let matchDate = true;

    if (dateFilter !== "All") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      if (dateFilter === "Today") {
        matchDate = orderDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "Week") {
        const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
        matchDate = diff <= 7;
      }

      if (dateFilter === "Month") {
        matchDate =
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear();
      }
    }

    return matchStatus && matchSearch && matchDate;
  });

  return (
    <div className="container">
      <h1>Orders 📦</h1>

      {/* 🔥 FILTER BAR */}
      <div className="filter-bar">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
        </select>

        <button onClick={exportCSV}>Export CSV 📥</button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found ❌</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="card">

            <h3>{order.customerName}</h3>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>

            {/* STATUS */}
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  background: getStatusColor(order.status || "Pending"),
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {order.status || "Pending"}
              </span>
            </p>

            {/* DATE */}
            <p style={{ fontSize: "12px", color: "#777" }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* ACTIONS */}
            <div style={{ marginTop: "10px" }}>

              {order.status === "Pending" && (
                <>
                  <button
                    onClick={() => updateStatus(order._id, "Accepted")}
                    style={{ marginRight: "10px", background: "#5cb85c" }}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Cancelled")}
                    style={{ background: "#d9534f" }}
                  >
                    Cancel
                  </button>
                </>
              )}

              {order.status === "Accepted" && (
                <button onClick={() => updateStatus(order._id, "Processing")}>
                  Start Processing
                </button>
              )}

              {order.status === "Processing" && (
                <button onClick={() => updateStatus(order._id, "Shipped")}>
                  Mark Shipped
                </button>
              )}

              {order.status === "Shipped" && (
                <button onClick={() => updateStatus(order._id, "Delivered")}>
                  Delivered
                </button>
              )}

            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;