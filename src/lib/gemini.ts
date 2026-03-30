import { GoogleGenerativeAI } from "@google/generative-ai";
import { AudienceMode } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function adaptTextWithGemini(text: string, audience: AudienceMode): Promise<string> {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const prompts: Record<AudienceMode, string> = {
    executive: "Rewrite the following meeting transcript segment for an EXECUTIVE audience. Focus on outcomes, risks, and high-level strategy. Keep it concise.",
    client: "Rewrite the following meeting transcript segment for a CLIENT audience. Use professional, trust-building language. Avoid internal technical jargon that might cause alarm.",
    engineer: "Rewrite the following meeting transcript segment for an ENGINEER audience. Keep the technical details and precision. Be direct.",
    newHire: "Rewrite the following meeting transcript segment for a NEW HIRE. Add necessary context, explain internal shorthand, and make it educational.",
    nonNative: "Rewrite the following meeting transcript segment for a NON-NATIVE English speaker. Use simple, clear language and avoid idioms or complex metaphors."
  };

  const prompt = `${prompts[audience]}\n\nTranscript segment: "${text}"\n\nAdapted version:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini adaptation error:", error);
    return `[Adaptation Failed] ${text}`;
  }
}

export async function generateAllVersionsWithGemini(text: string) {
  const audiences: AudienceMode[] = ["executive", "client", "engineer", "newHire", "nonNative"];
  
  // We can do them in parallel or one prompt for all. One prompt for all is more efficient.
  const multiPrompt = `You are an expert communicator. Rewrite the following meeting transcript segment for five different audiences:
1. Executive (concise, outcome-focused)
2. Client (professional, trust-building, jargon-free)
3. Engineer (technical, precise, direct)
4. New Hire (contextual, educational, explaining jargon)
5. Non-native Speaker (simple, clear, literal)

Transcript segment: "${text}"

Respond ONLY with a JSON object with the following keys: executive, client, engineer, newHire, nonNative. The value for each key should be the rewritten text.`;

  try {
    const result = await model.generateContent(multiPrompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini multi-adaptation error:", error);
    // Fallback to empty or original if parsing fails
    return null;
  }
}
