import React, { useState } from "react";
import { Users, Briefcase } from "lucide-react";

interface PartnersWidgetProps {
  partnerStatus: string | null;
  onPartnerSubmit: (companyName: string, region: string) => void;
  careerStatus: string | null;
  onCareerApply: (role: string) => void;
}

export default function PartnersWidget({
  partnerStatus,
  onPartnerSubmit,
  careerStatus,
  onCareerApply
}: PartnersWidgetProps) {
  const [compName, setCompName] = useState("");
  const [region, setRegion] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName || !region) return;
    onPartnerSubmit(compName, region);
  };

  return (
    <section id="homepage-partners-section" className="w-full bg-white py-24 sm:py-32 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        
        {/* Partners Marquee Logo Strip */}
        <div className="space-y-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00A651] block">Technical Alliances</span>
          <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Authorized TAPCO Hardware Providers</h4>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-300">
            {["Schneider Power", "Fronius Certified", "BYD Lithium Energy", "Victron Alliance", "Growatt Global"].map((logo, i) => (
              <span key={i} className="text-slate-500 font-black font-mono text-sm tracking-wider uppercase border-2 border-dashed border-slate-200 px-4 py-2 rounded-xl select-none hover:text-[#0057B8] hover:border-[#0057B8]/20 transition-all">
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 pt-10 border-t border-slate-100">
          
          {/* Partner Form */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8 md:p-10 space-y-6 shadow-sm flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00A651]/10 text-[#00A651]">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">TAPCO Partner / Dealer Program</h4>
                <p className="text-xs md:text-sm text-slate-400 font-semibold leading-relaxed">Join our accredited network to distribute and install premium solar equipment with localized corporate pricing.</p>
              </div>
            </div>
            {partnerStatus ? (
              <div className="rounded-xl bg-[#00A651]/10 p-5 border border-[#00A651]/20 text-[#00A651] text-xs font-semibold mt-4">
                {partnerStatus}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Registered Company Name"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0057B8] focus:outline-none transition-all font-bold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Core Operations Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0057B8] focus:outline-none transition-all font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/90 text-white font-black px-6 py-4 text-xs shadow-md shadow-[#0057B8]/10 hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
                >
                  Submit Partner Registration
                </button>
              </form>
            )}
          </div>

          {/* Careers Widget */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8 md:p-10 space-y-6 shadow-sm flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0057B8]/10 text-[#0057B8]">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Careers with TAPCO Group</h4>
                <p className="text-xs md:text-sm text-slate-400 font-semibold leading-relaxed">We actively recruit talented electrical field engineers, battery BMS developers, and project leads.</p>
              </div>
            </div>
            {careerStatus ? (
              <div className="rounded-xl bg-[#00A651]/10 p-5 border border-[#00A651]/20 text-[#00A651] text-xs font-semibold mt-4">
                {careerStatus}
              </div>
            ) : (
              <div className="space-y-4 text-xs mt-6">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-150 hover:border-slate-250 transition-colors shadow-sm">
                  <div>
                    <span className="font-black block text-slate-800 text-sm">Senior Field Electrician</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lagos Head Office • Full Time</span>
                  </div>
                  <button
                    onClick={() => onCareerApply("Senior Field Electrician")}
                    className="rounded-xl bg-[#0057B8]/10 hover:bg-[#0057B8] text-[#0057B8] hover:text-white px-4 py-2 hover:shadow-md transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-150 hover:border-slate-250 transition-colors shadow-sm">
                  <div>
                    <span className="font-black block text-slate-800 text-sm">BMS Firmware Engineer</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Remote / Hybrid • Full Time</span>
                  </div>
                  <button
                    onClick={() => onCareerApply("BMS Firmware Engineer")}
                    className="rounded-xl bg-[#0057B8]/10 hover:bg-[#0057B8] text-[#0057B8] hover:text-white px-4 py-2 hover:shadow-md transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
