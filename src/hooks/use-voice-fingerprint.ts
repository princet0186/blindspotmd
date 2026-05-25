"use client";

import { useRef, useCallback, useState } from "react";

export interface VoiceProfile {
  avgPitch: number;
  avgEnergy: number;
  spectralCentroid: number;
  pitchRange: [number, number];
  energyRange: [number, number];
  enrolledAt: string;
}

interface VoiceFrame {
  pitch: number;
  energy: number;
  spectralCentroid: number;
  timestamp: number;
}

function detectPitch(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGoodCorrelation = false;

  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return 0;

  for (let offset = 50; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > 0.9 && correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
      foundGoodCorrelation = true;
    } else if (foundGoodCorrelation) {
      break;
    }
  }

  if (bestCorrelation > 0.01 && bestOffset > 0) {
    return sampleRate / bestOffset;
  }
  return 0;
}

function calcSpectralCentroid(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  let weightedSum = 0;
  let totalMagnitude = 0;
  const binWidth = sampleRate / fftSize;

  for (let i = 0; i < freqData.length; i++) {
    const magnitude = freqData[i];
    const frequency = i * binWidth;
    weightedSum += frequency * magnitude;
    totalMagnitude += magnitude;
  }

  return totalMagnitude > 0 ? weightedSum / totalMagnitude : 0;
}

function calcEnergy(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx] || 0;
}

export function useVoiceFingerprint() {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [enrolledProfile, setEnrolledProfile] = useState<VoiceProfile | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const continuousSamplerRef = useRef<NodeJS.Timeout | null>(null);

  const rollingBufferRef = useRef<VoiceFrame[]>([]);
  const BUFFER_DURATION_MS = 3000;

  const captureFrame = useCallback((): VoiceFrame | null => {
    const analyser = analyserRef.current;
    const ctx = audioContextRef.current;
    if (!analyser || !ctx) return null;

    const timeDomainData = new Float32Array(analyser.fftSize);
    const freqData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getFloatTimeDomainData(timeDomainData);
    analyser.getByteFrequencyData(freqData);

    const pitch = detectPitch(timeDomainData, ctx.sampleRate);
    const energy = calcEnergy(timeDomainData);
    const spectralCentroid = calcSpectralCentroid(freqData, ctx.sampleRate, analyser.fftSize);

    return { pitch, energy, spectralCentroid, timestamp: Date.now() };
  }, []);

  const startContinuousSampling = useCallback(() => {
    if (continuousSamplerRef.current) return;

    continuousSamplerRef.current = setInterval(() => {
      const frame = captureFrame();
      if (!frame) return;

      rollingBufferRef.current.push(frame);

      const cutoff = Date.now() - BUFFER_DURATION_MS;
      rollingBufferRef.current = rollingBufferRef.current.filter((f) => f.timestamp > cutoff);
    }, 60);
  }, [captureFrame]);

  const stopContinuousSampling = useCallback(() => {
    if (continuousSamplerRef.current) {
      clearInterval(continuousSamplerRef.current);
      continuousSamplerRef.current = null;
    }
  }, []);

  const getRecentSpeechFrames = useCallback((windowMs: number = 1500): VoiceFrame[] => {
    const cutoff = Date.now() - windowMs;
    return rollingBufferRef.current.filter(
      (f) => f.timestamp > cutoff && f.pitch > 50 && f.energy > 0.015
    );
  }, []);

  const startCapture = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    streamRef.current = stream;
    rollingBufferRef.current = [];

    startContinuousSampling();
  }, [startContinuousSampling]);

  const stopCapture = useCallback(() => {
    stopContinuousSampling();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    rollingBufferRef.current = [];
  }, [stopContinuousSampling]);

  const enrollVoice = useCallback(
    async (durationMs: number = 7000): Promise<VoiceProfile> => {
      setIsEnrolling(true);
      setEnrollProgress(0);

      await startCapture();

      const pitchSamples: number[] = [];
      const energySamples: number[] = [];
      const centroidSamples: number[] = [];
      const startTime = Date.now();

      return new Promise((resolve, reject) => {
        const collectSamples = () => {
          const elapsed = Date.now() - startTime;
          setEnrollProgress(Math.min((elapsed / durationMs) * 100, 100));

          if (elapsed >= durationMs) {
            stopCapture();
            setIsEnrolling(false);

            const validPitches = pitchSamples.filter((p) => p > 50 && p < 500);
            const validEnergies = energySamples.filter((e) => e > 0.01);
            const validCentroids = centroidSamples.filter((c) => c > 0);

            if (validPitches.length < 10) {
              reject(new Error("Not enough speech detected. Please try again and speak continuously."));
              return;
            }

            const sortedPitches = [...validPitches].sort((a, b) => a - b);
            const sortedEnergies = [...validEnergies].sort((a, b) => a - b);

            const profile: VoiceProfile = {
              avgPitch: validPitches.reduce((a, b) => a + b, 0) / validPitches.length,
              avgEnergy: validEnergies.reduce((a, b) => a + b, 0) / validEnergies.length,
              spectralCentroid: validCentroids.reduce((a, b) => a + b, 0) / validCentroids.length,
              pitchRange: [percentile(sortedPitches, 10), percentile(sortedPitches, 90)],
              energyRange: [percentile(sortedEnergies, 10), percentile(sortedEnergies, 90)],
              enrolledAt: new Date().toISOString(),
            };

            setEnrolledProfile(profile);
            resolve(profile);
            return;
          }

          const frame = captureFrame();
          if (frame) {
            pitchSamples.push(frame.pitch);
            energySamples.push(frame.energy);
            centroidSamples.push(frame.spectralCentroid);
          }

          animFrameRef.current = requestAnimationFrame(collectSamples);
        };

        animFrameRef.current = requestAnimationFrame(collectSamples);
      });
    },
    [startCapture, stopCapture, captureFrame]
  );

  const identifySpeaker = useCallback(
    (doctorProfile: VoiceProfile): "dr" | "pt" => {
      const recentFrames = getRecentSpeechFrames(1200);

      if (recentFrames.length < 2) return "dr";

      const avgPitch = recentFrames.reduce((s, f) => s + f.pitch, 0) / recentFrames.length;
      const avgCentroid = recentFrames.reduce((s, f) => s + f.spectralCentroid, 0) / recentFrames.length;

      const [pitchLow, pitchHigh] = doctorProfile.pitchRange;
      const pitchMargin = (pitchHigh - pitchLow) * 0.4;

      const pitchInRange = avgPitch >= (pitchLow - pitchMargin) && avgPitch <= (pitchHigh + pitchMargin);

      const centroidDiff = Math.abs(avgCentroid - doctorProfile.spectralCentroid) /
        (doctorProfile.spectralCentroid || 1);

      if (pitchInRange && centroidDiff < 0.3) return "dr";
      if (!pitchInRange) return "pt";
      if (centroidDiff > 0.35) return "pt";

      return "dr";
    },
    [getRecentSpeechFrames]
  );

  return {
    enrollVoice,
    identifySpeaker,
    captureFrame,
    getRecentSpeechFrames,
    startCapture,
    stopCapture,
    isEnrolling,
    enrollProgress,
    enrolledProfile,
    setEnrolledProfile,
  };
}
