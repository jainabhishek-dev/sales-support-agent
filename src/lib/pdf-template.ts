import { PDFContent } from "@/types";

function getThemeStyles(theme: "executive" | "career-switcher" | "fresher") {
  switch (theme) {
    case "executive":
      return `
        --primary: #0F172A; /* Slate 900 */
        --secondary: #334155; /* Slate 700 */
        --accent-primary: #1E293B; /* Slate 800 */
        --accent-secondary: #D97706; /* Amber 600 */
        --bg-color: #FFFFFF;
        --bg-alt: #F8FAFC; /* Slate 50 */
        --border: #E2E8F0;
        --header-bg: #0F172A;
        --header-text: #FFFFFF;
        --font-family: 'Inter', sans-serif;
      `;
    case "career-switcher":
      return `
        --primary: #1E3A8A; /* Blue 900 */
        --secondary: #475569; /* Slate 600 */
        --accent-primary: #2563EB; /* Blue 600 */
        --accent-secondary: #EA580C; /* Orange 600 */
        --bg-color: #FFFFFF;
        --bg-alt: #EFF6FF; /* Blue 50 */
        --border: #BFDBFE; /* Blue 200 */
        --header-bg: #FFFFFF;
        --header-text: #1E3A8A;
        --font-family: 'Inter', sans-serif;
      `;
    case "fresher":
      return `
        --primary: #134E4A; /* Teal 900 */
        --secondary: #3F6212; /* Lime 800 */
        --accent-primary: #0F766E; /* Teal 700 */
        --accent-secondary: #10B981; /* Emerald 500 */
        --bg-color: #FFFFFF;
        --bg-alt: #ECFDF5; /* Emerald 50 */
        --border: #A7F3D0; /* Emerald 200 */
        --header-bg: #134E4A;
        --header-text: #FFFFFF;
        --font-family: 'Inter', sans-serif;
      `;
    default:
      return `
        --primary: #1F2937;
        --secondary: #4B5563;
        --accent-primary: #2563EB;
        --accent-secondary: #F97316;
        --bg-color: #FFFFFF;
        --bg-alt: #F3F4F6;
        --border: #E5E7EB;
        --header-bg: #FFFFFF;
        --header-text: #1F2937;
        --font-family: 'Inter', sans-serif;
      `;
  }
}

export function buildPDFHTML(content: PDFContent): string {
  const themeStyles = getThemeStyles(content.leadTheme);
  const isDarkHeader = content.leadTheme === "executive" || content.leadTheme === "fresher";
  
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
      ${themeStyles}
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: var(--font-family);
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
    }
    
    .content-wrapper {
      padding: 40px;
    }
    
    header {
      background-color: var(--header-bg);
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      ${!isDarkHeader ? 'border-bottom: 2px solid var(--accent-secondary);' : ''}
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: var(--header-text);
      letter-spacing: -0.5px;
    }
    
    .logo span {
      color: ${isDarkHeader ? 'var(--accent-secondary)' : 'var(--accent-secondary)'};
    }
    
    .lead-name-badge {
      background-color: ${isDarkHeader ? 'rgba(255,255,255,0.1)' : 'var(--bg-alt)'};
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: ${isDarkHeader ? '#FFFFFF' : 'var(--secondary)'};
      ${!isDarkHeader ? 'border: 1px solid var(--border);' : ''}
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-top: 20px;
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
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      page-break-inside: avoid;
      ${content.leadTheme === 'executive' ? 'border-left: 4px solid var(--accent-secondary); border-radius: 4px 12px 12px 4px;' : ''}
    }
    
    .question {
      font-size: 20px;
      font-weight: 600;
      color: var(--accent-primary);
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .answer {
      font-size: 16px;
      margin-bottom: 20px;
      color: var(--primary);
    }
    
    .evidence {
      background-color: var(--bg-color);
      ${content.leadTheme === 'career-switcher' ? 'border-left: 4px solid var(--accent-secondary);' : 'border-top: 1px solid var(--border);'}
      padding: 15px 20px;
      border-radius: ${content.leadTheme === 'career-switcher' ? '0 8px 8px 0' : '8px'};
      font-size: 14px;
      color: var(--secondary);
    }
    
    .recommendation-box {
      border: 2px dashed var(--accent-primary);
      background-color: var(--bg-alt);
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
      color: var(--accent-secondary);
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
      background-color: var(--accent-primary);
      color: white;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 12px;
      color: var(--secondary);
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div class="logo">SCALER<span>.</span></div>
      <div class="lead-name-badge">Prepared for ${content.leadName}</div>
    </header>
    
    <div class="content-wrapper">
      <h1>${content.headline}</h1>
      <div class="intro">${content.intro}</div>
      
      <div class="sections">
        ${content.sections.map(section => `
          <div class="section">
            <div class="question">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px; color: var(--accent-secondary);"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
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
        <div class="cta">Take the Entrance Test</div>
      </div>
      
      <footer>
        Confidential document prepared for ${content.leadName} | Scaler Admissions Team
      </footer>
    </div>
  </div>
</body>
</html>
  `;
}
