"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Patient {
  _id: string;
  name: string;
  age: number;
  sex: string;
  mrn: string;
  conditions: string[];
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  "Stable": "bg-success-bg text-success",
  "In-Review": "bg-clinical-blue-light text-clinical-blue",
  "Flagged": "bg-amber-bg text-amber",
  "Critical": "bg-alert-red-light text-alert-red-dark",
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const res = await fetch("/api/patients");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchPatients();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  }

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <>
      <Header title="Patients" subtitle={loading ? "..." : `${patients.length} registered`} />
      <div className="flex-1 overflow-y-auto p-5 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search patient name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clinical pl-9"
              />
            </div>
            <Button className="h-9 text-sm font-semibold gap-2 ml-4" style={{ background: "#00684a", color: "#ffffff" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Patient
            </Button>
          </div>

          {loading ? (
            <div className="clinical-card p-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full border-2 border-clinical-blue border-t-transparent animate-spin mb-3" />
              <p className="text-sm text-outline">Loading patients from database...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="clinical-card p-12 flex flex-col items-center justify-center text-center border-dashed">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c6c6cd" strokeWidth="1.5" className="mb-3">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              <p className="text-sm font-medium text-on-surface-variant mb-1">No patients found</p>
              <p className="text-xs text-outline mb-4">Seed the database to load demo patient records.</p>
              <Button
                onClick={handleSeed}
                disabled={seeding}
                className="bg-clinical-blue text-white hover:bg-clinical-blue/90 h-9 text-sm"
              >
                {seeding ? "Seeding..." : "Seed Database"}
              </Button>
            </div>
          ) : (
            <div className="clinical-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-outline uppercase tracking-wider hidden md:table-cell">MRN</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-outline uppercase tracking-wider hidden md:table-cell">Conditions</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-outline uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient, i) => (
                    <tr key={patient._id} className={`border-b border-border hover:bg-surface-container-low transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-surface"}`}>
                      <td className="px-4 py-3">
                        <Link href={`/patients/${patient._id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-semibold text-on-surface-variant shrink-0">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <span className="font-medium text-on-surface">{patient.name}</span>
                            <p className="text-[11px] text-outline">{patient.age}y, {patient.sex.charAt(0)}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-on-surface-variant hidden md:table-cell">#{patient.mrn}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {patient.conditions.map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px] font-medium">{c}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`status-chip ${STATUS_STYLES[patient.status] || "bg-surface-container-high text-on-surface-variant"}`}>{patient.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
