"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAmbientToggle?: boolean;
  isListening?: boolean;
  onToggleListening?: () => void;
  actions?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showAmbientToggle = false,
  isListening = false,
  onToggleListening,
  actions,
}: HeaderProps) {
  return (
    <header className="h-13 bg-white border-b border-border flex items-center px-5 justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="font-heading text-base font-semibold text-on-surface truncate">{title}</h2>
        {subtitle && (
          <Badge variant="secondary" className="text-[10px] font-mono font-medium bg-surface-container-high text-on-surface-variant border-0 shrink-0">
            {subtitle}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showAmbientToggle && (
          <button
            onClick={onToggleListening}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isListening
                ? "bg-success-bg text-success border border-success/20"
                : "bg-surface-container-low text-outline border border-border"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-success animate-pulse" : "bg-outline"}`} />
            {isListening ? "Ambient Listening Active" : "Ambient Listening Off"}
          </button>
        )}

        {actions}

        <button className="relative p-2 rounded-md hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-semibold text-on-surface-variant border border-border">
          DR
        </div>
      </div>
    </header>
  );
}
