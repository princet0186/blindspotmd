"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { VoiceProfile, useVoiceFingerprint } from "./use-voice-fingerprint";

export interface TranscriptLine {
  speaker: "dr" | "pt";
  text: string;
  timestamp: string;
  confidence: number;
}

interface UseSpeechRecognitionOptions {
  voiceProfile: VoiceProfile | null;
  onTranscriptLine?: (line: TranscriptLine) => void;
  lang?: string;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export function useSpeechRecognition({
  voiceProfile,
  onTranscriptLine,
  lang = "en-US",
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { startCapture, stopCapture, identifySpeaker } = useVoiceFingerprint();

  const voiceProfileRef = useRef(voiceProfile);
  const onTranscriptLineRef = useRef(onTranscriptLine);
  const lastSpeakerRef = useRef<"dr" | "pt">("dr");

  useEffect(() => {
    voiceProfileRef.current = voiceProfile;
  }, [voiceProfile]);

  useEffect(() => {
    onTranscriptLineRef.current = onTranscriptLine;
  }, [onTranscriptLine]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const determineSpeaker = useCallback((): "dr" | "pt" => {
    const profile = voiceProfileRef.current;
    if (!profile) return "dr";

    const speaker = identifySpeaker(profile);
    lastSpeakerRef.current = speaker;
    return speaker;
  }, [identifySpeaker]);

  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();

        if (result.isFinal) {
          if (text.length > 0) {
            const speaker = determineSpeaker();
            const line: TranscriptLine = {
              speaker,
              text,
              timestamp: new Date().toISOString(),
              confidence: result[0].confidence || 1,
            };
            setTranscript((prev) => [...prev, line]);
            onTranscriptLineRef.current?.(line);
          }
          setInterimText("");
        } else {
          interim += text + " ";
        }
      }

      if (interim) {
        setInterimText(interim.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;

      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please enable microphone permissions.");
        shouldRestartRef.current = false;
        setIsListening(false);
        return;
      }

      if (event.error === "no-speech" || event.error === "network") {
        return;
      }

      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (!shouldRestartRef.current) return;
          try {
            recognition.start();
          } catch {
            setIsListening(false);
            shouldRestartRef.current = false;
          }
        }, 50);
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, [lang, determineSpeaker]);

  const startListening = useCallback(async () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    setError(null);
    shouldRestartRef.current = true;

    try {
      await startCapture();
    } catch {
    }

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setError("Failed to start speech recognition.");
      setIsListening(false);
      shouldRestartRef.current = false;
    }
  }, [startCapture, createRecognition]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
      }
    }

    stopCapture();
    setIsListening(false);
    setInterimText("");
  }, [stopCapture]);

  const overrideSpeaker = useCallback((index: number, speaker: "dr" | "pt") => {
    setTranscript((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], speaker };
      }
      return next;
    });
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setInterimText("");
  }, []);

  const setTranscriptData = useCallback((data: TranscriptLine[]) => {
    setTranscript(data);
  }, []);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        try {
          recognition.stop();
        } catch {
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimText,
    error,
    startListening,
    stopListening,
    overrideSpeaker,
    clearTranscript,
    setTranscriptData,
  };
}
