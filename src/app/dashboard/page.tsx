"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeadProfileInput } from "@/components/LeadProfileInput";
import { LeadProfileForm } from "@/components/LeadProfileForm";
import { NudgeCard } from "@/components/NudgeCard";
import { TranscriptInput } from "@/components/TranscriptInput";
import { PDFPreview } from "@/components/PDFPreview";
import { ApprovalGate } from "@/components/ApprovalGate";
import { LeadProfile, NudgeContent } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [evaluatorPhone, setEvaluatorPhone] = useState<string | null>(null);
  
  // Step state: 1 (Profile) -> 2 (Nudge) -> 3 (Post-Call) -> 4 (Done)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Data state
  const [profile, setProfile] = useState<LeadProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nudge, setNudge] = useState<NudgeContent | null>(null);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [isGeneratingNudge, setIsGeneratingNudge] = useState(false);
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const phone = sessionStorage.getItem("evaluatorPhone");
    if (!phone) {
      router.push("/");
    } else {
      setEvaluatorPhone(phone);
    }
  }, [router]);

  const handleProfileParsed = (parsedProfile: LeadProfile) => {
    setProfile(parsedProfile);
    setIsEditingProfile(true);
  };

  const handleProfileConfirm = async (confirmedProfile: LeadProfile) => {
    setProfile(confirmedProfile);
    setIsEditingProfile(false);
    
    // Move to step 2 and trigger nudge generation
    setStep(2);
    setIsGeneratingNudge(true);
    
    try {
      const res = await fetch("/api/generate-nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: confirmedProfile, evaluatorPhone }),
      });
      if (!res.ok) throw new Error("Failed to generate nudge");
      
      const data = await res.json();
      setNudge(data.nudge);
      setNudgeSent(data.messageSent);
    } catch (error) {
      console.error(error);
      alert("Failed to generate pre-call nudge.");
    } finally {
      setIsGeneratingNudge(false);
    }
  };

  const handleTranscriptReady = async (transcript: string) => {
    if (!profile) return;
    setIsGeneratingPDF(true);
    
    try {
      // 1. Extract questions
      const extRes = await fetch("/api/extract-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, profile }),
      });
      if (!extRes.ok) throw new Error("Failed to extract questions");
      const { questions } = await extRes.json();

      // 2. Generate PDF Content
      const contentRes = await fetch("/api/generate-pdf-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, questions }),
      });
      if (!contentRes.ok) throw new Error("Failed to generate PDF content");
      const { content } = await contentRes.json();

      // 3. Generate PDF File & upload
      const pdfRes = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!pdfRes.ok) throw new Error("Failed to generate PDF file");
      const { pdfUrl } = await pdfRes.json();

      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error(error);
      alert("Error generating post-call PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendPDF = async (coverMessage: string) => {
    if (!evaluatorPhone || !pdfUrl || !profile) return;
    
    const res = await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: evaluatorPhone,
        pdfUrl,
        coverMessage,
        leadName: profile.name,
      }),
    });
    
    if (!res.ok) throw new Error("Failed to send WhatsApp message");
    setStep(4);
  };

  const handleSkipPDF = () => {
    setStep(4);
  };

  if (!evaluatorPhone) return null; // loading or redirecting

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-scaler-blue text-white rounded flex items-center justify-center mr-2 text-sm">S</div>
            SCALER<span className="text-scaler-orange">.</span>
          </div>
          <div className="text-sm font-medium text-gray-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected: {evaluatorPhone}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-scaler-blue -z-10 transition-all duration-500 rounded"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${
                  step >= s 
                    ? "bg-white border-scaler-blue text-scaler-blue" 
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-gray-500 px-1 uppercase tracking-wider">
            <span>Lead Profile</span>
            <span>Pre-Call Nudge</span>
            <span>Post-Call PDF</span>
            <span>Done</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1 */}
            {step === 1 && (
              <>
                {!isEditingProfile ? (
                  <LeadProfileInput onParsed={handleProfileParsed} />
                ) : (
                  profile && (
                    <LeadProfileForm 
                      initialProfile={profile} 
                      onConfirm={handleProfileConfirm} 
                      onCancel={() => setIsEditingProfile(false)}
                    />
                  )
                )}
              </>
            )}

            {/* Step 2 */}
            {step === 2 && profile && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-scaler-blue mr-3 font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                    <p className="text-sm text-gray-500">{profile.role} at {profile.company}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                  Pre-call nudge has been generated. When you finish the call, upload or paste the transcript to generate the personalized PDF.
                </p>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Call Finished - Proceed to PDF
                </button>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && profile && !pdfUrl && (
              <TranscriptInput onTranscriptReady={handleTranscriptReady} />
            )}

            {/* Step 3 - Generating state */}
            {step === 3 && isGeneratingPDF && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                <svg className="animate-spin h-10 w-10 text-scaler-blue mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Crafting Personalized PDF...</h3>
                <p className="text-sm text-gray-500 max-w-[250px]">
                  Analyzing call transcript, fetching Scaler evidence, and generating a pixel-perfect design.
                </p>
              </div>
            )}

            {/* Step 3 - Approval Gate */}
            {step === 3 && pdfUrl && profile && (
              <ApprovalGate 
                leadName={profile.name}
                pdfUrl={pdfUrl}
                evaluatorPhone={evaluatorPhone}
                onSend={handleSendPDF}
                onSkip={handleSkipPDF}
              />
            )}

            {/* Step 4 - Done */}
            {step === 4 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Lead Processed</h2>
                <p className="text-gray-500 mb-6">Workflow completed successfully.</p>
                <button
                  onClick={() => {
                    setStep(1);
                    setProfile(null);
                    setNudge(null);
                    setPdfUrl(null);
                  }}
                  className="bg-white text-scaler-blue border border-scaler-blue font-medium py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors inline-block"
                >
                  Start New Lead
                </button>
              </div>
            )}
            
          </div>


          {/* RIGHT COLUMN - Previews */}
          <div className="lg:col-span-7">
            {isGeneratingNudge && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center h-[400px]">
                <svg className="animate-spin h-10 w-10 text-scaler-blue mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-gray-500 font-medium">Generating Pre-Call Nudge...</p>
              </div>
            )}

            {!isGeneratingNudge && nudge && step < 3 && (
              <NudgeCard nudge={nudge} messageSent={nudgeSent} />
            )}

            {pdfUrl && (
              <PDFPreview pdfUrl={pdfUrl} />
            )}
            
            {!isGeneratingNudge && !nudge && !pdfUrl && (
              <div className="hidden lg:flex bg-gray-100 rounded-xl border border-dashed border-gray-300 h-[600px] items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="text-gray-400 font-medium">Nudge & PDF Preview Area</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
