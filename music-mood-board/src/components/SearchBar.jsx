// src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <span className="search-icon">🎵</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search a song or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          aria-label="Search for a song"
        />
        <button
          type="submit"
          className="search-btn"
          disabled={loading || !query.trim()}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>
    </form>
  );
}
