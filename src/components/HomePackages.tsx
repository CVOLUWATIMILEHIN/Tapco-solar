import React, { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, ShieldCheck, Clock, Hammer, HelpCircle, Eye } from "lucide-react";
import { useCMS } from "../context/CMSContext";
import { motion } from "motion/react";

interface HomePackagesProps {
  onConfigurePackage: (id: string) => void;
  onViewAllPackages: () => void;
}

export default function HomePackages({ onConfigurePackage, onViewAllPackages }: HomePackagesProps) {
  const { solarPackages } = useCMS();
  const [packages, setPackages] = useState(solarPackages);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    setPackages(solarPackages);
  }, [solarPackages]);

  useEffect(() => {
    let active = true;
    fetch("/api/solar-prices")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response from server");
        }
        return res.json();
      })
      .then((data) => {
        if (active && data.success && data.packages) {
          setExchangeRate(data.exchangeRate);
          const updated = solarPackages.map((p) => {
            const apiPkg = data.packages.find((ap: any) => ap.id === p.id);
            return apiPkg ? { ...p, price: apiPkg.price } : p;
          });
          setPackages(updated);
        }
      })
      .catch((err) => {
        console.warn("Gracefully falling back to cached packages data:", err.message || err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="homepage-packages-section" className="w-full bg-slate-50 border-b border-slate-100 py-12 sm:py-16 md:py-20 scroll-mt-24">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {exchangeRate ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#00A651]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A651] animate-pulse" />
              Live Price Sync (₦{exchangeRate.toLocaleString()}/USD)
            </div>
          ) : (
            <span className="text-xs font-black uppercase tracking-widest text-[#00A651] block">Standard Configurations</span>
          )}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">TAPCO High-Performance Solar Packages</h3>
          <p className="text-sm md:text-base text-slate-500 font-medium font-sans">Explore fully customized off-grid solar packages engineered with premium long-life lithium battery storage and hybrid smart inverters.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {packages.slice(0, 3).map((pkg, idx) => {
            const isPremium = idx === 2;
            const isClassic = idx === 1;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-3xl border overflow-hidden p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 ${
                  isPremium 
                    ? "bg-[#0F2937] text-white border-slate-800" 
                    : isClassic
                      ? "bg-white border-[#0057B8] ring-1 ring-[#0057B8]/20"
                      : "bg-white border-slate-100"
                }`}
              >
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      isPremium 
                        ? "bg-[#00A651]/20 text-[#00A651]" 
                        : isClassic
                          ? "bg-[#0057B8]/10 text-[#0057B8]"
                          : "bg-slate-100 text-slate-600"
                    }`}>
                      {isPremium ? "Best Seller" : isClassic ? "Most Popular" : "Starter Choice"}
                    </span>
                    <span className={`text-sm font-black font-mono tracking-tight ${isPremium ? "text-white" : "text-[#0057B8]"}`}>
                      Starting From ₦{pkg.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className={`text-xl font-black ${isPremium ? "text-white" : "text-slate-900"}`}>{pkg.name}</h4>
                    <p className="text-xs font-black text-[#00A651] font-mono tracking-widest uppercase">Capacity: {pkg.capacity}</p>
                  </div>

                  <p className={`text-xs leading-relaxed font-semibold ${isPremium ? "text-slate-300" : "text-slate-500"}`}>
                    {pkg.description}
                  </p>

                  {/* Core Specifications Grid */}
                  <div className={`space-y-3 pt-6 border-t ${isPremium ? "border-slate-800" : "border-slate-100"}`}>
                    <div className="flex items-start gap-2.5 text-xs">
                      <CheckCircle className="h-4.5 w-4.5 text-[#00A651] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-black block ${isPremium ? "text-white" : "text-slate-800"}`}>Solar Panel Capacity</span>
                        <span className={isPremium ? "text-slate-400" : "text-slate-500"}>{pkg.specs.panels}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs">
                      <CheckCircle className="h-4.5 w-4.5 text-[#00A651] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-black block ${isPremium ? "text-white" : "text-slate-800"}`}>Battery Configuration</span>
                        <span className={isPremium ? "text-slate-400" : "text-slate-500"}>{pkg.specs.battery}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs">
                      <CheckCircle className="h-4.5 w-4.5 text-[#00A651] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-black block ${isPremium ? "text-white" : "text-slate-800"}`}>Smart Inverter Unit</span>
                        <span className={isPremium ? "text-slate-400" : "text-slate-500"}>{pkg.specs.inverter}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Revision Details: Installation Time, Warranty, Recommended Use */}
                  <div className={`grid grid-cols-2 gap-3 pt-4 border-t text-[11px] ${isPremium ? "border-slate-800" : "border-slate-100"}`}>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Installation Time</span>
                      <span className={`font-black flex items-center gap-1 ${isPremium ? "text-slate-200" : "text-slate-800"}`}>
                        <Clock className="h-3 w-3 text-[#00A651]" /> {pkg.installationTime}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Warranty Support</span>
                      <span className={`font-black flex items-center gap-1 ${isPremium ? "text-slate-200" : "text-slate-800"}`}>
                        <ShieldCheck className="h-3 w-3 text-[#00A651]" /> Active Warranty
                      </span>
                    </div>
                    <div className="col-span-2 space-y-0.5 pt-1.5">
                      <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Recommended Use</span>
                      <span className={`font-black block ${isPremium ? "text-slate-200" : "text-slate-800"}`}>
                        {pkg.recommendedUse}
                      </span>
                    </div>
                  </div>

                  {/* Suitable Appliances Block */}
                  <div className={`pt-4 border-t ${isPremium ? "border-slate-800" : "border-slate-100"}`}>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px] mb-2">Suitable Appliances</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.recommendedAppliances.slice(0, 4).map((app, appIdx) => (
                        <span key={appIdx} className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          isPremium ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                        }`}>
                          {app}
                        </span>
                      ))}
                      {pkg.recommendedAppliances.length > 4 && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          isPremium ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                        }`}>
                          +{pkg.recommendedAppliances.length - 4} More
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100/10 flex flex-col gap-2">
                  <button
                    onClick={() => onConfigurePackage(pkg.id)}
                    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer ${
                      isPremium
                        ? "bg-[#FFD100] hover:bg-[#E2BB13] text-slate-900 shadow-md shadow-[#FFD100]/10"
                        : "bg-[#0057B8] hover:bg-[#0057B8]/90 text-white shadow-md shadow-[#0057B8]/10"
                    }`}
                  >
                    Request Quote for {pkg.name.split(" ")[1]}
                  </button>
                  <button
                    onClick={() => {
                      onViewAllPackages();
                      setTimeout(() => {
                        const target = document.getElementById("compare-packages-table");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }, 250);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      isPremium
                        ? "border-slate-700 hover:border-slate-600 text-white hover:bg-slate-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Compare Package Specs</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center pt-4">
          <button
            onClick={onViewAllPackages}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            <span>View Heavy Commercial Packages (10kVA - 40kVA)</span>
            <ArrowRight className="h-4 w-4 text-[#00A651]" />
          </button>
        </div>
      </div>
    </section>
  );
}
