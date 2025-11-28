import { GoogleGenAI } from "@google/genai";
import { QuoteResponse, AdviceResponse } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Harvey Specter from the TV show Suits. 
Your personality is:
- Extremely confident, borderline arrogant, but backed by skill.
- You value winning, loyalty, and closing the deal above all else.
- You do not use "fluff" or overly emotional language. You are sharp, direct, and pragmatic.
- You often use metaphors related to poker, boxing, or war.
- You dress well, you speak well, and you don't apologize for being the best.

When generating content, strictly adhere to this persona. Never break character.
`;

export const generateHarveyQuote = async (topic?: string): Promise<QuoteResponse> => {
  if (!apiKey) throw new Error("API Key is missing");

  // We append a random seed to the prompt to bypass any model-side caching and ensure variety
  const seed = Math.floor(Math.random() * 1000000);
  
  const prompt = topic 
    ? `Give me a short, punchy, unique quote about "${topic}" in the style of Harvey Specter. Do not repeat generic phrases. (Random seed: ${seed})`
    : `Give me a random, iconic, and unique advice or quote about winning, life, or business in the style of Harvey Specter. Make it different from the usual ones. (Random seed: ${seed})`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 100,
        temperature: 1, // Increased temperature for more randomness
        topK: 40,
        topP: 0.95,
      }
    });

    const text = response.text || "I don't get lucky, I make my own luck.";
    return { text: text.trim(), topic };
  } catch (error) {
    console.error("Gemini Quote Error:", error);
    throw new Error("Failed to consult Harvey.");
  }
};

export const generateHarveyAdvice = async (situation: string): Promise<AdviceResponse> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    The user is in this situation: "${situation}".
    Provide advice as Harvey Specter.
    
    Structure the response in JSON format with two keys:
    1. "advice": A direct, punchy statement telling them what to do.
    2. "strategy": A brief (1-2 sentences) explanation of the strategic mindset behind it.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as AdviceResponse;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return {
      advice: "Win a no-win situation by rewriting the rules.",
      strategy: "When you're backed against the wall, break the goddamn thing down."
    };
  }
};