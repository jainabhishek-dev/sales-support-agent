"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  
  // Clear any existing session on mount
  useEffect(() => {
    sessionStorage.removeItem("evaluatorPhone");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    // basic validation
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    sessionStorage.setItem("evaluatorPhone", formattedPhone);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-2 w-full bg-scaler-blue"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="text-3xl font-extrabold tracking-tight text-gray-900">
              SCALER<span className="text-scaler-orange">.</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">AI Sales Support Agent</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Supercharge BDA workflows with instant pre-call nudges and personalized post-call PDFs.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Your WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="+919876543210"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-scaler-blue focus:border-scaler-blue text-gray-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Include country code (e.g. +91). Make sure you have joined the Twilio sandbox first.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-scaler-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scaler-blue transition-colors"
            >
              Start Demo
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Built for the AI Product Builder Role
        </div>
      </div>
    </main>
  );
}
