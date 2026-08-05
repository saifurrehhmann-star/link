import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { groomName, brideName, tone = 'heartfelt & warm', relation = 'Friends & Family' } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallbackMessages = [
        `May your love story continue to grow richer with each passing year. Wishing ${groomName || 'the groom'} and ${brideName || 'the bride'} endless peace, laughter, and lifelong devotion.`,
        `To ${groomName || 'Hammad'} & ${brideName || 'Sanya'}, may your home always be filled with warm light, happiness, and kindness. Congratulations on beginning this sacred journey together!`,
        `Warmest wishes on your magical celebration! May every sunrise bring you closer and every sunset find your hearts full of joy.`
      ];
      const randomMsg = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      return res.status(200).json({ message: randomMsg, source: 'fallback' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Write a beautiful, poetic, and concise wedding/celebration message (around 25-45 words) for a couple named ${groomName || "Hammad"} and ${brideName || "Sanya"}. 
The tone should be ${tone}. The relationship is from ${relation}. Do not include quotes or surrounding formatting, just the message text suitable for a high-end luxury greeting card.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text?.trim() || `Wishing ${groomName} & ${brideName} a beautiful journey filled with warmth, love, and happiness.`;

    return res.status(200).json({ message: generatedText, source: 'gemini' });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate blessing',
      fallback: 'May your new journey together be blessed with unwritten joys, peaceful days, and everlasting companionship.'
    });
  }
}
