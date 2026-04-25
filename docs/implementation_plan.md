# AI Builder Take-Home — Sales Support Agent for Scaler

> **Status: ALL DECISIONS LOCKED. Awaiting user go-ahead to begin implementation.**

---

## All Decisions — Final

| Decision | Choice |
|---|---|
| Web framework | Next.js 14+ App Router + TypeScript |
| LLM (fast tasks) | `gemini-2.5-flash` — nudge, extraction, STT, lead profile parsing |
| LLM (quality tasks) | `gemini-2.5-pro` — PDF content generation |
| STT | Gemini 2.5 Flash multimodal (audio file as input, no separate service) |
| PDF generator | `puppeteer-core` + `@sparticuz/chromium` |
| PDF storage | Vercel Blob (free, public URL for Twilio) |
| WhatsApp | Twilio WhatsApp Sandbox |
| Scaler grounding | Static `scaler-context.ts` file |
| Deployment | Vercel |
| Database | **No Supabase** (see reasoning below) |

---

## Supabase — Decision & Reasoning

**Short answer: Not needed for this assignment.**

Here's the honest breakdown:

| What needs storing | Solution chosen | Why not Supabase |
|---|---|---|
| Evaluator phone number | `sessionStorage` (browser) | Ephemeral, only needed for current session |
| Generated nudge | React state | Shown in UI, no need to persist |
| Generated PDF URL | React state + Vercel Blob | PDF hosted on Blob, URL in state |
| Approval status | React state | Session-scoped action |

**Why Supabase would hurt here:**
- Adds schema design + client setup + additional API work (~60–90 min)
- The assignment says *"Cut anything else"* for non-negotiables
- Evaluators test by running one session — they don't need history
- Every minute saved goes toward better prompts and PDF quality (the 30% weight)

**When Supabase makes sense (post-assignment):**
- Multi-BDA usage with login
- Lead history & re-generation
- Approval audit trail
- Analytics on nudge/PDF quality

> [!NOTE]
> You have Supabase available and it's the right call for production. For this 5-hour prototype, it's out of scope. We'll note this in the README under the scale plan — which is exactly what the evaluator wants to see: that you know what breaks at scale.

---

## Updated Architecture

```
[ Onboarding Screen ]
  └─ BDA enters evaluator's WhatsApp number → sessionStorage

[ Dashboard — Step 1: Lead Profile ]
  │
  ├── Option A: Paste raw CRM text (textarea)
  │     └─ POST /api/parse-lead-profile
  │           └─ Gemini 2.5 Flash → structured LeadProfile JSON
  │                 └─ Pre-fills editable form
  │
  ├── Option B: Record voice / upload audio
  │     └─ POST /api/parse-lead-profile (audio)
  │           └─ Gemini 2.5 Flash multimodal → transcript → LeadProfile JSON
  │                 └─ Pre-fills editable form
  │
  └── BDA reviews pre-filled form, corrects any errors → "Confirm & Continue"

[ Dashboard — Step 2: Pre-Sales Nudge ]
  └─ POST /api/generate-nudge
        └─ Gemini 2.5 Flash → NudgeContent JSON
              └─ Display NudgeCard in UI
                    └─ POST /api/send-whatsapp → Twilio → BDA's phone
                          (No approval gate — internal)

[ Dashboard — Step 3: Post-Call PDF ]
  │
  ├── Input Tab A: Paste text transcript
  └── Input Tab B: Upload call audio file
        └─ POST /api/transcribe
              └─ Gemini 2.5 Flash multimodal → transcript text
  │
  ├─ POST /api/extract-questions
  │     └─ Gemini 2.5 Flash → ExtractedQuestion[]
  │
  ├─ POST /api/generate-pdf-content
  │     └─ Gemini 2.5 Pro + SCALER_CONTEXT → PDFContent
  │
  ├─ POST /api/generate-pdf
  │     └─ Puppeteer → PDF buffer → Vercel Blob → public URL
  │
  ├─ [UI] PDF Preview (iframe) + BDA Approval Gate
  │     └─ Approve / Edit / Skip
  │
  └─ On Approve: POST /api/send-whatsapp
        └─ Twilio → lead's phone + PDF attachment URL
```

---

## File Structure

