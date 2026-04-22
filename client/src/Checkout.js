import React, { useState } from "react";
import "./App.css";

function Checkout({ cart, setCart }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.qty || 1),
    0
  );

  const placeOrder = async () => {
    if (!name || !address) {
      alert("Please fill all details ❗");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart,
          total,
          customerName: name,
          address
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Order placed 🎉");
        setCart([]);
        window.location.href = "/";
      } else {
        alert("Order failed ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="container">

      {/* 🔥 HEADER */}
      <div className="section-header">
        <p className="section-sub">Secure Checkout</p>
        <span className="divider"></span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty 😢</p>
        </div>
      ) : (
        <div className="checkout-layout">

          {/* 🔥 LEFT FORM */}
          <div className="checkout-form card">
            <h3>Shipping Details</h3>

            <input
              className="input"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="input"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />

            <button className="checkout-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>

          {/* 🔥 RIGHT SUMMARY */}
          <div className="checkout-summary card">
            <h3>Order Summary</h3>

            {cart.map((item, i) => (
              <div key={i} className="summary-item">
                <span>{item.name}</span>
                <span>
                  ₹{item.price} × {item.qty || 1}
                </span>
              </div>
            ))}

            <hr />

            <h2>Total: ₹{total}</h2>
          </div>

        </div>
      )}

    </div>
  );
}

export default Checkout;