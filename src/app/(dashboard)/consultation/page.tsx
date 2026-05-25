"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpeechRecognition, TranscriptLine } from "@/hooks/use-speech-recognition";
import { VoiceProfile } from "@/hooks/use-voice-fingerprint";
import { VoiceEnrollment } from "@/components/voice-enrollment";

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

const AUTO_SAVE_INTERVAL_MS = 5_000;

export default function ConsultationPage() {

  const [showLogic, setShowLogic] = useState(false);
  const [notes, setNotes] = useState("");
  const [vitals, setVitals] = useState(MOCK_PATIENT.vitals);


  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);


  const [consultationId, setConsultationId] = useState<string | null>(null);
  const lastSavedIndexRef = useRef(0);


  const {
    isListening,
    isSupported,
    transcript,
    interimText,
    error: speechError,
    startListening,
    stopListening,
    overrideSpeaker,
  } = useSpeechRecognition({
    voiceProfile,
  });

  const transcriptEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/doctor/voice-profile");
        if (res.ok) {
          const data = await res.json();
          if (data.voiceProfile?.enrolledAt) {
            setVoiceProfile(data.voiceProfile);
            localStorage.setItem("voiceProfile", JSON.stringify(data.voiceProfile));
            setProfileLoading(false);
            return;
          }
        }
      } catch {
  
      }


      const localProfile = localStorage.getItem("voiceProfile");
      if (localProfile) {
        try {
          setVoiceProfile(JSON.parse(localProfile));
        } catch {
          setShowEnrollment(true);
        }
      } else {
        setShowEnrollment(true);
      }
      setProfileLoading(false);
    }
    loadProfile();
  }, []);


  const ensureConsultation = useCallback(async () => {
    if (consultationId) return consultationId;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: null,
          vitals,
          soapNotes: notes,
          visitType: "CONSULTATION",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setConsultationId(data._id);
        return data._id;
      }
    } catch (err) {
      console.error("Failed to create consultation:", err);
    }
    return null;
  }, [consultationId, vitals, notes]);


  useEffect(() => {
    if (!isListening || !consultationId) return;

    const timer = setInterval(async () => {
      const newLines = transcript.slice(lastSavedIndexRef.current);
      if (newLines.length === 0) return;

      try {
        await fetch(`/api/consultations/${consultationId}/transcript`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newLines,
            soapNotes: notes,
          }),
        });
        lastSavedIndexRef.current = transcript.length;
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isListening, consultationId, transcript, notes]);


  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, interimText]);


  async function handleToggleListening() {
    if (isListening) {

      stopListening();
      if (consultationId) {
        const newLines = transcript.slice(lastSavedIndexRef.current);
        if (newLines.length > 0) {
          try {
            await fetch(`/api/consultations/${consultationId}/transcript`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ newLines, soapNotes: notes }),
            });
            lastSavedIndexRef.current = transcript.length;
          } catch {

          }
        }
      }
    } else {
      await ensureConsultation();
      startListening();
    }
  }


  async function handleEndSession() {
    stopListening();
    if (consultationId) {

      const newLines = transcript.slice(lastSavedIndexRef.current);
      try {
        await fetch(`/api/consultations/${consultationId}/transcript`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newLines, soapNotes: notes }),
        });
      } catch {

      }

      try {
        await fetch(`/api/consultations/${consultationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endedAt: new Date().toISOString() }),
        });
      } catch {
      }
    }
  }


  async function handleEnrolled(profile: VoiceProfile) {
    setVoiceProfile(profile);
    setShowEnrollment(false);


    localStorage.setItem("voiceProfile", JSON.stringify(profile));


    try {
      await fetch("/api/doctor/voice-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch {

    }
  }


  if (!profileLoading && showEnrollment) {
    return (
      <>
        <Header title="Active Consultation" />
        <div className="flex-1 flex items-center justify-center p-5">
          <VoiceEnrollment
            onEnrolled={handleEnrolled}
            onSkip={() => setShowEnrollment(false)}
          />
        </div>
      </>
    );
  }


  return (
    <>
      <Header
        title="Active Consultation"
        showAmbientToggle
        isListening={isListening}
        onToggleListening={handleToggleListening}
        actions={
          <Button
            onClick={handleEndSession}
            variant="outline"
            className="h-8 px-3 text-xs rounded-md border-outline-variant text-on-surface-variant"
          >
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


          {speechError && (
            <div className="blindspot-card p-3 mb-5 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cf4c35" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs text-alert-red font-medium">{speechError}</span>
            </div>
          )}

          {!isSupported && (
            <div className="amber-card p-3 mb-5 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c5800" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs text-amber font-medium">
                Speech recognition is not supported in this browser. Please use Google Chrome.
              </span>
            </div>
          )}


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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container-low text-on-surface-variant">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container-low text-on-surface-variant">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                  </button>
                </div>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isListening ? "Notes are being transcribed by Ambient Listening..." : "Start ambient listening or type notes manually..."}
                  className="min-h-[180px] border-input text-sm resize-none focus:border-clinical-blue focus:ring-1 focus:ring-clinical-blue"
                />

                {isListening && (
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006d3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                    <span className="text-success font-medium">Listening and transcribing...</span>
                    {interimText && (
                      <span className="text-outline italic truncate max-w-[300px]">&quot;{interimText}&quot;</span>
                    )}
                  </div>
                )}
              </div>

              <div className="clinical-card p-5">
                <h3 className="font-heading text-sm font-semibold text-on-surface mb-3">Orders &amp; Plan</h3>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
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

              <div className="clinical-card p-4" style={{ borderTop: "2px solid #00684a" }}>
                <div className="flex items-center gap-2 mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00684a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="font-heading text-sm font-semibold text-on-surface">BlindSpot Insights</span>
                </div>
                <p className="text-[11px] text-outline mb-3">Silent Second Opinion™ active.</p>

                <div className="blindspot-card p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cf4c35" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
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
                    className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-on-surface-variant border border-border rounded-md hover:bg-surface-container-low transition-colors mb-3"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {showLogic ? "Hide" : "Show"} Clinical Logic
                  </button>

                  {showLogic && (
                    <div className="bg-white border border-border rounded-md p-3 text-xs text-on-surface-variant leading-relaxed mb-3">
                      <p className="mb-2">{MOCK_BLINDSPOT.logic}</p>
                      <div className="pt-2 border-t border-border">
                        <span className="font-semibold text-on-surface block mb-1">Recommended Action:</span>
                        <span>{MOCK_BLINDSPOT.action}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 h-8 text-xs rounded-md font-semibold" style={{ background: "#00684a", color: "#ffffff" }}>
                      Add to Plan
                    </Button>
                    <Button variant="outline" className="flex-1 border-outline-variant text-on-surface-variant h-8 text-xs rounded-md">
                      Dismiss
                    </Button>
                  </div>
                </div>

                {isListening && (
                  <div className="clinical-card p-4 border-dashed flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#76777d" strokeWidth="1.8" className="animate-spin" style={{ animationDuration: "3s" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    </div>
                    <p className="text-xs text-outline">Analyzing ambient transcription for further patterns...</p>
                  </div>
                )}
              </div>


              <div className="clinical-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-xs font-semibold text-outline uppercase tracking-wider">
                    {isListening ? "Live Transcript" : "Real-Time Transcript"}
                  </h3>
                  {transcript.length > 0 && (
                    <span className="text-[10px] font-mono text-outline">
                      {transcript.length} line{transcript.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <ScrollArea className="h-[280px]">
                  <div className="space-y-3 pr-3">
                    {transcript.length === 0 && !isListening && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c6c6cd" strokeWidth="1.5" className="mb-2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                        <p className="text-xs text-outline">Enable Ambient Listening to start transcription.</p>
                      </div>
                    )}

                    {transcript.map((line, i) => (
                      <div key={i} className="group">
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          <button
                            onClick={() => overrideSpeaker(i, line.speaker === "dr" ? "pt" : "dr")}
                            className={`font-semibold cursor-pointer hover:underline ${line.speaker === "dr" ? "text-on-surface" : "text-clinical-blue"
                              }`}
                            title="Click to toggle speaker"
                          >
                            {line.speaker === "dr" ? "Dr:" : "Pt:"}
                          </button>{" "}
                          {line.text}
                        </p>
                        <span className="text-[9px] text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                          {new Date(line.timestamp).toLocaleTimeString()} • {Math.round(line.confidence * 100)}% conf
                        </span>
                      </div>
                    ))}


                    {interimText && (
                      <p className="text-xs text-outline italic animate-pulse">
                        {interimText}...
                      </p>
                    )}


                    {isListening && (
                      <div className="flex items-center gap-1.5 pt-2">
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1 h-1 rounded-full bg-success animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}

                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>


                <div className="mt-3 pt-3 border-t border-border">
                  {voiceProfile ? (
                    <div className="flex items-center gap-2 text-[10px] text-success">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="font-medium">Voice profile active — auto-tagging speakers</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowEnrollment(true)}
                      className="flex items-center gap-2 text-[10px] text-amber font-medium hover:underline"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      </svg>
                      No voice profile — all lines tagged as Doctor. Click to enroll.
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
