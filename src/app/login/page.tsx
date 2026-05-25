"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) router.replace("/");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: mode === "signup" ? name : undefined,
          action: mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.replace("/");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ background: "#001e2b", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(0,237,100,0.2)", borderTop: "3px solid #00ed64", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      height: "100vh", 
      background: "linear-gradient(135deg, #023430 0%, #001e2b 100%)", 
      display: "flex", 
      flexDirection: mode === "signup" ? "row-reverse" : "row",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Background pattern for the entire screen */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="12" fill="none" stroke="#00ed64" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circles)"/>
        </svg>
      </div>

      {/* Form Container (Takes up a fixed blocky space on one side) */}
      <div style={{ 
        flex: "0 0 540px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "24px",
        zIndex: 10
      }}>
        <div style={{ 
          background: "#ffffff", 
          width: "100%", 
          height: "600px",
          borderRadius: 16, 
          padding: "32px 40px", 
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          
          <div style={{ width: "100%" }}>
            {/* Custom Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="#00684a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="#00684a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L2 22" stroke="#00ed64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: "#001e2b", fontWeight: 700, fontSize: 20, letterSpacing: "-0.03em", fontFamily: "var(--font-heading)" }}>
              BlindSpotMD
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#001e2b", marginBottom: 4, letterSpacing: "-0.03em", fontFamily: "var(--font-heading)" }}>
            {mode === "login" ? "Log in to your account" : "Create an account"}
          </h1>
          
          <div style={{ fontSize: 14, color: "#5c6c75", marginBottom: 24, fontWeight: 500 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ color: "#0051d5", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </div>

          {error && (
            <div style={{ background: "#ffeae5", border: "1px solid rgba(207,76,53,0.2)", borderRadius: 6, padding: "12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cf4c35" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span style={{ fontSize: 13, color: "#cf4c35", fontWeight: 600 }}>{error}</span>
            </div>
          )}

          <button
            type="button"
            style={{
              width: "100%",
              padding: "12px",
              background: "#ffffff",
              border: "1px solid #c1cdd1",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: "#5c6c75",
              marginBottom: 20,
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f9fbfa"}
            onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign {mode === "login" ? "in" : "up"} with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#e8edeb" }} />
            <span style={{ fontSize: 12, color: "#889397", fontWeight: 500 }}>Or with email and password</span>
            <div style={{ flex: 1, height: 1, background: "#e8edeb" }} />
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#001e2b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px 16px", fontSize: 14, color: "#001e2b", background: "#ffffff", border: "1px solid #c1cdd1", borderRadius: 6, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#00684a"}
                  onBlur={(e) => e.target.style.borderColor = "#c1cdd1"}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#001e2b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "10px 16px", fontSize: 14, color: "#001e2b", background: "#ffffff", border: "1px solid #c1cdd1", borderRadius: 6, outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#00684a"}
                onBlur={(e) => e.target.style.borderColor = "#c1cdd1"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#001e2b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  style={{ width: "100%", padding: "10px 40px 10px 16px", fontSize: 14, color: "#001e2b", background: "#ffffff", border: "1px solid #c1cdd1", borderRadius: 6, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#00684a"}
                  onBlur={(e) => e.target.style.borderColor = "#c1cdd1"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, color: "#889397" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                background: "#00684a",
                border: "none",
                borderRadius: 6,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = "#005a40" }}
              onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = "#00684a" }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in to BlindSpotMD" : "Create account"}
            </button>
          </form>
          </div>
        </div>
      </div>

      {/* Info Section (Takes up the rest of the full screen) */}
      <div style={{
        flex: 1,
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: mode === "signup" ? "flex-end" : "flex-start",
        textAlign: mode === "signup" ? "right" : "left",
        position: "relative",
        zIndex: 5
      }}>
        
        {/* Large Decorative Graphic (brackets-like shape) */}
        <div style={{ 
          position: "absolute", 
          right: mode === "signup" ? "auto" : "-10%", 
          left: mode === "signup" ? "-10%" : "auto", 
          top: "10%", 
          opacity: 0.15,
          transform: mode === "signup" ? "scaleX(-1)" : "none"
        }}>
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V22M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22M4 12H20M12 4C14.2091 4 16 7.58172 16 12C16 16.4183 14.2091 20 12 20C9.79086 20 8 16.4183 8 12C8 7.58172 9.79086 4 12 4Z" stroke="#00ed64" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
          <h2 style={{ fontSize: 48, fontWeight: 700, color: "#ffffff", marginBottom: 20, letterSpacing: "-0.02em", lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
            The Silent Second Opinion™
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.6 }}>
            AI-powered diagnostic safety net designed for clinical environments. Practice medicine with total confidence, zero disruption.
          </p>
          
          <a href="#" style={{ color: "#ffffff", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "2px solid #00ed64", paddingBottom: 4 }}>
            Learn more about our technology
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
      
    </div>
  );
}
