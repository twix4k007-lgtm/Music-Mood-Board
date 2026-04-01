// src/components/WallpaperGrid.jsx
// Fetches aesthetic wallpapers from Unsplash based on mood tags
import { useEffect, useState } from "react";
import { getWallpaperQuery } from "../utils/moodUtils";

// Unsplash doesn't need an API key for demo/source URLs
// We use their source URL (free, no key needed)
function getUnsplashUrl(query, index) {
  const seed = encodeURIComponent(query + index);
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${index}`;
}

export default function WallpaperGrid({ moodTags }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = getWallpaperQuery(moodTags);
    // Generate 6 wallpaper URLs — Unsplash source returns different images per sig
    const urls = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      url: getUnsplashUrl(query, i + Math.floor(Math.random() * 100)),
      query,
    }));
    setWallpapers(urls);
    setLoading(false);
  }, [moodTags]);

  const handleWallpaperClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="wallpaper-section">
      <h2 className="section-title">Aesthetic Wallpapers</h2>
      <p className="section-subtitle">
        Curated for your vibe · Click to open full size
      </p>

      {loading ? (
        <div className="wallpaper-loading">Loading wallpapers...</div>
      ) : (
        <div className="wallpaper-grid">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              className="wallpaper-card"
              onClick={() => handleWallpaperClick(w.url)}
              aria-label="Open wallpaper in new tab"
            >
              <img
                src={w.url}
                alt={`${w.query} wallpaper`}
                className="wallpaper-img"
                loading="lazy"
              />
              <div className="wallpaper-overlay">
                <span>🔗 Open Full Size</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
