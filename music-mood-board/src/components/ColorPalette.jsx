// src/components/ColorPalette.jsx
import { useState } from "react";

export default function ColorPalette({ colors }) {
  const [copied, setCopied] = useState("");

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <section className="palette-section">
      <h2 className="section-title">Mood Color Palette</h2>
      <p className="section-subtitle">Click any color to copy the hex code</p>
      <div className="palette-grid">
        {colors.map((color) => (
          <button
            key={color}
            className="palette-swatch"
            style={{ backgroundColor: color }}
            onClick={() => copyColor(color)}
            title={`Copy ${color}`}
            aria-label={`Color ${color}`}
          >
            <span className="swatch-label">
              {copied === color ? "✓ Copied!" : color}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
