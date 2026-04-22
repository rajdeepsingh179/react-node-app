import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Cart({ cart, setCart }) {

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty = (updated[index].qty || 1) + 1;
    setCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];

    if ((updated[index].qty || 1) > 1) {
      updated[index].qty -= 1;
    } else {
      updated.splice(index, 1);
    }

    setCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * (item.qty || 1),
    0
  );

  return (
    <div className="container">

      {/* 🔥 HEADER */}
      <div className="section-header">
        <p className="section-sub">Your Cart</p>
        <span className="divider"></span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty 😢</p>
          <Link to="/products">
            <button>Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-grid">

            {cart.map((item, i) => (
              <div key={i} className="card cart-card">

                {/* IMAGE */}
                <img
                  src={
                    item.imageUrl
                      ? `http://localhost:5000${item.imageUrl}`
                      : "https://via.placeholder.com/120"
                  }
                  alt={item.name}
                  className="cart-img"
                />

                {/* DETAILS */}
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p className="price">₹{item.price}</p>

                  {/* QTY */}
                  <div className="qty-box">
                    <button onClick={() => decreaseQty(i)}>−</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => increaseQty(i)}>+</button>
                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(i)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* 🔥 SUMMARY */}
          <div className="cart-summary">
            <h2>Total: ₹{total}</h2>

            <Link to="/checkout">
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;