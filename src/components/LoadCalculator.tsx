/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, FormEvent } from "react";
import { 
  Plus, 
  Minus,
  Trash2, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  CheckCircle,
  Lightbulb,
  Tv,
  Wind,
  Refrigerator,
  Flame,
  Laptop,
  Compass,
  Sun,
  Battery,
  BatteryCharging,
  TrendingUp,
  Clock,
  Printer,
  Share2,
  Check,
  ShieldCheck,
  Building,
  Home as HomeIcon,
  Sliders,
  DollarSign,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from "lucide-react";
import { useCMS } from "../context/CMSContext";
import { SolarPackage } from "../types";
import { motion, AnimatePresence } from "motion/react";

export interface ApplianceItem {
  id: string;
  name: string;
  category: "lighting" | "cooling" | "kitchen" | "entertainment" | "office" | "heavy" | "custom";
  count: number;
  watts: number;
  hours: number;
}

interface LoadCalculatorProps {
  onQuoteRequested: (appliances: ApplianceItem[], recommendedPackage: SolarPackage | null, estimatedPrice?: number) => void;
}

// Predefined list of popular appliances grouped by category for modern 1-click addition
const PRESET_CATALOG: Array<{
  name: string;
  category: ApplianceItem["category"];
  watts: number;
  defaultHours: number;
  icon: any;
}> = [
  { name: "LED Bulbs (Set of 5)", category: "lighting", watts: 45, defaultHours: 8, icon: Lightbulb },
  { name: "Security Floodlight (100W)", category: "lighting", watts: 100, defaultHours: 10, icon: Lightbulb },
  { name: "Standing / Ceiling Fan", category: "cooling", watts: 65, defaultHours: 12, icon: Wind },
  { name: "1.0 HP Inverter AC", category: "cooling", watts: 800, defaultHours: 6, icon: Wind },
  { name: "1.5 HP Inverter AC", category: "cooling", watts: 1150, defaultHours: 6, icon: Wind },
  { name: "2.0 HP Inverter AC", category: "cooling", watts: 1600, defaultHours: 6, icon: Wind },
  { name: "Smart TV (43\" - 55\")", category: "entertainment", watts: 100, defaultHours: 6, icon: Tv },
  { name: "Home Audio / Decoder", category: "entertainment", watts: 80, defaultHours: 5, icon: Tv },
  { name: "Inverter Refrigerator", category: "kitchen", watts: 140, defaultHours: 24, icon: Refrigerator },
  { name: "Deep Chest Freezer", category: "kitchen", watts: 200, defaultHours: 24, icon: Refrigerator },
  { name: "Microwave Oven", category: "kitchen", watts: 1100, defaultHours: 0.5, icon: Flame },
  { name: "Electric Kettle", category: "kitchen", watts: 1500, defaultHours: 0.5, icon: Flame },
  { name: "Laptop & Workstation", category: "office", watts: 75, defaultHours: 8, icon: Laptop },
  { name: "Wi-Fi Router & Starlink", category: "office", watts: 40, defaultHours: 24, icon: Laptop },
  { name: "1.0 HP Water Borehole Pump", category: "heavy", watts: 750, defaultHours: 1.5, icon: Cpu },
  { name: "2.0 HP Heavy Water Pump", category: "heavy", watts: 1500, defaultHours: 1.5, icon: Cpu },
];

// Quick Property Load Templates for instant 1-click loading
const PROPERTY_TEMPLATES = [
  {
    id: "apartment",
    title: "1-2 Bed Apartment",
    subtitle: "Essential lights, fans, TV, fridge & Wi-Fi",
    icon: HomeIcon,
    items: [
      { id: "p1", name: "LED Bulbs (Set of 5)", category: "lighting" as const, count: 2, watts: 45, hours: 8 },
      { id: "p2", name: "Standing / Ceiling Fan", category: "cooling" as const, count: 3, watts: 65, hours: 10 },
      { id: "p3", name: "Smart TV (43\" - 55\")", category: "entertainment" as const, count: 1, watts: 100, hours: 6 },
      { id: "p4", name: "Inverter Refrigerator", category: "kitchen" as const, count: 1, watts: 140, hours: 24 },
      { id: "p5", name: "Laptop & Workstation", category: "office" as const, count: 2, watts: 75, hours: 8 },
      { id: "p6", name: "Wi-Fi Router & Starlink", category: "office" as const, count: 1, watts: 40, hours: 24 },
    ]
  },
  {
    id: "duplex",
    title: "3-4 Bed Duplex",
    subtitle: "Full household + 1-2 Inverter ACs + Freezer + Pump",
    icon: Building,
    items: [
      { id: "d1", name: "LED Bulbs (Set of 5)", category: "lighting" as const, count: 4, watts: 45, hours: 8 },
      { id: "d2", name: "Standing / Ceiling Fan", category: "cooling" as const, count: 6, watts: 65, hours: 12 },
      { id: "d3", name: "1.5 HP Inverter AC", category: "cooling" as const, count: 2, watts: 1150, hours: 6 },
      { id: "d4", name: "Smart TV (43\" - 55\")", category: "entertainment" as const, count: 2, watts: 100, hours: 6 },
      { id: "d5", name: "Inverter Refrigerator", category: "kitchen" as const, count: 1, watts: 140, hours: 24 },
      { id: "d6", name: "Deep Chest Freezer", category: "kitchen" as const, count: 1, watts: 200, hours: 24 },
      { id: "d7", name: "1.0 HP Water Borehole Pump", category: "heavy" as const, count: 1, watts: 750, hours: 1.5 },
      { id: "d8", name: "Wi-Fi Router & Starlink", category: "office" as const, count: 1, watts: 40, hours: 24 },
    ]
  },
  {
    id: "executive",
    title: "Executive Mansion / Clinic",
    subtitle: "Heavy duty cooling, multi-fridges, medical/pumps",
    icon: Building,
    items: [
      { id: "e1", name: "LED Bulbs (Set of 5)", category: "lighting" as const, count: 8, watts: 45, hours: 10 },
      { id: "e2", name: "Standing / Ceiling Fan", category: "cooling" as const, count: 8, watts: 65, hours: 12 },
      { id: "e3", name: "1.5 HP Inverter AC", category: "cooling" as const, count: 4, watts: 1150, hours: 8 },
      { id: "e4", name: "2.0 HP Inverter AC", category: "cooling" as const, count: 1, watts: 1600, hours: 6 },
      { id: "e5", name: "Deep Chest Freezer", category: "kitchen" as const, count: 2, watts: 200, hours: 24 },
      { id: "e6", name: "Inverter Refrigerator", category: "kitchen" as const, count: 2, watts: 140, hours: 24 },
      { id: "e7", name: "2.0 HP Heavy Water Pump", category: "heavy" as const, count: 1, watts: 1500, hours: 2 },
      { id: "e8", name: "Laptop & Workstation", category: "office" as const, count: 4, watts: 75, hours: 10 },
    ]
  },
  {
    id: "commercial",
    title: "School / Commercial Complex",
    subtitle: "3-Phase industrial load, servers, lab & multi-ACs",
    icon: Cpu,
    items: [
      { id: "c1", name: "LED Bulbs (Set of 5)", category: "lighting" as const, count: 15, watts: 45, hours: 12 },
      { id: "c2", name: "1.5 HP Inverter AC", category: "cooling" as const, count: 8, watts: 1150, hours: 8 },
      { id: "c3", name: "2.0 HP Heavy Water Pump", category: "heavy" as const, count: 2, watts: 1500, hours: 3 },
      { id: "c4", name: "Laptop & Workstation", category: "office" as const, count: 12, watts: 75, hours: 9 },
      { id: "c5", name: "Deep Chest Freezer", category: "kitchen" as const, count: 3, watts: 200, hours: 24 },
      { id: "c6", name: "Security Floodlight (100W)", category: "lighting" as const, count: 6, watts: 100, hours: 12 },
    ]
  }
];

export default function LoadCalculator({ onQuoteRequested }: LoadCalculatorProps) {
  const { solarPackages } = useCMS();
  const [calculatorMode, setCalculatorMode] = useState<"appliances" | "bill" | "autonomy">("appliances");
  const [activePropertyPreset, setActivePropertyPreset] = useState<string>("apartment");
  
  // Appliance items state
  const [items, setItems] = useState<ApplianceItem[]>(PROPERTY_TEMPLATES[0].items);
  
  // Hardware Tier Selection
  const [selectedTier, setSelectedTier] = useState<"economy" | "premium" | "enterprise">("premium");
  
  // Autonomy Target (hours of night/cloudy backup)
  const [backupHoursTarget, setBackupHoursTarget] = useState<number>(14); // 14 hours night backup standard
  
  // Bill Offset Inputs (for Bill Mode)
  const [monthlyNepaBill, setMonthlyNepaBill] = useState<number>(120000); // ₦120,000
  const [monthlyFuelSpend, setMonthlyFuelSpend] = useState<number>(180000); // ₦180,000 for generator
  
  // Custom Appliance Builder states
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState<number | "">("");
  const [customHours, setCustomHours] = useState<number | "">("");
  const [customQty, setCustomQty] = useState<number>(1);
  const [customCategory, setCustomCategory] = useState<ApplianceItem["category"]>("custom");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Live packages sync
  const [livePackages, setLivePackages] = useState<SolarPackage[]>(solarPackages);

  useEffect(() => {
    setLivePackages(solarPackages);
  }, [solarPackages]);

  useEffect(() => {
    let active = true;
    fetch("/api/solar-prices")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (active && data.success && data.packages) {
          const updated = solarPackages.map((p) => {
            const apiPkg = data.packages.find((ap: any) => ap.id === p.id);
            return apiPkg ? { ...p, price: apiPkg.price } : p;
          });
          setLivePackages(updated);
        }
      })
      .catch((err) => {
        console.warn("Using fallback solar prices:", err.message || err);
      });
    return () => {
      active = false;
    };
  }, [solarPackages]);

  // Load a property preset
  const handleSelectPropertyPreset = (presetId: string) => {
    setActivePropertyPreset(presetId);
    const found = PROPERTY_TEMPLATES.find(p => p.id === presetId);
    if (found) {
      setItems(found.items.map(i => ({ ...i })));
    }
  };

  // Add standard item from catalog
  const handleAddFromCatalog = (preset: typeof PRESET_CATALOG[0]) => {
    const existingIndex = items.findIndex(i => i.name.toLowerCase() === preset.name.toLowerCase());
    if (existingIndex >= 0) {
      setItems(prev => prev.map((item, idx) => 
        idx === existingIndex ? { ...item, count: item.count + 1 } : item
      ));
    } else {
      const newItem: ApplianceItem = {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: preset.name,
        category: preset.category,
        count: 1,
        watts: preset.watts,
        hours: preset.defaultHours
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  // Stepper increment / decrement
  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = Math.max(0, item.count + delta);
        return { ...item, count: newCount };
      }
      return item;
    }).filter(item => item.count > 0));
  };

  const updateHours = (id: string, hours: number) => {
    const clamped = Math.max(0.5, Math.min(24, hours));
    setItems(prev => prev.map(item => item.id === id ? { ...item, hours: clamped } : item));
  };

  const updateWatts = (id: string, watts: number) => {
    const clamped = Math.max(1, watts);
    setItems(prev => prev.map(item => item.id === id ? { ...item, watts: clamped } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomAppliance = (e: FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const wattsVal = typeof customWatts === "number" ? customWatts : 100;
    const hoursVal = typeof customHours === "number" ? customHours : 6;

    const newItem: ApplianceItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      count: customQty > 0 ? customQty : 1,
      watts: Math.max(1, wattsVal),
      hours: Math.min(24, Math.max(0.5, hoursVal))
    };

    setItems(prev => [newItem, ...prev]);
    setCustomName("");
    setCustomWatts("");
    setCustomHours("");
    setCustomQty(1);
    setShowCustomModal(false);
  };

  const resetToDefault = () => {
    handleSelectPropertyPreset("apartment");
    setSelectedTier("premium");
    setBackupHoursTarget(14);
    setSubmitSuccess(false);
  };

  // --- CORE ELECTRICAL CALCULATIONS ---
  const totalWatts = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.watts * item.count), 0);
  }, [items]);

  const totalDailyWh = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.watts * item.count * item.hours), 0);
  }, [items]);

  const totalDailyKWh = totalDailyWh / 1000;

  // Inverter Sizing: Peak load with 30% safety surge factor
  const calculatedInverterKw = useMemo(() => {
    if (totalWatts === 0) return 1.0;
    const surge = totalWatts * 1.30;
    if (surge <= 1200) return 1.2;
    if (surge <= 2500) return 2.5;
    if (surge <= 3500) return 3.5;
    if (surge <= 5500) return 5.5;
    if (surge <= 8000) return 8.0;
    if (surge <= 11000) return 11.0;
    if (surge <= 16000) return 15.0;
    if (surge <= 22000) return 20.0;
    if (surge <= 35000) return 30.0;
    return Math.ceil(surge / 10000) * 10;
  }, [totalWatts]);

  // Battery Storage Sizing: (Daily consumption * target night ratio / DoD / Inverter efficiency)
  // Average Nigeria night load is roughly 65% of daily consumption
  const calculatedBatteryKwh = useMemo(() => {
    if (totalDailyKWh === 0) return 2.5;
    const nightPortion = Math.min(1.0, backupHoursTarget / 24);
    const dod = selectedTier === "economy" ? 0.80 : 0.90; // 90% DoD for Tier 1 LiFePO4
    const inverterLoss = 0.92;
    const requiredKwh = (totalDailyKWh * nightPortion) / (dod * inverterLoss);
    
    // Round to standard modular units (2.56kWh, 5.12kWh, 10.24kWh, 14.3kWh, 20.48kWh, etc.)
    if (requiredKwh <= 2.8) return 2.56;
    if (requiredKwh <= 5.5) return 5.12;
    if (requiredKwh <= 10.8) return 10.24;
    if (requiredKwh <= 16.0) return 15.36;
    if (requiredKwh <= 22.0) return 20.48;
    if (requiredKwh <= 32.0) return 30.72;
    return Math.ceil(requiredKwh / 5.12) * 5.12;
  }, [totalDailyKWh, backupHoursTarget, selectedTier]);

  // Solar PV Array Sizing: Daily energy / 5.2 peak sun hours / system efficiency (0.80)
  const calculatedSolarPanelsWatts = useMemo(() => {
    if (totalDailyWh === 0) return 1100;
    const peakSunHours = 5.2; // Nigerian average peak irradiance hours
    const systemLoss = 0.80; // Soiling, temperature coefficient, cable drop
    const rawPvWatts = totalDailyWh / (peakSunHours * systemLoss);
    const panelUnitWattage = 550; // Standard Tier-1 Half-Cell Monocrystalline panel
    const panelCount = Math.max(2, Math.ceil(rawPvWatts / panelUnitWattage));
    return panelCount * panelUnitWattage;
  }, [totalDailyWh]);

  const panelCount = Math.round(calculatedSolarPanelsWatts / 550);

  // --- DYNAMIC ACCURATE NIGERIAN PRICING ESTIMATION ENGINE ---
  const priceBreakdown = useMemo(() => {
    // Current market benchmark rates in Nigeria (2025/2026 Naira baseline)
    // 1. Inverter Cost
    let inverterCost = 0;
    if (calculatedInverterKw <= 1.5) inverterCost = 320000;
    else if (calculatedInverterKw <= 3.5) inverterCost = 680000;
    else if (calculatedInverterKw <= 5.5) inverterCost = 1150000;
    else if (calculatedInverterKw <= 8.0) inverterCost = 1850000;
    else if (calculatedInverterKw <= 11.0) inverterCost = 2550000;
    else if (calculatedInverterKw <= 15.0) inverterCost = 3850000;
    else if (calculatedInverterKw <= 20.0) inverterCost = 5200000;
    else inverterCost = calculatedInverterKw * 240000;

    // 2. Battery Cost (LiFePO4 high-cycle wall-mount / rackmount)
    // Standard ~₦290,000 per kWh for Grade-A LiFePO4 cells with built-in Smart BMS
    let batteryCostPerKwh = 295000;
    if (selectedTier === "economy") batteryCostPerKwh = 245000;
    if (selectedTier === "enterprise") batteryCostPerKwh = 340000;
    const batteryCost = Math.round(calculatedBatteryKwh * batteryCostPerKwh);

    // 3. Solar PV Array Cost (Tier-1 Monocrystalline / Bifacial TOPCon)
    // ~₦210 per watt (₦115,500 per 550W Tier-1 panel + anodized aluminum rails)
    let panelCostPerWatt = 215;
    if (selectedTier === "economy") panelCostPerWatt = 185;
    if (selectedTier === "enterprise") panelCostPerWatt = 250;
    const solarPanelsCost = Math.round(calculatedSolarPanelsWatts * panelCostPerWatt);

    // 4. Balance of System (BOS) & Protection
    // DC Isolators, SPD Lightning Arrestors, Earth Rod & Copper Cable Loom, AC Manual Bypass Switch
    const bosCost = Math.round(180000 + (calculatedInverterKw * 45000));

    // 5. Professional Installation & NEMSA Engineering Certification
    const installCost = Math.round(120000 + (calculatedInverterKw * 35000) + (panelCount * 8000));

    // Tier Multipliers
    let tierFactor = 1.0;
    if (selectedTier === "economy") tierFactor = 0.88;
    if (selectedTier === "enterprise") tierFactor = 1.22;

    const subtotal = Math.round((inverterCost + batteryCost + solarPanelsCost + bosCost + installCost) * tierFactor);

    // Round nicely to nearest ₦10,000
    const totalEstimatedPrice = Math.round(subtotal / 10000) * 10000;

    return {
      inverterCost: Math.round(inverterCost * tierFactor),
      batteryCost: Math.round(batteryCost * tierFactor),
      solarPanelsCost: Math.round(solarPanelsCost * tierFactor),
      bosCost: Math.round(bosCost * tierFactor),
      installCost: Math.round(installCost * tierFactor),
      totalEstimatedPrice: Math.max(950000, totalEstimatedPrice),
      monthlyInstallment12Mo: Math.round((totalEstimatedPrice * 1.12) / 12),
      monthlyInstallment24Mo: Math.round((totalEstimatedPrice * 1.22) / 24)
    };
  }, [calculatedInverterKw, calculatedBatteryKwh, calculatedSolarPanelsWatts, panelCount, selectedTier]);

  // --- FINANCIAL ROI & FUEL SAVINGS COMPUTATION ---
  const financialROI = useMemo(() => {
    // Average cost per kWh in Nigeria under Band A DisCo (₦209/kWh) or Petrol/Diesel Gen (₦380 - ₦550/kWh)
    const blendedKwhCost = 320; // ₦320 per kWh blended fuel/utility cost
    const monthlyGeneratedKwh = totalDailyKWh * 30;
    const monthlyFuelSavings = Math.round(monthlyGeneratedKwh * blendedKwhCost);
    const annualSavings = monthlyFuelSavings * 12;
    
    // Payback period in years
    const paybackYears = priceBreakdown.totalEstimatedPrice > 0 && annualSavings > 0
      ? (priceBreakdown.totalEstimatedPrice / annualSavings).toFixed(1)
      : "2.1";

    const tenYearNetSavings = Math.max(0, (annualSavings * 10) - priceBreakdown.totalEstimatedPrice);
    
    // Environmental Metric: 0.72 kg CO2 per kWh offset
    const annualCo2OffsetKg = Math.round(monthlyGeneratedKwh * 12 * 0.72);
    const treesEquivalent = Math.round(annualCo2OffsetKg / 21); // ~21kg CO2 per tree per year

    return {
      monthlyFuelSavings: Math.max(45000, monthlyFuelSavings),
      annualSavings: Math.max(540000, annualSavings),
      paybackYears,
      tenYearNetSavings,
      annualCo2OffsetTonnes: (annualCo2OffsetKg / 1000).toFixed(1),
      treesEquivalent
    };
  }, [totalDailyKWh, priceBreakdown.totalEstimatedPrice]);

  // Sizing Recommendation Package Match
  const recommendedPackage = useMemo(() => {
    if (calculatedInverterKw <= 1.5) {
      return {
        id: "pkg-1",
        name: "TAPCO 1kVA - 1.5kVA Starter Powerwall",
        capacity: "1.5kVA / 1.2kW Pure Sine Wave",
        inverter: `${calculatedInverterKw}kVA Hybrid Pure Sine Inverter`,
        battery: `${calculatedBatteryKwh} kWh LiFePO4 Lithium Storage`,
        solar: `${panelCount}x 550W Tier-1 Mono Solar Panels (${calculatedSolarPanelsWatts}W)`
      };
    } else if (calculatedInverterKw <= 3.5) {
      return {
        id: "pkg-3",
        name: "TAPCO 3.5kVA Executive Hybrid Grid",
        capacity: "3.5kVA / 3.0kW Continuous Demand",
        inverter: "3.5kVA MPPT Smart Inverter (Parallel Ready)",
        battery: `${calculatedBatteryKwh} kWh High-Cycle Lithium Powerwall`,
        solar: `${panelCount}x 550W Bifacial Solar Panels (${calculatedSolarPanelsWatts}W)`
      };
    } else if (calculatedInverterKw <= 6.0) {
      return {
        id: "pkg-5",
        name: "TAPCO 5.5kVA Premium Villa Powerwall",
        capacity: "5.5kVA / 5.0kW Heavy Hybrid Load",
        inverter: "5.5kVA High-Voltage MPPT Pure Sine Inverter",
        battery: `${calculatedBatteryKwh} kWh Modular LiFePO4 Energy Tower`,
        solar: `${panelCount}x 550W Half-Cell Panels (${calculatedSolarPanelsWatts}W)`
      };
    } else if (calculatedInverterKw <= 12.0) {
      return {
        id: "pkg-10",
        name: "TAPCO 10kVA - 12kVA Commercial Microgrid",
        capacity: "10kVA - 12kVA Commercial 3-Phase",
        inverter: "10kVA Dual MPPT Industrial Hybrid System",
        battery: `${calculatedBatteryKwh} kWh High-Voltage Lithium Cabinet`,
        solar: `${panelCount}x 550W Monocrystalline PV Array (${calculatedSolarPanelsWatts}W)`
      };
    } else {
      return {
        id: "pkg-40",
        name: `TAPCO ${calculatedInverterKw}kVA Industrial Power Plant`,
        capacity: `${calculatedInverterKw}kVA Heavy Industrial Microgrid`,
        inverter: `${calculatedInverterKw}kVA Three-Phase Industrial Synchronizer`,
        battery: `${calculatedBatteryKwh} kWh Industrial Rackmount Lithium Battery Bank`,
        solar: `${panelCount}x 550W Industrial Bifacial Arrays (${calculatedSolarPanelsWatts}W)`
      };
    }
  }, [calculatedInverterKw, calculatedBatteryKwh, panelCount, calculatedSolarPanelsWatts]);

  // Submit quote to parent
  const handleRequestCustomQuote = () => {
    const pkg: SolarPackage = {
      id: recommendedPackage.id,
      name: recommendedPackage.name,
      capacity: recommendedPackage.capacity,
      price: priceBreakdown.totalEstimatedPrice,
      description: `Engineered solar sizing for ${totalWatts}W peak demand and ${totalDailyKWh.toFixed(1)} kWh/day consumption. Includes ${recommendedPackage.battery} and ${recommendedPackage.solar}.`,
      specs: {
        panels: recommendedPackage.solar,
        inverter: recommendedPackage.inverter,
        battery: recommendedPackage.battery,
        accessories: "TAPCO Certified BOS, DC/AC Surge Protectors, Anodized Rails, Heavy Cabling & Earthing"
      },
      suitableFor: [recommendedPackage.capacity, `${items.length} Custom Appliances`],
      recommendedAppliances: items.map(i => `${i.count}x ${i.name} (${i.watts}W @ ${i.hours}h)`)
    };

    onQuoteRequested(items, pkg, priceBreakdown.totalEstimatedPrice);
    setSubmitSuccess(true);

    setTimeout(() => {
      const target = document.getElementById("manual-quotation-form") || document.getElementById("site-inspection-booking-form");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 250);
  };

  // Copy sizing summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `⚡ TAPCO SOLAR ENERGY SIZING SUMMARY\n` +
      `-----------------------------------------\n` +
      `• Peak Simultaneous Load: ${totalWatts.toLocaleString()} Watts (${(totalWatts/1000).toFixed(2)} kW)\n` +
      `• Daily Energy Demand: ${totalDailyKWh.toFixed(2)} kWh / Day\n` +
      `• Recommended Inverter: ${recommendedPackage.inverter}\n` +
      `• Recommended Battery: ${recommendedPackage.battery}\n` +
      `• Recommended Solar Array: ${recommendedPackage.solar}\n` +
      `• Selected Hardware Tier: ${selectedTier.toUpperCase()}\n` +
      `• ESTIMATED INVESTMENT: ₦${priceBreakdown.totalEstimatedPrice.toLocaleString()} NGN\n` +
      `• Estimated Monthly Savings: ₦${financialROI.monthlyFuelSavings.toLocaleString()}/month\n` +
      `• Estimated ROI Payback: ${financialROI.paybackYears} Years\n` +
      `-----------------------------------------\n` +
      `Generated with TAPCO Solar Sizing Engine | Hotline: 09059375492`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    });
  };

  // WhatsApp prefilled share
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello TAPCO Solar Engineers! I used your Solar Calculator and sized my property:\n\n` +
      `• Peak Load: ${totalWatts}W\n` +
      `• Daily Consumption: ${totalDailyKWh.toFixed(1)} kWh/day\n` +
      `• Target Package: ${recommendedPackage.name}\n` +
      `• Estimated Budget: ₦${priceBreakdown.totalEstimatedPrice.toLocaleString()} NGN\n\n` +
      `Please provide an official Bill of Quantities (BOQ) and site inspection schedule.`
    );
    window.open(`https://wa.me/2349059375492?text=${text}`, "_blank");
  };

  return (
    <div id="tapco-solar-calculator-root" className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden text-left">
      
      {/* Modern Header Bar */}
      <div className="bg-gradient-to-r from-[#0057B8] via-[#00428C] to-[#00A651] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-widest text-[#FFD100]">
                <Sparkles className="h-3 w-3" />
                Live Engineering &amp; Cost Simulator
              </span>
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest hidden sm:inline">
                NEMSA &amp; COREN Standards
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Solar Sizing &amp; Price Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              Calculate your exact peak kilowatt demand, required lithium storage, solar panel count, and transparent turnkey pricing in Nigerian Naira.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={resetToDefault}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition cursor-pointer active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset All
            </button>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs transition shadow-md cursor-pointer active:scale-95"
            >
              {copiedSummary ? <Check className="h-3.5 w-3.5 text-[#00A651]" /> : <Share2 className="h-3.5 w-3.5 text-[#0057B8]" />}
              {copiedSummary ? "Copied!" : "Share Sizing"}
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setCalculatorMode("appliances")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              calculatorMode === "appliances"
                ? "bg-white text-slate-900 shadow-lg scale-102"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            1. Appliance Load Builder
          </button>
          <button
            onClick={() => setCalculatorMode("bill")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              calculatorMode === "bill"
                ? "bg-white text-slate-900 shadow-lg scale-102"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            2. Generator / Bill Offset Sizer
          </button>
          <button
            onClick={() => setCalculatorMode("autonomy")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              calculatorMode === "autonomy"
                ? "bg-white text-slate-900 shadow-lg scale-102"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <BatteryCharging className="h-3.5 w-3.5" />
            3. Autonomy &amp; Storage Sizer
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="p-6 sm:p-8 lg:p-10 grid gap-10 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* TAB 1: APPLIANCE BUILDER */}
          {calculatorMode === "appliances" && (
            <div className="space-y-6">
              {/* Preset Property Selector */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0057B8]" />
                    Quick Property Presets
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">1-Click Population</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TEMPLATES.map((preset) => {
                    const isSelected = activePropertyPreset === preset.id;
                    const IconComp = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPropertyPreset(preset.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#0057B8] bg-[#0057B8]/5 ring-2 ring-[#0057B8]/20 shadow-sm"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComp className={`h-4 w-4 ${isSelected ? "text-[#0057B8]" : "text-slate-500"}`} />
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#0057B8]" />}
                        </div>
                        <div className="mt-3">
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{preset.title}</h4>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{preset.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Add Appliance Catalog Bar */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[#00A651]" />
                    Fast Add Appliances
                  </span>
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="text-xs font-bold text-[#0057B8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    + Add Custom Item
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {PRESET_CATALOG.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddFromCatalog(preset)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#0057B8] hover:bg-[#0057B8]/5 text-slate-700 hover:text-[#0057B8] text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Plus className="h-3 w-3 text-[#00A651]" />
                      <span>{preset.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({preset.watts}W)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Appliance List Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#0057B8]" />
                    Active Sizing Load Schedule ({items.length} Items)
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    Continuous: <strong className="text-[#0057B8]">{totalWatts.toLocaleString()}W</strong>
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3.5">Appliance</th>
                        <th className="px-3 py-3.5 text-center w-28">Quantity</th>
                        <th className="px-3 py-3.5 text-center w-24">Power (W)</th>
                        <th className="px-3 py-3.5 text-center w-24">Runtime (Hrs)</th>
                        <th className="px-3 py-3.5 text-right w-24">Daily (Wh)</th>
                        <th className="px-3 py-3.5 text-center w-12">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {items.map((item) => {
                          const dailyWh = item.watts * item.count * item.hours;
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="hover:bg-slate-50/70 transition-colors group"
                            >
                              <td className="px-4 py-3 font-bold text-slate-800">
                                <span className="block truncate max-w-[160px] sm:max-w-[200px]">{item.name}</span>
                              </td>
                              
                              {/* Quantity Stepper */}
                              <td className="px-3 py-3">
                                <div className="flex items-center justify-center gap-1.5 bg-slate-100 rounded-xl p-1 w-24 mx-auto">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="h-6 w-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-black shadow-2xs cursor-pointer transition"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-6 text-center font-black text-slate-900 text-xs">{item.count}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="h-6 w-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-black shadow-2xs cursor-pointer transition"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              </td>

                              {/* Wattage */}
                              <td className="px-3 py-3 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.watts}
                                  onChange={(e) => updateWatts(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 rounded-xl border border-slate-200 bg-slate-50 text-center py-1 font-bold text-slate-800 text-xs focus:bg-white focus:border-[#0057B8] focus:outline-none transition"
                                />
                              </td>

                              {/* Runtime Hours */}
                              <td className="px-3 py-3 text-center">
                                <input
                                  type="number"
                                  min="0.5"
                                  max="24"
                                  step="0.5"
                                  value={item.hours}
                                  onChange={(e) => updateHours(item.id, parseFloat(e.target.value) || 1)}
                                  className="w-16 rounded-xl border border-slate-200 bg-slate-50 text-center py-1 font-bold text-[#00A651] text-xs focus:bg-white focus:border-[#00A651] focus:outline-none transition"
                                />
                              </td>

                              {/* Daily Total */}
                              <td className="px-3 py-3 text-right font-mono font-bold text-slate-600">
                                {dailyWh.toLocaleString()}
                              </td>

                              {/* Delete */}
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Remove appliance"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>

                      {items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                            No appliances in schedule. Click a preset above or add custom appliances to begin sizing.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UTILITY & GENERATOR BILL OFFSET */}
          {calculatorMode === "bill" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Estimate Sizing from Monthly Energy Spend
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Enter your typical monthly electricity tariff (Band A/B) and generator fuel costs. We calculate your equivalent solar array and payback timeline.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase text-slate-700">Monthly DisCo / NEPA Bill</label>
                    <span className="text-xs font-black text-[#0057B8]">₦{monthlyNepaBill.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="800000"
                    step="10000"
                    value={monthlyNepaBill}
                    onChange={(e) => setMonthlyNepaBill(Number(e.target.value))}
                    className="w-full accent-[#0057B8]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>₦20,000</span>
                    <span>₦400,000</span>
                    <span>₦800,000+</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase text-slate-700">Monthly Generator Fuel</label>
                    <span className="text-xs font-black text-[#00A651]">₦{monthlyFuelSpend.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1500000"
                    step="20000"
                    value={monthlyFuelSpend}
                    onChange={(e) => setMonthlyFuelSpend(Number(e.target.value))}
                    className="w-full accent-[#00A651]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>₦30,000</span>
                    <span>₦750,000</span>
                    <span>₦1,500,000+</span>
                  </div>
                </div>
              </div>

              {/* Total Monthly Spend Box */}
              <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Combined Current Monthly Power Cost</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD100]">
                    ₦{(monthlyNepaBill + monthlyFuelSpend).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#00A651] tracking-widest block">Annual Drain on Budget</span>
                  <span className="text-xl font-bold text-white">
                    ₦{((monthlyNepaBill + monthlyFuelSpend) * 12).toLocaleString()} / year
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#00A651] shrink-0" />
                <span>
                  Switching to a TAPCO Solar Powerwall eliminates up to <strong>92% of your monthly generator fuel bills</strong> with an estimated payback in <strong>{financialROI.paybackYears} years</strong>.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: AUTONOMY & BATTERY STORAGE SIZING */}
          {calculatorMode === "autonomy" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Autonomy &amp; Lithium Battery Storage Calculator
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Select how many hours of continuous nighttime or zero-sunlight backup you require.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase text-slate-700">Target Autonomy Backup</label>
                  <span className="text-sm font-black text-[#0057B8] px-3 py-1 bg-[#0057B8]/10 rounded-full">
                    {backupHoursTarget} Hours Backup
                  </span>
                </div>

                <input
                  type="range"
                  min="6"
                  max="24"
                  step="2"
                  value={backupHoursTarget}
                  onChange={(e) => setBackupHoursTarget(Number(e.target.value))}
                  className="w-full accent-[#0057B8]"
                />

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
                  <button onClick={() => setBackupHoursTarget(8)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">8h (Overnight)</button>
                  <button onClick={() => setBackupHoursTarget(14)} className="p-2 bg-[#0057B8]/10 text-[#0057B8] rounded-lg cursor-pointer">14h (Standard)</button>
                  <button onClick={() => setBackupHoursTarget(18)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">18h (Extended)</button>
                  <button onClick={() => setBackupHoursTarget(24)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">24h (Full Off-Grid)</button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Battery</span>
                  <span className="text-xl font-black text-[#0057B8] mt-1 block">{calculatedBatteryKwh} kWh</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">LiFePO4 Powerwall</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Solar Yield</span>
                  <span className="text-xl font-black text-[#00A651] mt-1 block">{(calculatedSolarPanelsWatts * 5.2 / 1000).toFixed(1)} kWh</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">From {panelCount} Panels</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Depth of Discharge</span>
                  <span className="text-xl font-black text-slate-800 mt-1 block">90% DoD</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">6,000+ Cycles (15 Yrs)</span>
                </div>
              </div>
            </div>
          )}

          {/* HARDWARE QUALITY TIER SWITCHER */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00A651]" />
                Select Hardware &amp; Warranty Tier
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Customizes Component Specs &amp; Pricing
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  id: "economy" as const,
                  title: "Economy Tier",
                  badge: "Entry Value",
                  desc: "Hybrid inverter + High-rate Lithium + Standard Mono Panels",
                  warranty: "3-Year Warranty",
                  badgeColor: "bg-slate-100 text-slate-700"
                },
                {
                  id: "premium" as const,
                  title: "Premium Pro",
                  badge: "Most Popular",
                  desc: "Smart MPPT Inverter + Grade-A LiFePO4 + 550W Half-Cell Panels",
                  warranty: "5-Year Warranty",
                  badgeColor: "bg-[#0057B8] text-white"
                },
                {
                  id: "enterprise" as const,
                  title: "Enterprise Max",
                  badge: "Industrial Grade",
                  desc: "Three-Phase/Heavy Inverter + High-Voltage Lithium + TOPCon Solar + IoT",
                  warranty: "10-Year Warranty",
                  badgeColor: "bg-[#00A651] text-white"
                }
              ].map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0057B8] bg-[#0057B8]/5 ring-2 ring-[#0057B8]/20 shadow-md"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.badgeColor}`}>
                          {tier.badge}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-[#0057B8]" />}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{tier.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">{tier.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-extrabold text-[#00A651]">
                      {tier.warranty}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Estimated Pricing & Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Price & Spec Card */}
          <div className="rounded-3xl border-2 border-[#0057B8]/20 bg-slate-900 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0057B8]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00A651]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Header Badge */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00A651] block">
                    Turnkey Package Recommendation
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                    {recommendedPackage.name}
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-white/10 px-2.5 py-1 rounded-full text-slate-300">
                  {selectedTier.toUpperCase()}
                </span>
              </div>

              {/* ESTIMATED TOTAL PRICE DISPLAY */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                  Estimated Turnkey System Investment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFD100] tracking-tight font-mono">
                    ₦{priceBreakdown.totalEstimatedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">NGN</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Includes Inverter, LiFePO4 Battery, Tier-1 Solar Array, BOS Protectors &amp; Certified Installation.
                </p>

                {/* Installment Option */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Or Installment Financing:</span>
                  <span className="font-extrabold text-[#00A651]">From ₦{priceBreakdown.monthlyInstallment12Mo.toLocaleString()} / mo</span>
                </div>
              </div>

              {/* Technical Sizing Metrics Quad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Simultaneous Load</span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">
                    {totalWatts.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">Watts</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block">{(totalWatts/1000).toFixed(2)} kW Peak</span>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Daily Energy</span>
                  <span className="text-lg font-black text-[#00A651] font-mono mt-0.5 block">
                    {totalDailyKWh.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">kWh/day</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block">{totalDailyWh.toLocaleString()} Wh</span>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Inverter Sized</span>
                  <span className="text-lg font-black text-[#FFD100] font-mono mt-0.5 block">
                    {calculatedInverterKw} <span className="text-[10px] font-normal text-slate-400">kVA / kW</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block">+30% Surge Buffer</span>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Battery Storage</span>
                  <span className="text-lg font-black text-[#0057B8] font-mono mt-0.5 block">
                    {calculatedBatteryKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block">{backupHoursTarget}h Night Autonomy</span>
                </div>
              </div>

              {/* Matched Equipment Spec List */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Engineered Hardware Blueprint:
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <Zap className="h-4 w-4 text-[#FFD100] shrink-0 mt-0.5" />
                    <span><strong>Inverter:</strong> {recommendedPackage.inverter}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <Battery className="h-4 w-4 text-[#0057B8] shrink-0 mt-0.5" />
                    <span><strong>Battery:</strong> {recommendedPackage.battery}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <Sun className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
                    <span><strong>Solar PV:</strong> {recommendedPackage.solar}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Price Breakdown Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
                  className="w-full flex justify-between items-center text-xs font-extrabold text-slate-300 hover:text-white py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-[#00A651]" />
                    Itemized Cost Breakdown
                  </span>
                  {showBreakdownDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {showBreakdownDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-1.5 text-xs text-slate-400 font-mono overflow-hidden"
                    >
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span>Hybrid Inverter System:</span>
                        <span className="text-slate-200">₦{priceBreakdown.inverterCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span>LiFePO4 Battery Bank ({calculatedBatteryKwh}kWh):</span>
                        <span className="text-slate-200">₦{priceBreakdown.batteryCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span>Solar PV Array ({panelCount}x 550W):</span>
                        <span className="text-slate-200">₦{priceBreakdown.solarPanelsCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span>Balance of System (BOS &amp; Surge):</span>
                        <span className="text-slate-200">₦{priceBreakdown.bosCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>NEMSA Certified Installation:</span>
                        <span className="text-slate-200">₦{priceBreakdown.installCost.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Financial ROI Highlights */}
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#00A651]" />
                    Estimated Monthly Utility Offset:
                  </span>
                  <span className="font-black text-[#00A651] font-mono">
                    ₦{financialROI.monthlyFuelSavings.toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-300">Amortization / Payback Period:</span>
                  <span className="font-black text-white font-mono">{financialROI.paybackYears} Years</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRequestCustomQuote}
                  disabled={totalWatts === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00A651] to-[#008A43] hover:from-[#008A43] hover:to-[#007036] text-white font-extrabold py-4 px-6 text-xs uppercase tracking-wider shadow-lg shadow-[#00A651]/20 transition cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Request Official Proposal &amp; BOQ</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold py-3 px-6 text-xs uppercase tracking-wider transition cursor-pointer active:scale-98"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Send Sizing to WhatsApp Engineer</span>
                </button>
              </div>

            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2 font-medium">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold">
              <ShieldCheck className="h-4 w-4 text-[#0057B8]" />
              <span>TAPCO Engineering Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All prices include genuine Tier-1 components, certified electrical copper cabling, DC/AC circuit isolation, and professional physical handover with mobile telemetry app sync.
            </p>
          </div>

        </div>

      </div>

      {/* Slide-out Success Alert overlay */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-emerald-50 border-t-2 border-[#00A651] p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 px-8"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-full bg-[#00A651] text-white flex items-center justify-center shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-900">Sizing Transferred Successfully!</h4>
                <p className="text-xs text-emerald-700 font-medium">
                  Your load model ({totalWatts}W peak, ₦{priceBreakdown.totalEstimatedPrice.toLocaleString()} est.) is queued. Complete your contact details below to finalize your bid.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="text-xs font-extrabold uppercase tracking-wider text-[#00A651] hover:text-emerald-900 bg-white border border-emerald-200 px-4 py-2 rounded-xl cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: CUSTOM APPLIANCE BUILDER */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0057B8]">Custom Appliance</span>
                  <h3 className="text-lg font-black text-slate-900">Add Specific Equipment</h3>
                </div>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomAppliance} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold uppercase text-slate-600 text-[10px]">Appliance Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultrasound Machine, Dental Compressor"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 font-semibold focus:bg-white focus:border-[#0057B8] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold uppercase text-slate-600 text-[10px]">Wattage (Watts)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1200"
                      value={customWatts}
                      onChange={(e) => setCustomWatts(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 font-semibold focus:bg-white focus:border-[#0057B8] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold uppercase text-slate-600 text-[10px]">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 font-semibold focus:bg-white focus:border-[#0057B8] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold uppercase text-slate-600 text-[10px]">Estimated Daily Runtime (Hours)</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    max="24"
                    step="0.5"
                    placeholder="e.g. 8"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 font-semibold focus:bg-white focus:border-[#0057B8] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#0057B8] hover:bg-[#00428C] text-white font-extrabold uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Add to Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
