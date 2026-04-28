import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    setLoading(true);

    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        let newOrders = [];

        if (Array.isArray(data)) newOrders = data;
        else if (data.orders) newOrders = data.orders;
        else if (data.data) newOrders = data.data;

        const sorted = [...newOrders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

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

  // 🔍 FILTER
  const filtered = orders.filter(o => {
    const matchStatus =
      statusFilter === "All" || o.status === statusFilter;

    const matchSearch =
      o.customerName?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  // 🔥 PAGINATION
  const indexOfLast = currentPage * ordersPerPage;
  const currentOrders = filtered.slice(
    indexOfLast - ordersPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(filtered.length / ordersPerPage);

  return (
    <div className="orders-container">
      <h2>Orders Management 📦</h2>

      {/* 🔥 FILTER */}
      <div className="filter-bar">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* 🔥 TABLE */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>👤 Customer</th>
            <th>💰 Total</th>
            <th>📦 Status</th>
            <th>📅 Date</th>
            <th>⚙ Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : currentOrders.length === 0 ? (
            <tr>
              <td colSpan="5">No Orders ❌</td>
            </tr>
          ) : (
            currentOrders.map(order => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>₹{order.total}</td>

                {/* 🔥 STATUS BADGE */}
                <td>
                  <span className={`status ${order.status || "Pending"}`}>
                    {order.status || "Pending"}
                  </span>
                </td>

                {/* 🔥 DATE FORMAT */}
                <td>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </td>

                <td>
                  {/* 🔥 VIEW BUTTON */}
                  <button
                    style={{ marginRight: "10px" }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>

                  {/* 🔥 STATUS UPDATE */}
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Accepted</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔥 PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {/* 🔥 MODAL */}
      {selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Order Details</h3>

            <p><b>Name:</b> {selectedOrder.customerName}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>
            <p><b>Total:</b> ₹{selectedOrder.total}</p>

            <h4>Items:</h4>

            {selectedOrder.items?.length > 0 ? (
              <ul>
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found</p>
            )}

            <button onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;