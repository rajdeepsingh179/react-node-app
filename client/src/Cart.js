import React from "react";

function Cart({ cart, setCart }) {

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <div className="container">
      <h1>Checkout 🛒</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty 😢</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="card">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <button onClick={() => removeFromCart(i)}>
                Remove ❌
              </button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <button className="checkout-btn">
            Proceed to Payment 💳
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;