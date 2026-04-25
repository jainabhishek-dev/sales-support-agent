import { NextResponse } from "next/server";
import { proModel, generateStructured } from "@/lib/gemini";
import { buildPDFContentPrompt } from "@/lib/prompts";
import { SCALER_CONTEXT } from "@/lib/scaler-context";
import { SchemaType } from "@google/generative-ai";
import { PDFContent } from "@/types";

const pdfContentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    leadName: { type: SchemaType.STRING },
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

    const prompt = buildPDFContentPrompt(profile, questions);
    
    // We append the SCALER_CONTEXT to the prompt directly to ground the Pro model
    const groundedPrompt = `
SYSTEM KNOWLEDGE BASE (USE THIS FOR EVIDENCE AND CLAIMS, DO NOT FABRICATE):
${SCALER_CONTEXT}

---
${prompt}
    `;

    const content = await generateStructured<PDFContent>(proModel, groundedPrompt, pdfContentSchema);

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Generate PDF content error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
