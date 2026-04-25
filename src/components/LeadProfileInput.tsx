"use client";

import { useState, useRef } from "react";
import { LeadProfile } from "@/types";

interface LeadProfileInputProps {
  onParsed: (profile: LeadProfile) => void;
}

type ActiveTab = "paste" | "upload" | "voice";

export function LeadProfileInput({ onParsed }: LeadProfileInputProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("paste");
  const [rawText, setRawText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  // Upload audio state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
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
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedBlob(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check browser permissions.");
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
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      onParsed(data.profile);
    } catch (e) {
      console.error(e);
      alert("Failed to parse lead profile from text. Check the console for details.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseAudio = async (audioData: Blob | File) => {
    setIsParsing(true);
    try {
      const formData = new FormData();
      const filename = audioData instanceof File ? audioData.name : "voice-note.webm";
      formData.append("audio", audioData, filename);

      const res = await fetch("/api/parse-lead-profile", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      onParsed(data.profile);
    } catch (e) {
      console.error(e);
      alert("Failed to parse lead profile from audio. Check the console for details.");
    } finally {
      setIsParsing(false);
    }
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "paste", label: "Paste from CRM" },
    { id: "upload", label: "Upload Audio" },
    { id: "voice", label: "Record Voice Note" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Lead Details</h2>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-scaler-blue text-scaler-blue"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Paste from CRM */}
      {activeTab === "paste" && (
        <div>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-scaler-blue resize-none mb-4 text-sm"
            placeholder="Paste raw text from CRM (name, company, role, intent, LinkedIn profile...)"
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
      )}

      {/* Upload Audio */}
      {activeTab === "upload" && (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-scaler-blue transition-colors">
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer rounded-md bg-white font-medium text-scaler-blue hover:text-blue-700">
                <span>Upload an audio file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="audio/*"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">MP3, WAV, M4A, WebM — voice note describing the lead</p>
            {uploadedFile && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          <button
            onClick={() => uploadedFile && handleParseAudio(uploadedFile)}
            disabled={!uploadedFile || isParsing}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? "Transcribing & Parsing..." : "Parse from Audio"}
          </button>
        </div>
      )}

      {/* Record Voice Note */}
      {activeTab === "voice" && (
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          <div className="text-sm text-gray-500 mb-6">
            {isRecording
              ? "Recording... Click to stop"
              : recordedBlob
              ? "Audio captured — ready to parse"
              : "Click to record a voice note about the lead"}
          </div>
          <button
            onClick={() => recordedBlob && handleParseAudio(recordedBlob)}
            disabled={!recordedBlob || isParsing || isRecording}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? "Transcribing & Parsing..." : "Parse from Recording"}
          </button>
        </div>
      )}
    </div>
  );
}
