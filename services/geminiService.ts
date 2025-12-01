import { GoogleGenAI } from "@google/genai";
import { CaughtFish } from '../types';

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

export const appraiseFish = async (fish: CaughtFish): Promise<{ value: number; comment: string }> => {
  if (!ai) {
    // Fallback if no API key
    const multiplier = Math.random() > 0.5 ? 1.2 : 0.8;
    return {
      value: Math.floor(fish.basePrice * multiplier),
      comment: "Togore is sleeping, so he just mumbled a number."
    };
  }

  try {
    const prompt = `
      You are Togore, a giant, chaotic, funny monster who loves eating tuna.
      A player has caught a ${fish.name}.
      Description: ${fish.description}.
      Base Price: ${fish.basePrice}.

      Decide how much you want to pay for it based on a whim.
      - If you are hungry (random chance), offer MORE (up to 3x).
      - If you think it looks gross, offer LESS (down to 0.5x).
      - Be funny, brief, and chaotic. Speak in first person as Togore.

      Output JSON only:
      {
        "comment": "Your funny reason here",
        "multiplier": 1.5
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    
    const multiplier = result.multiplier || 1;
    const finalValue = Math.floor(fish.basePrice * multiplier);

    return {
      value: finalValue,
      comment: result.comment || "Togore grunts in approval."
    };

  } catch (error) {
    console.error("Gemini appraisal failed:", error);
    return {
      value: fish.basePrice,
      comment: "Togore is confused by this fish. Base price awarded."
    };
  }
};