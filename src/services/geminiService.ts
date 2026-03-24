import { GoogleGenAI, Type } from "@google/genai";
import { MarketIndex, MarketSentiment } from "../types";

export async function analyzeMarketSentiment(indices: MarketIndex[]): Promise<MarketSentiment> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("TODO")) {
    console.warn("Gemini API Key is missing or placeholder. Skipping sentiment analysis.");
    return {
      overall: 'Neutral',
      summary: 'Market sentiment analysis is currently unavailable (API Key not configured).',
      topPerformers: [],
      riskLevel: 'Moderate'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze the following global market indices and provide a sentiment summary:
    ${indices.map(i => `${i.symbol} (${i.country}): ${i.value} (${i.changePercent}%)`).join('\n')}
    
    Provide an overall sentiment, a brief summary, top performers, and a risk level.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
            summary: { type: Type.STRING },
            topPerformers: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] }
          },
          required: ['overall', 'summary', 'topPerformers', 'riskLevel']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return {
      overall: 'Neutral',
      summary: 'Unable to analyze sentiment at this time due to a service error.',
      topPerformers: [],
      riskLevel: 'Moderate'
    };
  }
}
