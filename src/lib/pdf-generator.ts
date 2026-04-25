import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function generatePDF(html: string): Promise<Buffer> {
  const isLocal = process.env.NODE_ENV === "development";
  let executablePath: string;

  if (isLocal) {
    // For local Windows development, usually it's in Program Files or similar.
    // For broader compatibility, you can use standard puppeteer if installed locally,
    // but here we are using puppeteer-core. We need to point to a local Edge or Chrome.
    executablePath = process.env.LOCAL_CHROME_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
    // Fallback common chrome path for windows: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  } else {
    executablePath = await chromium.executablePath();
  }

  const browser = await puppeteer.launch({
    args: isLocal ? [] : chromium.args,
    defaultViewport: { width: 1200, height: 800 },
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();
  
  // Set content with a faster timeout
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  
  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px"
    }
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}
