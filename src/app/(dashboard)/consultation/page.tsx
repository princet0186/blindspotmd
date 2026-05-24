"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const MOCK_PATIENT = {
  initials: "AS",
  name: "Ananya Sharma",
  age: 42,
  sex: "Female",
  mrn: "9482-104",
  status: "Stable",
  vitals: { bp: "130/85", hr: "72", spo2: "98", temp: "98.6" },
};

const MOCK_BLINDSPOT = {
  severity: "high",
  confidence: 92,
  title: "Consider Thyroid Panel",
  triggers: ["Persistent fatigue", "Unexplained weight loss", "Demographics (Female, 42)"],
  logic: "The combination of persistent fatigue and unexplained weight loss in a 42-year-old female places this patient in an elevated risk bracket for hypothyroidism. TSH and Free T4 testing is recommended before attributing symptoms to general fatigue or stress. Prevalence in this demographic is approximately 5-8%.",
  action: "Order TSH and Free T4 panel. If TSH > 4.5 mIU/L, consider referral to endocrinology.",
};

const MOCK_TRANSCRIPT = [
  { speaker: "dr", text: "So tell me, how long have you been feeling this tiredness?" },
  { speaker: "pt", text: "It has been maybe three weeks now. I just feel exhausted all the time, even after sleeping." },
  { speaker: "dr", text: "Have you noticed any changes in your weight recently?" },
  { speaker: "pt", text: "Yes actually, I think I have lost some weight. My clothes are looser." },
  { speaker: "dr", text: "Any hair loss or feeling cold when others are comfortable?" },
  { speaker: "pt", text: "Now that you mention it, yes, I have been feeling cold a lot lately." },
];

