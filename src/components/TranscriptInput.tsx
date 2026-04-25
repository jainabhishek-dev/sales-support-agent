"use client";

import { useState } from "react";

interface TranscriptInputProps {
  onTranscriptReady: (transcript: string) => void;
}

export function TranscriptInput({ onTranscriptReady }: TranscriptInputProps) {
  const [activeTab, setActiveTab] = useState<"text" | "audio">("text");
  const [transcriptText, setTranscriptText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextSubmit = () => {
    if (transcriptText.trim()) {
      onTranscriptReady(transcriptText);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioFile) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to transcribe");
      
      const data = await res.json();
      onTranscriptReady(data.transcript);
    } catch (e) {
      console.error(e);
      alert("Error transcribing audio");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Transcript</h2>
      
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "text"
              ? "border-scaler-blue text-scaler-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("text")}
        >
          Paste Transcript
        </button>
        <button
          className={`pb-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "audio"
              ? "border-scaler-blue text-scaler-blue"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("audio")}
        >
          Upload Audio
        </button>
      </div>

      {activeTab === "text" ? (
        <div>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-scaler-blue resize-none mb-4 text-sm"
            placeholder="Paste the call transcript here..."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!transcriptText.trim()}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 transition-colors"
          >
            Process Transcript
          </button>
        </div>
      ) : (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer rounded-md bg-white font-medium text-scaler-blue hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-scaler-blue focus-within:ring-offset-2">
                <span>Upload a file</span>
                <input 
                  type="file" 
                  className="sr-only" 
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">MP3, WAV, M4A up to 10MB</p>
            
            {audioFile && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          <button
            onClick={handleAudioSubmit}
            disabled={!audioFile || isProcessing}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 flex justify-center items-center transition-colors"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Transcribing Audio...
              </>
            ) : "Transcribe & Process"}
          </button>
        </div>
      )}
    </div>
  );
}
