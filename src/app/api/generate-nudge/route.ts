import { NextResponse } from "next/server";
import { flashModel, generateStructured } from "@/lib/gemini";
import { buildNudgePrompt } from "@/lib/prompts";
import { NudgeContent } from "@/types";
import { SchemaType } from "@google/generative-ai";
import { sendWhatsAppText } from "@/lib/twilio";

import { selectBestProgram } from "@/lib/program-selector";

const nudgeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    suggestedProgram: { type: SchemaType.STRING, description: "The name of the recommended Scaler program" },
    programReasoning: { type: SchemaType.STRING, description: "1 short sentence explaining why this program fits their background" },
    persona: { type: SchemaType.STRING, description: "Likely persona of the lead" },
    likelyMotivation: { type: SchemaType.STRING, description: "Why they might be looking for Scaler" },
    angles: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "2-3 angles that will resonate with them"
    },
    objections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          objection: { type: SchemaType.STRING },
          handle: { type: SchemaType.STRING }
        },
        required: ["objection", "handle"]
      },
      description: "2-3 likely objections with a one-line handle for each"
    },
    openingHook: { type: SchemaType.STRING, description: "A suggested opening hook for the call" },
    disclaimer: { type: SchemaType.STRING, description: "What is inferred vs fact vs missing" }
  },
  required: ["suggestedProgram", "programReasoning", "persona", "likelyMotivation", "angles", "objections", "openingHook", "disclaimer"]
};

export async function POST(req: Request) {
  try {
    const { profile, evaluatorPhone } = await req.json();

    if (!profile || !evaluatorPhone) {
      return NextResponse.json({ error: "Missing profile or evaluator phone number" }, { status: 400 });
    }

    const program = selectBestProgram(profile);
    const prompt = buildNudgePrompt(profile, program);
    const nudge = await generateStructured<NudgeContent>(flashModel, prompt, nudgeSchema);

    // Format for WhatsApp
    const message = `*Pre-Call Prep: ${profile.name}* 🚀\n
*Suggested Program:* ${nudge.suggestedProgram}
_Why: ${nudge.programReasoning}_\n
*Persona:* ${nudge.persona}
*Motivation:* ${nudge.likelyMotivation}\n
*Angles to Hit:*
${nudge.angles.map(a => `✅ ${a}`).join("\n")}

*Expect Objections:*
${nudge.objections.map(o => `⚠️ ${o.objection}\n💡 ${o.handle}`).join("\n\n")}

*Opening Hook:*
"${nudge.openingHook}"

_Notes: ${nudge.disclaimer}_`;

    let messageSent = false;
    let sid = "";

    try {
      sid = await sendWhatsAppText(evaluatorPhone, message);
      messageSent = true;
    } catch (e: any) {
      console.error("Twilio send failed:", e);
      // We don't fail the whole API if Twilio fails, so UI can still show the nudge
    }

    return NextResponse.json({ nudge, messageSent, sid });
  } catch (error: any) {
    console.error("Generate nudge error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
