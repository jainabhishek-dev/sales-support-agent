import { LeadProfile, ExtractedQuestion } from "@/types";

import { ScalerProgram } from "./scaler-programs";

export function buildParseLeadProfilePrompt(rawText: string): string {
  return `
You are an expert sales assistant parsing raw CRM data or voice transcripts into a structured lead profile.
Given the following raw text, extract the fields required for the LeadProfile.

RAW TEXT:
"""
${rawText}
"""

Instructions:
- Infer the current salary (in LPA - Lakhs Per Annum) if mentioned, otherwise leave it empty/null.
- Keep the intent and linkedinNotes concise but retain key details.
- If years of experience is not explicitly stated, try to infer it from graduation year or work history (e.g. 2020 grad = ~4-6 YoE in 2024/2026). If unknown, default to 0.
`;
}

export function buildNudgePrompt(profile: LeadProfile, program: ScalerProgram): string {
  return `
    You are a sales assistant helping a Scaler BDA prepare for a call.
    
    LEAD PROFILE:
    ${JSON.stringify(profile, null, 2)}

    RECOMMENDED PROGRAM FOR THIS LEAD:
    Name: ${program.name}
    Tagline: ${program.tagline}
    Target Audience: ${program.targetAudience}
    Key Modules: ${program.keyModules.join(", ")}
    Outcomes: ${program.outcomes.join(", ")}
    Differentiators: ${program.differentiators.join(", ")}
    
    TASK:
    Generate a short, scannable WhatsApp nudge. 
    STRICT LIMIT: Total response must be under 1000 characters.
    
    FORMAT (JSON):
    {
      "persona": "Short 1-sentence persona",
      "likelyMotivation": "1-sentence motivation tied to their profile",
      "angles": ["Angle 1 (using specific program differentiator)", "Angle 2 (using specific outcome or module)"],
      "objections": [{"objection": "...", "handle": "..."}],
      "openingHook": "Direct, non-generic opening line",
      "disclaimer": "Fact vs Inference"
    }
    
    Tone: Teammate-like, scannable, direct. No corporate fluff.
    CRITICAL: The angles MUST specifically reference the Recommended Program details provided above. Do not use generic Scaler angles.
  `;
}

export function buildTranscribeCallPrompt(): string {
  return `
You are a transcription assistant. Transcribe the following audio call recording.
The call is between a Scaler BDA (Business Development Associate) and a Lead.
Label the speakers as 'BDA:' and '[Lead Name]:' (or 'Lead:' if name is unknown).
Capture the exact questions and context the lead shares.
`;
}

export function buildExtractQuestionsPrompt(transcript: string, profile: LeadProfile): string {
  return `
You are a sales operations analyst analyzing a call transcript between a Scaler BDA and a lead named ${profile.name}.
Extract the lead's open questions, doubts, or objections from the transcript.

TRANSCRIPT:
"""
${transcript}
"""

Instructions:
- Extract ONLY the questions or doubts raised by the lead.
- For each question, provide the "context" - the sentences around it so we understand why they are asking.
- Keep it structured and specific.
`;
}

export function buildPDFContentPrompt(profile: LeadProfile, questions: ExtractedQuestion[], program: ScalerProgram): string {
  return `
You are an expert sales copywriter at Scaler.
Write the content for a highly personalized, premium 2-3 page post-call PDF for a lead named ${profile.name}.
The goal is to build deep trust so they take the entrance test.

LEAD PROFILE:
Role: ${profile.role}
Company: ${profile.company}
Experience: ${profile.yearsOfExperience} years
Intent: ${profile.intent}

RECOMMENDED PROGRAM:
Name: ${program.name}
Duration: ${program.duration}
Tagline: ${program.tagline}
Key Modules:
${program.keyModules.map(m => `- ${m}`).join("\n")}
Outcomes:
${program.outcomes.map(o => `- ${o}`).join("\n")}
Certifications:
${program.certifications.map(c => `- ${c}`).join("\n")}
Differentiators:
${program.differentiators.map(d => `- ${d}`).join("\n")}

QUESTIONS RAISED ON CALL:
${questions.map((q, i) => `${i + 1}. ${q.question}\n   Context: ${q.context}`).join("\n\n")}

Instructions:
- Address each of the lead's open questions specifically in the 'sections' array.
- For each answer, provide concrete 'evidence' from the RECOMMENDED PROGRAM context above. 
- Frame Scaler's strengths through the lens of ${profile.name}'s specific goals and background. Do not use generic marketing speak.
- Maintain a tone suitable for a ${profile.role} with ${profile.yearsOfExperience} years of experience.
- DO NOT fabricate specific statistics, modules, or placement guarantees not present in the RECOMMENDED PROGRAM. If you don't have verified data in the context, say "Scaler can share specifics on request".

Structure:
- Headline: A personalized hook.
- Intro: A brief warm intro acknowledging their specific career situation.
- Sections: 1 section per question answered, with 'evidence' from the program context.
- Closing CTA: A nudge to take the entrance test.
- Program Recommendation: Recommend the best Scaler program. If a specific program was discussed in the QUESTIONS RAISED ON CALL, recommend that one. Otherwise, recommend ${program.name} based on their profile.
`;
}
