"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [outbreakEnabled, setOutbreakEnabled] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(true);
  const [vectorSensitivity, setVectorSensitivity] = useState(65);

  return (
    <>
      <Header
        title="Settings & Context"
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full text-xs font-medium text-on-surface-variant border border-border">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            Low-Bandwidth Mode: Active
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-5 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-on-surface mb-1">Settings</h2>
            <p className="text-sm text-outline">Configure local health context and profile preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <div className="clinical-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span className="font-heading text-sm font-semibold">Local Health Context</span>
                  </div>
                  <span className="status-chip bg-surface-container-high text-on-surface-variant">Region: Sector 7G</span>
                </div>

                <div className={`p-3 rounded-sm mb-4 flex items-center justify-between ${outbreakEnabled ? "bg-alert-red-bg border-l-[3px] border-l-alert-red" : "bg-surface-container-low"}`}>
                  <div>
                    <span className={`text-sm font-semibold ${outbreakEnabled ? "text-alert-red" : "text-on-surface-variant"}`}>Regional Outbreak Flagged</span>
                    {outbreakEnabled && (
                      <p className="text-xs text-alert-red mt-0.5">Scrub Typhus Outbreak active in your sector. AI models are prioritizing rickettsial indicators.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setOutbreakEnabled(!outbreakEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${outbreakEnabled ? "bg-alert-red" : "bg-outline-variant"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-0.5 ${outbreakEnabled ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <Separator className="my-4" />

                <h4 className="label-clinical mb-3">AI Probability Adjustments</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-on-surface">Vector-borne Disease Sensitivity</span>
                      <span className="text-sm font-semibold text-clinical-blue">+{vectorSensitivity - 50}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-clinical-blue rounded-full transition-all" style={{ width: `${vectorSensitivity}%` }} />
                    </div>
                    <p className="text-[10px] text-outline mt-1">Auto-adjusted based on outbreak flag</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-on-surface">Waterborne Pathogen Baseline</span>
                      <span className="text-sm font-semibold text-on-surface-variant">Standard</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-on-surface rounded-full" style={{ width: "50%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="clinical-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/></svg>
                  <span className="font-heading text-sm font-semibold">Connectivity</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-on-surface">Low-Bandwidth Mode</span>
                  <button
                    onClick={() => setLowBandwidth(!lowBandwidth)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${lowBandwidth ? "bg-clinical-blue" : "bg-outline-variant"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-0.5 ${lowBandwidth ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <p className="text-[10px] text-outline leading-relaxed">Image uploads paused. Text clinical data prioritizing async sync.</p>
              </div>

              <div className="clinical-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span className="font-heading text-sm font-semibold">System</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-outline">Version</span>
                    <span className="font-semibold text-on-surface">v2.4.1 (Stable)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Local DB Sync</span>
                    <span className="font-semibold text-on-surface">12 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="clinical-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="font-heading text-base font-semibold">Profile Management</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-clinical">Full Name</label>
                <input type="text" defaultValue="Dr. Sarah Jenkins" className="input-clinical" />
              </div>
              <div>
                <label className="label-clinical">Primary Contact</label>
                <input type="text" defaultValue="s.jenkins@blindspotmd.org" className="input-clinical" />
              </div>
              <div>
                <label className="label-clinical">Credentials</label>
                <input type="text" defaultValue="MD, Internal Medicine" className="input-clinical" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label-clinical">Security PIN</label>
                  <input type="password" defaultValue="1234" className="input-clinical" />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="h-[38px] text-xs border-outline-variant">Update</Button>
                </div>
              </div>
              <div>
                <label className="label-clinical">Clinic ID</label>
                <input type="text" defaultValue="CL-9942-X" className="input-clinical bg-surface-container-low" readOnly />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button className="bg-on-surface text-white hover:bg-on-surface/90 h-9 text-sm font-medium px-6">
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
