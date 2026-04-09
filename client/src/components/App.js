import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [category, setCategory] = useState("All");

  // 🔥 Products from backend
  const [products, setProducts] = useState([]);

  // 🔥 Form state
  const [form, setForm] = useState({
    name: "",
    category: "Jewelry",
    desc: "",
    img: "",
    price: "",
    stock: ""
  });

  // 🔥 Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  // 🔥 Add product (save to DB)
  const addProduct = async () => {
    if (!form.name || !form.price) return;

    await axios.post("http://localhost:5000/api/products", {
      name: form.name,
      category: form.category,
      description: form.desc,
      imageUrl: form.img,
      price: form.price,
      stock: form.stock
    });

    setForm({
      name: "",
      category: "Jewelry",
      desc: "",
      img: "",
      price: "",
      stock: ""
    });

    fetchProducts(); // refresh list
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Filter
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((item) => item.category === category);

  // 🔥 Cart logic
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, id: product._id, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>

      {/* Navbar */}
      <div className="navbar">
        <h2>FABORNAS</h2>
        <div>
          <span onClick={() => setShowCart(false)}>Home</span>
          <span onClick={() => setShowCart(false)}>Products</span>
          <span onClick={() => setShowCart(true)}>
            Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </span>
        </div>
      </div>

      {showCart ? (
        <div className="cart">
          <h2>Your Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} />
                  <div style={{ flex: 1 }}>
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>

                    <div>
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
              <h3>Total: ₹{total}</h3>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Product Form */}
          <div className="form">
            <h3>Add Product</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="desc" placeholder="Description" value={form.desc} onChange={handleChange} />
            <input name="img" placeholder="Image URL" value={form.img} onChange={handleChange} />
            <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />

            <select name="category" value={form.category} onChange={handleChange}>
              <option>Jewelry</option>
              <option>Decor</option>
              <option>Kids</option>
            </select>

            <button onClick={addProduct}>Add Product</button>
          </div>

          {/* Categories */}
          <div className="categories">
            <button onClick={() => setCategory("All")}>All</button>
            <button onClick={() => setCategory("Jewelry")}>Jewelry</button>
            <button onClick={() => setCategory("Decor")}>Decor</button>
            <button onClick={() => setCategory("Kids")}>Kids</button>
          </div>

          {/* Products */}
          <div className="products">
            {filteredProducts.map((item) => (
              <div className="card" key={item._id}>
                <img src={item.img || "https://via.placeholder.com/200"} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <p><b>₹{item.price}</b></p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default App;