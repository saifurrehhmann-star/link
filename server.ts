import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for generating AI wedding blessings using Gemini
app.post("/api/generate-blessing", async (req, res) => {
  try {
    const { groomName, brideName, tone = "heartfelt & warm", relation = "Friends & Family" } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Fallback graceful messages if API key not supplied
      const fallbackMessages = [
        `May your love story continue to grow richer with each passing year. Wishing ${groomName || 'the groom'} and ${brideName || 'the bride'} endless peace, laughter, and lifelong devotion.`,
        `To ${groomName || 'Hammad'} & ${brideName || 'Sanya'}, may your home always be filled with warm light, happiness, and kindness. Congratulations on beginning this sacred journey together!`,
        `Warmest wishes on your magical celebration! May every sunrise bring you closer and every sunset find your hearts full of joy.`
      ];
      const randomMsg = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      return res.json({ message: randomMsg, source: "fallback" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Write a beautiful, poetic, and concise wedding/celebration message (around 25-45 words) for a couple named ${groomName || "Hammad"} and ${brideName || "Sanya"}. 
The tone should be ${tone}. The relationship is from ${relation}. Do not include quotes or surrounding formatting, just the message text suitable for a high-end luxury greeting card.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text?.trim() || `Wishing ${groomName} & ${brideName} a beautiful journey filled with warmth, love, and happiness.`;

    return res.json({ message: generatedText, source: "gemini" });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate blessing",
      fallback: "May your new journey together be blessed with unwritten joys, peaceful days, and everlasting companionship."
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:3000`);
  });
}

startServer();
