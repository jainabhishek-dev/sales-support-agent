export interface LeadProfile {
  name: string;
  role: string;
  company: string;
  yearsOfExperience: number;
  intent: string;
  linkedinNotes: string;
  currentSalaryLPA?: number;
}

export interface ExtractedQuestion {
  question: string;
  context: string;
}

export interface NudgeContent {
  suggestedProgram: string;
  programReasoning: string;
  persona: string;
  likelyMotivation: string;
  angles: string[];
  objections: { objection: string; handle: string }[];
  openingHook: string;
  disclaimer: string;
}

export interface PDFSection {
  question: string;
  answer: string;
  evidence: string;
}

export interface PDFContent {
  leadName: string;
  leadTheme: "executive" | "career-switcher" | "fresher";
  headline: string;
  intro: string;
  sections: PDFSection[];
  closingCTA: string;
  programRecommendation: string;
}
