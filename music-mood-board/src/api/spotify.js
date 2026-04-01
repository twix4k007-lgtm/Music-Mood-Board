// src/api/spotify.js
// Handles all Spotify API calls

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiry = null;

// Step 1: Get an access token using Client Credentials flow
async function getAccessToken() {
  // Reuse token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Spotify. Check your API keys in .env");
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 5000; // 5s buffer

  return accessToken;
}

// Step 2: Search for a track by name
export async function searchTrack(query) {
  const token = await getAccessToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not search Spotify. Try again in a moment.");
  }

  const data = await response.json();
  const items = data.tracks?.items;

  if (!items || items.length === 0) {
    throw new Error(`No track found for "${query}". Try a different search.`);
  }

  const track = items[0];

  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || "",
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    releaseYear: track.album.release_date?.split("-")[0],
    duration: formatDuration(track.duration_ms),
  };
}

// Step 3: Get audio features (energy, valence, tempo, etc.)
export async function getAudioFeatures(trackId) {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Could not fetch audio features.");
  }

  const data = await response.json();

  return {
    energy: data.energy,         // 0–1, how intense/active
    valence: data.valence,       // 0–1, how happy/positive
    danceability: data.danceability, // 0–1
    tempo: data.tempo,           // BPM
    acousticness: data.acousticness, // 0–1
    instrumentalness: data.instrumentalness, // 0–1
    loudness: data.loudness,     // dB, usually -60 to 0
    speechiness: data.speechiness,
  };
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
