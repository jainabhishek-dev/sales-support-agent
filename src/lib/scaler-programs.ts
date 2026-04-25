export interface ScalerProgram {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  targetAudience: string;
  keyModules: string[];
  outcomes: string[];
  certifications: string[];
  differentiators: string[];
}

export const SCALER_PROGRAMS: Record<string, ScalerProgram> = {
  scaler_academy_sde_ai: {
    id: "scaler_academy_sde_ai",
    name: "Software Development Course with Specialisation in AI",
    tagline: "Bridging the gap between software development and AI expertise.",
    duration: "9 - 12 Months",
    targetAudience: "Software Developers, IT Professionals, and Maths/Engineering background candidates (0-10+ YoE) looking to master DSA, System Design, and integrate AI tools into development.",
    keyModules: [
      "Programming Language Fundamentals",
      "Data Structures and Algorithms (4.5 Months)",
      "High-Level Design & Low-Level Design (1.5 Months each)",
      "Frontend / Backend Engineering Specialisations",
      "Gen AI for Software Engineers",
      "Product Management for Engineers"
    ],
    outcomes: [
      "Average CTC: 21.6 LPA",
      "Average Hike: 126%",
      "Placement Support: 600+ partner employers",
      "Roles: SDE 1, SDE 2, SDE 3, Lead Engineer"
    ],
    certifications: [
      "Certificate of Excellence from Scaler",
      "Optional Add-on Certificate from IIT-Roorkee CEC"
    ],
    differentiators: [
      "Live classes by industry experts from top product companies",
      "1:1 personalized mentorship",
      "AI-powered mock interviews & teaching assistance"
    ]
  },
  scaler_devops_cloud: {
    id: "scaler_devops_cloud",
    name: "DevOps, Cloud & AI Platform Engineering Program",
    tagline: "Modern Infrastructure. Made for the AI Age.",
    duration: "14 - 18 Months",
    targetAudience: "Professionals aiming to specialize in Cloud-native infrastructure, Kubernetes, CI/CD, DevSecOps, and AI operations.",
    keyModules: [
      "Linux, DevOps 1 & 2, AWS 1 & 2",
      "No-Code Automation & Python as the AI Control Plane",
      "Observability for AI and Operations",
      "Generative AI for Engineers & Agentic AI Systems",
      "MLOps on Kubernetes & AWS AI/ML Foundations"
    ],
    outcomes: [
      "Roles: DevOps Engineer, SRE, Cloud Architect, Platform Engineer",
      "900+ partner companies for placements",
      "Industry-grade capstone projects"
    ],
    certifications: [
      "AWS Certified DevOps Engineer Professional",
      "Certified Kubernetes Administrator (CKA)",
      "Note: Scaler reimburses AWS and CKA exam fees upon successful completion"
    ],
    differentiators: [
      "Unlimited AI Mock Interviews for Platform Engineer & SRE roles",
      "1:1 Mentorship from seasoned DevOps experts",
      "Certification fee reimbursement for CKA and AWS"
    ]
  },
  scaler_ds_ml: {
    id: "scaler_ds_ml",
    name: "Modern Data Science & ML Program",
    tagline: "Modern Data Science Built for the Age of AI",
    duration: "14 - 20 Months",
    targetAudience: "Freshers and professionals (Tech & Non-tech) wanting to build predictive models, design intelligent systems, and transition to Data Science & ML.",
    keyModules: [
      "Advanced Analytics with Python, Pandas & AI Workflows",
      "Statistics, Experimentation & AI for Data-Driven Decisions",
      "Supervised & Un-supervised Machine Learning with AI",
      "Deep Learning, Neural Networks, Computer Vision & NLP",
      "AI Engineering and Agentic AI",
      "MLOps & AI Deployment"
    ],
    outcomes: [
      "Roles: Data Analyst, Data Scientist, ML Engineer, BI Analyst",
      "Avg. CTC (Data Scientist): Rs. 20.2 LPA",
      "Avg. CTC (Sr. Data Scientist): Rs. 45.2 LPA"
    ],
    certifications: [
      "NSDC Certified",
      "Certificate of Excellence from Scaler",
      "Optional Add-on Certificate from IIT-Roorkee CEC"
    ],
    differentiators: [
      "AI-First curriculum reflecting current industry needs",
      "Domain Analytics specializations (Fintech, E-commerce, Healthcare)",
      "Real-world Portfolio Projects with companies like Swiggy, Netflix, CRED"
    ]
  },
  scaler_academy_modern_ai: {
    id: "scaler_academy_modern_ai",
    name: "Modern Software and AI Engineering Program",
    tagline: "With Specialisation in GenAI/Agentic AI",
    duration: "17 - 18 Months",
    targetAudience: "Engineering professionals and freshers wanting to build production-ready AI-enabled systems and master full-stack/backend engineering.",
    keyModules: [
      "Advanced DSA (Linear, Non-Linear, Backtracking, DP, Heaps & Graphs)",
      "AI & Agents: From Talking to AI to Building One",
      "Backend Specialisation: Object-Oriented Design & Scalable Systems",
      "Fullstack Specialisation: React, TypeScript, Backend Product Systems",
      "Distributed System Design & AI-Integrated Architectures",
      "Forward Deployment Engineering & Data Engineering"
    ],
    outcomes: [
      "Average CTC: 21.6 LPA",
      "Highest Package: 1.7 Cr",
      "Promotion Rate: 31.8% (One Year Post Scaler)",
      "Roles: SDE, Fullstack Developer, Backend Engineer, AI Engineer"
    ],
    certifications: [
      "Certificate of Excellence from Scaler",
      "Optional Paid Add-on Certificate from IIT-Roorkee"
    ],
    differentiators: [
      "24x7 AI Companion for dialogue-based solutioning",
      "Extend Scaler credits into a Master's Degree via Woolf",
      "Specialisation in GenAI/Agentic AI alongside core software engineering"
    ]
  }
};
