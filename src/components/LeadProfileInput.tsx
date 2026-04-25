"use client";

import { useState, useRef } from "react";
import { LeadProfile } from "@/types";

interface LeadProfileInputProps {
  onParsed: (profile: LeadProfile) => void;
}

export function LeadProfileInput({ onParsed }: LeadProfileInputProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "voice">("paste");
  const [rawText, setRawText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioBlob(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch("/api/parse-lead-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      if (!res.ok) throw new Error("Failed to parse");
      const data = await res.json();
      onParsed(data.profile);
    } catch (e) {
      console.error(e);
      alert("Failed to parse lead profile from text.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseAudio = async () => {
    if (!audioBlob) return;
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-note.webm");

      const res = await fetch("/api/parse-lead-profile", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to parse audio");
      const data = await res.json();
      onParsed(data.profile);
    } catch (e) {
      console.error(e);
      alert("Failed to parse lead profile from audio.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Lead Details</h2>
      
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "paste"
              ? "border-scaler-blue text-scaler-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("paste")}
        >
          Paste from CRM
        </button>
        <button
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "voice"
              ? "border-scaler-blue text-scaler-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("voice")}
        >
          Record Voice Note
        </button>
      </div>

      {activeTab === "paste" ? (
        <div>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-scaler-blue resize-none mb-4"
            placeholder="Paste raw text from CRM (name, company, role, intent, linkedin profile...)"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isParsing}
          />
          <button
            onClick={handleParseText}
            disabled={!rawText.trim() || isParsing}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? "Parsing with AI..." : "Parse Lead Details"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
              isRecording
                ? "bg-red-100 text-red-600 animate-pulse"
                : "bg-blue-50 text-scaler-blue hover:bg-blue-100"
            }`}
            disabled={isParsing}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            )}
          </button>
          <div className="text-sm text-gray-500 mb-6">
            {isRecording ? "Recording... Click to stop" : audioBlob ? "Audio recorded" : "Click to record voice note"}
          </div>
          
          <button
            onClick={handleParseAudio}
            disabled={!audioBlob || isParsing || isRecording}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? "Transcribing & Parsing..." : "Parse from Audio"}
          </button>
        </div>
      )}
    </div>
  );
}
