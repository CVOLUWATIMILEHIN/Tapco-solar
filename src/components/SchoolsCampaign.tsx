import React from "react";

export default function SchoolsCampaign() {
  const handleNomination = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your nomination. Our CSR committee reviews schools every quarter and will contact the administrative team directly.");
  };

  return (
    <section id="schools-campaign-section" className="w-full bg-white border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0057B8] via-[#003B80] to-[#00A651] border border-slate-200 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-xl shadow-slate-200/50">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
          
          {/* Left Column (CSR Story) */}
          <div className="lg:w-7/12 space-y-6 text-white text-left relative z-10">
            <span className="inline-block text-[9px] uppercase font-black text-[#FFD100] tracking-[0.2em] bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              Corporate Social Responsibility
            </span>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Energy for Schools Campaign
            </h3>
            <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-semibold">
              Education thrives under pure sunshine. To date, we have powered over 14 high-need community schools across regional areas with complete solar microgrids. This offsets continuous fuel generator expenditures, channeling valuable capital directly into classrooms, computers, and science kits.
            </p>

            {/* CSR Progress Indicator Bar */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-3 mt-6">
              <div className="flex justify-between items-center text-xs font-black text-[#FFD100] uppercase tracking-wider">
                <span>Current Campaign: Lekki Vocational Institute</span>
                <span>72% Raised</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD100] rounded-full transition-all duration-1000" style={{ width: "72%" }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-100 font-bold uppercase tracking-wider">
                <span>$36,200 Secured</span>
                <span>Goal: $50,000 for 10kVA Microgrid</span>
              </div>
            </div>
          </div>

          {/* Right Column (Submit School Nomination Widget) */}
          <div className="lg:w-5/12 bg-white rounded-3xl p-6 md:p-10 text-slate-800 space-y-6 relative z-10 border border-white shadow-lg w-full text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#00A651] uppercase tracking-widest block">Active Participation</span>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Nominate a High-Need School</h4>
              <p className="text-xs text-slate-400 font-semibold">Our selection board inspects nominated public institutions for complete off-grid solar funding.</p>
            </div>

            <form onSubmit={handleNomination} className="space-y-4">
              <input
                type="text"
                required
                placeholder="School Name / Administrative Region"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs placeholder-slate-400 focus:border-[#0057B8] focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              />
              <input
                type="email"
                required
                placeholder="Your Contact Email Address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs placeholder-slate-400 focus:border-[#0057B8] focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#00A651] hover:bg-[#00A651]/90 text-white font-black px-6 py-3.5 text-xs uppercase tracking-wider shadow-md shadow-[#00A651]/10 transition-all cursor-pointer text-center"
              >
                Submit Nomination Pledge
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
