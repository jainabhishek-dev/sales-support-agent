"use client";

import { useState, useRef } from "react";

interface TranscriptInputProps {
  onTranscriptReady: (transcript: string) => void;
}

type ActiveTab = "text" | "audio" | "record";

export function TranscriptInput({ onTranscriptReady }: TranscriptInputProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("text");
  const [transcriptText, setTranscriptText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Recording state
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

  const handleTextSubmit = () => {
    if (transcriptText.trim()) {
      onTranscriptReady(transcriptText);
    }
  };

  const handleAudioTranscribe = async (audioData: Blob | File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      const filename = audioData instanceof File ? audioData.name : "call-recording.webm";
      formData.append("audio", audioData, filename);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      onTranscriptReady(data.transcript);
    } catch (e) {
      console.error(e);
      alert("Error transcribing audio. Check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "text", label: "Paste Transcript" },
    { id: "audio", label: "Upload Audio" },
    { id: "record", label: "Record Audio" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Transcript</h2>

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

      {/* Paste Transcript */}
      {activeTab === "text" && (
        <div>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scaler-blue focus:border-scaler-blue resize-none mb-4 text-sm"
            placeholder="Paste the full call transcript here..."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!transcriptText.trim()}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Process Transcript
          </button>
        </div>
      )}

      {/* Upload Audio */}
      {activeTab === "audio" && (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-scaler-blue transition-colors">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
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
            <p className="text-xs text-gray-500 mt-2">MP3, WAV, M4A up to 25MB</p>
            {audioFile && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          <button
            onClick={() => audioFile && handleAudioTranscribe(audioFile)}
            disabled={!audioFile || isProcessing}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-colors"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Transcribing Audio...
              </>
            ) : (
              "Transcribe & Process"
            )}
          </button>
        </div>
      )}

      {/* Record Audio */}
      {activeTab === "record" && (
        <div className="flex flex-col items-center justify-center py-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
              isRecording
                ? "bg-red-100 text-red-600 animate-pulse"
                : "bg-blue-50 text-scaler-blue hover:bg-blue-100"
            }`}
            disabled={isProcessing}
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
              ? "Recording captured — ready to transcribe"
              : "Click to record the call audio"}
          </div>
          <button
            onClick={() => recordedBlob && handleAudioTranscribe(recordedBlob)}
            disabled={!recordedBlob || isProcessing || isRecording}
            className="w-full bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-colors"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Transcribing...
              </>
            ) : (
              "Transcribe & Process"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
