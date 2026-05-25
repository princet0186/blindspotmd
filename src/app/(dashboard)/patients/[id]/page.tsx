"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Diagnostic {
  panel: string;
  date: string;
  result: string;
  refRange: string;
  abnormal: boolean;
}

interface Flag {
  _id: string;
  consultationId: string;
  suggestion: string;
  confidence: number;
  severity: string;
  triggeredBy: string[];
  clinicalLogic: string;
  status: string;
  createdAt: string;
}

interface ConsultationRecord {
  _id: string;
  visitType: string;
  summary: string;
  soapNotes: string;
  startedAt: string;
  vitals: { bp: string; hr: string; spo2: string; temp: string };
}

interface PatientData {
  _id: string;
  name: string;
  age: number;
  sex: string;
  mrn: string;
  dob: string;
  conditions: string[];
  status: string;
}

interface PatientResponse {
  patient: PatientData;
  consultations: ConsultationRecord[];
  flags: Flag[];
  diagnostics: Diagnostic[];
}

const SUB_NAV = [
  { key: "longitudinal", label: "Longitudinal Record", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { key: "labs", label: "Lab Results", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { key: "medications", label: "Medications", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg> },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}

export default function PatientRecordPage() {
  const params = useParams();
  const [data, setData] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("longitudinal");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/patients/${params.id}`);
        if (!res.ok) {
          setError("Patient not found");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header title="Patient Record" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-clinical-blue border-t-transparent animate-spin" />
            <p className="text-sm text-outline">Loading patient record...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header title="Patient Record" />
        <div className="flex-1 flex items-center justify-center">
          <div className="clinical-card p-8 text-center border-dashed">
            <p className="text-sm font-medium text-on-surface-variant">{error || "No data available"}</p>
          </div>
        </div>
      </>
    );
  }

  const { patient, consultations, flags, diagnostics } = data;
  const totalFlags = flags.length;
  const acceptedFlags = flags.filter((f) => f.status === "accepted").length;

  const vitalHistory = consultations
    .filter((c) => c.vitals?.bp)
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  const chartWidth = 600;
  const chartHeight = 180;
  const padX = 40;
  const padY = 20;
  const plotW = chartWidth - padX * 2;
  const plotH = chartHeight - padY * 2;
  const toX = (i: number) => padX + (i / Math.max(vitalHistory.length - 1, 1)) * plotW;
  const toY = (val: number, min: number, max: number) => padY + plotH - ((val - min) / (max - min)) * plotH;

  const systolicVals = vitalHistory.map((c) => parseInt(c.vitals.bp.split("/")[0]) || 0);
  const diastolicVals = vitalHistory.map((c) => parseInt(c.vitals.bp.split("/")[1]) || 0);
  const months = vitalHistory.map((c) => new Date(c.startedAt).toLocaleDateString("en-US", { month: "short" }));

  const sysPoints = systolicVals.map((v, i) => `${toX(i)},${toY(v, 60, 180)}`).join(" ");
  const diaPoints = diastolicVals.map((v, i) => `${toX(i)},${toY(v, 60, 180)}`).join(" ");

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <>
      <Header title="Patient Record" subtitle={`#${patient.mrn}`} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[220px] shrink-0">
              <div className="mb-4">
                <p className="label-clinical">Active Patient</p>
                <h2 className="font-heading text-lg font-bold text-on-surface">{patient.name}</h2>
                <p className="text-xs text-outline mt-0.5">ID: #{patient.mrn} &bull; DOB: {patient.dob || "N/A"}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {patient.conditions.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px] font-medium bg-surface-container-high">{c}</Badge>
                  ))}
                </div>
              </div>
              <nav className="space-y-0.5">
                {SUB_NAV.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                      activeTab === item.key
                        ? "bg-clinical-blue-light text-clinical-blue border-l-[3px] border-clinical-blue -ml-[3px] pl-[15px]"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-on-surface">Longitudinal Record</h3>
                  <p className="text-sm text-outline">Comprehensive clinical history and AI intervention tracking.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-9 text-xs border-outline-variant">Export Full Record</Button>
                  <Button className="h-9 text-xs gap-1.5" style={{ background: "#00684a", color: "#ffffff" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Note
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-8 space-y-5">
                  {vitalHistory.length > 0 && (
                    <div className="clinical-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-heading text-sm font-semibold">Vital Trends</h4>
                        <div className="flex items-center gap-4 text-xs text-outline">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-clinical-blue rounded-full" />Systolic</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-outline-variant rounded-full" />Diastolic</span>
                        </div>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-h-[200px]">
                          {[60, 100, 140, 180].map((v) => (
                            <g key={v}>
                              <line x1={padX} y1={toY(v, 60, 180)} x2={chartWidth - padX} y2={toY(v, 60, 180)} stroke="#e0e3e5" strokeWidth="1" />
                              <text x={padX - 8} y={toY(v, 60, 180) + 4} textAnchor="end" fill="#76777d" fontSize="10">{v}</text>
                            </g>
                          ))}
                          {months.map((m, i) => (
                            <text key={`${m}-${i}`} x={toX(i)} y={chartHeight - 4} textAnchor="middle" fill="#76777d" fontSize="10">{m}</text>
                          ))}
                          <polyline points={sysPoints} fill="none" stroke="#00684a" strokeWidth="2" strokeLinejoin="round" />
                          <polyline points={diaPoints} fill="none" stroke="#c6c6cd" strokeWidth="2" strokeLinejoin="round" />
                          {systolicVals.map((v, i) => (
                            <circle key={`s-${i}`} cx={toX(i)} cy={toY(v, 60, 180)} r="3" fill="#00684a" />
                          ))}
                          {diastolicVals.map((v, i) => (
                            <circle key={`d-${i}`} cx={toX(i)} cy={toY(v, 60, 180)} r="3" fill="#c6c6cd" />
                          ))}
                        </svg>
                      </div>
                    </div>
                  )}

                  {diagnostics.length > 0 && (
                    <div className="clinical-card overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                        <h4 className="font-heading text-sm font-semibold">Recent Diagnostics</h4>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-surface-container-low">
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-outline uppercase tracking-wider">Panel</th>
                            <th className="text-left px-5 py-2.5 text-xs font-semibold text-outline uppercase tracking-wider">Date</th>
                            <th className="text-right px-5 py-2.5 text-xs font-semibold text-outline uppercase tracking-wider">Result</th>
                            <th className="text-right px-5 py-2.5 text-xs font-semibold text-outline uppercase tracking-wider">Ref Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diagnostics.map((d: Diagnostic, i: number) => (
                            <tr key={`${d.panel}-${i}`} className={`border-b border-border ${i % 2 === 0 ? "bg-white" : "bg-surface"}`}>
                              <td className="px-5 py-2.5 font-semibold text-on-surface">{d.panel}</td>
                              <td className="px-5 py-2.5 text-on-surface-variant">{d.date}</td>
                              <td className={`px-5 py-2.5 text-right font-semibold ${d.abnormal ? "text-alert-red" : "text-on-surface"}`}>
                                {d.result} {d.abnormal && "↑"}
                              </td>
                              <td className="px-5 py-2.5 text-right text-outline">{d.refRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="clinical-card p-5">
                    <h4 className="font-heading text-sm font-semibold mb-4">Visit Timeline</h4>
                    {consultations.length === 0 ? (
                      <div className="border border-dashed border-outline-variant rounded-md p-6 text-center">
                        <p className="text-xs text-outline">No consultations on record.</p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {consultations.map((visit, i) => {
                          const hasFlagForVisit = flags.some((f) => f.consultationId === visit._id);
                          return (
                            <div key={visit._id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                  hasFlagForVisit ? "bg-alert-red" : visit.visitType === "FOLLOW-UP" ? "bg-clinical-blue" : "bg-outline-variant"
                                }`} />
                                {i < consultations.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                              </div>
                              <div className="pb-6 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-semibold text-clinical-blue uppercase tracking-wider">{formatDate(visit.startedAt)}</span>
                                  <span className="text-[10px] text-outline">&bull;</span>
                                  <span className="text-[10px] font-medium text-outline uppercase">{visit.visitType}</span>
                                </div>
                                {hasFlagForVisit && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-alert-red mb-1">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    </svg>
                                    AI BlindSpot Flagged
                                  </span>
                                )}
                                <p className="text-xs text-on-surface-variant leading-relaxed">{visit.summary || visit.soapNotes}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-5">
                  <div className="clinical-card p-5">
                    <h4 className="font-heading text-sm font-semibold mb-1">AI Interventions</h4>
                    <p className="text-xs text-outline mb-4">Lifetime BlindSpot Flags</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="border border-border rounded-md p-3 text-center">
                        <span className="text-2xl font-bold text-on-surface block">{totalFlags}</span>
                        <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Total Flags</span>
                      </div>
                      <div className="border border-border rounded-md p-3 text-center">
                        <span className="text-2xl font-bold text-clinical-blue block">{acceptedFlags}</span>
                        <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Accepted</span>
                      </div>
                    </div>
                    {flags.length === 0 ? (
                      <div className="border border-dashed border-outline-variant rounded-md p-4 text-center">
                        <p className="text-xs text-outline">No AI flags for this patient yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {flags.map((flag) => (
                          <div key={flag._id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                            <div className={`w-0.5 h-full min-h-[40px] rounded-full shrink-0 mt-0.5 ${
                              flag.status === "accepted" ? "bg-alert-red" : "bg-outline-variant"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-semibold ${flag.status === "accepted" ? "text-alert-red" : "text-on-surface"}`}>
                                {flag.suggestion}
                              </span>
                              <p className="text-[11px] text-outline mt-0.5">
                                {formatDate(flag.createdAt)} &bull; {flag.triggeredBy[0] || flag.severity}
                              </p>
                            </div>
                            <div className="shrink-0 mt-1">
                              {flag.status === "accepted" ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006d3b" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#76777d" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
