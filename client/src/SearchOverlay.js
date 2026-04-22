import React, { useState } from "react";
import "./SearchOverlay.css";

function SearchOverlay({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState("");

  return (
    <>
      <div className={`search-overlay ${isOpen ? "show" : ""}`}>

        {/* CLOSE */}
        <div className="search-header">
          <span>Search</span>
          <span className="close-btn" onClick={() => setIsOpen(false)}>✕</span>
        </div>

        {/* INPUT */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

      </div>
    </>
  );
}

export default SearchOverlay;