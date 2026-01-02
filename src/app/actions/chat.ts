'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

// Prefer a server-side key `GEMINI_API_KEY`. If missing (dev), allow falling back
// to `NEXT_PUBLIC_GEMINI_API_KEY` so local testing works when only the public
// env var was added. WARNING: using a public key is insecure for production.
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function getGeminiResponse(history: { role: "user" | "model"; parts: string }[], message: string) {
    if (!genAI) {
        return "Error: GEMINI_API_KEY is not set in environment variables.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.parts }]
            })),
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
}
