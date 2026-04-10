import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fabornas-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fabornas Products 🚀</h1>

      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        products.map((item) => (
          <div key={item._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;