import React, { useState, useMemo } from "react";
import { 
  Battery, Zap, Plus, Trash, RotateCcw, Info, Sliders, Gauge, Clock, AlertTriangle, CheckCircle, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Appliance {
  id: string;
  name: string;
  wattage: number;
  quantity: number;
  category: "lighting" | "cooling" | "entertainment" | "office" | "kitchen" | "heavy" | "custom";
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: "app-1", name: "LED Light Bulbs", wattage: 10, quantity: 6, category: "lighting" },
  { id: "app-2", name: "Standing Fan", wattage: 55, quantity: 3, category: "cooling" },
  { id: "app-3", name: "LED Smart TV (43\")", wattage: 75, quantity: 1, category: "entertainment" },
  { id: "app-4", name: "Laptops", wattage: 65, quantity: 2, category: "office" },
  { id: "app-5", name: "Double-Door Fridge/Freezer", wattage: 150, quantity: 1, category: "kitchen" },
  { id: "app-6", name: "Inverter Air Conditioner (1.5 HP)", wattage: 850, quantity: 0, category: "cooling" },
  { id: "app-7", name: "Water Pump (1 HP)", wattage: 750, quantity: 0, category: "heavy" },
  { id: "app-8", name: "Sound System / Home Theater", wattage: 100, quantity: 0, category: "entertainment" },
];