```
sales-support-agent/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx                         # Onboarding: phone number input
│       ├── globals.css
│       ├── dashboard/
│       │   └── page.tsx                     # Main app — all 3 steps
│       └── api/
│           ├── parse-lead-profile/route.ts  # POST: raw text/audio → LeadProfile
│           ├── generate-nudge/route.ts      # POST: profile → nudge + WhatsApp
│           ├── transcribe/route.ts          # POST: call audio → transcript
│           ├── extract-questions/route.ts   # POST: transcript → questions
│           ├── generate-pdf-content/route.ts # POST: profile+questions → PDFContent
│           ├── generate-pdf/route.ts        # POST: PDFContent → Blob URL
│           └── send-whatsapp/route.ts       # POST: send PDF to lead via Twilio
├── components/
│   ├── OnboardingScreen.tsx
│   ├── LeadProfileInput.tsx     # Paste/voice input + parse trigger
│   ├── LeadProfileForm.tsx      # Editable structured form (pre-filled by AI)
│   ├── NudgeCard.tsx
│   ├── TranscriptInput.tsx      # Text or audio upload for call
│   ├── PDFPreview.tsx
│   └── ApprovalGate.tsx
├── lib/
│   ├── gemini.ts                # Gemini client + model instances
│   ├── twilio.ts                # Twilio WhatsApp client
│   ├── pdf-generator.ts         # Puppeteer HTML→PDF
│   ├── pdf-template.ts          # HTML template for PDF
│   ├── prompts.ts               # All LLM prompts
│   └── scaler-context.ts        # Static Scaler curriculum facts
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── next.config.ts
├── .env.local                   # Gitignored
├── .env.example                 # Committed (template)
└── README.md
```

---

## TypeScript Interfaces

```ts
// types/index.ts

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
  headline: string;
  intro: string;
  sections: PDFSection[];
  closingCTA: string;
  programRecommendation: string;
}
```

---

## Phase-by-Phase Task Breakdown

### Phase 1 — Project Setup (~25 min)
- `npx create-next-app@latest ./ --typescript --app --eslint --no-tailwind`
- Install dependencies:
  ```
  @google/generative-ai
  twilio
  puppeteer-core
  @sparticuz/chromium
  @vercel/blob
  ```
- Configure `next.config.ts`:
  ```ts
  const nextConfig = {
    serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  };
  ```
- Create `.env.example`

---

### Phase 2 — Core Libraries (~40 min)

**`lib/gemini.ts`**
- `GoogleGenerativeAI` client with API key
- Export `flashModel` and `proModel`
- `generateStructured<T>(model, prompt, schema): Promise<T>`
- `generateText(model, prompt): Promise<string>`
- `transcribeAudio(audioBase64, mimeType, systemPrompt): Promise<string>`

**`lib/scaler-context.ts`**
- Verified facts from scaler.com (researched during build):
  - Programs: Academy (12mo, ₹3.5L, 0-7 YoE), DS&ML (12+mo), DevOps (9mo)
  - Curriculum modules: DSA, System Design, AI/ML, LLM engineering, RAG, agents
  - Financing: EMI, ISA, loan tie-ups
  - Placement model, alumni salary outcomes (ranges, not fabricated specifics)
  - Instructor credibility (practitioners from FAANG/startups)
  - Cohort structure, peer learning
- Exported as `SCALER_CONTEXT: string`

**`lib/prompts.ts`**
- `buildParseLeadProfilePrompt(rawText: string): string`
- `buildNudgePrompt(profile: LeadProfile): string`
- `buildTranscribeCallPrompt(): string`
- `buildExtractQuestionsPrompt(transcript: string, profile: LeadProfile): string`
- `buildPDFContentPrompt(profile: LeadProfile, questions: ExtractedQuestion[]): string`

**`lib/pdf-generator.ts`**
- `generatePDF(html: string): Promise<Buffer>`
- Env-aware: local → system Chrome path, prod → `@sparticuz/chromium`

**`lib/pdf-template.ts`**
- `buildPDFHTML(content: PDFContent): string`
- Branded Scaler design: header, accent colors, per-section layout, footer

**`lib/twilio.ts`**
- `sendWhatsAppText(to, body): Promise<string>` — returns messageSid
- `sendWhatsAppMedia(to, mediaUrl, body): Promise<string>`

---

### Phase 3 — API Routes (~60 min)

**`POST /api/parse-lead-profile`**
- Accepts: `{ rawText?: string, audioBase64?: string, mimeType?: string }`
- If audio: transcribe via Gemini Flash multimodal first → get raw text
- Then: Gemini Flash structured output → `LeadProfile`
- Returns: `{ profile: LeadProfile }`

**`POST /api/generate-nudge`**
- Accepts: `{ profile: LeadProfile, phone: string }`
- Gemini Flash → `NudgeContent` (structured JSON)
- Format nudge as WhatsApp message
- Twilio send → `phone`
- Returns: `{ nudge: NudgeContent, messageSid: string }`

**`POST /api/transcribe`**
- Accepts: multipart/form-data with audio file
- Gemini Flash multimodal → transcript with speaker labels
- Returns: `{ transcript: string }`

**`POST /api/extract-questions`**
- Accepts: `{ transcript: string, profile: LeadProfile }`
- Gemini Flash structured → `ExtractedQuestion[]`
- Returns: `{ questions: ExtractedQuestion[] }`

