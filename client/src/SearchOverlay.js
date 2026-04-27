import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchOverlay.css";

function SearchOverlay({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);

  const navigate = useNavigate();

  // 🔥 load recent
  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecent(saved);
    }
  }, [isOpen]);

  // 🔥 fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 suggestions (API + fallback)
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    fetch(`http://localhost:5000/api/search?q=${debouncedQuery}`)
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(() => {
        // fallback (old logic)
        const filtered = products
          .filter(p =>
            p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 6);

        setSuggestions(filtered);
      });

  }, [debouncedQuery, products]);

  // 🔥 trending
  const trending = products.slice(0, 5);

  // 🔥 save recent
  const saveRecent = (value) => {
    let updated = [value, ...recent.filter(item => item !== value)];
    updated = updated.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecent(updated);
  };

  // 🔥 clear recent
  const clearRecent = () => {
    localStorage.removeItem("recentSearches");
    setRecent([]);
  };

  // 🔥 enter search
  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      saveRecent(query);
      navigate(`/products?search=${query}`);
      closeAll();
    }
  };

  // 🔥 click
  const handleClick = (name) => {
    saveRecent(name);
    navigate(`/products?search=${name}`);
    closeAll();
  };

  // 🔥 close
  const closeAll = () => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  // 🔥 ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeAll();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={`search-overlay ${isOpen ? "show" : ""}`} onClick={closeAll}>
      <div className="search-container" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="search-header">
          <span>Search</span>
          <span className="close-btn" onClick={closeAll}>✕</span>
        </div>

        {/* INPUT */}
        <div className="search-box">
          <span className="icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
          />
        </div>

        {/* 🔁 RECENT + CLEAR */}
        {query.trim() === "" && recent.length > 0 && (
          <div className="suggestions-box">
            <div style={{display:"flex", justifyContent:"space-between", padding:"10px"}}>
              <strong>Recent</strong>
              <button onClick={clearRecent} style={{border:"none", background:"none", cursor:"pointer", color:"red"}}>
                Clear
              </button>
            </div>

            {recent.map((item, index) => (
              <div key={index} className="suggestion-item" onClick={() => handleClick(item)}>
                🔁 {item}
              </div>
            ))}
          </div>
        )}

        {/* 🔥 TRENDING */}
        {query.trim() === "" && trending.length > 0 && (
          <div className="suggestions-box">
            <div style={{ padding: "10px", fontWeight: "bold" }}>
              🔥 Trending
            </div>

            {trending.map((item) => (
              <div key={item._id} className="suggestion-item" onClick={() => handleClick(item.name)}>
                {item.image && (
                  <img src={`http://localhost:5000/${item.image}`} alt={item.name}/>
                )}
                <div>
                  <p>{item.name}</p>
                  <span>₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔍 SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="suggestions-box">
            {suggestions.map((item) => (
              <div key={item._id} className="suggestion-item" onClick={() => handleClick(item.name)}>
                {item.image && (
                  <img src={`http://localhost:5000/${item.image}`} alt={item.name}/>
                )}
                <div>
                  <p>{item.name}</p>
                  <span>₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ❌ NO RESULT */}
        {debouncedQuery && suggestions.length === 0 && (
          <div className="suggestions-box">
            <div className="suggestion-item" style={{ justifyContent: "center" }}>
              ❌ No products found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchOverlay;