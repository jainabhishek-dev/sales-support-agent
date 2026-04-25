import { NextResponse } from "next/server";
import { buildPDFHTML } from "@/lib/pdf-template";
import { generatePDF } from "@/lib/pdf-generator";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing PDF content" }, { status: 400 });
    }

    const html = buildPDFHTML(content);
    const pdfBuffer = await generatePDF(html);

    // Upload to Vercel Blob
    const filename = `scaler-path-${content.leadName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.pdf`;
    
    // We check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN not set. Cannot upload PDF to Vercel Blob.");
    }

    const blob = await put(filename, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return NextResponse.json({ pdfUrl: blob.url });
  } catch (error: any) {
    console.error("Generate PDF error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
