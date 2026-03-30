import { NextResponse } from "next/server";
import { generateAllVersionsWithGemini } from "@/lib/gemini";
import { adaptText } from "@/lib/adaptation";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text source" }, { status: 400 });
    }

    const geminiVersions = await generateAllVersionsWithGemini(text);

    if (geminiVersions) {
        return NextResponse.json({ versions: geminiVersions });
    }

    // Fallback to existing logic if Gemini fails
    return NextResponse.json({
        versions: {
            executive: adaptText(text, "executive"),
            client: adaptText(text, "client"),
            engineer: adaptText(text, "engineer"),
            newHire: adaptText(text, "newHire"),
            nonNative: adaptText(text, "nonNative"),
        }
    });
  } catch (error) {
    console.error("Adaptation API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
