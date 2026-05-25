"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";

const NAV_GROUPS = [
  {
    header: "CLINICAL",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    items: [
      { label: "Active Consultation", href: "/consultation" },
      { label: "Patient Records", href: "/patients" },
      { label: "Referrals", href: "/referrals" },
    ],
  },
  {
    header: "SYSTEM",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    items: [
      { label: "Settings", href: "/settings" },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { doctor, logout } = useAuth();

  const initials = doctor?.name
    ? doctor.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DR";

  return (
    <div className="flex flex-col h-full bg-[#ffffff]" style={{ borderRight: "1px solid #e8edeb" }}>
      
      {/* Top Logo Section */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e8edeb" }}>
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" stroke="#00684a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="#00684a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L2 22" stroke="#00ed64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="font-heading text-[16px] font-bold tracking-tight" style={{ color: "#00684a" }}>
            BlindSpotMD
          </h1>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        
        {/* Main Dashboard Link (Mimicking "Project Overview") */}
        <div className="mb-6">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded transition-colors"
            style={{
              background: pathname === "/" ? "#e3fcef" : "transparent",
              color: pathname === "/" ? "#00684a" : "#001e2b",
            }}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </div>
            <span className="font-bold text-[13px]">Dashboard</span>
          </Link>
        </div>

        {/* Categorized Navigation */}
        <div className="space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.header}>
              <div className="flex items-center justify-between px-3 mb-2">
                <div className="flex items-center gap-2" style={{ color: "#00684a" }}>
                  {group.icon}
                  <p className="text-[11px] font-bold uppercase tracking-wider">{group.header}</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00684a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className="block px-3 py-1.5 ml-7 rounded transition-colors"
                      style={{
                        background: isActive ? "#e3fcef" : "transparent",
                        color: isActive ? "#00684a" : "#5c6c75",
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "13px"
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Profile Section */}
      <div className="p-4" style={{ borderTop: "1px solid #e8edeb", background: "#f9fbfa" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "#00684a", color: "#ffffff" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold truncate" style={{ color: "#001e2b" }}>{doctor?.name || "Doctor"}</p>
            <p className="text-[11px] truncate" style={{ color: "#5c6c75" }}>{doctor?.region || "Clinical User"}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded transition-colors hover:bg-gray-200"
            style={{ color: "#889397" }}
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-[#ffffff] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff]" style={{ borderTop: "1px solid #e8edeb" }}>
        <div className="flex items-center justify-around h-14 px-2">
          {NAV_GROUPS.flatMap((g) => g.items)
            .slice(0, 4)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2"
                style={{ color: "#5c6c75" }}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            ))}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="flex flex-col items-center gap-1 p-2" style={{ color: "#5c6c75" }}>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
              <span className="text-[10px] font-medium">More</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0 border-r border-[#e8edeb]">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
