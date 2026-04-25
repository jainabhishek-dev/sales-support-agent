import { NextResponse } from "next/server";
import { proModel, generateStructured } from "@/lib/gemini";
import { buildPDFContentPrompt } from "@/lib/prompts";
import { selectBestProgram, determineLeadTheme } from "@/lib/program-selector";
import { SchemaType } from "@google/generative-ai";
import { PDFContent } from "@/types";

const pdfContentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    leadName: { type: SchemaType.STRING },
    leadTheme: { type: SchemaType.STRING, enum: ["executive", "career-switcher", "fresher"] },
    headline: { type: SchemaType.STRING },
    intro: { type: SchemaType.STRING },
    sections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          answer: { type: SchemaType.STRING },
          evidence: { type: SchemaType.STRING }
        },
        required: ["question", "answer", "evidence"]
      }
    },
    closingCTA: { type: SchemaType.STRING },
    programRecommendation: { type: SchemaType.STRING }
  },
  required: ["leadName", "headline", "intro", "sections", "closingCTA", "programRecommendation"]
};

export async function POST(req: Request) {
  try {
    const { profile, questions } = await req.json();

    if (!profile || !questions) {
      return NextResponse.json({ error: "Missing profile or questions" }, { status: 400 });
    }

    const program = selectBestProgram(profile);
    const theme = determineLeadTheme(profile);
    const prompt = buildPDFContentPrompt(profile, questions, program);

    const content = await generateStructured<PDFContent>(proModel, prompt, pdfContentSchema);
    
    // Ensure the theme from our logic is definitely the one used, even if AI hallucinates it
    content.leadTheme = theme;

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Generate PDF content error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
