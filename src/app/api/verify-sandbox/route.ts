import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_WHATSAPP_FROM;

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Missing or invalid phone number" }, { status: 400 });
    }

    if (!accountSid || !authToken || !fromPhone) {
      return NextResponse.json({ error: "Twilio credentials missing" }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    const toFormatted = phone.startsWith("whatsapp:") ? phone : `whatsapp:${phone.startsWith('+') ? phone : '+' + phone}`;

    // Send a real welcome message via Twilio.
    const message = await client.messages.create({
      body: "✅ *Scaler AI Sales Agent*\n\nYour WhatsApp is verified and connected. You're all set to begin your session!",
      from: fromPhone,
      to: toFormatted,
    });

    // Twilio sandbox returns 'queued' immediately for numbers that haven't joined yet.
    // It asynchronously fails shortly after. We wait 2 seconds and fetch the status.
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fetchedMessage = await client.messages(message.sid).fetch();

    const twilioCode = fetchedMessage.errorCode;
    const isFailed = fetchedMessage.status === 'failed' || fetchedMessage.status === 'undelivered';
    
    // 63015 / 63016 = sandbox error, 21608 = not a whatsapp number
    const notJoined = twilioCode === 63015 || twilioCode === 63016 || twilioCode === 21608;

    if (isFailed) {
      return NextResponse.json(
        {
          verified: false,
          twilioCode: twilioCode ?? null,
          message: notJoined
            ? "This number has not joined the Twilio sandbox. Please send 'join applied-still' to +1 415 523 8886 on WhatsApp, then retry."
            : `Verification failed: ${fetchedMessage.errorMessage || 'Unknown error'}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error: any) {
    console.error("Sandbox verification failed:", error);
    
    const twilioCode = error?.code;
    const notJoined = twilioCode === 63015 || twilioCode === 63016 || twilioCode === 21608;

    return NextResponse.json(
      {
        verified: false,
        twilioCode: twilioCode ?? null,
        message: notJoined
          ? "This number has not joined the Twilio sandbox. Please send 'join applied-still' to +1 415 523 8886 on WhatsApp, then retry."
          : `Verification failed: ${error.message}`,
      },
      { status: 200 }
    );
  }
}
