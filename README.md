# Scaler AI Sales Support Agent

This repository contains the complete assignment for the AI Product Builder role at Scaler.

## 1. What was built
- **A 3-Step BDA Assistant:** The agent helps BDAs parse raw lead data, prepares them for a call via a WhatsApp nudge, and automatically generates a highly personalized post-call PDF.
- **Smart Input Parsing:** BDAs can paste raw CRM text or use a voice note. A Gemini 2.5 Flash agent structure parses the intent, name, and background into an editable form.
- **Pre-Sales Nudge:** An internal WhatsApp message is sent to the BDA with specific angles, a hook, and likely objections tailored to the lead's profile.
- **Post-Call PDF:** After pasting or uploading the call transcript, the app extracts questions raised by the lead, pulls verified answers from `scaler-context.ts`, and uses Gemini 2.5 Pro to write a highly targeted, premium PDF.
- **Tech Stack:** Next.js 16 (App Router), Tailwind CSS, Puppeteer Core (with Vercel Sparticuz Chromium), Vercel Blob storage, Twilio WhatsApp Sandbox, and Google Gemini API.

## 2. One failure (or near-failure) and how I fixed it
- **Vercel Chromium Size Limitations:** Initially, generating a PDF using standard `puppeteer` on Vercel Edge/Serverless limits causes immediate deployment failures because the standard Chromium bundle exceeds the 50MB function limit.
- **The Fix:** I switched to `puppeteer-core` paired with `@sparticuz/chromium`. This package downloads a highly compressed, serverless-friendly version of Chromium at runtime or uses a pre-compiled package within limits, allowing high-quality HTML-to-PDF rendering (far better than standard HTML-to-PDF APIs like html2pdf.js) without hitting Vercel limits.

## 3. What breaks if we 100x the usage today
- **Rate Limits & API Costs:** The application is highly dependent on synchronous external APIs (Twilio, Gemini, Blob). At 100x scale, Vercel function timeouts or Gemini rate limits (especially Pro models) will cause failures.
- **Lack of Persisted State:** The current app uses React State and Session Storage. A BDA cannot retrieve a past lead's PDF or see history.
- **The Scale Plan:**
  1. Introduce a Database (e.g., Supabase PostgreSQL) to save Leads, Transcripts, and PDF URLs.
  2. Move PDF generation and Twilio sending to an asynchronous background worker queue (e.g., Inngest or Upstash QStash) rather than blocking the HTTP request.
  3. Batch processing of nudges.

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
