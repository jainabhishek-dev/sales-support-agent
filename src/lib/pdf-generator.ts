export async function generatePDF(html: string): Promise<Buffer> {
  const apiKey = process.env.BROWSERLESS_API_KEY;

  if (!apiKey) {
    throw new Error("BROWSERLESS_API_KEY is not set.");
  }

  const response = await fetch(
    `https://chrome.browserless.io/pdf?token=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        options: {
          format: "A4",
          printBackground: true,
          margin: {
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px",
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Browserless PDF generation failed: ${response.status} ${errorText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
