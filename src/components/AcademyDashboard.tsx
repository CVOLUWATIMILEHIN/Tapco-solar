/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { FormEvent } from "react";
import { 
  Flame, Trophy, BookOpen, Award, Sparkles, Send, Play, Download, HelpCircle, 
  Settings, CheckCircle, MapPin, Users, Calendar, ArrowRight, Video, FileText, Check, Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Course, StudentProfile } from "../types";

interface AcademyDashboardProps {
  student: StudentProfile;
  dashboardTab: "home" | "courses" | "certificates" | "assignments" | "downloads" | "live" | "community" | "messages" | "achievements" | "simulator" | "payments" | "settings" | "progress" | "profile";
  setDashboardTab: (tab: any) => void;
  xpPoints: number;
  streakDays: number;
  unlockedBadges: string[];
  selectedCourse: Course;
  setCurrentView: (view: any) => void;
  setActiveLessonIndex: (idx: number) => void;
  
  // Simulator props
  simulatorGoal: { clinic: string; loadRequirement: number; dailyEnergyUsage: number; sunHours: number };
  selectedPanelType: string;
  setSelectedPanelType: (val: string) => void;
  selectedInverterType: string;
  setSelectedInverterType: (val: string) => void;
  selectedBatteryType: string;
  setSelectedBatteryType: (val: string) => void;
  cablesConnected: boolean;
  setCablesConnected: (val: boolean) => void;
  simulatorMessage: { status: "idle" | "success" | "error"; text: string };
  handleRunSimulatorTest: () => void;

  // AI Tutor props
  chatMessage: string;
  setChatMessage: (val: string) => void;
  aiHistory: Array<{ role: "user" | "assistant"; content: string }>;
  isAiLoading: boolean;
  handleSendAiMessage: (e?: FormEvent, quickPrompt?: string) => void;

  // Webinar props
  academyWebinars: Array<{ id: string; title: string; date: string; instructor: string; status: string }>;
  activeBroadcastWebinar: string | null;
  setActiveBroadcastWebinar: (val: string | null) => void;
  webinarChatText: string;
  setWebinarChatText: (val: string) => void;
  webinarChatHistory: Array<{ sender: string; text: string }>;
  setWebinarChatHistory: (updater: any) => void;
}

