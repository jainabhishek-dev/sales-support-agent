import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/gemini";
import { buildTranscribeCallPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    
    const systemPrompt = buildTranscribeCallPrompt();
    const transcript = await transcribeAudio(base64Audio, audioFile.type, systemPrompt);

    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error("Transcribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
