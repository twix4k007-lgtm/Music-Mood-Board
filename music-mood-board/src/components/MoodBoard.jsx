// src/components/MoodBoard.jsx
import { useState } from "react";

export default function MoodBoard({ track, generatedImage, moodTags }) {
  const [imgLoading, setImgLoading] = useState(true);

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `${track.name}-moodboard.png`;
    a.click();
  };

  return (
    <section className="mood-board-section">
      <h2 className="section-title">Your Mood Board</h2>
      <div className="mood-board-card">
        {/* Track Info */}
        <div className="track-info">
          <img
            src={track.albumArt}
            alt={`${track.album} cover`}
            className="album-art"
          />
          <div className="track-details">
            <h3 className="track-name">{track.name}</h3>
            <p className="track-artist">{track.artist}</p>
            <p className="track-album">
              {track.album} · {track.releaseYear}
            </p>
            <p className="track-duration">⏱ {track.duration}</p>

            {/* Mood Tags */}
            <div className="mood-tags">
              {moodTags.map((tag) => (
                <span key={tag} className="mood-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Spotify Link */}
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-link"
            >
              🎧 Open in Spotify
            </a>

            {/* Preview Audio */}
            {track.previewUrl && (
              <div className="audio-preview">
                <p className="preview-label">30s Preview</p>
                <audio controls src={track.previewUrl} />
              </div>
            )}
          </div>
        </div>

        {/* AI Generated Image */}
        <div className="ai-image-container">
          {!generatedImage ? (
            <div className="ai-image-placeholder">
              <div className="pulse-ring" />
              <p>Generating your artwork...</p>
              <p className="small">This can take ~20 seconds</p>
            </div>
          ) : (
            <>
              {imgLoading && (
                <div className="ai-image-placeholder">
                  <div className="pulse-ring" />
                  <p>Loading image...</p>
                </div>
              )}
              <img
                src={generatedImage}
                alt="AI generated mood artwork"
                className="ai-image"
                style={{ display: imgLoading ? "none" : "block" }}
                onLoad={() => setImgLoading(false)}
              />
              {!imgLoading && (
                <button className="download-btn" onClick={handleDownload}>
                  💾 Download Artwork
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
