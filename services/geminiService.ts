
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export const createAiChat = (): Chat => {
    const genAI = getAi();
    return genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and helpful chat assistant.',
        },
    });
}

export const getGeminiResponse = async (chat: Chat, prompt: string): Promise<string> => {
    try {
        const result: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return result.text;
    } catch (error) {
        console.error("Error getting response from Gemini:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};
