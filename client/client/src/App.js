import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: ""
  });

  const [imageFile, setImageFile] = useState(null);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  // ✅ ADD PRODUCT (WITH IMAGE)
  const addProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("description", newProduct.description);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setProducts([...products, data]);

      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: ""
      });

      setImageFile(null);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Fabornas Products 🚀</h1>

      {/* 🔹 ADD PRODUCT FORM */}
      <div className="form">
        <input name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} />
        <input name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} />
        <input name="category" placeholder="Category" value={newProduct.category} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleChange} />

        {/* 🔥 FILE INPUT */}
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* 🔹 PRODUCT LIST */}
      <div className="grid">
        {products.map((item) => (
          <div key={item._id} className="card">
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

            <button onClick={() => deleteProduct(item._id)}>
              Delete ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;