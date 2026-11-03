import React, { useState } from "react";
import { Zap, ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

interface HomeCalculatorPreviewProps {
  onAdvancedCalculatorClick: () => void;
}

export default function HomeCalculatorPreview({ onAdvancedCalculatorClick }: HomeCalculatorPreviewProps) {
  const [previewLoadPreset, setPreviewLoadPreset] = useState<"small" | "medium" | "large">("medium");

  const presets = [
    { 
      id: "small", 
      title: "Small Apartment / Office", 
      sub: "Lights, fans, TV, routers, laptop & fridge", 
      capacity: "1.5kVA / 2.5kWh System",
      estimatedPrice: "₦1,250,000 - ₦1,450,000",
      solarSpecs: "2x 550W Panels + 2.5kWh LiFePO4",
      monthlySavings: "₦45,000 / mo"
    },
    { 
      id: "medium", 
      title: "3-4 Bedroom Duplex / Clinic", 
      sub: "Double fridge, water pump, 2 Inverter ACs, LEDs", 
      capacity: "5.5kVA / 10.2kWh System",
      estimatedPrice: "₦3,850,000 - ₦4,350,000",
      solarSpecs: "8x 550W Panels + 10.2kWh LiFePO4",
      monthlySavings: "₦195,000 / mo"
    },
    { 
      id: "large", 
      title: "Commercial School / Estate / Hub", 
      sub: "Multi-ACs, heavy borehole pumps, labs & servers", 
      capacity: "20kVA / 30.7kWh 3-Phase",
      estimatedPrice: "₦14,500,000 - ₦16,800,000",
      solarSpecs: "24x 550W Panels + 30.7kWh Rack",
      monthlySavings: "₦780,000 / mo"
    }
  ];

  const currentPresetData = presets.find(p => p.id === previewLoadPreset) || presets[1];

  return (
    <section id="load-calculator-preview-section" className="w-full bg-white border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Solar Estimator
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Smart Power Sizing &amp; Cost Estimator
          </h3>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Select a property archetype to immediately view engineered inverter ratings, lithium capacity, and real-time Nigerian Naira estimated investment.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Quick Presets selector */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Select Property Setup</h4>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
              Each preset models verified continuous appliance demands, matching balanced LiFePO4 storage cycles and high-efficiency Tier-1 solar panels.
            </p>
            
            <div className="grid gap-4">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPreviewLoadPreset(preset.id as any)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    previewLoadPreset === preset.id
                      ? "bg-[#0057B8]/5 border-[#0057B8] ring-2 ring-[#0057B8]/20 shadow-md"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-sm block text-slate-900">{preset.title}</span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase mt-1 block">{preset.sub}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#00A651] uppercase tracking-wider bg-[#00A651]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {preset.id.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="border-t border-slate-200/60 mt-4 pt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Estimated Price:</span>
                    <span className="text-[#0057B8] font-black">{preset.estimatedPrice}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Live dynamic visual stats dashboard */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0057B8]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00A651]/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Live Presets Metrics */}
            <div className="space-y-8 relative z-10 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                    Recommended Sizing Configuration
                  </span>
                  <span className="text-xl font-black text-white uppercase tracking-wider mt-0.5 block">
                    {currentPresetData.capacity}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#0057B8]/20 flex items-center justify-center text-[#FFD100]">
                  <Zap className="h-6 w-6" />
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                    Turnkey Estimated Price (NGN)
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD100] font-mono mt-0.5 block">
                    {currentPresetData.estimatedPrice}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#00A651] block flex items-center gap-1 sm:justify-end">
                    <TrendingUp className="h-3 w-3" />
                    Monthly Generator Savings
                  </span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">
                    {currentPresetData.monthlySavings}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Estimated Peak Load</span>
                  <span className="text-xl font-black text-[#FFD100] mt-1 block font-mono">
                    {previewLoadPreset === "small" ? "1.2 kW" : previewLoadPreset === "medium" ? "4.8 kW" : "18.5 kW"}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">Continuous concurrent watt</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Daily Solar Yield</span>
                  <span className="text-xl font-black text-[#00A651] mt-1 block font-mono">
                    {previewLoadPreset === "small" ? "5.4 kWh" : previewLoadPreset === "medium" ? "22.8 kWh" : "86.0 kWh"}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">Under peak solar irradiance</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Hardware Blueprint</span>
                  <span className="text-xs font-black text-slate-200 mt-1 block leading-tight">
                    {currentPresetData.solarSpecs}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">Grade-A LiFePO4 cells</span>
                </div>
              </div>

              {/* Supported appliances list */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-left">
                <h5 className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                  Typical Powered Load Schedule:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(previewLoadPreset === "small"
                    ? ["5x LED bulbs", "3x High-velocity fans", "Wi-Fi Router", "2x Laptop / phone chargers", "Smart TV", "Mini Fridge"]
                    : previewLoadPreset === "medium"
                      ? ["15x LED bulbs", "6x Ceiling fans", "Double-door inverter fridge", "Deep freezer", "2x 1.5HP Inverter ACs", "1HP Water pump", "Microwave"]
                      : ["50x LED bulbs", "15x Ceiling fans", "4x Double fridges", "8x 1.5HP Inverter ACs", "2HP borehole pump", "Server racks", "Medical/Lab units"]
                  ).map((app, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-800 border border-slate-700/60 text-slate-300 px-3 py-1 rounded-lg">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <p className="text-[11px] text-slate-400 font-medium max-w-sm text-left">
                Want to calculate exact sizing based on individual appliances in your home or facility?
              </p>
              <button
                onClick={onAdvancedCalculatorClick}
                className="rounded-xl bg-[#FFD100] hover:bg-[#E2BB13] text-slate-900 font-black px-6 py-3.5 text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md flex items-center gap-2"
              >
                <span>Launch Interactive Sizer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
