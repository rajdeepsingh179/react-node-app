import React, { useEffect, useState } from "react";
import "./App.css";

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
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

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
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
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (data.success) fetchProducts();
    else alert("Delete failed ❌");
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const filteredProducts = products.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || item.category === category)
    );
  });

  return (
    <div className="container">

      <h1>Fabornas Luxury Store 🛍️</h1>

      <p style={{ color: "gold" }}>
        Token: {getToken() ? "YES ✅" : "NO ❌"}
      </p>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>

      {/* ADMIN FORM */}
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
          <div key={item._id} className="card">

            {/* 🔥 IMAGE FIX (THIS WAS MISSING) */}
            <img
              src={
                item.imageUrl
                  ? `http://localhost:5000${item.imageUrl}`
                  : "https://via.placeholder.com/150"
              }
              alt={item.name}
            />

            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>

            {getToken() && (
              <button onClick={() => deleteProduct(item._id)}>
                Delete ❌
              </button>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Products;