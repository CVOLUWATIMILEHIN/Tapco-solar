import React from "react";
import { FileText, Download, Compass, Eye, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function CompanyIntroduction() {
  const documents = [
    { name: "TAPCO Corporate Profile 2026.pdf", size: "4.8 MB", type: "PDF Document" },
    { name: "Solar Installation Blueprint & Shading Guide.pdf", size: "12.4 MB", type: "Technical Guide" },
    { name: "Premium Component Catalogue V4.pdf", size: "8.1 MB", type: "Product Catalog" }
  ];

  const handleDownload = (doc: string) => {
    alert(`Downloading Document: ${doc}\nYour download will begin in 1 second.`);
  };

  return (
    <section id="introduction-section" className="w-full bg-white border-b border-slate-200/60 py-12 sm:py-16 md:py-20 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="grid gap-16 lg:grid-cols-12 items-stretch">
          
          {/* Brand Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10 text-left">
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00A651] bg-[#00A651]/10 px-4 py-1.5 rounded-full w-fit block">
                Corporate Legacy &amp; Values
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Engineering Uninterrupted Clean Energy Solutions
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold">
                TAPCO Solar is Nigeria's standard-setting renewable energy engineering firm. We design, deploy, and maintain robust solar microgrids for smart residential estates, high-tech industrial plants, public campuses, and critical medical facilities.
              </p>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                By integrating Tier-1 Monocrystalline solar modules, pure-sine smart hybrid inverters, and high-cycle LiFePO4 energy storage arrays, we completely eliminate reliance on high-cost diesel generators, bringing silent, absolute energy independence to thousands of lives.
              </p>
            </div>

            {/* UPGRADED MISSION & VISION CARDS (Spacious, modern, and highly visual) */}
            <div className="grid gap-6 sm:grid-cols-2 pt-6">
              <motion.div 
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#0057B8]" />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0057B8]/10 text-[#0057B8] shadow-sm">
                  <Compass className="h-5 w-5" />
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">Corporate Mission</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  To eradicate power outages across sub-Saharan Africa through bespoke, high-efficiency solar microgrids, securing industrial productivity and daily livelihoods.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0057B8]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> <span>Quality Assured</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#00A651]" />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00A651]/10 text-[#00A651] shadow-sm">
                  <Eye className="h-5 w-5" />
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">Strategic Vision</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  To establish continuous, off-grid energy hubs in over 1,000 schools and healthcare campuses by the year 2030, raising generations of clean energy professionals.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00A651]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> <span>SDG aligned</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* UPGRADED DOCUMENT DOWNLOAD HUB COLUMN (Highly visual & luxury finish) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-[#0F2937] text-white p-8 md:p-10 space-y-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
            
            <div className="space-y-6 relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0057B8]/25 text-[#FFD100] border border-[#0057B8]/30 shadow-md">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="text-xl font-black text-white tracking-tight">TAPCO Resource Hub</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Gain instant access to our official company registrations, electrical design handbooks, and structural engineering compliance catalogs.
                </p>
              </div>
            </div>

            <div className="grid gap-4 relative z-10">
              {documents.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDownload(doc.name)}
                  className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 p-5 text-xs text-slate-100 hover:text-white transition-all border border-white/10 hover:border-white/20 font-bold group shadow-sm w-full text-left"
                >
                  <div className="min-w-0 pr-4">
                    <span className="block truncate font-black text-sm text-white group-hover:text-[#FFD100] transition-colors">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider mt-1 block">
                      {doc.type} • <strong className="text-slate-300 font-semibold">{doc.size}</strong>
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-white/5 group-hover:bg-[#0057B8] flex items-center justify-center shrink-0 transition-colors">
                    <Download className="h-4.5 w-4.5 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* ISO Quality certification indicator */}
            <div className="relative z-10 border-t border-white/10 pt-6 flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              <span>Verified Secure Connection</span>
              <span className="text-[#00A651]">SSL Encrypted</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
