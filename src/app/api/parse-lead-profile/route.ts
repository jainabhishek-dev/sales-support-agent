import { NextResponse } from "next/server";
import { flashModel, generateStructured, transcribeAudio } from "@/lib/gemini";
import { buildParseLeadProfilePrompt } from "@/lib/prompts";
import { LeadProfile } from "@/types";
import { SchemaType } from "@google/generative-ai";

const leadProfileSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING, description: "Full name of the lead" },
    role: { type: SchemaType.STRING, description: "Current job role" },
    company: { type: SchemaType.STRING, description: "Current company" },
    yearsOfExperience: { type: SchemaType.INTEGER, description: "Years of experience" },
    intent: { type: SchemaType.STRING, description: "Why they are looking for Scaler" },
    linkedinNotes: { type: SchemaType.STRING, description: "Any background from linkedin/education" },
    currentSalaryLPA: { type: SchemaType.NUMBER, description: "Current salary in LPA, if known" }
  },
  required: ["name", "role", "company", "yearsOfExperience", "intent", "linkedinNotes"]
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let rawText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const rawTextField = formData.get("rawText") as string;
      const audioFile = formData.get("audio") as File;

      if (rawTextField) {
        rawText = rawTextField;
      } else if (audioFile) {
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        
        rawText = await transcribeAudio(
          base64Audio,
          audioFile.type,
          "Transcribe this voice note from a sales representative describing a lead."
        );
      }
    } else {
      const body = await req.json();
      rawText = body.rawText;
    }

    if (!rawText) {
      return NextResponse.json({ error: "No raw text or audio provided" }, { status: 400 });
    }

    const prompt = buildParseLeadProfilePrompt(rawText);
    const profile = await generateStructured<LeadProfile>(flashModel, prompt, leadProfileSchema);

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Parse lead profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
