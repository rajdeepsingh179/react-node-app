import React, { useState } from "react";

function Checkout({ cart, setCart }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
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

        // 🔥 redirect home
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
      <h1>Checkout 🧾</h1>

      <div className="form">
        <input
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />

        <h3>Total: ₹{total}</h3>

        <button onClick={placeOrder}>
          Place Order 🚀
        </button>
      </div>
    </div>
  );
}

export default Checkout;