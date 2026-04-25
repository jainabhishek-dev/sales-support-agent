import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_WHATSAPP_FROM;

let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendWhatsAppText(to: string, body: string): Promise<string> {
  if (!client) {
    throw new Error("Twilio client not initialized. Missing environment variables.");
  }
  
  // Format destination number for whatsapp sandbox
  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`;

  const message = await client.messages.create({
    body,
    from: fromPhone,
    to: toFormatted,
  });

  return message.sid;
}

export async function sendWhatsAppMedia(to: string, mediaUrl: string, body: string): Promise<string> {
  if (!client) {
    throw new Error("Twilio client not initialized. Missing environment variables.");
  }

  // Format destination number for whatsapp sandbox
  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`;

  const message = await client.messages.create({
    body,
    mediaUrl: [mediaUrl],
    from: fromPhone,
    to: toFormatted,
  });

  return message.sid;
}