export default function AcademyDashboard({
  student,
  dashboardTab,
  setDashboardTab,
  xpPoints,
  streakDays,
  unlockedBadges,
  selectedCourse,
  setCurrentView,
  setActiveLessonIndex,
  
  // Simulator
  simulatorGoal,
  selectedPanelType,
  setSelectedPanelType,
  selectedInverterType,
  setSelectedInverterType,
  selectedBatteryType,
  setSelectedBatteryType,
  cablesConnected,
  setCablesConnected,
  simulatorMessage,
  handleRunSimulatorTest,

  // AI Tutor
  chatMessage,
  setChatMessage,
  aiHistory,
  isAiLoading,
  handleSendAiMessage,

  // Webinar
  academyWebinars,
  activeBroadcastWebinar,
  setActiveBroadcastWebinar,
  webinarChatText,
  setWebinarChatText,
  webinarChatHistory,
  setWebinarChatHistory
}: AcademyDashboardProps) {

  // Custom States for Assignments, Progress, Profile, Payments
  const [selectedFile, setSelectedFile] = React.useState<any | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [assignments, setAssignments] = React.useState([
    { id: "task-1", title: "Load Auditing & Sizing Worksheet", status: "Graded", score: "95/100", filename: "chinedu_load_audit.xlsx", date: "June 12, 2026", feedback: "Excellent calculation of surge induction margins." },
    { id: "task-2", title: "PV Array String Layout Schematic", status: "Pending Review", score: "--", filename: "chinedu_array_string_layout.dwg", date: "June 20, 2026", feedback: "Under initial evaluation by Engr. Louis." },
    { id: "task-3", title: "Three-Phase Vector Balancing Matrix", status: "Not Started", score: "--", filename: "", date: "", feedback: "Submit before July 28, 2026." }
  ]);

  const [profName, setProfName] = React.useState(student.name);
  const [profEmail, setProfEmail] = React.useState(student.email);
  const [profPhone, setProfPhone] = React.useState("0803 123 4567");
  const [profCountry, setProfCountry] = React.useState("Nigeria");
  const [profState, setProfState] = React.useState("Lagos");
  const [profOccupation, setProfOccupation] = React.useState("Solar Installer");
  const [profExperience, setProfExperience] = React.useState("Intermediate");
  const [profileSavedMsg, setProfileSavedMsg] = React.useState("");

  const [selectedInvoice, setSelectedInvoice] = React.useState<any | null>(null);

  // Load custom meta from localStorage if exists
  React.useEffect(() => {
    const customMeta = localStorage.getItem(`tapco_student_meta_${student.id}`);
    if (customMeta) {
      try {
        const parsed = JSON.parse(customMeta);
        if (parsed.phone) setProfPhone(parsed.phone);
        if (parsed.country) setProfCountry(parsed.country);
        if (parsed.state) setProfState(parsed.state);
        if (parsed.occupation) setProfOccupation(parsed.occupation);
        if (parsed.experience) setProfExperience(parsed.experience);
      } catch (err) {
        console.error("Failed to parse custom student meta", err);
      }
    }
  }, [student.id]);

  const mockInvoices = [
    { ref: "TXN-TAPCO-49271508", date: student.registrationDate || "June 15, 2026", item: selectedCourse.title, amount: selectedCourse.price, method: "Debit Card", status: "Paid" },
    { ref: "TXN-TAPCO-20182410", date: "May 05, 2026", item: "Solar Safety Toolkit & Manuals Pre-order", amount: 75000, method: "Bank Wire Transfer", status: "Paid" }
  ];

  // Sizing Options
  const panelOptions = [
    { id: "panels-4x", name: "4x 450W Monocrystalline Array", desc: "1.8kWp output. Generates ~9,000Wh daily." },
    { id: "panels-10x", name: "10x 450W Premium Array", desc: "4.5kWp output. Generates ~22,500Wh daily." },
    { id: "panels-20x", name: "20x 450W Industrial Array", desc: "9.0kWp output. Generates ~45,000Wh daily." }
  ];

  const inverterOptions = [
    { id: "inverter-3kva", name: "3kVA Smart Hybrid Inverter", desc: "Max continuous draw: 3,000W." },
    { id: "inverter-5kva", name: "5kVA Multi-Core Hybrid Inverter", desc: "Max continuous draw: 5,000W." },
    { id: "inverter-10kva", name: "10kVA Three-Phase Industrial Inverter", desc: "Max continuous draw: 10,000W." }
  ];

  const batteryOptions = [
    { id: "battery-1powerwall", name: "1x LiFePO4 Powerwall (4.8kWh)", desc: "100Ah @ 48V. Usable capacity: 4.3kWh." },
    { id: "battery-3powerwall", name: "3x Stacked LiFePO4 Battery Pack (14.4kWh)", desc: "300Ah @ 48V. Usable capacity: 13.0kWh." },
    { id: "battery-5powerwall", name: "5x Industrial Rack LFP Pack (24.0kWh)", desc: "500Ah @ 48V. Usable capacity: 21.6kWh." }
  ];

  // Quick Action triggers
  const handleDownloadMaterials = (file: string) => {
    alert(`📥 Downloading handbooks: ${file}. Formatted with AutoCAD drawings & MPPT charging coefficient tables.`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start bg-white text-[#0F172A] w-full">
      
      {/* LEFT SLEEK DOCK (ARC / LINEAR INSPIRED NAVIGATION - LIGHT THEME) */}
      <aside className="lg:col-span-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 px-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0057B8] to-[#00A651] text-white flex items-center justify-center font-bold text-sm shadow">
            🎓
          </div>
          <div>
            <div className="text-xs font-black text-[#0F172A]">{student.name}</div>
            <div className="text-[10px] font-mono text-[#64748B] font-bold">{student.studentId}</div>
          </div>
        </div>

        {/* Tab Items */}
        <nav className="space-y-1">
          {[
            { id: "home", label: "Overview Workspace", icon: "📐" },
            { id: "courses", label: "My Enrolled Diplomas", icon: "📚" },
            { id: "progress", label: "Progress Tracking", icon: "📊" },
            { id: "assignments", label: "Assignments & Tasks", icon: "📁" },
            { id: "simulator", label: "Virtual Sizing Lab", icon: "🔌" },
            { id: "messages", label: "AI Sizing Tutor", icon: "✨" },
            { id: "live", label: "Live Webinars", icon: "🎙️" },
            { id: "certificates", label: "Certifications Case", icon: "📜" },
            { id: "downloads", label: "Reference Handbooks", icon: "💾" },
            { id: "profile", label: "My Profile", icon: "👤" },
            { id: "payments", label: "Payment History", icon: "🧾" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDashboardTab(tab.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                dashboardTab === tab.id 
                  ? "bg-[#0057B8] text-white shadow-md shadow-[#0057B8]/15" 
                  : "text-[#64748B] hover:bg-slate-200/50 hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {tab.id === "messages" && isAiLoading && (
                <span className="h-2 w-2 rounded-full bg-[#00A651] animate-ping"></span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* RIGHT WORKSPACE PANELS */}
      <main className="lg:col-span-9 space-y-6">
        
        {/* ================= 1. OVERVIEW WORKSPACE (BENTO GRID WIDGETS) ================= */}
        {dashboardTab === "home" && (
          <div className="space-y-6">
            
            {/* STREAK & XP WIDGET */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-[#64748B] leading-none">Continuous study</div>
                  <div className="text-xl font-black text-[#0F172A] mt-1.5">{streakDays} Days Streak</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-500 animate-pulse" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-[#64748B] leading-none">Trainee ranking</div>
                  <div className="text-xl font-black text-[#0F172A] mt-1.5">{xpPoints} XP Points</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                  <Trophy className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-sm hover:shadow-md transition">
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-[#64748B] leading-none">Unlocks achieved</div>
                  <div className="text-xl font-black text-[#0F172A] mt-1.5">{unlockedBadges.length} Active Badges</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Award className="h-5 w-5 text-[#00A651]" />
                </div>
              </div>
            </div>

            {/* CONTINUE LEARNING CORE FLOATING CARD */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#0057B8]/5 via-[#00A651]/5 to-transparent border border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
              <div className="space-y-1.5">
                <span className="inline-block text-[8.5px] font-black uppercase text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded tracking-widest">
                  CONTINUE STUDYING
                </span>
                <h3 className="text-sm sm:text-base font-black text-[#0F172A]">{selectedCourse.title}</h3>
                <p className="text-[10px] sm:text-xs text-[#64748B] leading-none font-semibold">
                  Currently at module: {selectedCourse.lessons[0]?.title || "First Module"}
                </p>
                
                {/* Progress bar */}
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
                  <div className="h-full bg-[#00A651] rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setCurrentView("classroom");
                  setActiveLessonIndex(0);
                }}
                className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3.5 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Resume Lecture</span>
                <Play className="h-3.5 w-3.5 fill-white text-white" />
              </button>
            </div>

            {/* LEARNING ANALYTICS (SVG WAVE CHART) & QUICK ACTIONS */}
            <div className="grid gap-6 md:grid-cols-12">
              
              {/* SINE WAVE CHART */}
              <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Weekly Sizing Lab Activity</div>
                  <span className="text-[9px] font-mono text-[#00A651] font-bold bg-[#00A651]/10 px-2 py-0.5 rounded">Active Trend (+12%)</span>
                </div>
                
                {/* Dynamic Sizing Wave Line Chart using SVG */}
                <div className="relative h-44 w-full flex items-end">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00A651" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#00A651" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    
                    {/* Fill Area */}
                    <path d="M 0 120 C 50 100, 100 30, 150 50 C 200 70, 250 140, 300 40 C 350 -10, 400 120, 400 150 L 400 150 L 0 150 Z" fill="url(#chartGradient)" />
                    {/* Stroke line */}
                    <path d="M 0 120 C 50 100, 100 30, 150 50 C 200 70, 250 140, 300 40 C 350 -10, 400 120, 400 120" stroke="#00A651" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Points */}
                    <circle cx="150" cy="50" r="4.5" fill="#00A651" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="300" cy="40" r="4.5" fill="#00A651" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                  
                  {/* Chart labels */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono text-[8px] text-slate-400 px-2 leading-none">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS DOCK */}
              <div className="md:col-span-4 p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Quick Actions</div>
                <div className="space-y-2 flex flex-col">
                  <button 
                    onClick={() => setDashboardTab("simulator")}
                    className="w-full text-left p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0057B8]/40 text-[11px] font-bold text-slate-700 hover:text-[#0F172A] hover:bg-slate-100/50 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Launch Virtual Sizing Lab</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setDashboardTab("messages")}
                    className="w-full text-left p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0057B8]/40 text-[11px] font-bold text-slate-700 hover:text-[#0F172A] hover:bg-slate-100/50 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>✨ Ask AI Sizing Tutor</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleDownloadMaterials("Trainee Handbook.pdf")}
                    className="w-full text-left p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0057B8]/40 text-[11px] font-bold text-slate-700 hover:text-[#0F172A] hover:bg-slate-100/50 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>💾 PDF Reference Sheets</span>
                    <Download className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= 2. ENROLLED DIPLOMAS ================= */}
        {dashboardTab === "courses" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Your Enrolled Curriculums</h3>
              <p className="text-xs text-[#64748B]">Track and manage your professional credentials.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row gap-6 items-center shadow-sm">
              <div className="h-16 w-16 bg-[#F8FAFC] rounded-2xl overflow-hidden flex-shrink-0 border border-[#E2E8F0] flex items-center justify-center text-2xl">
                📐
              </div>
              <div className="space-y-1.5 flex-1 text-left">
                <span className="inline-block text-[8.5px] font-black uppercase text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded tracking-widest">
                  Active Academic Node
                </span>
                <h4 className="text-sm font-black text-[#0F172A] leading-snug">{selectedCourse.title}</h4>
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold">
                  <div>Instructor: {selectedCourse.instructor}</div>
                  <div>•</div>
                  <div>Syllabus: {selectedCourse.lessonsCount} Core Modules</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setCurrentView("classroom");
                  setActiveLessonIndex(0);
                }}
                className="rounded-xl bg-[#0057B8] text-white hover:bg-[#0057B8]/95 text-[10px] font-black uppercase tracking-wider px-5 py-3.5 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Open Video Player</span>
                <Play className="h-3.5 w-3.5 fill-white text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. VIRTUAL SIZING WORKBENCH SIMULATOR ================= */}
        {dashboardTab === "simulator" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0057B8]/5 border border-[#0057B8]/15 space-y-4">
              <div className="flex items-center gap-2 text-[#0057B8] font-extrabold text-sm">
                <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>Interactive Solar Sizing Virtual Workbench</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Connect panel string configurations, inverter sizes, and stackable LFP batteries to satisfy the outpost vaccine refrigeration needs. Your system node configuration must safely satisfy 4,000 Watts continuous draw and 13,000 Wh usable daily capacity.
              </p>
              <div className="grid gap-3 sm:grid-cols-3 font-mono text-[10px] text-slate-500 border-t border-[#E2E8F0] pt-3">
                <div>🏢 Outpost Node: <span className="text-[#0057B8] font-bold">{simulatorGoal.clinic}</span></div>
                <div>⚡ Continuous Peak Load: <span className="text-[#0057B8] font-bold">{simulatorGoal.loadRequirement}W</span></div>
                <div>🔋 Target Storage: <span className="text-[#0057B8] font-bold">{simulatorGoal.dailyEnergyUsage}Wh</span></div>
              </div>
            </div>

            {/* Sizing Selectors */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Step 1: Choose PV Array Sizing</label>
                <div className="space-y-2">
                  {panelOptions.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => setSelectedPanelType(opt.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        selectedPanelType === opt.id 
                          ? "bg-[#0057B8]/8 border-[#0057B8] text-[#0057B8]" 
                          : "bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-350"
                      }`}
                    >
                      <div className={`text-xs font-bold leading-tight ${selectedPanelType === opt.id ? "text-[#0057B8]" : "text-[#0057B8]/80"}`}>{opt.name}</div>
                      <div className="text-[10px] text-[#64748B] leading-normal mt-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Step 2: Choose Smart Inverter</label>
                <div className="space-y-2">
                  {inverterOptions.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => setSelectedInverterType(opt.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        selectedInverterType === opt.id 
                          ? "bg-[#0057B8]/8 border-[#0057B8] text-[#0057B8]" 
                          : "bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-350"
                      }`}
                    >
                      <div className={`text-xs font-bold leading-tight ${selectedInverterType === opt.id ? "text-[#0057B8]" : "text-[#0057B8]/80"}`}>{opt.name}</div>
                      <div className="text-[10px] text-[#64748B] leading-normal mt-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Step 3: Choose Lithium Batteries</label>
                <div className="space-y-2">
                  {batteryOptions.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => setSelectedBatteryType(opt.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        selectedBatteryType === opt.id 
                          ? "bg-[#0057B8]/8 border-[#0057B8] text-[#0057B8]" 
                          : "bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-350"
                      }`}
                    >
                      <div className={`text-xs font-bold leading-tight ${selectedBatteryType === opt.id ? "text-[#0057B8]" : "text-[#0057B8]/80"}`}>{opt.name}</div>
                      <div className="text-[10px] text-[#64748B] leading-normal mt-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cable toggle and test button */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCablesConnected(!cablesConnected)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    cablesConnected 
                      ? "bg-[#00A651] text-white" 
                      : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:border-slate-300"
                  }`}
                >
                  {cablesConnected ? "🔌 Breaker Status: CLOSED" : "🔌 Open DC circuit breaker"}
                </button>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Cables: {cablesConnected ? "CONNECTED" : "OPEN CIRCUIT"}
                </span>
              </div>

              <button 
                onClick={handleRunSimulatorTest}
                className="rounded-xl bg-gradient-to-r from-[#0057B8] to-[#00A651] text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 hover:opacity-95 transition cursor-pointer shadow-lg shadow-[#0057B8]/15"
              >
                Run Commissioning Sizing Test
              </button>
            </div>

            {/* Diagnostic Message */}
            {simulatorMessage.text && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold transition ${
                  simulatorMessage.status === "success" 
                    ? "bg-[#00A651]/10 border-[#00A651]/20 text-[#00A651]" 
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {simulatorMessage.text}
              </motion.div>
            )}
          </div>
        )}

        {/* ================= 4. AI SOLAR TUTOR (GEMINI CONNECTED) ================= */}
        {dashboardTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#0057B8] animate-pulse" />
                  TAPCO Solar Academy AI Tutor
                </h3>
                <p className="text-[10px] text-[#64748B] font-semibold">Solve continuous and surge loads, review circuit blueprints, or prepare for NERC credentials.</p>
              </div>
            </div>

            {/* History Chat */}
            <div className="h-[350px] overflow-y-auto border border-[#E2E8F0] bg-[#F8FAFC] rounded-2xl p-4 space-y-4 shadow-inner">
              {aiHistory.map((item, idx) => (
                <div key={idx} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    item.role === "user" 
                      ? "bg-[#0057B8] text-white" 
                      : "bg-white border border-[#E2E8F0] text-[#0F172A]"
                  }`}>
                    {item.content}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-3 bg-white border border-[#E2E8F0] text-xs text-slate-400 animate-pulse">
                    Thinking with TAPCO sizing satellite arrays...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Inputs */}
            <form onSubmit={handleSendAiMessage} className="flex gap-2">
              <input 
                type="text"
                placeholder="Ask AI Tutor to calculate continuous loads or Depth of Discharge..."
                className="w-full rounded-xl border px-4 py-3.5 text-xs bg-white border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isAiLoading}
                className="rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 text-white px-5 py-3.5 transition cursor-pointer shadow-md shadow-[#00A651]/10"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* ================= 5. LIVE WEBINARS BROADCAST ================= */}
        {dashboardTab === "live" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Live Webinars Calendar</h3>
              <p className="text-xs text-[#64748B]">Interactive live sizing coordination classrooms with chief designers.</p>
            </div>

            {activeBroadcastWebinar ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setActiveBroadcastWebinar(null)}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold flex items-center gap-1 cursor-pointer transition uppercase tracking-wider"
                >
                  ← Exit broadcast
                </button>
                
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shadow-md">
                      <div className="absolute inset-0 bg-[#00A651]/3 animate-pulse"></div>
                      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        <span className="h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
                        <div className="text-xs font-black uppercase text-red-600 tracking-wider">LIVE BROADCAST CONVERGED</div>
                        <p className="text-[10px] text-slate-400 font-mono">Stream latency: 120ms • Resolution: 1080p</p>
                      </div>
                    </div>
                  </div>

                  {/* Webinar Chat sidebar */}
                  <div className="lg:col-span-4 p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 flex flex-col justify-between h-[300px] shadow-sm">
                    <div className="text-xs uppercase font-black text-[#64748B]">Broadcast Live Chat</div>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
                      {webinarChatHistory.map((chat, i) => (
                        <div key={i} className="leading-tight">
                          <span className="text-[#00A651] font-bold">{chat.sender}:</span> <span className="text-slate-600">{chat.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {academyWebinars.map((webinar) => (
                  <div key={webinar.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md hover:border-[#0057B8]/30 transition duration-300">
                    <div className="space-y-2 text-left">
                      <span className="inline-block text-[9px] font-black uppercase text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded tracking-widest leading-none">
                        UPCOMING BROADCAST
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">{webinar.title}</h4>
                      <p className="text-[10px] text-[#64748B] font-semibold">Instructor: {webinar.instructor}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 mt-4">
                      <span className="text-[10px] font-mono text-[#64748B]">{webinar.date}</span>
                      <button 
                        onClick={() => setActiveBroadcastWebinar(webinar.id)}
                        className="rounded bg-[#00A651] hover:bg-[#00A651]/95 text-white font-bold text-[10px] px-3.5 py-2 transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join Broadcast</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 6. CERTIFICATIONS CASE ================= */}
        {dashboardTab === "certificates" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Your Accredited Certifications</h3>
              <p className="text-xs text-[#64748B]">Accredited by NERC and NEMSA standards in Africa.</p>
            </div>

            {student.isGraduated ? (
              <div className="max-w-lg p-8 rounded-3xl bg-gradient-to-tr from-[#0057B8]/5 via-[#00A651]/5 to-transparent border border-emerald-500/20 space-y-6 text-center shadow-sm">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto text-xl">
                  📜
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-[#0F172A]">TAPCO Solar Sizing & Commissioning Diploma</h4>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed font-semibold">
                    This certifies that <strong className="text-[#00A651]">{student.name}</strong> has completed all academic models, scored over 70% in the solar evaluations, and successfully commissioned the clinic microgrid.
                  </p>
                </div>

                {/* QR Code Placeholder */}
                <div className="h-28 w-28 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center mx-auto shadow-md">
                  <div className="h-full w-full bg-[#0F172A] flex items-center justify-center text-[10px] text-[#00A651] font-bold font-mono">
                    TAPCO-QR
                  </div>
                </div>

                <div className="text-[9px] text-[#64748B] font-bold tracking-widest font-mono uppercase">
                  VERIFIABLE ENROLLMENT ID: {student.studentId}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 text-left shadow-sm">
                <div className="text-xs sm:text-sm font-bold text-[#0F172A]">No active certificates yet</div>
                <p className="text-xs text-[#64748B] leading-normal font-semibold">
                  To earn your verified diploma, complete all curriculum lectures and score over 70% in the final Sizing & Commissioning quiz within the course player.
                </p>
                <button 
                  onClick={() => setDashboardTab("courses")}
                  className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 transition cursor-pointer shadow-sm"
                >
                  Start Studying Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= 7. HANDBOOKS DOWNLOADS ================= */}
        {dashboardTab === "downloads" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Reference Handbooks & Calculator Sheets</h3>
              <p className="text-xs text-[#64748B]">Download CAD drawings, sizing spreadsheets, and compliance frameworks.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "3-Phase Vector Sizing Manual.pdf", size: "4.8 MB", desc: "Covers industrial motor startup multipliers and balanced vector couplings." },
                { name: "NERC Compliance Sizing Checklist.pdf", size: "1.2 MB", desc: "Africa's regulatory guidelines for off-grid hybrid connections." },
                { name: "NEMSA Grounding & Safety Guide.pdf", size: "2.4 MB", desc: "Detailed wiring blueprints, circuit breaker ratings, and surge protections." }
              ].map((file, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition duration-300 text-left">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#0F172A] leading-tight">{file.name}</div>
                    <p className="text-[10px] text-[#64748B] leading-normal font-semibold">{file.desc}</p>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{file.size}</span>
                  </div>
                  <button 
                    onClick={() => handleDownloadMaterials(file.name)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. PROGRESS TRACKING PANEL ================= */}
        {dashboardTab === "progress" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">My Academic Progress Tracking</h3>
              <p className="text-xs text-[#64748B]">Real-time audit of lesson completions, quiz averages, and unlocked credentials.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Overall Completion Metric Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-[#64748B] tracking-wider block">Completed Lectures</span>
                  <div className="text-2xl font-black text-[#0F172A]">
                    {student.completedLessons.length} / {selectedCourse.lessonsCount} Modules
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-normal">
                    You have unlocked {student.completedLessons.length} modules on solar grids.
                  </p>
                </div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden border">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0057B8] to-[#00A651] rounded-full transition-all duration-300" 
                    style={{ width: `${Math.max(15, (student.completedLessons.length / selectedCourse.lessonsCount) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Average Evaluated Quiz Scores */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-[#64748B] tracking-wider block">Average Quiz Scores</span>
                  <div className="text-2xl font-black text-[#00A651]">
                    {Object.keys(student.quizScores).length > 0 ? "88%" : "95% (Demo average)"}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-normal">
                    Passing threshold is 70% to trigger verifiable Smart Diploma.
                  </p>
                </div>
                
                <div className="flex gap-1.5 pt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Study Streaks and XP Points */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-[#64748B] tracking-wider block">Learning Velocity</span>
                  <div className="text-2xl font-black text-amber-600">
                    {streakDays} Day Run
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-normal">
                    Accumulated {xpPoints} points on solar sizing calculations.
                  </p>
                </div>
                
                <div className="text-[10px] font-mono font-bold text-[#0057B8] pt-4">
                  🚀 Rank: Tier-1 Senior Apprentice
                </div>
              </div>
            </div>

            {/* Achievement Badges Case */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider mb-4">My Verified Badges Case</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: "Solar Pioneer", desc: "First course enrollment", unlocked: true, icon: "🎓" },
                  { name: "Load Master", desc: "Sized clinic continuous load", unlocked: true, icon: "📐" },
                  { name: "Three-Phase Wizard", desc: "MW-scale vector grouping", unlocked: false, icon: "⚡" },
                  { name: "Commissioning Hero", desc: "Submit first practical", unlocked: false, icon: "🏆" }
                ].map((badge, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex gap-3 items-center text-left transition ${
                      badge.unlocked 
                        ? "bg-white border-[#E2E8F0] opacity-100" 
                        : "bg-slate-100/50 border-slate-200 opacity-60 filter grayscale"
                    }`}
                  >
                    <span className="text-xl leading-none">{badge.icon}</span>
                    <div>
                      <h5 className="text-xs font-bold text-[#0F172A] leading-tight flex items-center gap-1.5">
                        {badge.name}
                        {badge.unlocked && <span className="h-1.5 w-1.5 rounded-full bg-[#00A651]"></span>}
                      </h5>
                      <p className="text-[9px] text-slate-500 font-medium leading-none mt-1">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. ASSIGNMENTS PANEL ================= */}
        {dashboardTab === "assignments" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Assignments & Practical Projects</h3>
              <p className="text-xs text-[#64748B]">Download design problems and submit spreadsheets or drawings for instructor review.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12 items-start">
              {/* Left: Assignments List (8 columns) */}
              <div className="md:col-span-8 space-y-4">
                {assignments.map((task) => (
                  <div key={task.id} className="p-5 rounded-2xl border border-[#E2E8F0] bg-white text-left space-y-3 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-black text-[#0F172A] leading-snug">{task.title}</h4>
                        <p className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1">
                          <span>📅 Limit: July 28, 2026</span>
                          {task.filename && (
                            <span className="text-[#0057B8] bg-blue-50/50 border border-blue-100 px-1.5 py-0.5 rounded font-mono text-[9px]">
                              {task.filename}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full border leading-none ${
                        task.status === "Graded" 
                          ? "bg-emerald-50 text-[#00A651] border-emerald-100" 
                          : task.status === "Pending Review" 
                          ? "bg-amber-50 text-amber-600 border-amber-100" 
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100 leading-normal">
                      <strong>Feedback:</strong> {task.feedback}
                    </p>

                    {task.score !== "--" && (
                      <div className="text-[11px] font-black text-[#00A651]">
                        Graded Score: {task.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right: Premium Drag-and-Drop Uploader Widget (4 columns) */}
              <div className="md:col-span-4 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl text-center space-y-4">
                <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider leading-none">Submit New Project</h4>
                
                {/* File Drop/Input Container */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                      setUploadSuccess(false);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDragOver ? "border-[#0057B8] bg-blue-50/30" : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                  }`}
                  onClick={() => {
                    const input = document.getElementById("file-input-trigger");
                    input?.click();
                  }}
                >
                  <input 
                    type="file"
                    id="file-input-trigger"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setUploadSuccess(false);
                      }
                    }}
                  />
                  <span className="text-2xl select-none">📤</span>
                  <div className="text-[10px] font-black text-[#0F172A]">Drag & Drop File Here</div>
                  <p className="text-[8.5px] text-slate-400 font-bold leading-none">or click to browse local folders</p>
                </div>

                {/* Upload Meta Feedback */}
                {selectedFile && (
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-left space-y-2 relative">
                    <div className="text-[10px] font-bold text-[#0F172A] truncate">
                      File: {selectedFile.name}
                    </div>
                    <div className="text-[8.5px] font-mono text-slate-400">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                    
                    {uploadSuccess ? (
                      <div className="text-[9px] text-[#00A651] font-black uppercase flex items-center gap-1 animate-fade-in">
                        <span>✓ Upload Secured</span>
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border">
                        <div className="h-full bg-[#0057B8] w-2/3 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  disabled={!selectedFile || uploadSuccess}
                  onClick={() => {
                    if (!selectedFile) return;
                    setUploadSuccess(true);
                    
                    // Add newly submitted assignment dynamically to lists
                    const newTask = {
                      id: `task-${Date.now()}`,
                      title: "Classroom Sizing Worksheet Draft",
                      status: "Pending Review",
                      score: "--",
                      filename: selectedFile.name,
                      date: new Date().toLocaleDateString(),
                      feedback: "Uploaded successfully. Pending audit by Engr. Louis."
                    };
                    setAssignments([newTask, ...assignments]);
                  }}
                  className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 disabled:opacity-50 text-white py-3 text-[10px] font-black uppercase tracking-wider transition cursor-pointer shadow-sm shadow-[#0057B8]/10"
                >
                  {uploadSuccess ? "Uploaded successfully" : "Submit Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. PROFILE SETTINGS PANEL ================= */}
        {dashboardTab === "profile" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Student Academic Profile</h3>
              <p className="text-xs text-[#64748B]">Adjust details used for printing your NERC/NEMSA diploma certificate.</p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setProfileSavedMsg("Academic Profile successfully updated in TAPCO database registry!");
                
                // Save custom data back into meta storage
                const studentMeta = {
                  phone: profPhone,
                  country: profCountry,
                  state: profState,
                  occupation: profOccupation,
                  experience: profExperience
                };
                localStorage.setItem(`tapco_student_meta_${student.id}`, JSON.stringify(studentMeta));

                setTimeout(() => setProfileSavedMsg(""), 3500);
              }}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-left max-w-2xl"
            >
              {profileSavedMsg && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 font-bold animate-fade-in">
                  ✓ {profileSavedMsg}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Full Name (Legal spelling for Diploma)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Email Address</label>
                  <input 
                    type="email" 
                    required
                    disabled
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-slate-50 text-slate-400 focus:outline-none cursor-not-allowed"
                    value={profEmail}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Occupation</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                    value={profOccupation}
                    onChange={(e) => setProfOccupation(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Country</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                    value={profCountry}
                    onChange={(e) => setProfCountry(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">State / Region</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                    value={profState}
                    onChange={(e) => setProfState(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Previous Experience</label>
                <select 
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8] cursor-pointer"
                  value={profExperience}
                  onChange={(e) => setProfExperience(e.target.value)}
                >
                  <option value="None">None (Absolute Beginner)</option>
                  <option value="Basic Electrical">Basic Electrical Background</option>
                  <option value="Intermediate">Intermediate (Some Solar Installation)</option>
                  <option value="Advanced">Advanced Grid Engineer</option>
                </select>
              </div>

              <button 
                type="submit"
                className="rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 text-white py-3.5 text-xs font-black uppercase tracking-wider px-6 transition cursor-pointer shadow-sm shadow-[#00A651]/10"
              >
                Save Profile Information
              </button>
            </form>
          </div>
        )}

        {/* ================= 11. PAYMENT HISTORY PANEL ================= */}
        {dashboardTab === "payments" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A]">Payment History & Invoices</h3>
              <p className="text-xs text-[#64748B]">Review tuition billing records, split installment payments and download receipts.</p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-[#F8FAFC] border-b text-[9px] uppercase font-black tracking-wider text-[#0F172A] font-mono">
                    <tr>
                      <th className="px-6 py-4">Transaction Ref</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Tuition Item</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment Method</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {mockInvoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-450">{inv.ref}</td>
                        <td className="px-6 py-4">{inv.date}</td>
                        <td className="px-6 py-4 font-bold text-[#0F172A]">{inv.item}</td>
                        <td className="px-6 py-4 text-[#00A651] font-black">${inv.amount}.00</td>
                        <td className="px-6 py-4 text-[10px]">{inv.method}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded">
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedInvoice(inv)}
                            className="rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[10px] font-bold px-3 py-1.5 transition cursor-pointer text-[#0057B8]"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INVOICE POPUP MODAL */}
            <AnimatePresence>
              {selectedInvoice && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md rounded-3xl bg-white border border-[#E2E8F0] p-6 space-y-4 text-left shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-dashed pb-3 flex justify-between font-mono text-[10px] font-bold text-[#0F172A]">
                      <span>TAPCO SOLAR ACADEMY</span>
                      <span>TAX RECEIPT</span>
                    </div>

                    <div className="font-mono text-[9px] text-slate-600 space-y-1.5">
                      <div className="flex justify-between">
                        <span>TRANSACTION REFERENCE:</span>
                        <span className="font-bold text-[#0F172A]">{selectedInvoice.ref}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DATE:</span>
                        <span>{selectedInvoice.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>STUDENT REGISTRY:</span>
                        <span className="font-bold text-[#0F172A]">{student.name} ({student.studentId})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ITEM DESCRIPTION:</span>
                        <span>{selectedInvoice.item}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PAYMENT METHOD:</span>
                        <span>{selectedInvoice.method}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-dashed pt-3 mt-3 text-xs text-[#0F172A]">
                        <span>TOTAL RECEIVED (NGN):</span>
                        <span className="text-[#00A651]">₦{selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl border border-slate-250 text-[10px] font-black uppercase tracking-wider py-2.5 transition text-center hover:bg-slate-50 cursor-pointer"
                      >
                        Print Tax Invoice
                      </button>
                      <button 
                        onClick={() => setSelectedInvoice(null)}
                        className="flex-1 rounded-xl bg-[#0057B8] text-white text-[10px] font-black uppercase tracking-wider py-2.5 transition text-center hover:bg-[#0057B8]/95 cursor-pointer"
                      >
                        Close Invoice
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

      </main>

    </div>
  );
}
