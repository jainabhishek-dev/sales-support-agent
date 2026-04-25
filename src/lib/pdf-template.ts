import { PDFContent } from "@/types";

export function buildPDFHTML(content: PDFContent): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Path at Scaler</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1F2937;
      --secondary: #4B5563;
      --accent-orange: #F97316;
      --accent-blue: #2563EB;
      --bg-color: #FFFFFF;
      --bg-alt: #F3F4F6;
      --border: #E5E7EB;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: var(--primary);
      background-color: var(--bg-color);
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    
    .page {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    header {
      border-bottom: 2px solid var(--accent-orange);
      padding-bottom: 20px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: -0.5px;
    }
    
    .logo span {
      color: var(--accent-orange);
    }
    
    .lead-name-badge {
      background-color: var(--bg-alt);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary);
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.2;
      color: var(--primary);
    }
    
    .intro {
      font-size: 18px;
      color: var(--secondary);
      margin-bottom: 40px;
    }
    
    .section {
      background-color: var(--bg-alt);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .question {
      font-size: 20px;
      font-weight: 600;
      color: var(--accent-blue);
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .answer {
      font-size: 16px;
      margin-bottom: 20px;
    }
    
    .evidence {
      background-color: white;
      border-left: 4px solid var(--accent-orange);
      padding: 15px 20px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      color: var(--secondary);
    }
    
    .recommendation-box {
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 30px;
      margin-top: 40px;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .rec-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      color: var(--secondary);
      margin-bottom: 10px;
    }
    
    .rec-program {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 20px;
    }
    
    .cta {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }
    
    footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 12px;
      color: #9CA3AF;
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div class="logo">SCALER<span>.</span></div>
      <div class="lead-name-badge">Prepared for ${content.leadName}</div>
    </header>
    
    <h1>${content.headline}</h1>
    <div class="intro">${content.intro}</div>
    
    <div class="sections">
      ${content.sections.map(section => `
        <div class="section">
          <div class="question">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            ${section.question}
          </div>
          <div class="answer">${section.answer.replace(/\n/g, '<br/>')}</div>
          <div class="evidence">
            <strong>Evidence:</strong> ${section.evidence.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="recommendation-box">
      <div class="rec-title">Recommended Program</div>
      <div class="rec-program">${content.programRecommendation}</div>
      <p style="margin-bottom: 20px; font-size: 16px; color: var(--secondary);">${content.closingCTA}</p>
      <div style="background-color: var(--accent-blue); color: white; padding: 12px 24px; border-radius: 8px; display: inline-block; font-weight: 600;">Take the Entrance Test</div>
    </div>
    
    <footer>
      Confidential document prepared for ${content.leadName} | Scaler Admissions Team
    </footer>
  </div>
</body>
</html>
  `;
}
