import React from "react";
import { Shield, Sun, Zap, GraduationCap, Award, CheckCircle, ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";

export default function TrustIndicators() {
  const credentials = [
    {
      title: "COREN Licensed",
      subtitle: "Council for Regulation of Engineering in Nigeria",
      icon: Shield,
      badge: "Verified Compliance",
      colorClass: "blue",
      glowColor: "group-hover:shadow-blue-500/10",
      iconBg: "bg-[#0057B8]/10 text-[#0057B8]",
      accentBg: "from-[#0057B8]/5 via-white to-white",
      badgeColor: "bg-[#0057B8]/10 text-[#0057B8] border-[#0057B8]/20",
      desc: "Every solar blueprint and mechanical layout is signed off by certified, COREN-licensed electrical engineers, ensuring strict compliance with local construction codes.",
      actionText: "Engineering Standard",
      metrics: [
        { label: "License Reg", value: "COREN/ERB/2026/0948" },
        { label: "Active Standards", value: "IEEE 1547, IEC 60364" },
        { label: "Verification Cycle", value: "Active (2026/2027)" },
        { label: "Clearance Level", value: "NEMSA Level 1 Approved" }
      ]
    },
    {
      title: "SESN Authorized",
      subtitle: "Solar Energy Society of Nigeria Member",
      icon: Sun,
      badge: "State Certified",
      colorClass: "emerald",
      glowColor: "group-hover:shadow-emerald-500/10",
      iconBg: "bg-[#00A651]/10 text-[#00A651]",
      accentBg: "from-[#00A651]/5 via-white to-white",
      badgeColor: "bg-[#00A651]/10 text-[#00A651] border-[#00A651]/20",
      desc: "TAPCO is an active corporate member of the SESN network, supporting national grid resilience and leading renewable energy advocacy across West Africa.",
      actionText: "Grid Integrator",
      metrics: [
        { label: "Registry Code", value: "SESN-CORP-2024-N085" },
        { label: "Compliance Authority", value: "Energy Commission (ECN)" },
        { label: "Primary Focus", value: "Grid-Tie Synchronization" },
        { label: "Policy Alliance", value: "National Renewable Act" }
      ]
    },
    {
      title: "Tier-1 Standards",
      subtitle: "A-Grade Raw Monocrystalline Modules",
      icon: Zap,
      badge: "High Performance",
      colorClass: "amber",
      glowColor: "group-hover:shadow-amber-500/10",
      iconBg: "bg-amber-500/10 text-amber-600",
      accentBg: "from-amber-500/5 via-white to-white",
      badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      desc: "We supply exclusively zero-compromise monocrystalline cells, delivering up to 22.8% cell efficiency with active half-cell PERC performance in low-light environments.",
      actionText: "A-Grade Silicon",
      metrics: [
        { label: "Cell Structure", value: "RAW Mono Half-Cell" },
        { label: "Cell Efficiency", value: "22.8% Peak Conversion" },
        { label: "Max Degradation", value: "< 0.45% Annually" },
        { label: "Certifications", value: "IEC 61215, IEC 61730" }
      ]
    },
    {
      title: "NABCEP Aligned",
      subtitle: "North American Board of Certified Energy Practitioners",
      icon: GraduationCap,
      badge: "Accredited Academy",
      colorClass: "purple",
      glowColor: "group-hover:shadow-purple-500/10",
      iconBg: "bg-purple-500/10 text-purple-600",
      accentBg: "from-purple-500/5 via-white to-white",
      badgeColor: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      desc: "Our training academy bootcamps strictly follow NABCEP standards, training regional field specialists with certified real-world installation laboratories.",
      actionText: "Global Curriculums",
      metrics: [
        { label: "Syllabus Standard", value: "NABCEP JTA Framework" },
        { label: "Faculty Status", value: "Board-Certified Trainers" },
        { label: "Laboratory Units", value: "Grid-Interactive & Off-Grid" },
        { label: "Audit Schedule", value: "Compliant Q1 2026" }
      ]
    },
    {
      title: "ISO 9001 System",
      subtitle: "Standardized Quality Management Systems",
      icon: Award,
      badge: "Audit Cleared",
      colorClass: "teal",
      glowColor: "group-hover:shadow-teal-500/10",
      iconBg: "bg-teal-500/10 text-teal-600",
      accentBg: "from-teal-500/5 via-white to-white",
      badgeColor: "bg-teal-500/10 text-teal-700 border-teal-500/20",
      desc: "From initial multi-point shading analysis to materials dispatch and final test commissioning, our processes follow international quality assurance workflows.",
      actionText: "Monitored Supply",
      metrics: [
        { label: "Quality Framework", value: "ISO 9001:2015 Audited" },
        { label: "Verification Body", value: "United Registrar of Systems" },
        { label: "Audited Yield", value: "99.74% Component Quality" },
        { label: "Next Assessment", value: "Surveillance Q2 2027" }
      ]
    },
    {
      title: "5-Year Protection",
      subtitle: "TAPCO Structural Warranty Assurance",
      icon: CheckCircle,
      badge: "Secured Coverage",
      colorClass: "indigo",
      glowColor: "group-hover:shadow-indigo-500/10",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      accentBg: "from-indigo-500/5 via-white to-white",
      badgeColor: "bg-indigo-500/10 text-[#0057B8] border-indigo-500/20",
      desc: "Enjoy peace of mind with a 5-year full engineering warranty on physical balances and inverter integration, backed by our rapid-dispatch service team.",
      actionText: "Guaranteed Security",
      metrics: [
        { label: "BOS Scope", value: "5-Year Full Structural" },
        { label: "Performance SLA", value: "< 24h Urgent Dispatch" },
        { label: "Capacity Output", value: "90% at Yr 10, 80% at Yr 25" },
        { label: "Liability Shield", value: "₦15M Equipment Indemnity" }
      ]
    }
  ];

  return (
    <section id="trust-indicators-section" className="relative w-full bg-slate-50/50 border-b border-slate-200/50 py-16 sm:py-24 overflow-hidden scroll-mt-24">
      {/* Decorative vector grid elements for an authoritative enterprise aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#0057B8] bg-[#0057B8]/10 px-4 py-1.5 rounded-full inline-block">
            Quality Assurance &amp; Authority
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Our Certified Technical Governance
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed font-sans">
            TAPCO does not compromise on safety or compliance. We back every single solar microgrid installation with verified credentials and regulatory alignments.
          </p>
        </div>

        {/* Credentials Grid - Upgraded to elegant, highly spaced bento layout with micro-gradients */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className={`group relative rounded-3xl border border-slate-200/70 bg-gradient-to-br ${badge.accentBg} p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${badge.glowColor}`}
            >
              {/* Subtle top border accent with brand colors */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#0057B8] to-[#00A651] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              {/* Giant background faded number */}
              <span className="absolute right-6 top-8 text-7xl font-black text-slate-200/20 select-none pointer-events-none group-hover:text-slate-200/40 transition-colors duration-300">
                0{idx + 1}
              </span>

              <div className="space-y-6 relative z-10">
                {/* Header Row: Icon and Pill Badge */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${badge.iconBg} border border-white/50 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <badge.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badge.badgeColor}`}>
                    {badge.badge}
                  </span>
                </div>

                {/* Card Title & Institution */}
                <div className="space-y-2 text-left">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                    {badge.subtitle}
                  </p>
                </div>

                {/* Substantial, high-fidelity descriptive text */}
                <p className="text-xs text-slate-500 leading-relaxed font-semibold font-sans text-left">
                  {badge.desc}
                </p>
              </div>

              {/* Card Footer indicator */}
              <div className="mt-8 pt-5 border-t border-slate-100/80 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00A651] transition-colors">
                <span>{badge.actionText}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300" />
              </div>

              {/* TECHNICAL METRICS HOVER OVERLAY */}
              <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-20 text-white rounded-3xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">
                        Technical Metrics
                      </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                      SECURE CERT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                    {badge.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="space-y-0.5 text-left">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                          {metric.label}
                        </span>
                        <p className="text-[10px] font-mono font-bold text-slate-200 truncate" title={metric.value}>
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Governance
                  </span>
                  <span className="text-slate-500 font-mono text-[9px]">0{idx + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
