import { NextResponse } from "next/server";
import { sendWhatsAppText } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Missing or invalid phone number" }, { status: 400 });
    }

    // Attempt to send a real welcome message via Twilio.
    // If the number has NOT joined the sandbox, Twilio throws error code 63016.
    // If the message is accepted, the number IS in the sandbox.
    await sendWhatsAppText(
      phone,
      "✅ *Scaler AI Sales Agent*\n\nYour WhatsApp is verified and connected. You're all set to begin your session!"
    );

    return NextResponse.json({ verified: true });
  } catch (error: any) {
    console.error("Sandbox verification failed:", error);

    // Twilio error 63016 = number has not joined the sandbox
    // Twilio error 21608 = number is not a WhatsApp user
    const twilioCode = error?.code;
    const notJoined = twilioCode === 63016 || twilioCode === 21608;

    return NextResponse.json(
      {
        verified: false,
        twilioCode: twilioCode ?? null,
        message: notJoined
          ? "This number has not joined the Twilio sandbox. Please send 'join applied-still' to +1 415 523 8886 on WhatsApp, then retry."
          : `Verification failed: ${error.message}`,
      },
      { status: 200 } // 200 so the frontend can read the body and decide what to show
    );
  }
}
