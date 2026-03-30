import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI((process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    console.log(`[API] Gemini Key Check - Length: ${key.length}, Start: ${key.slice(0, 4)}...`);

    const { text, audience, inputLanguage, outputLanguage } = await req.json();

    if (!text || !audience) {
      return NextResponse.json({ error: "Text and audience are required" }, { status: 400 });
    }

    if (!key) {
      console.error("[API] Gemini API key is missing from environment.");
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const audiencePrompts: Record<string, string> = {
      executive: "Focus on the outcome, risk, and next steps. Be concise.",
      client: "Remove internal jargon and focus on value and professional transparency.",
      engineer: "Preserve technical detail, precision, and dependencies. Be specific.",
      newHire: "Explain internal shorthand in plain terms and provide necessary context.",
      nonNative: "Use simple, clear vocabulary and avoid idioms or complex grammar.",
    };

    const prompt = `
      You are an expert communication assistant. Rewrite the following transcript segment for a specific audience.
      
      Target Audience: ${audience} (${audiencePrompts[audience] || "Make the text clear for this person."})
      Input Language: ${inputLanguage || "English"}
      Output Language: ${outputLanguage || "English"}
      
      Original Transcript:
      "${text}"
      
      Requirements:
      1. Rewrite the text to be appropriate for the target audience.
      2. If it's a simple greeting, keep it friendly and short.
      3. If there are technical components, adapt the level of detail as per the audience.
      4. DO NOT add any preamble like 'Here is the rewrite:'. Just provide the transformed text.
      5. The output must be in the target output language.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();

    return NextResponse.json({ rewrite: responseText });
  } catch (error) {
    console.error("Adaptation error:", error);
    return NextResponse.json({ error: "Failed to adapt text" }, { status: 500 });
  }
}
