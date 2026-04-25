"use client";

import { NudgeContent } from "@/types";

interface NudgeCardProps {
  nudge: NudgeContent;
  messageSent: boolean;
}

export function NudgeCard({ nudge, messageSent }: NudgeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Pre-Call Nudge</h3>
        {messageSent && (
          <span className="flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            Sent to WhatsApp
          </span>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Persona & Motivation</h4>
          <p className="text-gray-900 font-medium">{nudge.persona}</p>
          <p className="text-gray-600 text-sm mt-1">{nudge.likelyMotivation}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Angles to Hit</h4>
          <ul className="space-y-2">
            {nudge.angles.map((angle, i) => (
              <li key={i} className="flex items-start">
                <svg className="w-5 h-5 text-scaler-orange mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm text-gray-700">{angle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Likely Objections</h4>
          <div className="space-y-3">
            {nudge.objections.map((obj, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-900 mb-1">&quot;{obj.objection}&quot;</p>
                <p className="text-sm text-scaler-blue flex items-start">
                  <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  {obj.handle}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Opening Hook</h4>
          <div className="bg-blue-50 border-l-4 border-scaler-blue p-3 text-sm text-gray-800 italic">
            &quot;{nudge.openingHook}&quot;
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Disclaimer:</span> {nudge.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
