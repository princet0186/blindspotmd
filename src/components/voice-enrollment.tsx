"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VoiceProfile, useVoiceFingerprint } from "@/hooks/use-voice-fingerprint";

interface VoiceEnrollmentProps {
  onEnrolled: (profile: VoiceProfile) => void;
  onSkip: () => void;
}

export function VoiceEnrollment({ onEnrolled, onSkip }: VoiceEnrollmentProps) {
  const { enrollVoice, isEnrolling, enrollProgress } = useVoiceFingerprint();
  const [phase, setPhase] = useState<"intro" | "recording" | "done" | "error">("intro");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleStartEnroll() {
    setPhase("recording");
    setErrorMsg("");
    try {
      const profile = await enrollVoice(5000);
      setPhase("done");
      onEnrolled(profile);
    } catch (err) {
      setPhase("error");
      setErrorMsg(err instanceof Error ? err.message : "Enrollment failed. Please try again.");
    }
  }

  return (
    <div className="clinical-card p-6 max-w-md mx-auto text-center">
      <div className="w-12 h-12 rounded-full bg-clinical-blue-light flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0051d5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </div>

      {(phase === "intro" || phase === "recording") && (
        <>
          <h3 className="font-heading text-base font-semibold text-on-surface mb-1">Voice Enrollment</h3>
          <p className="text-xs text-outline mb-4 leading-relaxed">
            To differentiate between doctor and patient voices, please read the following sentence aloud for 5 seconds:
          </p>
          <div className="bg-surface-container-low rounded-md p-3 mb-5 border border-border">
            <p className="text-sm text-on-surface italic leading-relaxed">
              &ldquo;The patient presents with a three-week history of persistent fatigue, unexplained weight loss,
              and cold intolerance, suggesting possible thyroid dysfunction.&rdquo;
            </p>
          </div>
          
          {phase === "intro" ? (
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleStartEnroll}
                className="bg-clinical-blue text-white hover:bg-clinical-blue/90 h-9 text-sm gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
                Start Recording
              </Button>
              <Button
                variant="outline"
                onClick={onSkip}
                className="h-9 text-sm border-outline-variant text-on-surface-variant"
              >
                Skip for Now
              </Button>
            </div>
          ) : (
            <div className="px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-alert-red animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-alert-red" />
                  Recording...
                </span>
                <span className="text-[10px] text-outline font-mono">{Math.round(enrollProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-clinical-blue to-blue-400 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${enrollProgress}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {phase === "done" && (
        <>
          <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006d3b" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3 className="font-heading text-base font-semibold text-success mb-1">Voice Enrolled</h3>
          <p className="text-xs text-outline">
            Your voice profile has been saved. The system will now auto-tag transcript lines.
          </p>
        </>
      )}

      {phase === "error" && (
        <>
          <h3 className="font-heading text-base font-semibold text-alert-red mb-1">Enrollment Failed</h3>
          <p className="text-xs text-outline mb-4">{errorMsg}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setPhase("intro");
                setErrorMsg("");
              }}
              className="bg-on-surface text-white hover:bg-on-surface/90 h-9 text-sm"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
              className="h-9 text-sm border-outline-variant text-on-surface-variant"
            >
              Skip
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
