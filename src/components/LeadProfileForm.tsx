"use client";

import { LeadProfile } from "@/types";
import { useState, useEffect } from "react";

interface LeadProfileFormProps {
  initialProfile: LeadProfile;
  onConfirm: (profile: LeadProfile) => void;
  onCancel: () => void;
}

export function LeadProfileForm({ initialProfile, onConfirm, onCancel }: LeadProfileFormProps) {
  const [profile, setProfile] = useState<LeadProfile>(initialProfile);

  // Sync state if initialProfile changes from parent
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleChange = (field: keyof LeadProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Review Lead Profile</h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">AI Extracted</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.company || ""}
            onChange={(e) => handleChange("company", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            required
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.yearsOfExperience ?? ""}
            onChange={(e) => handleChange("yearsOfExperience", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Intent (Why Scaler?)</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.intent || ""}
            onChange={(e) => handleChange("intent", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn / Background Notes</label>
          <textarea
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue resize-none h-20"
            value={profile.linkedinNotes || ""}
            onChange={(e) => handleChange("linkedinNotes", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary (LPA) - Optional</label>
          <input
            type="number"
            step="0.1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-scaler-blue focus:border-scaler-blue"
            value={profile.currentSalaryLPA || ""}
            onChange={(e) => handleChange("currentSalaryLPA", parseFloat(e.target.value) || undefined)}
          />
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-scaler-blue hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Confirm & Continue
        </button>
      </div>
    </form>
  );
}
