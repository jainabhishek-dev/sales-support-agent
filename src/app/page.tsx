"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Curated list of common country codes — add more as needed
const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA / Canada" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
];

type VerificationState = "idle" | "verifying" | "verified" | "failed";

export default function Onboarding() {
  const [countryCode, setCountryCode] = useState("+91");
  const [localNumber, setLocalNumber] = useState("");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [failureMessage, setFailureMessage] = useState("");
  const router = useRouter();

  const fullPhone = `${countryCode}${localNumber.replace(/^0+/, "")}`;

  const handleVerify = async () => {
    const digitsOnly = localNumber.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      alert("Please enter a valid phone number.");
      return;
    }

    setVerificationState("verifying");
    setFailureMessage("");

    try {
      const res = await fetch("/api/verify-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await res.json();

      if (data.verified) {
        setVerificationState("verified");
        // Store the verified phone for use across the session
        sessionStorage.setItem("evaluatorPhone", fullPhone);
      } else {
        setVerificationState("failed");
        setFailureMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationState("failed");
      setFailureMessage("Could not reach the server. Please check your connection and try again.");
    }
  };

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-2 w-full bg-scaler-blue" />

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-3xl font-extrabold tracking-tight text-gray-900">
              SCALER<span className="text-scaler-orange">.</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            AI Sales Support Agent
          </h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Supercharge BDA workflows with instant pre-call nudges and personalized post-call PDFs.
          </p>

          <div className="space-y-5">
            {/* Phone input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your WhatsApp Number
              </label>
              <div className="flex gap-2">
                {/* Country code dropdown */}
                <select
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                    setVerificationState("idle");
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-sm text-gray-900 focus:ring-scaler-blue focus:border-scaler-blue bg-white"
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.flag}-${c.code}`} value={c.code}>
                      {c.flag} {c.code} {c.name}
                    </option>
                  ))}
                </select>

                {/* Local number */}
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="9876543210"
                  className="flex-1 block px-3 py-3 border border-gray-300 rounded-lg focus:ring-scaler-blue focus:border-scaler-blue text-gray-900 text-sm"
                  value={localNumber}
                  onChange={(e) => {
                    setLocalNumber(e.target.value);
                    setVerificationState("idle");
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter without leading zero or country code (e.g. 9876543210)
              </p>
            </div>

            {/* Verification status banners */}
            {verificationState === "verified" && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                <span className="text-lg leading-none">✅</span>
                <div>
                  <p className="font-semibold">WhatsApp Connected!</p>
                  <p className="text-green-700 text-xs mt-0.5">
                    A confirmation message has been sent to {fullPhone}. You are ready to start.
                  </p>
                </div>
              </div>
            )}

            {verificationState === "failed" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                <span className="text-lg leading-none">⚠️</span>
                <div>
                  <p className="font-semibold">WhatsApp Not Connected</p>
                  <p className="text-red-700 text-xs mt-1">{failureMessage}</p>
                  {failureMessage.includes("join") && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-900">
                      Send: <strong>join applied-still</strong><br />
                      To: <strong>+1 415 523 8886</strong> on WhatsApp
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {verificationState !== "verified" ? (
              <button
                onClick={handleVerify}
                disabled={!localNumber.trim() || verificationState === "verifying"}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-scaler-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scaler-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verificationState === "verifying" ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking WhatsApp...
                  </>
                ) : verificationState === "failed" ? (
                  "Retry Verification"
                ) : (
                  "Verify WhatsApp"
                )}
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors"
              >
                Start Session →
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Built for the AI Product Builder Role · Scaler
        </div>
      </div>
    </main>
  );
}
