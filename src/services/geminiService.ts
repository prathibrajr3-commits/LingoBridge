import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  pronunciation?: string;
  notes?: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<TranslationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text to ${targetLanguage}. 
    Source language: ${sourceLanguage}. 
    Text to translate: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translatedText: { type: Type.STRING },
          detectedLanguage: { type: Type.STRING },
          pronunciation: { type: Type.STRING, description: "Phonetic pronunciation if applicable" },
          notes: { type: Type.STRING, description: "Grammatical or cultural notes" },
        },
        required: ["translatedText"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { translatedText: response.text || "Translation failed" };
  }
}
