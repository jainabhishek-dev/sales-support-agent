import { LeadProfile } from "@/types";
import { SCALER_PROGRAMS, ScalerProgram } from "./scaler-programs";

export function selectBestProgram(profile: LeadProfile): ScalerProgram {
  const intentLower = profile.intent.toLowerCase();
  const roleLower = profile.role.toLowerCase();
  
  // Rule 1: Data Science / Machine Learning
  if (
    intentLower.includes("data") || 
    intentLower.includes("ml") || 
    intentLower.includes("machine learning") ||
    roleLower.includes("data") ||
    roleLower.includes("analyst")
  ) {
    return SCALER_PROGRAMS.scaler_ds_ml;
  }
  
  // Rule 2: DevOps / Cloud / SRE
  if (
    intentLower.includes("devops") || 
    intentLower.includes("cloud") || 
    intentLower.includes("sre") ||
    roleLower.includes("devops") ||
    roleLower.includes("platform") ||
    roleLower.includes("infrastructure")
  ) {
    return SCALER_PROGRAMS.scaler_devops_cloud;
  }

  // Rule 3: Senior / GenAI focus
  if (
    profile.yearsOfExperience >= 3 && 
    (intentLower.includes("ai") || intentLower.includes("product") || intentLower.includes("switch"))
  ) {
    return SCALER_PROGRAMS.scaler_academy_modern_ai;
  }

  // Default: Scaler Academy (Core SDE/AI)
  return SCALER_PROGRAMS.scaler_academy_sde_ai;
}

export function determineLeadTheme(profile: LeadProfile): "executive" | "career-switcher" | "fresher" {
  // Executive: Top companies or highly experienced
  const topCompanies = ["google", "microsoft", "amazon", "meta", "apple", "netflix", "adobe", "uber"];
  const isTopCompany = topCompanies.some(c => profile.company.toLowerCase().includes(c));
  
  if (profile.yearsOfExperience >= 5 || (isTopCompany && profile.yearsOfExperience >= 3)) {
    return "executive";
  }
  
  // Career Switcher: Mid-level looking to transition
  if (profile.yearsOfExperience >= 2) {
    return "career-switcher";
  }
  
  // Fresher: 0-2 YoE
  return "fresher";
}
