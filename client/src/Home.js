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

      {/* 🔥 HERO */}
      <div className="hero lv-hero">
        <div className="hero-overlay">

          <h1 className="brand-text brand-lg brand-gold">
            FABORNAS
          </h1>

          <p>
            Discover premium ornaments, handcrafted decor, and timeless luxury collections.
          </p>

          <div className="hero-buttons">
            <Link to="/products">
              <button className="lv-btn">Shop Now</button>
            </Link>

            <Link to="/products">
              <button className="lv-outline">Explore</button>
            </Link>
          </div>

        </div>
      </div>

      {/* 🔥 TRUST BAR */}
      <div className="trust-bar">
        <p>✔ 100% Authentic</p>
        <p>✔ Secure Payments</p>
        <p>✔ Fast Delivery</p>
      </div>

      {/* 🔥 PRODUCT PREVIEW */}
      <div className="preview">

        <div className="section-header">
          <h2 className="brand-text brand-md">FABORNAS</h2>
          <span className="divider"></span>
          <p>Featured Collection</p>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div className="card premium-card" key={p._id}>

              <span className="product-dot"></span>

              <img 
                src={
                  p.imageUrl
                    ? `http://localhost:5000${p.imageUrl}`
                    : "https://via.placeholder.com/200"
                } 
                alt={p.name} 
              />

              <h3>{p.name}</h3>
              <p className="price">₹ {p.price}</p>

              <Link to="/products">
                <button className="quick-btn">View</button>
              </Link>

            </div>
          ))}
        </div>

        <Link to="/products">
          <button className="view-btn">View All Products</button>
        </Link>
      </div>

      {/* 🔥 ABOUT */}
      <div className="about">
        <h2 className="brand-text brand-md">FABORNAS</h2>
        <p>
          We bring you handpicked products with a focus on quality, style, and affordability.
        </p>
      </div>

      {/* 🔥 CTA */}
      <div className="cta">
        <h2 className="brand-text brand-md">FABORNAS</h2>
        <Link to="/products">
          <button className="cta-btn">Explore Now</button>
        </Link>
      </div>

    </div>
  );
}

export default Home;