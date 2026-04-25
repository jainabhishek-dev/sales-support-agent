import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const flashModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const proModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export async function generateStructured<T>(
  model: any,
  prompt: string | any[],
  schema: any
): Promise<T> {
  const result = await model.generateContent({
    contents: [{ role: "user", parts: Array.isArray(prompt) ? prompt : [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = result.response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw e;
  }
}

export async function generateText(model: any, prompt: string | any[]): Promise<string> {
  const result = await model.generateContent({
    contents: [{ role: "user", parts: Array.isArray(prompt) ? prompt : [{ text: prompt }] }],
  });
  return result.response.text();
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
  systemPrompt: string
): Promise<string> {
  const parts = [
    { text: systemPrompt },
    {
      inlineData: {
        mimeType: mimeType,
        data: audioBase64,
      },
    },
  ];

  return generateText(flashModel, parts);
}
