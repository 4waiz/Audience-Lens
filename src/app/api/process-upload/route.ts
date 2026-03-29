import { NextResponse } from "next/server";

import { createSessionFromDemo } from "@/services/relay-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No recording file was provided." },
      { status: 400 },
    );
  }

  const session = createSessionFromDemo({
    kind: "upload",
    inputLanguage: "en-US",
    outputLanguage: "en",
    title: file.name.replace(/\.[^.]+$/, ""),
    subtitle: "Imported recording processed with Common Ground demo services",
    sourceFileName: file.name,
    sourceDurationLabel: "08:14",
  });

  return NextResponse.json({ session });
}
