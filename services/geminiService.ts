import { GoogleGenAI, Type } from "@google/genai";
import type { Gift, SearchParams } from '../types';
import { GiftWiseError } from '../types';

// Cache the client instance to avoid re-creating it on every call.
let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * This prevents the app from crashing on startup if environment variables are not properly configured.
 */
function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }

  // Safely access the API key to prevent reference errors in environments where `process` is not defined.
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

  if (!apiKey) {
    // This user-friendly error will be caught by the component and displayed in the UI.
    throw new GiftWiseError("API Key is missing. Please ensure it's configured in your deployment environment variables.");
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
}

const giftSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        productName: {
          type: Type.STRING,
          description: "The specific name of the gift product."
        },
        reason: {
          type: Type.STRING,
          description: "A compelling, short, one-sentence reason why this gift is perfect for the recipient."
        },
        estimatedPrice: {
          type: Type.NUMBER,
          description: "A plausible estimated price in USD for the product."
        },
        rating: {
          type: Type.NUMBER,
          description: "A plausible user rating for the product, from 1 to 5."
        },
        amazonSearchQuery: {
          type: Type.STRING,
          description: "A concise search query string to find this product on Amazon.com."
        },
      },
      required: ["productName", "reason", "estimatedPrice", "rating", "amazonSearchQuery"],
    },
};

export async function findGifts(params: SearchParams): Promise<Gift[]> {
  const { recipient, occasion, budget, interests } = params;

  if (!recipient) {
      throw new GiftWiseError("Please specify who the gift is for.");
  }
  
  const systemInstruction = "You are GiftWise, an expert AI gift finder. Your goal is to provide a list of creative and thoughtful gift ideas based on the user's input.";

  const userPrompt = `I'm looking for a gift for "${recipient}" for a "${occasion}". 
Their interests are: ${interests.length > 0 ? interests.join(', ') : "not specified"}.
The budget is between $${budget[0]} and $${budget[1]}.`;

  try {
    const client = getAiClient(); // Get the lazily-initialized client.
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: giftSchema,
            temperature: 0.8,
            topP: 0.9,
        },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new GiftWiseError("The AI returned an empty response. Please try again.");
    }
    
    try {
        const gifts: Gift[] = JSON.parse(responseText);
        return gifts;
    } catch (parseError) {
        console.error("Error parsing JSON response from Gemini API:", parseError, "Raw response text:", responseText);
        throw new GiftWiseError("The AI provided an invalid response format. Please try again.");
    }

  } catch (error) {
    // If it's a known error (like our API key check), re-throw it to be displayed.
    if (error instanceof GiftWiseError) {
        throw error;
    }
    
    // For other unexpected API errors.
    console.error("Error calling Gemini API:", error);
    throw new GiftWiseError("The AI is a bit stumped right now. Please try refining your search or try again later.");
  }
}
