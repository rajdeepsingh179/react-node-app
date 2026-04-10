import React, { useEffect, useState } from "react";

function Products({ cart, setCart }) {
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

  // ✅ ADD PRODUCT
  const addProduct = async () => {
    try {
      const formData = new FormData();

      Object.keys(newProduct).forEach((key) => {
        formData.append(key, newProduct[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setProducts([...products, data]);

      // reset form
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

  // ✅ ADD TO CART
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="container">

      <h1>Products 🛍️</h1>

      {/* 🔹 ADD PRODUCT FORM */}
      <div className="form">
        <input
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
        />

        <input
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button onClick={addProduct}>
          Add Product
        </button>
      </div>

      {/* 🔹 PRODUCT GRID */}
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

            {/* 🛒 CART */}
            <button onClick={() => addToCart(item)}>
              Add to Cart 🛒
            </button>

            {/* ❌ DELETE */}
            <button onClick={() => deleteProduct(item._id)}>
              Delete ❌
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Products;