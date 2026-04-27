import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // 🔥 ADD
import "./App.css";

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const location = useLocation(); // 🔥 ADD

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: ""
  });

  const [imageFile, setImageFile] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 NAVBAR SEARCH CONNECT
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");

    if (query) {
      setSearch(query);
    }
  }, [location.search]);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = async () => {
    try {
      const token = getToken();
      const formData = new FormData();

      Object.keys(newProduct).forEach((key) => {
        formData.append(key, newProduct[key]);
      });

      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Product Added ✅");
        fetchProducts();
      } else {
        alert("Not authorized ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server Error ❌");
    }
  };

  const deleteProduct = async (id) => {
    const token = getToken();

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    if (data.success) fetchProducts();
  };

  // 🔥 CART LOGIC
  const addToCart = (item) => {
    const exist = cart.find(p => p._id === item._id);

    if (exist) {
      setCart(cart.map(p =>
        p._id === item._id
          ? { ...p, qty: (p.qty || 1) + 1 }
          : p
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // 🔥 FILTER
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || item.category === category)
  );

  return (
    <div className="container">

      <div className="section-header">
        <p className="section-sub">Curated Collections</p>
        <span className="divider"></span>
      </div>

      {/* 🔥 FILTER BAR */}
      <div className="filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>

      {/* ADMIN */}
      {getToken() && (
        <div className="form">
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="price" placeholder="Price" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} />
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

          <button onClick={addProduct}>Add Product</button>
        </div>
      )}

      {/* PRODUCTS */}
      <div className="grid">
        {filteredProducts.map((item) => (
          <div key={item._id} className="card premium-product">

            <span className="product-dot"></span>

            <img
              src={
                item.imageUrl
                  ? `http://localhost:5000${item.imageUrl}`
                  : "https://via.placeholder.com/150"
              }
              alt={item.name}
            />

            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>

            <button
              className="add-btn"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>

            {getToken() && (
              <button
                className="delete-btn"
                onClick={() => deleteProduct(item._id)}
              >
                ❌
              </button>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Products;