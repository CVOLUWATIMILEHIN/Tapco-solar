import React from "react";
import { Shield, Zap, SunMedium, BatteryCharging, LineChart, Cpu } from "lucide-react";
import { motion } from "motion/react";

export default function WhyChooseUs() {
  const edgeItems = [
    {
      title: "German-Engineered Monocrystalline Modules",
      desc: "We utilize advanced half-cell PERC technology to deliver a verified 22.8% solar-to-electricity conversion rating. These high-density silicon wafers capture broader wavelengths, ensuring active power generation even during highly overcast, rainy, or dusty days.",
      stat: "22.8% Eff",
      statLabel: "Module Rating",
      icon: SunMedium,
      color: "bg-[#FFD100]/10 text-[#FFD100] border-[#FFD100]/20"
    },
    {
      title: "High-Cycle LiFePO4 Battery Systems",
      desc: "Our systems integrate top-tier Lithium Iron Phosphate storage cells. Engineered to deliver 6,000+ full charging cycles (equivalent to 15+ years of active continuous operation) while maintaining a high depth of discharge (DoD) of 90%.",
      stat: "6,000+ Cycles",
      statLabel: "15+ Years Service",
      icon: BatteryCharging,
      color: "bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20"
    },
    {
      title: "Real-Time Cloud IoT Telemetry",
      desc: "Gain absolute transparency over your solar generation, state of charge (SoC), and active household appliances. Our systems are fitted with robust Wi-Fi and cell-network telemetry modules that synchronize directly with your portal.",
      stat: "Live IoT",
      statLabel: "24/7 Monitoring",
      icon: LineChart,
      color: "bg-[#0057B8]/10 text-[#0057B8] border-[#0057B8]/20"
    }
  ];

  return (
    <section id="why-choose-us-section" className="w-full bg-slate-50 border-b border-slate-200/60 py-12 sm:py-16 md:py-20 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#0057B8] block">
            Our Technical Edge
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            The TAPCO Engineering Distinction
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Why West African enterprises, luxury estate planners, and critical public infrastructures select TAPCO for mission-critical power engineering.
          </p>
        </div>

        {/* Dynamic Bento/Row Grid Structure */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          
          {/* Left Column - Heavy Duty Outage Guarantee Card */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0F2937] text-white p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-800">
            {/* Ambient Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]"></div>
            
            <div className="space-y-8 relative z-10 text-left">
              <span className="inline-block text-[10px] uppercase font-black text-[#FFD100] tracking-widest bg-white/10 border border-white/15 px-4 py-1.5 rounded-full">
                Engineering Commitment
              </span>
              <div className="space-y-4">
                <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white">
                  The Zero-Outage Power Guarantee
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold">
                  Every power system we design is built with sub-15 millisecond seamless failover logic. This protects sensitive medical instruments, laboratory computers, server clusters, and home offices from sudden voltage drops, harmonics, or complete grid collapses.
                </p>
              </div>
            </div>

            {/* Micro details row */}
            <div className="border-t border-white/10 pt-8 mt-12 relative z-10 flex items-center justify-between">
              <div className="text-left space-y-1">
                <span className="block text-2xl md:text-3xl font-black text-[#00A651]">25 Years</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Panel Efficiency Warranty</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD100]">
                <Shield className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Right Column - Stacked luxury detailed cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {edgeItems.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.04)" }}
                className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:border-slate-300 transition-all duration-300 shadow-sm"
              >
                {/* Icon & Description Column */}
                <div className="flex gap-5 items-start text-left flex-1 min-w-0">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0057B8] shrink-0 shadow-sm">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Highly structured, prominent scientific metric badge */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-2 shrink-0">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                    {item.statLabel}
                  </span>
                  <div className={`px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wider text-center min-w-[130px] border ${item.color}`}>
                    {item.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
