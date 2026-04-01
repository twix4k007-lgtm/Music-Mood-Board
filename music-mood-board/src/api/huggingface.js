// src/api/huggingface.js
// Generates AI artwork using Hugging Face Inference API (Stable Diffusion)

const HF_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

// Using SDXL Turbo — fast, free tier compatible
const MODEL_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function generateMoodImage(prompt) {
  if (!HF_TOKEN) {
    throw new Error("Hugging Face token missing. Add VITE_HF_API_TOKEN to your .env file.");
  }

  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        width: 768,
        height: 768,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }),
  });

  // Model might be loading — retry after delay
  if (response.status === 503) {
    const retryData = await response.json();
    const waitTime = (retryData.estimated_time || 20) * 1000;
    await new Promise((res) => setTimeout(res, Math.min(waitTime, 25000)));
    return generateMoodImage(prompt); // retry once
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error("HF error:", errText);
    throw new Error("AI image generation failed. Check your Hugging Face token or try again.");
  }

  // Response is a binary image blob
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
}
