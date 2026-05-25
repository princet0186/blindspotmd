"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

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
  const { doctor } = useAuth();

  const initials = doctor?.name
    ? doctor.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DR";

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="font-heading text-[15px] font-bold text-on-surface truncate tracking-tight">{title}</h2>
        {subtitle && (
          <Badge variant="secondary" className="text-[10px] font-mono font-medium bg-surface-container text-on-surface-variant border-0 shrink-0 rounded-md">
            {subtitle}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showAmbientToggle && (
          <button
            onClick={onToggleListening}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: isListening ? "#e3fcef" : "#f3f7f5",
              color: isListening ? "#00684a" : "#5c6c75",
              border: isListening ? "1px solid rgba(0, 104, 74, 0.2)" : "1px solid #e8edeb",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: isListening ? "#00ed64" : "#889397",
                boxShadow: isListening ? "0 0 6px rgba(0, 237, 100, 0.5)" : "none",
                animation: isListening ? "subtle-pulse 2s ease-in-out infinite" : "none",
              }}
            />
            {isListening ? "Ambient Listening Active" : "Ambient Listening Off"}
          </button>
        )}

        {actions}

        <button className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold tracking-wide"
          style={{ background: "#001e2b", color: "#00ed64" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
