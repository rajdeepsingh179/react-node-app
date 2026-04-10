import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <h1>Welcome to Fabornas</h1>
        <p>
          Discover premium ornaments, handcrafted decor, and stylish collections 
          designed to elevate your lifestyle.
        </p>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link to="/products">
            <button className="shop-btn">Shop Now</button>
          </Link>

          <Link to="/contact">
            <button className="view-btn">Contact Us</button>
          </Link>
        </div>
      </div>

      {/* PRODUCT PREVIEW */}
      <div className="preview">
        <h2>Featured Products</h2>

        <div className="product-grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img 
                src={`http://localhost:5000${p.imageUrl}`} 
                alt={p.name} 
              />
              <h3>{p.name}</h3>
              <p>₹ {p.price}</p>
            </div>
          ))}
        </div>

        <Link to="/products">
          <button className="view-btn">View All Products</button>
        </Link>
      </div>

      {/* ABOUT */}
      <div className="about">
        <h2>Why Fabornas?</h2>
        <p>
          We bring you handpicked products with a focus on quality, style, and affordability.
        </p>
      </div>

    </div>
  );
}

export default Home;