export default function BatteryDischargeEstimator() {
  // Appliances State
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  
  // Custom Appliance Inputs
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState<number | "">("");
  const [customCat, setCustomCat] = useState<Appliance["category"]>("custom");

  // Battery Configuration State
  const [batteryType, setBatteryType] = useState<"gel" | "lithium">("lithium");
  const [systemVoltage, setSystemVoltage] = useState<12 | 24 | 48>(48);
  const [batteryCapacityAh, setBatteryCapacityAh] = useState<number>(100); // for Gel
  const [lithiumCapacityKwh, setLithiumCapacityKwh] = useState<number>(4.8); // for Lithium (TAPCO standard modular lithium units)
  const [batteryQty, setBatteryQty] = useState<number>(1);
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(90); // 90%
  const [customDoD, setCustomDoD] = useState<number | null>(null); // Custom Depth of Discharge

  // Reset helper
  const resetToDefault = () => {
    setAppliances(DEFAULT_APPLIANCES.map(a => ({ ...a })));
    setBatteryType("lithium");
    setSystemVoltage(48);
    setBatteryCapacityAh(100);
    setLithiumCapacityKwh(4.8);
    setBatteryQty(1);
    setInverterEfficiency(90);
    setCustomDoD(null);
  };

  // DoD defaults
  const activeDoD = useMemo(() => {
    if (customDoD !== null) return customDoD;
    return batteryType === "lithium" ? 90 : 50;
  }, [batteryType, customDoD]);

  // Handle quantity changes
  const updateQty = (id: string, delta: number) => {
    setAppliances(prev => prev.map(app => {
      if (app.id === id) {
        const nextQty = Math.max(0, app.quantity + delta);
        return { ...app, quantity: nextQty };
      }
      return app;
    }));
  };

  // Handle direct wattage update
  const updateWattage = (id: string, watts: number) => {
    setAppliances(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, wattage: Math.max(1, watts) };
      }
      return app;
    }));
  };

  // Add custom appliance
  const addCustomAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customWatts) return;

    const newApp: Appliance = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      wattage: Number(customWatts),
      quantity: 1,
      category: customCat,
    };

    setAppliances(prev => [...prev, newApp]);
    setCustomName("");
    setCustomWatts("");
    setCustomCat("custom");
  };

  // Delete an appliance
  const deleteAppliance = (id: string) => {
    setAppliances(prev => prev.filter(app => app.id !== id));
  };

  // Calculations
  const totalLoadWatts = useMemo(() => {
    return appliances.reduce((sum, app) => sum + (app.wattage * app.quantity), 0);
  }, [appliances]);

  const batteryMetrics = useMemo(() => {
    let grossWh = 0;
    
    if (batteryType === "lithium") {
      // Lithium is based on standard kWh module units (e.g. 4.8kWh powerwalls or 5kWh stackables)
      grossWh = lithiumCapacityKwh * 1000 * batteryQty;
    } else {
      // Lead Acid / Gel: Voltage * Amp Hours * Quantity
      grossWh = systemVoltage * batteryCapacityAh * batteryQty;
    }

    const usableWh = grossWh * (activeDoD / 100) * (inverterEfficiency / 100);
    
    let dischargeHours = 0;
    if (totalLoadWatts > 0) {
      dischargeHours = usableWh / totalLoadWatts;
    }

    return {
      grossWh,
      usableWh,
      dischargeHours,
    };
  }, [batteryType, systemVoltage, batteryCapacityAh, lithiumCapacityKwh, batteryQty, activeDoD, inverterEfficiency, totalLoadWatts]);

  // Formatted discharge time
  const formattedTime = useMemo(() => {
    if (totalLoadWatts === 0) return { hours: 0, mins: 0, label: "Infinite Autonomy (No Load)" };
    
    const decimalHours = batteryMetrics.dischargeHours;
    const hours = Math.floor(decimalHours);
    const mins = Math.round((decimalHours - hours) * 60);
    
    if (hours >= 100) {
      return { hours, mins, label: "100+ Hours" };
    }
    
    let label = "";
    if (hours > 0) {
      label += `${hours}h `;
    }
    label += `${mins}m`;
    
    return {
      hours,
      mins,
      label,
    };
  }, [totalLoadWatts, batteryMetrics.dischargeHours]);

  // C-rate checks & notifications
  const batteryHealthImpact = useMemo(() => {
    if (totalLoadWatts === 0) return { status: "safe", text: "Ready. Add appliances below to begin estimation.", color: "text-slate-500" };
    
    // Convert load to approximate battery DC Amperes to check against C-rate
    // Watts = Volts * Amps
    const systemVolts = batteryType === "lithium" ? 48 : systemVoltage;
    const dcCurrentAmps = totalLoadWatts / systemVolts;
    
    // Total battery capacity in parallel equivalent Ah
    let totalAh = 0;
    if (batteryType === "lithium") {
      // 48V Lithium approximation: kWh * 1000 / 48V
      totalAh = (lithiumCapacityKwh * 1000 / 48) * batteryQty;
    } else {
      totalAh = batteryCapacityAh * batteryQty;
    }

    const cRate = dcCurrentAmps / totalAh;

    if (batteryType === "gel") {
      if (cRate > 0.3) {
        return {
          status: "danger",
          text: `Critical High Load Alert! You are discharging Gel batteries at ${cRate.toFixed(2)}C. GEL batteries suffer severe thermal stress and Peukert losses when discharged above 0.3C. Actual backup time may drop by up to 35%!`,
          color: "text-rose-600 bg-rose-50 border-rose-100"
        };
      } else if (cRate > 0.15) {
        return {
          status: "warning",
          text: `Moderate High-Current Stress. Your Gel configuration is discharging at ${cRate.toFixed(2)}C. This is safe, but may cause mild Peukert capacity loss. Consider upgrading to Lithium or adding parallel batteries.`,
          color: "text-amber-600 bg-amber-50 border-amber-100"
        };
      }
    } else {
      // Lithium
      if (cRate > 0.8) {
        return {
          status: "warning",
          text: `Lithium High Rate Load (${cRate.toFixed(2)}C). Safe and supported by lithium cells, but close to typical smart BMS limits. Verify your inverter continuous rating matches.`,
          color: "text-amber-600 bg-amber-50 border-amber-100"
        };
      }
    }

    return {
      status: "optimal",
      text: "Excellent! Your connected power load is well within the healthy, high-efficiency discharge rates of this configuration.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    };
  }, [batteryType, systemVoltage, batteryCapacityAh, lithiumCapacityKwh, batteryQty, totalLoadWatts]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-8 text-left overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#00A651] bg-[#00A651]/10 px-3.5 py-1.5 rounded-full">Interactive Tools</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">TAPCO Battery Autonomy &amp; Discharge Estimator</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold font-sans">
            Calculate accurate continuous runtime hours, optimize appliance configurations, and evaluate the premium performance gains of Lithium LiFePO4 cells.
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition self-start sm:self-center cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Config
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Battery Config (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#0057B8]" />
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">1. Configure Storage Bank</h3>
          </div>

          {/* Battery Chemistry */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Storage Chemistry</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBatteryType("lithium")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                  batteryType === "lithium"
                    ? "bg-[#0057B8] text-white border-[#0057B8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>LiFePO4 Lithium</span>
                <span className={`text-[9px] font-medium ${batteryType === "lithium" ? "text-slate-200" : "text-slate-400"}`}>
                  90% DoD • High Cycle Life
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBatteryType("gel")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                  batteryType === "gel"
                    ? "bg-[#0057B8] text-white border-[#0057B8] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Deep Cycle Gel</span>
                <span className={`text-[9px] font-medium ${batteryType === "gel" ? "text-slate-200" : "text-slate-400"}`}>
                  50% DoD • Economic Sizing
                </span>
              </button>
            </div>
          </div>

          {/* Sizing inputs based on battery chemistry */}
          {batteryType === "lithium" ? (
            <div className="space-y-4">
              {/* Modular unit capacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500">Lithium Unit Size</label>
                  <span className="font-extrabold text-slate-700">{lithiumCapacityKwh} kWh</span>
                </div>
                <select
                  value={lithiumCapacityKwh}
                  onChange={(e) => setLithiumCapacityKwh(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0057B8]"
                >
                  <option value={2.5}>2.5 kWh (Standard Wall)</option>
                  <option value={4.8}>4.8 kWh (TAPCO Premium Powerwall)</option>
                  <option value={5.12}>5.12 kWh (TAPCO stackable module)</option>
                  <option value={10.0}>10.0 kWh (TAPCO Pro-Max stack)</option>
                </select>
              </div>

              {/* Number of lithium units */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500">Number of Modules</label>
                  <span className="font-extrabold text-slate-700">{batteryQty} {batteryQty === 1 ? "Unit" : "Units"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={batteryQty}
                    onChange={(e) => setBatteryQty(Number(e.target.value))}
                    className="flex-1 accent-[#0057B8] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={batteryQty}
                    onChange={(e) => setBatteryQty(Math.max(1, Number(e.target.value)))}
                    className="w-14 text-center bg-white border border-slate-200 rounded-xl py-1 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* System DC Voltage */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">System Voltage</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[12, 24, 48].map((volts) => (
                    <button
                      key={volts}
                      type="button"
                      onClick={() => setSystemVoltage(volts as 12 | 24 | 48)}
                      className={`py-2 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        systemVoltage === volts
                          ? "bg-[#0057B8]/10 text-[#0057B8] border-[#0057B8]/40"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {volts}V
                    </button>
                  ))}
                </div>
              </div>

              {/* Ah Rating per battery */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500">Battery Rating (Ah)</label>
                  <span className="font-extrabold text-slate-700">{batteryCapacityAh} Ah</span>
                </div>
                <select
                  value={batteryCapacityAh}
                  onChange={(e) => setBatteryCapacityAh(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0057B8]"
                >
                  <option value={100}>100 Ah</option>
                  <option value={150}>150 Ah</option>
                  <option value={200}>200 Ah (Standard Gel)</option>
                  <option value={260}>260 Ah (Heavy duty)</option>
                </select>
              </div>

              {/* Battery Quantity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500">Battery Quantity (Total)</label>
                  <span className="font-extrabold text-slate-700">{batteryQty} {batteryQty === 1 ? "Unit" : "Units"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={batteryQty}
                    onChange={(e) => setBatteryQty(Number(e.target.value))}
                    className="flex-1 accent-[#0057B8] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={batteryQty}
                    onChange={(e) => setBatteryQty(Math.max(1, Number(e.target.value)))}
                    className="w-14 text-center bg-white border border-slate-200 rounded-xl py-1 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Factors */}
          <div className="border-t border-slate-200/60 pt-4 space-y-3.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Advanced Efficiency Factors</span>

            {/* Target Depth of Discharge */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-500">Depth of Discharge (DoD)</label>
                <span className="font-extrabold text-[#00A651]">{activeDoD}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={activeDoD}
                onChange={(e) => setCustomDoD(Number(e.target.value))}
                className="w-full accent-[#00A651] h-1 bg-slate-200 rounded-lg cursor-pointer"
              />
              <p className="text-[9px] text-slate-400 font-medium font-sans">
                {batteryType === "lithium" 
                  ? "Lithium batteries safely handle 80% - 95% DoD." 
                  : "We strongly recommend keeping Gel batteries below 50% DoD to preserve system life."}
              </p>
            </div>

            {/* Inverter Efficiency */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-500">Inverter Conversion Loss</label>
                <span className="font-extrabold text-slate-600">{inverterEfficiency}% efficiency</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={inverterEfficiency}
                onChange={(e) => setInverterEfficiency(Number(e.target.value))}
                className="w-full accent-slate-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Middle Column: Appliances Checklist & Custom Adds (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#00A651]" />
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">2. Select Household Load</h3>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md tracking-wider">
              {appliances.filter(a => a.quantity > 0).length} active loads
            </span>
          </div>

          {/* Appliances Table/List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {appliances.map((app) => (
              <div 
                key={app.id} 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  app.quantity > 0 
                    ? "bg-emerald-50/20 border-emerald-500/10 hover:border-emerald-500/20 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200/80"
                }`}
              >
                <div className="space-y-1 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{app.name}</span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      app.category === "heavy" ? "bg-rose-100 text-rose-700" :
                      app.category === "cooling" ? "bg-cyan-100 text-cyan-700" :
                      app.category === "lighting" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {app.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold font-sans">Power consumption:</span>
                    <input
                      type="number"
                      min="1"
                      value={app.wattage}
                      onChange={(e) => updateWattage(app.id, Number(e.target.value))}
                      className="w-12 text-center bg-slate-100/60 border border-slate-200/50 rounded-md py-0.5 text-[10px] font-bold text-slate-700 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">W</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity adjustment buttons */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => updateQty(app.id, -1)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition font-black text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2.5 text-xs font-black text-slate-800">{app.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(app.id, 1)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition font-black text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {app.category === "custom" && (
                    <button
                      type="button"
                      onClick={() => deleteAppliance(app.id)}
                      className="text-slate-300 hover:text-rose-500 transition p-1 cursor-pointer"
                      title="Remove custom appliance"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Appliance Form */}
          <form onSubmit={addCustomAppliance} className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Add Custom Appliance</span>
            <div className="grid gap-2 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="e.g. Microwave Oven"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4 flex items-center bg-white border border-slate-200 rounded-xl px-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Watts"
                  value={customWatts}
                  onChange={(e) => setCustomWatts(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border-0 px-1 py-1.5 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0"
                />
                <span className="text-[10px] text-slate-400 font-bold pr-1">W</span>
              </div>
              <button
                type="submit"
                disabled={!customName.trim() || !customWatts}
                className="sm:col-span-3 bg-[#00A651] hover:bg-[#008A42] text-white disabled:bg-slate-200 disabled:text-slate-400 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Display Gauge, Calculations, and Warnings (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Gauge className="h-5 w-5 text-[#FFD100]" />
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">3. Live Estimation</h3>
          </div>

          {/* Autonomy Badge / Gauge */}
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-900 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-lg relative overflow-hidden">
            {/* Ambient subtle backdrop glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A651]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0057B8]/10 rounded-full blur-3xl" />

            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#FFD100]" />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Continuous Autonomy</span>
              <div className="text-3xl sm:text-4xl font-black text-[#00A651] tracking-tight">
                {formattedTime.label}
              </div>
            </div>

            <div className="w-full space-y-2 border-t border-white/10 pt-4 text-xs font-sans text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Total Connected Load</span>
                <span className="font-extrabold text-white">{totalLoadWatts} Watts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Usable Capacity</span>
                <span className="font-extrabold text-white">{(batteryMetrics.usableWh / 1000).toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Total Storage Capacity</span>
                <span>{(batteryMetrics.grossWh / 1000).toFixed(2)} kWh</span>
              </div>
            </div>
          </div>

          {/* C-Rate / Peukert Warning Info Card */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans font-semibold flex items-start gap-2.5 ${batteryHealthImpact.color}`}>
            {batteryHealthImpact.status === "danger" ? (
              <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            ) : batteryHealthImpact.status === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <p className="flex-1 text-left text-[11px]">
              {batteryHealthImpact.text}
            </p>
          </div>

          {/* Educational Insights / Recommendations */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3.5 text-left font-sans">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-[#0057B8]" />
              Engineering Tips by TAPCO
            </span>
            <ul className="space-y-2.5 text-[10px] text-slate-500 font-semibold">
              <li className="flex gap-2">
                <span className="text-[#00A651] font-black">✔</span>
                <span><strong>Duty Cycle Sizing:</strong> Most appliances do not run continuously. Fridges operate ~50% duty cycle, meaning actual standby backup is roughly double what is estimated.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00A651] font-black">✔</span>
                <span><strong>Lithium Advantage:</strong> TAPCO’s Lithium modular cells withstand 6000+ deep cycles, compared to Gel batteries which lose performance if discharged past 50% DoD regularly.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
