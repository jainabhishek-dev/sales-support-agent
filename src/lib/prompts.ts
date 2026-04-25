import { LeadProfile, ExtractedQuestion } from "@/types";

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

export function buildNudgePrompt(profile: LeadProfile): string {
  return `
You are an expert sales coach for Scaler.
Given the following Lead Profile, generate a concise, scannable pre-sales nudge for the BDA (Business Development Associate) who is about to call this lead in 2 minutes.

LEAD PROFILE:
Name: ${profile.name}
Role: ${profile.role}
Company: ${profile.company}
Experience: ${profile.yearsOfExperience} years
Intent: ${profile.intent}
LinkedIn/Notes: ${profile.linkedinNotes}
${profile.currentSalaryLPA ? `Current Salary: ${profile.currentSalaryLPA} LPA` : ""}

Instructions:
- Write like a teammate messaging on WhatsApp. Keep it punchy and scannable.
- Provide a likely persona for this lead and why they might be looking for Scaler.
- Provide 2 or 3 angles that will resonate with them, tied to real facts from their profile.
- Provide 2 or 3 likely objections with a one-line handle for each.
- Provide a suggested opening hook (the first 10 seconds of the call).
- Include a disclaimer section that explicitly states what is FACT, what is INFERRED, and what is MISSING from their profile.
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

export function buildPDFContentPrompt(profile: LeadProfile, questions: ExtractedQuestion[]): string {
  return `
You are an expert sales copywriter at Scaler.
Write the content for a highly personalized, premium 2-3 page post-call PDF for a lead named ${profile.name}.
The goal is to build deep trust so they take the entrance test.

LEAD PROFILE:
Role: ${profile.role}
Company: ${profile.company}
Experience: ${profile.yearsOfExperience} years
Intent: ${profile.intent}

QUESTIONS RAISED ON CALL:
${questions.map((q, i) => `${i + 1}. ${q.question}\n   Context: ${q.context}`).join("\n\n")}

Instructions:
- Address each of the lead's open questions specifically in the 'sections' array.
- For each answer, provide concrete 'evidence' from the SCALER_CONTEXT. 
- Frame Scaler's strengths through the lens of ${profile.name}'s specific goals and background. Do not use generic marketing speak.
- Maintain a tone suitable for a ${profile.role} with ${profile.yearsOfExperience} years of experience.
- DO NOT fabricate specific statistics, salary numbers, or placement guarantees not present in the SCALER_CONTEXT. If you don't have verified data, say "Scaler can share specifics on request".

Structure:
- Headline: A personalized hook.
- Intro: A brief warm intro acknowledging their specific career situation.
- Sections: 1 section per question answered, with 'evidence'.
- Closing CTA: A nudge to take the entrance test.
- Program Recommendation: Briefly name the specific Scaler program they should aim for based on their profile.
`;
}
