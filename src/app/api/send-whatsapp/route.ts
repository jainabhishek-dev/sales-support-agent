import { NextResponse } from "next/server";
import { sendWhatsAppMedia } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { phone, pdfUrl, coverMessage, leadName } = await req.json();

    if (!phone || !pdfUrl || !coverMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sid = await sendWhatsAppMedia(phone, pdfUrl, coverMessage);

    return NextResponse.json({ messageSid: sid });
  } catch (error: any) {
    console.error("Send WhatsApp error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
