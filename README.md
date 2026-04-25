# Scaler AI Sales Support Agent

This repository contains the complete assignment for the AI Product Builder role at Scaler.

## 1. What I built
A two-part AI sales assistant that supercharges Scaler BDAs via WhatsApp. First, it processes raw CRM notes or audio to generate a scannable pre-call nudge, giving the BDA specific angles and objection handles based on the lead's profile. Second, it ingests the call transcript to generate a highly personalized, visually distinct post-call PDF that answers the lead's specific questions using verified curriculum data, routed through the BDA for approval before delivery. *(Note: Currently uses Gemini 2.5 Flash and Pro, but can be swapped for other models to optimize outcomes. Due to the Twilio free tier, both the nudge and PDF are sent to the BDA's number for this demo, but the PDF can easily be routed to the lead's number in production).*

## 2. One failure I found
Initially, the AI produced generic PDFs that converged to a middle ground, ignoring program nuances. I fixed this by extracting hard facts from the 4 course brochures into a TypeScript catalog and implementing a deterministic routing function, forcing the AI to cite specific modules instead of hallucinating marketing claims.

## 3. Scale plan
If we hit 100,000 leads a month, the primary constraint becomes **Context Windows & Token Limits**. Dumping full 45-minute call transcripts directly into the prompt will quickly hit token limits, exponentially increase API costs, and degrade extraction quality. To scale this, we'd need to implement an intermediate, streaming chunked-summarization step to extract questions robustly before generating the final PDF.

---

## Running Locally

1. Create a \`.env.local\` file using the template:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
2. Fill out the environment variables:
   - \`GEMINI_API_KEY\`
   - \`TWILIO_ACCOUNT_SID\`
   - \`TWILIO_AUTH_TOKEN\`
   - \`TWILIO_WHATSAPP_FROM\`
   - \`BLOB_READ_WRITE_TOKEN\` (if connected via Vercel CLI, this is auto-populated)
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
