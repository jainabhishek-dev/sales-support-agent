"use client";

import { useState } from "react";

interface ApprovalGateProps {
  leadName: string;
  pdfUrl: string;
  evaluatorPhone: string;
  onSend: (coverMessage: string) => Promise<void>;
  onSkip: () => void;
}

export function ApprovalGate({ leadName, pdfUrl, evaluatorPhone, onSend, onSkip }: ApprovalGateProps) {
  const [coverMessage, setCoverMessage] = useState(
    `Hi ${leadName}, great speaking with you today! I've put together a personalized overview answering the specific questions we discussed about Scaler. Let me know what you think!`
  );
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(coverMessage);
      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send WhatsApp message.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-50 rounded-xl p-8 text-center border border-green-200">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-green-900 mb-1">Successfully Sent to Lead!</h3>
        <p className="text-sm text-green-700">The PDF has been delivered via WhatsApp to {evaluatorPhone}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-scaler-orange overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-scaler-orange"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 text-scaler-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            BDA Approval Gate
          </h3>
          <span className="bg-orange-100 text-scaler-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Required</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Review the cover message below. This will be sent to the lead along with their personalized PDF.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Cover Message</label>
          <div className="relative">
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-scaler-blue resize-none text-gray-900 text-sm bg-gray-50"
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              disabled={isSending}
            />
          </div>
          
          <div className="mt-3 flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            Attached: <strong>{leadName.split(" ")[0]}_Scaler_Overview.pdf</strong>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSkip}
            disabled={isSending}
            className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Skip / Do Not Send
          </button>
          <button
            onClick={handleSend}
            disabled={!coverMessage.trim() || isSending}
            className="flex-[2] bg-scaler-orange hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-50"
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sending via WhatsApp...
              </>
            ) : (
              "Approve & Send to Lead"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
