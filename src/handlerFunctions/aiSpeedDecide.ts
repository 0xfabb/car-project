import { GoogleGenerativeAI } from "@google/generative-ai";

const APIKey = process.env.GEMINI_API!;
const ai = new GoogleGenerativeAI(APIKey);

const prompt: string = process.env.PROMPT!;
let speedLimit: number = 0;

export const getGlobalSpeed = async () => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = await response.text();

    const match = text.match(/\d+/);
    if (match) {
      speedLimit = Number(match[0]);
    } else {
      console.log("No numeric speed limit found in the response.");
    }
  } catch (e) {
    console.error("Caught an error:", e);
  }
  return speedLimit;
};

console.log(speedLimit);
