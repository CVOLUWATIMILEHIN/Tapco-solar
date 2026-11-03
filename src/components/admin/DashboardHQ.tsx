import React, { useState } from "react";
import { 
  DollarSign, Users, Briefcase, ShoppingBag, BookOpen, 
  TrendingUp, Activity, Calendar, FileText, ArrowRight,
  TrendingDown, CheckCircle, AlertCircle, PlusCircle, RefreshCw, Clock
} from "lucide-react";
import { motion } from "motion/react";
import { Customer, Project, ProductItem, Order, Lead } from "./AdminData";

interface DashboardHQProps {
  customers: Customer[];
  projects: Project[];
  products: ProductItem[];
  orders: Order[];
  leads: Lead[];
  onNavigate: (tabId: string) => void;
  onQuickCreate: (type: string) => void;
  role: string;
}

export default function DashboardHQ({ 
  customers, 
  projects, 
  products, 
  orders, 
  leads, 
  onNavigate, 
  onQuickCreate,
  role 
}: DashboardHQProps) {
  const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<"revenue" | "conversion">("revenue");

  // Computations
  const totalRevenue = customers.reduce((sum, c) => sum + c.spend, 0) + orders.reduce((sum, o) => sum + o.amount, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const inProgressProjects = projects.filter(p => p.phase !== "Commissioned").length;

  const kpis = [
    { 
      id: "revenue",
      title: "Total Enterprise Revenue", 
      value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, 
      sub: "₦276.5M baseline + current e-commerce",
      trend: "+14.8%", 
      trendUp: true, 
      icon: DollarSign, 
      bg: "from-[#0057B8]/5 via-white to-white", 
      border: "hover:border-[#0057B8]/40",
      accent: "#0057B8"
    },
    { 
      id: "crm",
      title: "Active Enterprise Customers", 
      value: customers.length.toString(), 
      sub: "3 heavy-grid accounts connected",
      trend: "+8.2%", 
      trendUp: true, 
      icon: Users, 
      bg: "from-[#00A651]/5 via-white to-white", 
      border: "hover:border-[#00A651]/40",
      accent: "#00A651"
    },
    { 
      id: "projects",
      title: "Clean Grid Installations", 
      value: projects.length.toString(), 
      sub: `${inProgressProjects} active project deliveries`,
      trend: "100% uptime", 
      trendUp: true, 
      icon: Briefcase, 
      bg: "from-[#FFC107]/5 via-white to-white", 
      border: "hover:border-[#FFC107]/40",
      accent: "#FFC107"
    },
    { 
      id: "products",
      title: "Inventory Stocks Limit", 
      value: products.reduce((sum, p) => sum + p.stock, 0).toString(), 
      sub: `${lowStockCount} items below alert threshold`,
      trend: `${lowStockCount} warnings`, 
      trendUp: false, 
      icon: ShoppingBag, 
      bg: "from-rose-500/5 via-white to-white", 
      border: "hover:border-rose-500/40",
      accent: "#EF4444"
    },
  ];

  // Activities Feed
  const recentActivities = [
    { id: 1, type: "install", text: "Prestige Estate Phase II system microgrid initialized live testing sequence.", time: "10m ago", icon: CheckCircle, color: "text-[#10B981] bg-[#10B981]/10" },
    { id: 2, type: "payment", text: "Louis Olosunde cleared payment balance of ₦4,200,000 for direct panels.", time: "44m ago", icon: DollarSign, color: "text-[#0057B8] bg-[#0057B8]/10" },
    { id: 3, type: "survey", text: "Site inspection scheduled for Chevron Housing terrace villa coordinates.", time: "2h ago", icon: Calendar, color: "text-[#00A651] bg-[#00A651]/10" },
    { id: 4, type: "warning", text: "BYD Powerwall inventory units reached warning threshold bounds.", time: "4h ago", icon: AlertCircle, color: "text-amber-500 bg-amber-500/10" }
  ];

  return (
    <div className="space-y-8">
      {/* 1. LARGE WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#0057B8] p-8 md:p-10 text-white shadow-xl shadow-slate-200/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-35" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-radial-gradient from-white/10 to-transparent blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-radial-gradient from-[#00A651]/20 to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            TAPCO Enterprise OS v2.0
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Welcome back, Administrator
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
            TAPCO Control Center coordinates all engineering pipelines, student enrollment records, physical microgrid load tests, and direct-to-installer e-commerce supplies across West Africa.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => onNavigate("crm")}
              className="rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition shadow-lg shadow-[#00A651]/20 cursor-pointer flex items-center gap-2"
            >
              <span>Manage Client Pipelines</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onNavigate("projects")}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition border border-white/10 backdrop-blur-sm cursor-pointer"
            >
              Active Installations
            </button>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC 4-COLUMN KPI METRICS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isHovered = hoveredKpi === idx;
          return (
            <motion.div
              key={kpi.title}
              onMouseEnter={() => setHoveredKpi(idx)}
              onMouseLeave={() => setHoveredKpi(null)}
              onClick={() => onNavigate(kpi.id)}
              className={`relative overflow-hidden bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-left ${kpi.border}`}
              whileHover={{ y: -4 }}
            >
              {/* Inner glowing hover backplate */}
              {isHovered && (
                <div 
                  className="absolute inset-0 opacity-[0.03] transition-opacity pointer-events-none duration-300"
                  style={{ backgroundColor: kpi.accent }}
                />
              )}

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{kpi.title}</span>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                </div>
                <div 
                  className="p-3 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: isHovered ? `${kpi.accent}15` : "#F8FAFC",
                    color: kpi.accent
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-[11px] font-bold">
                <span className={`px-2 py-0.5 rounded-full ${kpi.trendUp ? "text-[#10B981] bg-[#10B981]/10" : "text-rose-500 bg-rose-50/50"}`}>
                  {kpi.trend}
                </span>
                <span className="text-slate-400 font-medium">{kpi.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. EXPANSIVE 12-COLUMN grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: INTERACTIVE VISUAL ANALYTICS (8 COLS) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-[24px] p-6 text-left shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#0057B8]">Logistics Analytics</span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">TAPCO Financial & Lead Operations</h3>
            </div>
            
            {/* Chart Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveChartTab("revenue")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${activeChartTab === "revenue" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Revenue Flow
              </button>
              <button
                onClick={() => setActiveChartTab("conversion")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${activeChartTab === "conversion" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Lead Funnels
              </button>
            </div>
          </div>

          {/* DYNAMIC HIGH-FIDELITY CUSTOM SVG CHART */}
          <div className="relative h-64 w-full">
            {activeChartTab === "revenue" ? (
              /* REVENUE GRAPH (Stripe/Apple Minimalist Stroke Gradient) */
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0057B8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0057B8" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0057B8" />
                    <stop offset="50%" stopColor="#00A651" />
                    <stop offset="100%" stopColor="#0057B8" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Guide lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="220" x2="600" y2="220" stroke="#E2E8F0" strokeWidth="1" />

                {/* Fill Area */}
                <path 
                  d="M0,220 L0,180 Q100,120 150,150 T300,80 T450,110 T600,40 L600,220 Z" 
                  fill="url(#chartGrad)" 
                />

                {/* Beautiful Glowing Spline Line */}
                <path 
                  d="M0,180 Q100,120 150,150 T300,80 T450,110 T600,40" 
                  fill="none" 
                  stroke="url(#strokeGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />

                {/* Points & Interactive Glyphs */}
                <circle cx="150" cy="150" r="5" fill="#00A651" stroke="#fff" strokeWidth="2.5" className="cursor-pointer transition-all hover:scale-150" />
                <circle cx="300" cy="80" r="5" fill="#0057B8" stroke="#fff" strokeWidth="2.5" className="cursor-pointer transition-all hover:scale-150" />
                <circle cx="600" cy="40" r="5" fill="#0057B8" stroke="#fff" strokeWidth="2.5" className="cursor-pointer transition-all hover:scale-150" />

                {/* Custom floating annotations */}
                <foreignObject x="270" y="35" width="130" height="40">
                  <div className="bg-slate-900 text-white text-[9px] px-2 py-1.5 rounded-lg shadow-xl border border-slate-700 font-mono text-center">
                    ₦181M (Peak Microgrid)
                  </div>
                </foreignObject>
              </svg>
            ) : (
              /* LEAD CONVERSION BARS */
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="220" x2="600" y2="220" stroke="#E2E8F0" strokeWidth="1" />

                {/* Render elegant rounded bars */}
                {/* Bar 1 (Design) */}
                <rect x="50" y="80" width="35" height="140" rx="6" fill="#0057B8" className="hover:opacity-90 cursor-pointer" />
                {/* Bar 2 (Quotation) */}
                <rect x="180" y="40" width="35" height="180" rx="6" fill="#00A651" className="hover:opacity-90 cursor-pointer" />
                {/* Bar 3 (Inspection) */}
                <rect x="310" y="110" width="35" height="110" rx="6" fill="#FFC107" className="hover:opacity-90 cursor-pointer" />
                {/* Bar 4 (Negotiation) */}
                <rect x="440" y="140" width="35" height="80" rx="6" fill="#EF4444" className="hover:opacity-90 cursor-pointer" />
                {/* Bar 5 (Closed) */}
                <rect x="520" y="60" width="35" height="160" rx="6" fill="#10B981" className="hover:opacity-90 cursor-pointer" />
              </svg>
            )}
          </div>

          {/* Chart Legend row */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E2E8F0] text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">
            <span>Jan 2026</span>
            <span>Mar 2026</span>
            <span>May 2026</span>
            <span>Jul 2026 (Live Forecast)</span>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT quotation INTAKE & FEED (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Action Feed */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
              <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider">Live System Telemetry</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A651] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A651]" />
              </span>
            </div>

            <div className="space-y-4">
              {recentActivities.map(act => (
                <div key={act.id} className="flex gap-3 text-xs leading-relaxed">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <act.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-700">{act.text}</p>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-gradient-to-br from-[#0057B8]/5 to-transparent border border-[#0057B8]/10 rounded-[24px] p-6 text-left shadow-sm">
            <h3 className="text-xs uppercase font-black text-[#0057B8] tracking-widest mb-3">Quick Terminal Controls</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => onQuickCreate("customer")}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0057B8]/40 transition text-center space-y-2 group cursor-pointer shadow-sm"
              >
                <PlusCircle className="h-5 w-5 text-[#0057B8] mx-auto group-hover:scale-110 transition" />
                <span className="block text-[10px] font-black uppercase text-slate-700">Add Customer</span>
              </button>
              <button
                onClick={() => onQuickCreate("lead")}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0057B8]/40 transition text-center space-y-2 group cursor-pointer shadow-sm"
              >
                <PlusCircle className="h-5 w-5 text-[#00A651] mx-auto group-hover:scale-110 transition" />
                <span className="block text-[10px] font-black uppercase text-slate-700">Add Lead</span>
              </button>
              <button
                onClick={() => onQuickCreate("booking")}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0057B8]/40 transition text-center space-y-2 group cursor-pointer shadow-sm"
              >
                <PlusCircle className="h-5 w-5 text-[#FFC107] mx-auto group-hover:scale-110 transition" />
                <span className="block text-[10px] font-black uppercase text-slate-700">Add Booking</span>
              </button>
              <button
                onClick={() => onNavigate("security")}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0057B8]/40 transition text-center space-y-2 group cursor-pointer shadow-sm"
              >
                <RefreshCw className="h-5 w-5 text-indigo-500 mx-auto group-hover:rotate-180 transition duration-500" />
                <span className="block text-[10px] font-black uppercase text-slate-700">MFA & Audits</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