**`POST /api/generate-pdf-content`**
- Accepts: `{ profile: LeadProfile, questions: ExtractedQuestion[] }`
- System: `SCALER_CONTEXT` + anti-hallucination instruction
- Gemini Pro structured → `PDFContent`
- Returns: `{ content: PDFContent }`

**`POST /api/generate-pdf`**
- Accepts: `{ content: PDFContent }`
- Build HTML → Puppeteer → PDF buffer → Vercel Blob upload
- Returns: `{ pdfUrl: string }`

**`POST /api/send-whatsapp`**
- Accepts: `{ phone: string, pdfUrl: string, coverMessage: string, leadName: string }`
- Twilio send with media URL
- Returns: `{ messageSid: string }`

---

### Phase 4 — UI (~70 min)

**`app/page.tsx`** — Onboarding
- Branded landing: Scaler-inspired **light theme** (white/light grey background, Scaler orange/blue accents, clean sans-serif typography)
- Single WhatsApp number input with country code
- "Get Started" → save to sessionStorage → redirect `/dashboard`

**`app/dashboard/page.tsx`** — 3-step flow
- Step indicator (1 → 2 → 3) visible at top
- Step 1: Lead Profile Input
- Step 2: Pre-Sales Nudge
- Step 3: Post-Call PDF

**`LeadProfileInput.tsx`** *(new component)*
- Two tabs: "Paste from CRM" | "Record Voice"
- Paste tab: large textarea + "Parse with AI" button
- Voice tab: record button (MediaRecorder API) + "Parse with AI" button
- On parse: loading state → API call → pre-fills `LeadProfileForm`

**`LeadProfileForm.tsx`**
- Editable fields for all `LeadProfile` fields
- Pre-filled by `LeadProfileInput` but fully editable
- "Confirm Profile & Continue" button → Step 2

**`NudgeCard.tsx`**
- Rendered sections: Persona, Motivation, Angles (2–3), Objections + handles, Opening Hook
- "Sent to WhatsApp ✓" confirmation badge

**`TranscriptInput.tsx`** — for post-call step
- Two tabs: "Paste Transcript" | "Upload Audio"
- Audio tab: file input (drag-drop) for call recording

**`PDFPreview.tsx`**
- `<iframe>` embedding the Blob PDF URL

**`ApprovalGate.tsx`**
- Modal: PDF preview + editable covering WhatsApp message
- Three buttons: "Approve & Send" | "Edit Message" | "Skip"

---

### Phase 5 — Deployment (~20 min)
- Push to GitHub (public)
- Vercel → import repo → auto-detect Next.js
- Set env vars in Vercel dashboard
- Enable Vercel Blob from Storage tab
- Smoke test live link end-to-end

---

### Phase 6 — README + Polish (~20 min)
- Write README (3 tight sections: what built / one failure / scale plan)
- Test all 3 personas: nudges visibly different, PDFs visibly different
- Confirm approval gate on every lead-facing send
- Confirm audio path works

---

## Environment Variables

```bash
# .env.example — copy to .env.local and fill in values

GEMINI_API_KEY=                   # Google AI Studio → API Keys
TWILIO_ACCOUNT_SID=               # Twilio Console → Account Info
TWILIO_AUTH_TOKEN=                # Twilio Console → Account Info
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio Sandbox number
BLOB_READ_WRITE_TOKEN=            # Vercel → Storage → Blob → Token (auto-added)
```

---

## Key Implementation Notes

**No mock values anywhere:**
- All API routes make real external calls (Gemini, Twilio, Vercel Blob)
- No hardcoded persona data anywhere in business logic
- Three demo personas are entered manually into the form during Loom demo
- The parse-from-CRM feature works with any pasted text, not just demo personas

**PDF personalisation (30% weight):**
- Sections are fully driven by the lead's specific extracted questions
- Gemini Pro prompt: "Address [name] specifically, not generically. Tone for a [role] at [company]."
- Rohan → technical depth on LLMs, concrete salary ROI math
- Karthik → applied vs academic, peer-level cohort, practitioner instructors
- Meera → emotional framing, placement guarantee language, financing walkthrough

**Anti-hallucination:**
- `SCALER_CONTEXT` injected as system context in every PDF generation call
- Explicit instruction: "Never fabricate specific numbers. Use 'Scaler can confirm specifics' for anything not in context."

---

## Verification Checklist

- [x] Paste-from-CRM → parse → pre-filled form works with arbitrary text
- [x] Voice record → parse → pre-filled form works
- [x] Pre-sales nudge generated and WhatsApp arrives (no approval gate)
- [x] All 3 persona PDFs look and read visibly different
- [x] BDA approval gate shown before every lead-facing send
- [x] Audio call upload → transcript → PDF → WhatsApp works end-to-end
- [x] Evaluator's own input works (not hardcoded)
- [ ] Live Vercel link functional

---

## User Review Required

> [!IMPORTANT]
> Plan is complete and all decisions locked. Please say **"go ahead"** to begin implementation.
