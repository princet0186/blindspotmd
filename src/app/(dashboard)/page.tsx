"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";

interface DashboardStats {
  patients: number;
  consultations: number;
  flags: number;
  referrals: number;
  recentPatients: { _id: string; name: string; status: string; mrn: string }[];
}

export default function DashboardPage() {
  const { doctor } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-6 md:p-8">

          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-on-surface tracking-tight">
              {greeting()}, {doctor?.name?.split(" ").slice(-1)[0] || "Doctor"}
            </h1>
            <p className="text-sm text-outline mt-1">Here&apos;s your clinical overview for today.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Patients", value: stats?.patients ?? "—", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", color: "#00684a" },
              { label: "Consultations", value: stats?.consultations ?? "—", icon: "M22 12h-4l-3 9L9 3l-3 9H2", color: "#023430" },
              { label: "BlindSpot Flags", value: stats?.flags ?? "—", icon: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", color: "#cf4c35" },
              { label: "Referrals", value: stats?.referrals ?? "—", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", color: "#944f01" },
            ].map((s, i) => (
              <div
                key={i}
                className="clinical-card p-5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.color + "15" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.icon} />
                    </svg>
                  </div>
                </div>
                <span className="text-3xl font-bold text-on-surface block tracking-tight">{loading ? "—" : s.value}</span>
                <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            <div className="lg:col-span-8">
              <div className="clinical-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e8edeb" }}>
                  <div>
                    <h3 className="font-heading text-base font-bold text-on-surface">Active Consultation</h3>
                    <p className="text-xs text-outline mt-0.5">Start or continue a live session.</p>
                  </div>
                  <Link href="/consultation">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{ background: "#00684a", color: "#ffffff" }}
                    >
                      Open Session
                    </button>
                  </Link>
                </div>

                <div className="px-5 py-4">
                  <div className="flex items-center gap-5 flex-wrap">
                    <Link
                      href="/consultation"
                      className="flex items-center gap-3 p-3 rounded-lg flex-1 min-w-[200px] transition-all"
                      style={{ border: "1px solid #e8edeb" }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#e3fcef" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00684a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-on-surface block">Start Ambient Listening</span>
                        <span className="text-xs text-outline">Begin real-time transcription</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#889397" strokeWidth="2" className="ml-auto"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>

                    <Link
                      href="/patients"
                      className="flex items-center gap-3 p-3 rounded-lg flex-1 min-w-[200px] transition-all"
                      style={{ border: "1px solid #e8edeb" }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#f3f7f5" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c6c75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" y1="8" x2="19" y2="14" />
                          <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-on-surface block">View Patient Records</span>
                        <span className="text-xs text-outline">Browse longitudinal data</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#889397" strokeWidth="2" className="ml-auto"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="clinical-card p-5">
                <h3 className="font-heading text-base font-bold text-on-surface mb-1">Integrations</h3>
                <p className="text-xs text-outline mb-4">Connected services powering your clinical AI.</p>
                <div className="space-y-3">
                  {[
                    { name: "Google Gemini", desc: "Reasoning engine", status: "active" },
                    { name: "MongoDB Atlas", desc: "Data persistence", status: "active" },
                    { name: "Arize AI", desc: "Observability", status: "pending" },
                  ].map((svc) => (
                    <div key={svc.name} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ border: "1px solid #e8edeb" }}>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: svc.status === "active" ? "#00ed64" : "#c1cdd1" }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-on-surface block">{svc.name}</span>
                        <span className="text-[11px] text-outline">{svc.desc}</span>
                      </div>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: svc.status === "active" ? "#e3fcef" : "#f3f7f5",
                          color: svc.status === "active" ? "#00684a" : "#889397",
                        }}
                      >
                        {svc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="clinical-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e8edeb" }}>
                  <h3 className="font-heading text-base font-bold text-on-surface">Recent Patients</h3>
                  <Link href="/patients" className="text-xs font-semibold" style={{ color: "#00684a" }}>View all &rarr;</Link>
                </div>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-2" style={{ borderColor: "#00684a", borderTopColor: "transparent" }} />
                    <p className="text-xs text-outline">Loading...</p>
                  </div>
                ) : !stats?.recentPatients?.length ? (
                  <div className="p-8 text-center" style={{ borderTop: "1px dashed #e8edeb" }}>
                    <p className="text-sm text-outline mb-3">No patients in the database yet.</p>
                    <SeedButton />
                  </div>
                ) : (
                  <div>
                    {stats.recentPatients.map((p, i) => (
                      <Link
                        key={p._id}
                        href={`/patients/${p._id}`}
                        className="flex items-center gap-3 px-5 py-3 transition-colors"
                        style={{
                          borderBottom: i < stats.recentPatients.length - 1 ? "1px solid #e8edeb" : "none",
                          background: i % 2 === 0 ? "#ffffff" : "#f9fbfa",
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "#e3fcef", color: "#00684a" }}>
                          {p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-on-surface block">{p.name}</span>
                          <span className="text-[11px] text-outline">MRN: #{p.mrn}</span>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: p.status === "Critical" ? "#ffeae5" : p.status === "Flagged" ? "#fff3cd" : "#e3fcef",
                            color: p.status === "Critical" ? "#cf4c35" : p.status === "Flagged" ? "#944f01" : "#00684a",
                          }}
                        >
                          {p.status}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c1cdd1" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="clinical-card p-5" style={{ borderTop: "2px solid #00684a" }}>
                <h3 className="font-heading text-base font-bold text-on-surface mb-1">Clinical AI Status</h3>
                <p className="text-xs text-outline mb-4">Real-time system diagnostics.</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-on-surface">Ambient Capture</span>
                      <span className="text-[10px] font-semibold" style={{ color: "#00684a" }}>Ready</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#e8edeb" }}>
                      <div className="h-full rounded-full" style={{ width: "100%", background: "#00ed64" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-on-surface">Gemini Reasoning</span>
                      <span className="text-[10px] font-semibold" style={{ color: "#944f01" }}>Stage 6</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#e8edeb" }}>
                      <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #00ed64, #00684a)" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-on-surface">Arize Observability</span>
                      <span className="text-[10px] font-semibold" style={{ color: "#889397" }}>Pending</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#e8edeb" }}>
                      <div className="h-full rounded-full" style={{ width: "0%", background: "#c1cdd1" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function SeedButton() {
  const [seeding, setSeeding] = useState(false);

  async function handleSeed() {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      window.location.reload();
    } catch {
    } finally {
      setSeeding(false);
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={seeding}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{ background: "#00684a", color: "#ffffff", opacity: seeding ? 0.6 : 1 }}
    >
      {seeding ? "Seeding..." : "Seed Database"}
    </button>
  );
}
