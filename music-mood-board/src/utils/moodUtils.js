// src/utils/moodUtils.js
// Translates Spotify audio features into prompts, colors, and mood tags

// Builds a descriptive text prompt for AI image generation
export function buildPrompt(track, features) {
  const { energy, valence, tempo, acousticness, danceability } = features;

  // Mood descriptors based on energy + valence quadrant
  let moodWords = [];

  if (energy > 0.7 && valence > 0.6) moodWords = ["euphoric", "vibrant", "electric", "summer festival"];
  else if (energy > 0.7 && valence < 0.4) moodWords = ["intense", "dramatic", "dark storm", "cinematic chaos"];
  else if (energy < 0.4 && valence > 0.6) moodWords = ["peaceful", "dreamy", "golden hour", "gentle warmth"];
  else if (energy < 0.4 && valence < 0.4) moodWords = ["melancholic", "introspective", "rainy night", "solitude"];
  else moodWords = ["balanced", "emotional", "atmospheric", "urban landscape"];

  // Tempo feel
  const tempoFeel = tempo > 130 ? "fast-paced, energetic" : tempo > 90 ? "mid-tempo, flowing" : "slow, cinematic";

  // Texture
  const texture = acousticness > 0.6 ? "organic, warm, analog film grain" : "digital, neon, modern";

  // Style direction
  const style = danceability > 0.7
    ? "music video aesthetic, colorful, dynamic"
    : "fine art digital painting, moody lighting";

  const artistGenre = track.artist;

  const prompt = `${moodWords.join(", ")} mood, ${tempoFeel}, ${texture}, ${style}, inspired by the music of ${artistGenre}, highly detailed, 8k, award winning digital art, no text, no watermark`;

  console.log("Generated prompt:", prompt); // helpful for debugging
  return prompt;
}

// Returns color hex codes that match the song's mood
export function extractMoodColors(features) {
  const { energy, valence, acousticness } = features;

  if (energy > 0.7 && valence > 0.6) {
    // Euphoric / Happy / Energetic
    return ["#FF6B35", "#F7C59F", "#EFEFD0", "#004E89", "#1A936F"];
  } else if (energy > 0.7 && valence < 0.4) {
    // Angry / Intense / Dark
    return ["#1A1A2E", "#16213E", "#0F3460", "#E94560", "#533483"];
  } else if (energy < 0.4 && valence > 0.6) {
    // Calm / Happy / Peaceful
    return ["#A8DADC", "#457B9D", "#1D3557", "#F1FAEE", "#E63946"];
  } else if (energy < 0.4 && valence < 0.4) {
    // Sad / Melancholic
    return ["#2D3142", "#4F5D75", "#BFC0C0", "#FFFFFF", "#EF8354"];
  } else if (acousticness > 0.6) {
    // Acoustic / Warm
    return ["#774936", "#9B6A37", "#C9A84C", "#EDE0D4", "#F2ECD8"];
  } else {
    // Neutral / Mixed
    return ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"];
  }
}

// Returns mood tag strings used for wallpaper search
export function getMoodTags(features) {
  const { energy, valence, tempo, acousticness, danceability } = features;
  const tags = [];

  if (energy > 0.7) tags.push("energetic");
  else if (energy < 0.4) tags.push("calm");
  else tags.push("moderate");

  if (valence > 0.6) tags.push("happy");
  else if (valence < 0.4) tags.push("melancholic");
  else tags.push("neutral");

  if (tempo > 130) tags.push("upbeat");
  else if (tempo < 80) tags.push("slow");

  if (acousticness > 0.6) tags.push("acoustic");
  if (danceability > 0.7) tags.push("danceable");

  return tags;
}

// Maps mood tags to Unsplash search queries for wallpapers
export function getWallpaperQuery(tags) {
  if (tags.includes("energetic") && tags.includes("happy")) return "vibrant festival lights";
  if (tags.includes("energetic") && tags.includes("melancholic")) return "stormy dark city";
  if (tags.includes("calm") && tags.includes("happy")) return "peaceful golden sunrise nature";
  if (tags.includes("calm") && tags.includes("melancholic")) return "rainy window city night";
  if (tags.includes("acoustic")) return "cozy warm coffee autumn";
  if (tags.includes("danceable")) return "neon dance floor colorful";
  return "abstract music aesthetic";
}
