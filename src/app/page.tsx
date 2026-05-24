import React from "react";
import { Button } from "@/components/ui/button";

export default function ClinicalDashboard() {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <aside className="hidden md:flex flex-col w-[280px] bg-white border-r border-[#e0e3e5] shrink-0">
        <div className="p-4 border-b border-[#e0e3e5]">
          <h1 className="font-heading text-xl font-bold tracking-tight text-[#000000]">GhostDoctor</h1>
          <p className="text-xs font-medium text-[#76777d]">CLINICAL TERMINAL v1.0</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-[#76777d] uppercase tracking-wider mb-2">Patient Queue</h2>
            <div className="space-y-2">
              <div className="p-3 bg-[#f2f4f6] rounded-md border border-[#e0e3e5]">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Ramesh K.</span>
                  <span className="text-[10px] bg-[#dbe1ff] text-[#00174b] px-2 py-0.5 rounded-full font-semibold">WAITING</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1">45M • Fever, Chills</p>
              </div>
              <div className="p-3 bg-white rounded-md border border-[#e0e3e5]">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Sunita D.</span>
                  <span className="text-[10px] bg-[#f2f4f6] text-[#45464d] px-2 py-0.5 rounded-full font-semibold">10:30 AM</span>
                </div>
                <p className="text-xs text-[#45464d] mt-1">32F • Routine Checkup</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-[#e0e3e5]">
          <Button className="w-full bg-[#000000] text-white hover:bg-[#191c1e] rounded-md h-10 text-sm font-medium">
            New Consultation
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white border-b border-[#e0e3e5] flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <span className="font-heading font-semibold text-lg">Active Consultation: Ramesh K.</span>
            <span className="text-xs font-medium bg-[#e6e8ea] text-[#45464d] px-2 py-1 rounded">ID: 994-2A</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
              <span className="text-xs font-medium text-[#ba1a1a]">AMBIENT LISTENING</span>
            </div>
            <Button variant="outline" className="h-8 px-3 text-xs rounded-md border-[#c6c6cd]">End Session</Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
            
            <div className="md:col-span-8 space-y-6">
              <section className="bg-white rounded-md border border-[#e0e3e5] p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-[#45464d] mb-4 uppercase tracking-wide">Clinical Notes</h3>
                <textarea 
                  className="w-full h-32 p-3 border border-[#c6c6cd] rounded-sm text-sm focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] resize-none"
                  placeholder="Patient complains of intermittent fever for 3 days..."
                />
              </section>

              <section className="bg-white rounded-md border border-[#e0e3e5] p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-[#45464d] mb-4 uppercase tracking-wide">Vitals Entry</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#76777d] mb-1">BP (mmHg)</label>
                    <input type="text" className="w-full border border-[#c6c6cd] rounded-sm p-2 text-sm focus:border-[#0051d5] outline-none" placeholder="120/80" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#76777d] mb-1">Heart Rate (bpm)</label>
                    <input type="text" className="w-full border border-[#c6c6cd] rounded-sm p-2 text-sm focus:border-[#0051d5] outline-none" placeholder="72" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#76777d] mb-1">Temp (°F)</label>
                    <input type="text" className="w-full border border-[#c6c6cd] rounded-sm p-2 text-sm focus:border-[#0051d5] outline-none" placeholder="98.6" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#76777d] mb-1">SpO2 (%)</label>
                    <input type="text" className="w-full border border-[#c6c6cd] rounded-sm p-2 text-sm focus:border-[#0051d5] outline-none" placeholder="99" />
                  </div>
                </div>
              </section>
            </div>

            <div className="md:col-span-4 space-y-6">
              <section className="bg-[#fffbfa] rounded-md border-l-4 border-l-[#ba1a1a] border-y border-r border-[#e0e3e5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[#ba1a1a] uppercase tracking-wider">Diagnostic Blind Spot</h3>
                  <span className="text-[10px] font-mono font-bold bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded">CONF: 87%</span>
                </div>
                <p className="text-sm text-[#191c1e] font-medium leading-snug mb-3">
                  Symptom combination (intermittent fever + chills) in endemic region suggests high risk of Malaria.
                </p>
                <div className="bg-white border border-[#e0e3e5] p-2 rounded-sm text-xs text-[#45464d] mb-3">
                  <span className="font-semibold block mb-1">Recommended Action:</span>
                  Order peripheral blood smear or rapid diagnostic test (RDT) before broad-spectrum antibiotics.
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-[#ba1a1a] text-white hover:bg-[#93000a] h-8 text-xs rounded-sm">Add to Plan</Button>
                  <Button variant="outline" className="flex-1 border-[#c6c6cd] text-[#45464d] h-8 text-xs rounded-sm">Dismiss</Button>
                </div>
              </section>

              <section className="bg-white rounded-md border border-[#e0e3e5] p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-[#76777d] uppercase tracking-wider mb-3">Real-Time Transcript</h3>
                <div className="h-48 overflow-y-auto space-y-3 pr-2">
                  <p className="text-xs text-[#45464d]"><span className="font-semibold text-[#191c1e]">Dr:</span> So how long have you had the fever?</p>
                  <p className="text-xs text-[#45464d]"><span className="font-semibold text-[#0051d5]">Pt:</span> It started three days ago, mostly at night.</p>
                  <p className="text-xs text-[#45464d]"><span className="font-semibold text-[#191c1e]">Dr:</span> Any shivering or sweating?</p>
                  <p className="text-xs text-[#45464d]"><span className="font-semibold text-[#0051d5]">Pt:</span> Yes, very bad shivering.</p>
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
