import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MoodBoard from "./components/MoodBoard";
import ColorPalette from "./components/ColorPalette";
import WallpaperGrid from "./components/WallpaperGrid";
import { searchTrack, getAudioFeatures } from "./api/spotify";
import { generateMoodImage } from "./api/huggingface";
import { buildPrompt, extractMoodColors, getMoodTags } from "./utils/moodUtils";

export default function App() {
  const [track, setTrack] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [moodColors, setMoodColors] = useState([]);
  const [moodTags, setMoodTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (query) => {
    setLoading(true);
    setError("");
    setTrack(null);
    setGeneratedImage(null);

    try {
      // Step 1: Search track
      setStep("🔍 Finding your track on Spotify...");
      const trackData = await searchTrack(query);
      setTrack(trackData);

      // Step 2: Get audio features
      setStep("🎵 Analyzing the song's energy and mood...");
      const features = await getAudioFeatures(trackData.id);
      setAudioFeatures(features);

      const colors = extractMoodColors(features);
      const tags = getMoodTags(features);
      setMoodColors(colors);
      setMoodTags(tags);

      // Step 3: Build prompt + generate image
      const prompt = buildPrompt(trackData, features);
      setStep("🎨 Generating AI artwork for your vibe...");
      const imageUrl = await generateMoodImage(prompt);
      setGeneratedImage(imageUrl);

      setStep("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-glow" />
        <div className="logo">
          <span className="logo-icon">🎵</span>
          <div>
            <h1>Music Mood Board</h1>
            <p className="tagline">Pick a song. Feel the vibe. See it come to life.</p>
          </div>
        </div>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      <main className="main">
        {/* Loading State */}
        {loading && (
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p className="loading-step">{step}</p>
            <p className="loading-sub">This might take 15–30 seconds for AI generation ✨</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-box">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!track && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🎧</div>
            <h2>Search for any song to begin</h2>
            <p>Try "Blinding Lights", "Bohemian Rhapsody", or "Levitating"</p>
            <div className="example-chips">
              {["Blinding Lights", "lo-fi hip hop", "Bohemian Rhapsody", "Levitating"].map((s) => (
                <button key={s} className="chip" onClick={() => handleSearch(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {track && !loading && (
          <div className="results">
            <MoodBoard track={track} generatedImage={generatedImage} moodTags={moodTags} />
            {moodColors.length > 0 && <ColorPalette colors={moodColors} />}
            {moodTags.length > 0 && <WallpaperGrid moodTags={moodTags} />}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made with ❤️ · Powered by Spotify & Hugging Face · MIT License</p>
      </footer>
    </div>
  );
}
