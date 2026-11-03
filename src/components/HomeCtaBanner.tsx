import React from "react";

interface HomeCtaBannerProps {
  onSiteInspectionClick: () => void;
  onCustomQuoteClick: () => void;
}

export default function HomeCtaBanner({ onSiteInspectionClick, onCustomQuoteClick }: HomeCtaBannerProps) {
  return (
    <section id="homepage-cta-section" className="w-full bg-[#0F2937] text-white py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0057B8]/10 via-transparent to-[#00A651]/10 opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-5"></div>
      
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 text-center space-y-10 relative z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD100] block">Zero Outages, Zero Emissions</span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Switch to Uninterrupted Clean Power?
          </h3>
          <p className="text-sm md:text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Protect your corporate premises, medical equipment, or smart home from sudden grid failures today. Request a bespoke engineering audit.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onSiteInspectionClick}
            className="rounded-xl bg-[#FFD100] hover:bg-[#E2BB13] text-slate-900 font-black px-8 py-4 text-xs uppercase tracking-wider shadow-lg shadow-[#FFD100]/5 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Book Physical Site Inspection
          </button>
          <button
            onClick={onCustomQuoteClick}
            className="rounded-xl border border-white/25 hover:border-white hover:bg-white/5 text-white font-black px-8 py-4 text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            Request Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
}
