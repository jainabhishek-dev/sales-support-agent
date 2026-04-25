import { NextResponse } from "next/server";
import { flashModel, generateStructured } from "@/lib/gemini";
import { buildExtractQuestionsPrompt } from "@/lib/prompts";
import { SchemaType } from "@google/generative-ai";
import { ExtractedQuestion } from "@/types";

const questionsSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: { type: SchemaType.STRING, description: "The specific question or doubt" },
      context: { type: SchemaType.STRING, description: "Context around the question" }
    },
    required: ["question", "context"]
  }
};

export async function POST(req: Request) {
  try {
    const { transcript, profile } = await req.json();

    if (!transcript || !profile) {
      return NextResponse.json({ error: "Missing transcript or profile" }, { status: 400 });
    }

    const prompt = buildExtractQuestionsPrompt(transcript, profile);
    const questions = await generateStructured<ExtractedQuestion[]>(flashModel, prompt, questionsSchema);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Extract questions error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
