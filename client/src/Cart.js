import React from "react";
import { Link } from "react-router-dom";

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
      <h1>Cart 🛒</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty 😢</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="card cart-card">

              {/* 🔥 IMAGE FIX */}
              <img
                src={
                  item.imageUrl
                    ? `http://localhost:5000${item.imageUrl}`
                    : "https://via.placeholder.com/100"
                }
                alt={item.name}
                className="cart-img"
              />

              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                {/* 🔥 QTY CONTROLS */}
                <div>
                  <button onClick={() => decreaseQty(i)}>➖</button>

                  <span style={{ margin: "0 10px" }}>
                    {item.qty || 1}
                  </span>

                  <button onClick={() => increaseQty(i)}>➕</button>
                </div>

                <button onClick={() => removeFromCart(i)}>
                  Remove ❌
                </button>
              </div>

            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <Link to="/checkout">
            <button className="checkout-btn">
              Proceed to Checkout 🧾
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;