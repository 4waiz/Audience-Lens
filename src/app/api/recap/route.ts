import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(request: Request) {
  try {
    const { text, audience } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), { status: 400 });
    }

    const prompt = `You are a meeting assistant. Based on the following transcript, provide:
1. A summary for the audience: ${audience || "General"}
2. One key decision made (keep it one sentence)
3. One immediate action item (keep it one sentence, assign to someone if possible)
4. A potential risk mentioned (one sentence)

Transcript:
"${text}"

Respond ONLY with a JSON object with keys: summary, decision, action, risk.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, "").trim();
    const recap = JSON.parse(jsonString);

    return new Response(JSON.stringify({ recap }), { status: 200 });
  } catch (error) {
    console.error("Recap API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recap" }), { status: 500 });
  }
}