export default function ConsultationPage() {
  const [isListening, setIsListening] = useState(true);
  const [showLogic, setShowLogic] = useState(false);
  const [notes, setNotes] = useState("");
  const [vitals, setVitals] = useState(MOCK_PATIENT.vitals);

  return (
    <>
      <Header
        title="Active Consultation"
        showAmbientToggle
        isListening={isListening}
        onToggleListening={() => setIsListening(!isListening)}
        actions={
          <Button variant="outline" className="h-8 px-3 text-xs rounded-md border-outline-variant text-on-surface-variant">
            End Session
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-5 md:p-6">
          <div className="clinical-card p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-clinical-blue-light flex items-center justify-center text-sm font-semibold text-clinical-blue shrink-0">
                {MOCK_PATIENT.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base font-semibold">{MOCK_PATIENT.name}</span>
                  <Badge variant="outline" className="status-chip bg-success-bg text-success border-success/20">
                    {MOCK_PATIENT.status}
                  </Badge>
                </div>
                <p className="text-xs text-outline mt-0.5">
                  {MOCK_PATIENT.age}y, {MOCK_PATIENT.sex} &bull; MRN: {MOCK_PATIENT.mrn}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "BP", value: vitals.bp, unit: "mmHg" },
                { label: "HR", value: vitals.hr, unit: "bpm" },
                { label: "SPO2", value: vitals.spo2, unit: "%" },
                { label: "TEMP", value: vitals.temp, unit: "°F" },
              ].map((v) => (
                <div key={v.label} className="text-center md:text-left">
                  <span className="label-clinical">{v.label}</span>
                  <div className="flex items-baseline gap-1 justify-center md:justify-start">
                    <span className="data-value">{v.value}</span>
                    <span className="text-[10px] text-outline">{v.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-5">
              <div className="clinical-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-sm font-semibold text-on-surface">Clinical Notes (SOAP)</h3>
                  <button className="text-xs font-medium text-clinical-blue hover:underline">
                    Insert Template
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-2 border-b border-border pb-2">
                  <button className="p-1.5 rounded hover:bg-surface-container-low text-on-surface-variant">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container-low text-on-surface-variant">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container-low text-on-surface-variant">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  </button>
                </div>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes are being transcribed by Ambient Listening..."
                  className="min-h-[180px] border-input text-sm resize-none focus:border-clinical-blue focus:ring-1 focus:ring-clinical-blue"
                />

                {isListening && (
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006d3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                    <span className="text-success font-medium">Listening and transcribing...</span>
                    <span className="text-outline italic">&quot;Patient reports persistent fatigue over the last 3 weeks...&quot;</span>
                  </div>
                )}
              </div>

              <div className="clinical-card p-5">
                <h3 className="font-heading text-sm font-semibold text-on-surface mb-3">Orders & Plan</h3>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    type="text"
                    placeholder="Search medications, labs, imaging..."
                    className="input-clinical pl-9"
                  />
                </div>
              </div>

              <div className="clinical-card p-5">
                <h3 className="font-heading text-sm font-semibold text-on-surface mb-3">Vitals Entry</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "BP (mmHg)", key: "bp" as const },
                    { label: "Heart Rate (bpm)", key: "hr" as const },
                    { label: "Temp (°F)", key: "temp" as const },
                    { label: "SpO2 (%)", key: "spo2" as const },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="label-clinical">{field.label}</label>
                      <input
                        type="text"
                        value={vitals[field.key]}
                        onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                        className="input-clinical"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="clinical-card p-4 border-t-2 border-t-clinical-blue">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0051d5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span className="font-heading text-sm font-semibold text-on-surface">BlindSpot Insights</span>
                </div>
                <p className="text-[11px] text-outline mb-3">Silent Second Opinion™ active.</p>

                <div className="blindspot-card p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <span className="text-[10px] font-bold text-alert-red uppercase tracking-wider">High Confidence</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-alert-red-light text-alert-red-dark px-2 py-0.5 rounded">{MOCK_BLINDSPOT.confidence}% Match</span>
                  </div>

                  <h4 className="text-sm font-semibold text-on-surface mb-2">{MOCK_BLINDSPOT.title}</h4>

                  <p className="text-[11px] text-on-surface-variant mb-2">Triggered by context:</p>
                  <ul className="space-y-1 mb-3">
                    {MOCK_BLINDSPOT.triggers.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-clinical-blue shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowLogic(!showLogic)}
                    className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-on-surface-variant border border-border rounded-sm hover:bg-surface-container-low transition-colors mb-3"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {showLogic ? "Hide" : "Show"} Clinical Logic
                  </button>

                  {showLogic && (
                    <div className="bg-white border border-border rounded-sm p-3 text-xs text-on-surface-variant leading-relaxed mb-3">
                      <p className="mb-2">{MOCK_BLINDSPOT.logic}</p>
                      <div className="pt-2 border-t border-border">
                        <span className="font-semibold text-on-surface block mb-1">Recommended Action:</span>
                        <span>{MOCK_BLINDSPOT.action}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-on-surface text-white hover:bg-on-surface/90 h-8 text-xs rounded-sm font-medium">
                      Add to Plan
                    </Button>
                    <Button variant="outline" className="flex-1 border-outline-variant text-on-surface-variant h-8 text-xs rounded-sm">
                      Dismiss
                    </Button>
                  </div>
                </div>

                <div className="clinical-card p-4 border-dashed flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#76777d" strokeWidth="1.8" className="animate-spin" style={{ animationDuration: "3s" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </div>
                  <p className="text-xs text-outline">Analyzing ambient transcription for further patterns...</p>
                </div>
              </div>

              <div className="clinical-card p-4">
                <h3 className="font-heading text-xs font-semibold text-outline uppercase tracking-wider mb-3">Real-Time Transcript</h3>
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3 pr-3">
                    {MOCK_TRANSCRIPT.map((line, i) => (
                      <p key={i} className="text-xs text-on-surface-variant leading-relaxed">
                        <span className={`font-semibold ${line.speaker === "dr" ? "text-on-surface" : "text-clinical-blue"}`}>
                          {line.speaker === "dr" ? "Dr:" : "Pt:"}
                        </span>{" "}
                        {line.text}
                      </p>
                    ))}
                    {isListening && (
                      <div className="flex items-center gap-1.5 pt-2">
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
