import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Building2,
  Factory,
  Sprout,
  GraduationCap,
  Zap,
  Wrench,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Compass,
  Clock,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sliders,
  BatteryCharging,
  Sun,
  FileText,
  Eye,
  RefreshCw,
  Database,
  Network,
  Settings,
  Share2
} from "lucide-react";

// CATEGORY TYPE DEFINITION
interface ServiceCategory {
  id: string;
  number: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<any>;
  image: string;
  description: string;
  detailedScope: string;
  services: string[];
  specs: { label: string; value: string }[];
  compliance: string[];
  ctaText: string;
  accentColor: string;
  gallery: { url: string; title: string; desc: string }[];
  flowchartNodes: {
    id: string;
    title: string;
    subtitle: string;
    type: "source" | "process" | "output";
    iconName: string;
    description: string;
    techSpec: string;
    nominalVal: string;
    unit: string;
  }[];
  calcInputs: {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
    unit: string;
    multiplier: number; // load contribution in Watts or custom factors
  }[];
  faq: { q: string; a: string }[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential Solar Solutions",
    tagline: "Uninterrupted clean energy tailored for modern homes",
    icon: Home,
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1000&auto=format&fit=crop&q=80",
    description: "Reliable solar and backup power systems designed for homes, apartments, estates, and private residences. Our solutions help reduce electricity costs while ensuring uninterrupted power for everyday living under robust safety guidelines.",
    detailedScope: "We manage your entire residential transition from initial site scoping and 3D shadow analysis to precise mechanical roof racking and structural electrical integrations. Every installation adheres strictly to standard codes, optimizing daily irradiation collection.",
    services: [
      "Bespoke Solar Designing & Sizing",
      "Pure Sine Hybrid Inverter Grid Ties",
      "LiFePO4 Safe Battery Vault Sizing",
      "Automatic Transfer Switch (ATS) Failovers",
      "Multi-Point Shading & Solar Angle Audits",
      "Home Distribution Board Safe Upgrades",
      "Preventive System Support SLA Plans"
    ],
    specs: [
      { label: "Recommended Range", value: "3kVA to 15kVA Systems" },
      { label: "Battery Chemistry", value: "Lithium Iron Phosphate (LiFePO4)" },
      { label: "Failover Speed", value: "Sub-15ms Automatic Switch" },
      { label: "Warranty Standard", value: "5-Year Active Component Protection" }
    ],
    compliance: [
      "NEMSA Household Wiring Code",
      "IEC 61215 PV Module Quality Certified",
      "IEEE Pure Sine Wave Frequency Regulation"
    ],
    ctaText: "Begin Residential Consultation",
    accentColor: "#00A651",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop&q=80",
        title: "Monocrystalline Roof Mounts",
        desc: "A-grade 600W cells mounted securely on modular anodized aluminum rafter structures."
      },
      {
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
        title: "LFP Battery Enclosure",
        desc: "Modular server-rack cabinet housing high-density LiFePO4 cells with full CAN-bus telemetry."
      },
      {
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
        title: "Inverter Controls",
        desc: "Premium pure-sine wave hybrid inverter with dynamic load-routing control circuits."
      }
    ],
    flowchartNodes: [
      { id: "pv", title: "Silicon PV Field", subtitle: "Rooftop Generation", type: "source", iconName: "sun", description: "Collects solar irradiance and converts to high-voltage DC current via monocrystalline panels.", techSpec: "Tier-1 Cell Eff: 22.8%", nominalVal: "5400", unit: "Wp" },
      { id: "mppt", title: "MPPT Charge Core", subtitle: "Solar Input Tracker", type: "process", iconName: "cpu", description: "Performs continuous high-speed maximum power point tracking to maximize daily energy harvesting.", techSpec: "Efficiency: 99.4%", nominalVal: "400", unit: "V DC" },
      { id: "inv", title: "Hybrid Inverter", subtitle: "DC-AC Wave Synthesizer", type: "process", iconName: "activity", description: "Synthesizes ultra-clean, pure-sine wave 230V AC output to support sensitive residential devices.", techSpec: "Harmonic Distortion: <1.2%", nominalVal: "230", unit: "V AC" },
      { id: "vault", title: "LiFePO4 Storage", subtitle: "Smart Battery Banks", type: "process", iconName: "battery", description: "High-cycle energy bank backed by full active temperature management and over-discharge safety grids.", techSpec: "DoD: 90%, 6000+ Cycles", nominalVal: "15", unit: "kWh" },
      { id: "panel", title: "Main Subpanel", subtitle: "Load Distribution", type: "output", iconName: "zap", description: "Distributes clean phase-balanced energy to lighting, HVAC units, refrigeration and sockets.", techSpec: "ATS Switch Speed: <15ms", nominalVal: "24", unit: "Amps" }
    ],
    calcInputs: [
      { id: "ac", label: "Inverter Air Conditioners", min: 0, max: 6, step: 1, defaultVal: 2, unit: "Units", multiplier: 1200 },
      { id: "fridge", label: "Smart Refrigerators", min: 0, max: 4, step: 1, defaultVal: 1, unit: "Units", multiplier: 300 },
      { id: "bulbs", label: "LED Low-Draw Lighting", min: 5, max: 50, step: 5, defaultVal: 15, unit: "Bulbs", multiplier: 12 },
      { id: "tv", label: "OLED Smart Televisions", min: 1, max: 6, step: 1, defaultVal: 2, unit: "TVs", multiplier: 110 },
      { id: "pump", label: "Water Pumping Unit", min: 0, max: 2, step: 1, defaultVal: 1, unit: "Unit", multiplier: 1500 }
    ],
    faq: [
      { q: "How fast is the backup switch during a utility grid failure?", a: "Our premium hybrid systems deploy a state-of-the-art Automatic Transfer Switch (ATS) operating at under 15 milliseconds. This speed is fast enough to ensure routers, computers, and smart TVs do not reset during failover." },
      { q: "Can this system completely run my home air conditioners?", a: "Yes. By utilizing modern, variable-frequency Inverter Air Conditioners and correctly sizing our high-current LiFePO4 battery vaults, you can comfortably run AC units throughout both the day and night." }
    ]
  },
  {
    id: "commercial",
    number: "02",
    title: "Commercial Solar Solutions",
    tagline: "Scalable solar networks to mitigate corporate diesel overheads",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&auto=format&fit=crop&q=80",
    description: "Scalable solar power systems for offices, hotels, hospitals, shopping complexes, banks, and commercial facilities to improve operational efficiency and drastically reduce energy expenses.",
    detailedScope: "We engineer heavy-duty commercial rooftop solar installations with full phase balancing, generator synchronization, and high-voltage electrical safety controls. Ideal for corporate headquarters seeking diesel offset.",
    services: [
      "Commercial Rooftop Solar Grid Sizing",
      "Diesel-Solar Hybrid Active Syncing",
      "Heavy-Duty Lithium Storage Vaults",
      "Level 2 EV Charging Station Docks",
      "Corporate Energy Management Controls",
      "Balanced Three-Phase Wiring Plans",
      "Annual Maintenance SLA Frameworks"
    ],
    specs: [
      { label: "Design Scale", value: "15kW to 150kW Peak Output" },
      { label: "Optimization Grid", value: "Smart Hybrid Diesel Peak-Shaving" },
      { label: "EV Charger Spec", value: "Level 2 High-Speed 22kW Station" },
      { label: "Corporate Benefit", value: "Eligible for Pioneer Status Tax Holiday" }
    ],
    compliance: [
      "REAN Quality Assurance Standards",
      "IEEE 1547 Grid Integration Compliant",
      "NEMSA Certified Commercial Commissioning"
    ],
    ctaText: "Launch Corporate Proposal",
    accentColor: "#0057B8",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
        title: "Commercial Facade PV",
        desc: "Architecturally integrated solar arrays built directly onto high-efficiency glass corporate structures."
      },
      {
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
        title: "Ground-Mounted Solar Farms",
        desc: "Enterprise field arrays built in northern Nigeria utilizing automatic dual-axis tilt brackets."
      },
      {
        url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
        title: "EV Canopy Charging Station",
        desc: "Solar parking canopy routing pure-sun power straight to level-2 vehicle charging nodes."
      }
    ],
    flowchartNodes: [
      { id: "field", title: "Commercial PV Field", subtitle: "High-Output Arrays", type: "source", iconName: "sun", description: "Bespoke high-voltage monocrystalline field generating clean direct current during business hours.", techSpec: "Output: 15kW to 150kWp", nominalVal: "45000", unit: "Wp" },
      { id: "sync", title: "Parallel Sync Array", subtitle: "Generator-Solar Sync", type: "process", iconName: "cpu", description: "Coordinates with diesel generators to optimize diesel run times and fuel consumption using load-following tracking logic.", techSpec: "Optimizes diesel fuel by up to 60%", nominalVal: "3", unit: "Gen Units" },
      { id: "battery", title: "Enterprise Storage", subtitle: "LFP Cabinet Vault", type: "process", iconName: "battery", description: "Heavy-duty modular industrial battery storage designed for uninterrupted 3-phase grid support.", techSpec: "Air-cooled climate cabinet", nominalVal: "45", unit: "kWh" },
      { id: "charge", title: "EV Station Hub", subtitle: "22kW Vehicle Charging", type: "output", iconName: "zap", description: "Direct routing to Level-2 smart EV chargers, utilizing surplus generation during peak solar windows.", techSpec: "AC Level-2 fast charging", nominalVal: "22", unit: "kW" },
      { id: "building", title: "Office Complex Load", subtitle: "Main HVAC & Computing", type: "output", iconName: "building", description: "Powers main administrative desk blocks, computer hardware systems, servers, and central air cooling.", techSpec: "Balanced phase load system", nominalVal: "120", unit: "Amps" }
    ],
    calcInputs: [
      { id: "staff", label: "Active Office Staff Count", min: 10, max: 150, step: 10, defaultVal: 40, unit: "Staff", multiplier: 180 }, // average watts per desk (computer + monitor)
      { id: "ac", label: "Commercial HVAC Air Cons", min: 2, max: 20, step: 1, defaultVal: 8, unit: "ACs", multiplier: 2400 },
      { id: "servers", label: "Enterprise Server Racks", min: 1, max: 6, step: 1, defaultVal: 2, unit: "Racks", multiplier: 1500 },
      { id: "dispenser", label: "Water Dispensers & Hubs", min: 1, max: 10, step: 1, defaultVal: 3, unit: "Units", multiplier: 650 }
    ],
    faq: [
      { q: "What is the commercial amortization period?", a: "With current high diesel prices and clean energy customs exemptions in Nigeria, most TAPCO commercial installations fully pay for themselves in 3 to 4 years, followed by 20+ years of free energy generation." },
      { q: "Is our facility eligible for the Pioneer Status tax holiday?", a: "Yes. Companies making significant capital infrastructure investments in solar microgrids can apply for the FGN Pioneer Status Incentive, granting a 3 to 5-year corporate tax exemption." }
    ]
  },
  {
    id: "industrial",
    number: "03",
    title: "Industrial Solar Solutions",
    tagline: "Heavy-duty microgrids engineered for high-availability manufacturing",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1000&auto=format&fit=crop&q=80",
    description: "High-capacity renewable energy systems engineered for factories, manufacturing plants, warehouses, and industrial facilities requiring dependable, heavy-duty power under continuous duty cycles.",
    detailedScope: "We build heavy-duty industrial megawatt-scale microgrids backed by robust active filter setups, SCADA telemetry desks, and heavy protection enclosures to guarantee zero-defect manufacturing continuity.",
    services: [
      "Industrial MW Microgrid Engineering",
      "High-Voltage Substation Interfacing",
      "Thermal-Insulated Containerized Storage",
      "High-Impedance Step-Up Transformers",
      "Bespoke Active Power Factor Correction",
      "Automated Load Peak-Shaving Controllers",
      "Fiber-Optic SCADA Control Telemetry"
    ],
    specs: [
      { label: "Microgrid Capacity", value: "150kW to 1MW+ Heavy-Duty" },
      { label: "Power Sync", value: "Multi-Generator Parallel Sync Logic" },
      { label: "Grid Interface", value: "High Voltage Substation Transformer" },
      { label: "Telemetry Standard", value: "Fiber-Optic SCADA Cloud Tracking" }
    ],
    compliance: [
      "IEC 60364 Electrical Installations for Buildings",
      "NEMSA Industrial Substation Authorization",
      "IEEE 519 Harmonic Distortion Control"
    ],
    ctaText: "Request Industrial Feasibility Study",
    accentColor: "#0057B8",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        title: "Automated Assembly Line",
        desc: "Manufacturing infrastructure backed by high-voltage hybrid solar filtering grids."
      },
      {
        url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80",
        title: "Industrial Substation Yard",
        desc: "High-voltage transformer grids step solar capacity up for direct factory consumption."
      },
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
        title: "SCADA Control Hub",
        desc: "Fibre-linked SCADA workstation plotting active load optimization and dynamic power factor metrics."
      }
    ],
    flowchartNodes: [
      { id: "pv_mw", title: "Megawatt Solar Farm", subtitle: "Continuous Generation", type: "source", iconName: "sun", description: "Bespoke tracking ground array engineered with anti-reflective glass cells delivering heavy-load DC.", techSpec: "Tier-1 Mono bifacial cells", nominalVal: "540", unit: "kWp" },
      { id: "sub", title: "HV Transformer Substation", subtitle: "Step-Up Voltage Grid", type: "process", iconName: "activity", description: "Steps solar voltage up to matching high-voltage distribution parameters of industrial manufacturing grids.", techSpec: "Oil-immersed continuous cooling", nominalVal: "11", unit: "kV" },
      { id: "pfc", title: "Power Factor Tuner", subtitle: "Active Harmonic Filter", type: "process", iconName: "cpu", description: "Maintains optimal reactive power balances, completely eliminating voltage harmonics and grid penalties.", techSpec: "Cos Phi: 0.99 Active Tuning", nominalVal: "0.99", unit: "PF" },
      { id: "scada", title: "SCADA Telemetry Desk", subtitle: "Fiber-Optic Cloud Monitor", type: "process", iconName: "network", description: "Continuous remote PLC checking of inverter, string, and climate storage safety metrics over GPRS/Fiber.", techSpec: "Response Latency: <100ms", nominalVal: "24", unit: "Channels" },
      { id: "mfg", title: "Factory Heavy Load", subtitle: "Industrial Motors", type: "output", iconName: "factory", description: "Continuous clean 3-phase delivery to injection molding machinery, raw conveyers, and sorting lines.", techSpec: "Harmonic Distortion: <3.0%", nominalVal: "400", unit: "Amps" }
    ],
    calcInputs: [
      { id: "motors", label: "Heaviest Motor Horsepower", min: 10, max: 200, step: 10, defaultVal: 50, unit: "HP", multiplier: 746 }, // 1 HP = 746 Watts
      { id: "conveyor", label: "Conveyor & Sorting Line Load", min: 1, max: 10, step: 1, defaultVal: 2, unit: "Lines", multiplier: 5500 },
      { id: "climate", label: "Industrial Exhaust & Cooling", min: 1, max: 8, step: 1, defaultVal: 3, unit: "Systems", multiplier: 4500 },
      { id: "offices", label: "Admin Office & Light Power", min: 1, max: 5, step: 1, defaultVal: 1, unit: "Blocks", multiplier: 8000 }
    ],
    faq: [
      { q: "Can a solar microgrid handle the massive inrush current of industrial induction motors?", a: "Yes, when correctly engineered. We design customized Power Factor Correction (PFC) banks and deploy heavy-duty inverters with high surge capacities, or utilize Soft Starters/VSDs to keep start-up current completely within safe bounds." },
      { q: "How is system performance monitored over time?", a: "Every TAPCO industrial microgrid is equipped with a fiber-optic SCADA telemetry desk that streams active operating logs directly to cloud databases, triggering automated sms alerts for preventive repairs." }
    ]
  },
  {
    id: "agricultural",
    number: "04",
    title: "Agricultural Solar Solutions",
    tagline: "Eco-power solutions for irrigation, livestock, and cold storage",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=1000&auto=format&fit=crop&q=80",
    description: "Solar-powered solutions designed to improve agricultural productivity and completely eliminate dependency on erratic, expensive fuel-powered equipment in rural and urban farming centers.",
    detailedScope: "We engineer ruggedized agritech solar installations. Featuring MPPT variable speed drives for high-capacity water pumping, IP66 desert-proof control boxes, and 24/7 solar cold storage hubs.",
    services: [
      "Solar Water Pump Engineering & Drives",
      "Brushless DC Submersible Borehole Pumps",
      "Rural Farm Grid Sizing & Wiring",
      "Solar-Powered Post-Harvest Cold Rooms",
      "Livestock Climate & Ventilation Sizing",
      "Variable Frequency Drive (VFD) Inverters",
      "IP66 Outdoor Sand-Proof Power Stations"
    ],
    specs: [
      { label: "Pumping Drive", value: "MPPT Solar Pump Variable Speed (VSD)" },
      { label: "Water Output", value: "Up to 150,000 Liters Daily Sizing" },
      { label: "Cold Preservation", value: "24/7 Zero-Diesel Cold Storage Hubs" },
      { label: "Enclosure Spec", value: "IP66 Extreme Weatherproof Cabinets" }
    ],
    compliance: [
      "FAO Renewable Energy for Agriculture Guidelines",
      "IEC 62253 Solar Pumping Performance Standard",
      "NEMSA Rural Electrification Safety Clearance"
    ],
    ctaText: "Begin Agritech Planning",
    accentColor: "#00A651",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=800&auto=format&fit=crop&q=80",
        title: "Solar Irrigation Hub",
        desc: "High-volume agricultural water pumping system running on clean solar power drive feeds."
      },
      {
        url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
        title: "Cold room Storage Hub",
        desc: "24/7 refrigeration facility powered by specialized thermal solar backup battery arrays."
      },
      {
        url: "https://images.unsplash.com/photo-1620021601016-91866380a570?w=800&auto=format&fit=crop&q=80",
        title: "IP66 Field Control Enclosure",
        desc: "Rugged agritech field enclosures proofed against intense tropical heat, heavy rain, and Harmattan dust storms."
      }
    ],
    flowchartNodes: [
      { id: "agri_pv", title: "Agritech PV Canopy", subtitle: "Rugged Ground Array", type: "source", iconName: "sun", description: "Extremely rugged, ground-mounted ground PV frames utilizing high-yield bifacial glass panels.", techSpec: "Wind Load: Up to 150km/h", nominalVal: "8400", unit: "Wp" },
      { id: "vsd", title: "Solar Pump VSD", subtitle: "Variable Speed Drive", type: "process", iconName: "cpu", description: "A battery-less inverter that adjusts voltage output on the fly to drive submersible AC water pumps smoothly.", techSpec: "Efficiency: 98.7% with Dry-Run detection", nominalVal: "15", unit: "HP Drive" },
      { id: "pump", title: "Submersible Borehole Pump", subtitle: "High-Volume Extraction", type: "process", iconName: "droplets", description: "Stainless steel multi-stage borehole pump engineered to draw high volumes of water on pure solar output.", techSpec: "Delivery: Up to 150k Liters Daily", nominalVal: "100", unit: "Meters Head" },
      { id: "cold", title: "Cold Storage Room", subtitle: "24/7 Produce Preservation", type: "output", iconName: "database", description: "Preserves harvest freshness, utilizing high-density thermal solar storage units to run zero-diesel refrigeration.", techSpec: "Maintains optimal 2°C to 8°C", nominalVal: "20", unit: "kWh Bank" },
      { id: "drip", title: "Irrigation Outlets", subtitle: "Drip Feeding Network", type: "output", iconName: "sprout", description: "Distributes water directly across crop fields via solar-controlled automatic solenoid valves.", techSpec: "Automated solar scheduling", nominalVal: "12", unit: "Valves" }
    ],
    calcInputs: [
      { id: "pump_hp", label: "Solar Pump Motor Capacity", min: 1, max: 15, step: 1, defaultVal: 5, unit: "HP", multiplier: 1200 }, // Solar pump equivalent load factor
      { id: "cold_vol", label: "Post-Harvest Cold Room Volume", min: 0, max: 100, step: 10, defaultVal: 30, unit: "m³", multiplier: 150 }, // Refrigeration watts per m3
      { id: "vent", label: "Livestock Barn Climate Fans", min: 0, max: 12, step: 1, defaultVal: 4, unit: "Fans", multiplier: 250 },
      { id: "farm_lights", label: "Farm Security Night Bulbs", min: 5, max: 30, step: 5, defaultVal: 10, unit: "Lights", multiplier: 20 }
    ],
    faq: [
      { q: "Can a solar water pump operate without expensive battery storage?", a: "Yes, definitely! By utilizing specialized Variable Speed Drives (VSDs), we configure water pumping solutions to run directly on raw solar energy. Water is pumped into high-elevation reservoirs during the day, creating gravity-fed irrigation for the night without needing batteries." },
      { q: "How do you protect field systems from northern Nigeria's severe Harmattan sandstorms?", a: "All TAPCO agritech controllers are housed in IP66 extreme weatherproof steel cabinets. These enclosures completely seal out wind, fine dust particles, and heavy rains while utilizing passive aluminum heat-sinks to prevent overheating." }
    ]
  },
  {
    id: "schools",
    number: "05",
    title: "Solar Solutions for Schools",
    tagline: "Powering academic excellence with noise-free solar microgrids",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80",
    description: "Reliable and sustainable power systems for schools, universities, technical institutions, and educational campuses to power ICT suites, libraries, and science labs.",
    detailedScope: "We engineer silent, clean, high-availability school solar grids designed to keep classrooms cool, power computer laboratories, and light campus corridors safely under secure community donor plans.",
    services: [
      "Campus Solar Power Grid Designs",
      "Auditorium & Class Ventilation Sizing",
      "Computer ICT Laboratory Backups",
      "Hostel Safe Energy Infrastructure",
      "In-Lobby Interactive Learning Displays",
      "Energy Efficiency Campus Audits",
      "Community Donor Program Blueprints"
    ],
    specs: [
      { label: "Target Load", value: "Silent Power for Research & Study" },
      { label: "Campus Sizing", value: "10kVA starter to 100kVA full campuses" },
      { label: "Educational Assets", value: "In-Lobby Interactive Learning Dashboards" },
      { label: "Sponsorship", value: "Donor and Corporate Grant Ready Blueprint" }
    ],
    compliance: [
      "NEMSA Educational Center Safety Certification",
      "WHO Ambient Noise Guidelines for Classrooms",
      "National Policy on Renewable Energy (REEEP)"
    ],
    ctaText: "Request Educational Campus Audit",
    accentColor: "#00A651",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1594818379496-da1e345b0cd3?w=800&auto=format&fit=crop&q=80",
        title: "Campus Canopy PV Grid",
        desc: "Overhead solar car-canopies built across school buildings, creating clean solar energy structures."
      },
      {
        url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
        title: "Silent Research Library",
        desc: "Stable solar infrastructure powering silent AC units and charging ports inside University study complexes."
      },
      {
        url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        title: "Student Computer Lab",
        desc: "Reliable battery power packs protecting 40+ thin-client student PCs from sudden power cutouts."
      }
    ],
    flowchartNodes: [
      { id: "school_pv", title: "Campus PV Canopy", subtitle: "Clean Solar Arrays", type: "source", iconName: "sun", description: "Mounted on classroom rooftops or walkways, collecting pure sunlight quietly without disturbing lectures.", techSpec: "Decibel Rating: 0 dB Silent", nominalVal: "10800", unit: "Wp" },
      { id: "school_core", title: "Balanced Sizing Core", subtitle: "Central Solar Inverter", type: "process", iconName: "cpu", description: "A quad-core hybrid inverter designed to manage high peak load periods when computer labs boot up.", techSpec: "Surge Protection: Built-in active grid isolation", nominalVal: "20", unit: "kVA System" },
      { id: "school_battery", title: "ICT Backup Banks", subtitle: "Stable Energy Vault", type: "process", iconName: "battery", description: "LFP chemical battery storage that guarantees smooth backup power for computer terminals and server networks.", techSpec: "Capacity Standard: 100% Depth of Discharge", nominalVal: "30", unit: "kWh" },
      { id: "dashboard", title: "Interactive Display Screen", subtitle: "Lobby Energy Monitor", type: "output", iconName: "activity", description: "In-lobby dynamic screen mapping real-time generation metrics, teaching students renewable energy principles.", techSpec: "Interactive LED display node", nominalVal: "100", unit: "Watts" },
      { id: "classroom", title: "Student Classrooms", subtitle: "Lab PCs & Ventilation", type: "output", iconName: "graduation-cap", description: "Distributes steady, pure-sine current to classroom fans, LED lighting, science labs, and ICT computers.", techSpec: "THD Distortion: <1.5% Wave", nominalVal: "45", unit: "Amps" }
    ],
    calcInputs: [
      { id: "pcs", label: "Student Computers Count", min: 5, max: 60, step: 5, defaultVal: 30, unit: "PCs", multiplier: 120 }, // 120W per active client PC
      { id: "ac", label: "Library AC Units Sizing", min: 0, max: 4, step: 1, defaultVal: 1, unit: "ACs", multiplier: 1500 },
      { id: "fans", label: "Classroom Overhead Fans", min: 5, max: 40, step: 5, defaultVal: 15, unit: "Fans", multiplier: 75 },
      { id: "lights", label: "Campus Security LED Bulbs", min: 10, max: 80, step: 10, defaultVal: 40, unit: "Bulbs", multiplier: 12 }
    ],
    faq: [
      { q: "How does the school solar setup help reduce operational costs?", a: "By generating electricity locally, educational institutions eliminate high utility bills and expensive generator fuel costs, allowing boards to redirect critical funds to learning materials and teacher salaries." },
      { q: "Is the interactive lobby energy display included in school layouts?", a: "Yes. Every TAPCO school microgrid features a custom in-lobby interactive display screen to teach students solar science and show real-time environmental metrics." }
    ]
  },
  {
    id: "electrical",
    number: "06",
    title: "Electrical Engineering Services",
    tagline: "COREN-licensed electrical designs, earthing, and grid protection",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80",
    description: "Professional electrical engineering services delivered in accordance with strict local and international codes for residential, commercial, and industrial facilities.",
    detailedScope: "We deliver full-scale licensed electrical engineering designs. Specializing in high-impedance copper earthing pits (below 1.0 Ohm), lightning air rods, and phase quality audits.",
    services: [
      "Certified Schematic CAD Wiring Layouts",
      "Main Power Distribution Boards (PDB)",
      "High-Impedance Earthing Pit Grids",
      "Copper Lightning Air Terminals",
      "AC/DC Transient Surge Protection",
      "Active Power Quality Vector Scans",
      "COREN-Licensed Project Signoffs"
    ],
    specs: [
      { label: "Design License", value: "Certified COREN-Registered Signoffs" },
      { label: "Earthing Impedance", value: "Strictly Below 1.0 Ohm Earth Grid" },
      { label: "Protection Standard", value: "AC/DC Type 1+2 surge protective relays" },
      { label: "Testing Hardware", value: "Fluke Power Quality Analyzers & Scans" }
    ],
    compliance: [
      "NEMSA National Electrical Installation Standards (NEIS)",
      "IEE Wiring Regulations BS 7671 Guidelines",
      "NFPA 780 Standard for Lightning Protection"
    ],
    ctaText: "Contact Lead Systems Engineer",
    accentColor: "#0057B8",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
        title: "CAD Electrical Schematic",
        desc: "Certified electrical diagrams detailing phase balances, wire sizing, and protection blueprints."
      },
      {
        url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80",
        title: "Power Distribution Panels",
        desc: "Main switchboards customized with clean copper busbars and rapid-acting thermal breakers."
      },
      {
        url: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=800&auto=format&fit=crop&q=80",
        title: "Earthing Grid Installation",
        desc: "Installing high-conductive chemical ground pits to establish safety paths under 1.0 Ohm resistance."
      }
    ],
    flowchartNodes: [
      { id: "feeder", title: "Main Substation Feeder", subtitle: "AC Power Source", type: "source", iconName: "sun", description: "Incoming three-phase current routed from utility grids, backup generators, or high-capacity solar setups.", techSpec: "Inbound: 415V Three-Phase AC", nominalVal: "415", unit: "V AC" },
      { id: "pdb", title: "Distribution Panel (PDB)", subtitle: "Breaker Distribution", type: "process", iconName: "cpu", description: "The central hub where circuit breakers divide, isolate, and distribute power safely across different building levels.", techSpec: "Phase Balancing: Active Vector Sync", nominalVal: "250", unit: "Amps Bus" },
      { id: "spd", title: "Surge Protective Relays", subtitle: "Transient Guard", type: "process", iconName: "activity", description: "High-speed AC/DC surge protectors that route sudden transient voltage spikes safely straight into the ground.", techSpec: "Type 1+2 Dual Surge Protection", nominalVal: "40", unit: "kA Surge" },
      { id: "ground", title: "Copper Ground Grid", subtitle: "Impedance Safety Pit", type: "process", iconName: "droplets", description: "Chemically enriched earth pits that maintain ground resistance at minimal levels to ensure human protection.", techSpec: "Resistance Target: Below 1.0 Ohm", nominalVal: "0.8", unit: "Ohms" },
      { id: "rod", title: "Lightning Air Terminals", subtitle: "Rooftop Air Rods", type: "output", iconName: "zap", description: "Heavy copper air terminals designed to attract and safely discharge structural lightning strikes.", techSpec: "Standard Compliance: NFPA 780", nominalVal: "100", unit: "kA Capacity" }
    ],
    calcInputs: [
      { id: "circuits", label: "Facility Total Target Circuits", min: 5, max: 60, step: 5, defaultVal: 15, unit: "Circuits", multiplier: 3000 }, // Sizing multiplier factor
      { id: "earth_points", label: "Earthing Ground Pit Pits", min: 1, max: 6, step: 1, defaultVal: 2, unit: "Pits", multiplier: 150000 }, // Naira estimate weight
      { id: "lightning_rods", label: "Lightning Protection Rods", min: 0, max: 4, step: 1, defaultVal: 1, unit: "Rods", multiplier: 85000 },
      { id: "surge_relays", label: "AC/DC Surge Protection Relays", min: 1, max: 10, step: 1, defaultVal: 2, unit: "Relays", multiplier: 45000 }
    ],
    faq: [
      { q: "Why is earth resistance under 1.0 Ohm so critical?", a: "High earth resistance prevents safety fuses and surge devices from triggering instantly during short circuits. Keeping ground resistance below 1.0 Ohm routes hazardous faults away, protecting humans and sensitive computing equipment." },
      { q: "What standard guidelines do TAPCO engineering layouts follow?", a: "Every electrical schematic is signed off by a COREN-registered engineer in accordance with NEMSA National Electrical Installation Standards and IEE Wiring Code (BS 7671) guidelines." }
    ]
  },
  {
    id: "maintenance",
    number: "07",
    title: "Maintenance & Support",
    tagline: "Protecting clean assets via thermal hotspot tracking & telemetry",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1000&auto=format&fit=crop&q=80",
    description: "Protect your long-term clean energy investment with scheduled routine inspections, preventive diagnostics, component adjustments, and rapid emergency support.",
    detailedScope: "We run systematic solar asset maintenance contracts. Utilizing infrared thermal cameras to capture cell micro-fractures, deionized water panel spray washes, and 24/7 GPRS telemetry health scans.",
    services: [
      "Scheduled Physical Structural Audits",
      "Thermographic Hotspot Testing Scans",
      "Pressure-Wash Module Cleaning Rounds",
      "LiFePO4 Charge Calibration Updates",
      "Active GPRS / Wi-Fi Telemetry Link Checks",
      "Emergency Disaster Recovery Teams",
      "Annual Service Contract Operations"
    ],
    specs: [
      { label: "Telemetry Link", value: "24/7 GPRS / Wi-Fi Active Cloud Status" },
      { label: "Module Cleaning", value: "Deionized Water Pressure Spraying Cycle" },
      { label: "Diagnostics Scan", value: "Infrared Thermographic Hotspot Testing" },
      { label: "Response SLA", value: "Under 4 Hours for Critical Emergencies" }
    ],
    compliance: [
      "IEC 62446 Grid Connected PV Maintenance Standards",
      "NEMSA Certified Engineering Audit Logs",
      "IEEE 1188 State of Health (SoH) Calibration"
    ],
    ctaText: "Book System Health Check",
    accentColor: "#0057B8",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
        title: "Rooftop Engineering Inspection",
        desc: "Using advanced visual inspection and cloud telemetry to isolate micro-fissures in solar energy arrays."
      },
      {
        url: "https://images.unsplash.com/photo-1548613053-22003a8a0194?w=800&auto=format&fit=crop&q=80",
        title: "Deionized Pressure Wash",
        desc: "Removing thick encrusted dust and bird droppings with soft, chemical-free deionized water washes."
      },
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80",
        title: "Battery Diagnostic Scan",
        desc: "Checking individual battery pack impedances and uploading charge profile software recalibrations."
      }
    ],
    flowchartNodes: [
      { id: "ir_scan", title: "Thermal Infrared Camera", subtitle: "Micro-Fracture Check", type: "source", iconName: "sun", description: "Infrared imaging isolates invisible hot-spots and micro-fissures in solar modules before they cause efficiency decay.", techSpec: "Fault Capture accuracy: 99.8%", nominalVal: "38", unit: "°C Hotspot" },
      { id: "wash", title: "Deionized Module Wash", subtitle: "Dust & Soiling Removal", type: "process", iconName: "droplets", description: "Pressure-spraying utilizing pure deionized water to prevent salt scaling, completely restoring original sunlight yields.", techSpec: "Restores up to 25% dust loss", nominalVal: "98", unit: "Bar Flow" },
      { id: "bms", title: "State of Health (SoH)", subtitle: "Battery Cell Calibration", type: "process", iconName: "cpu", description: "Deep-recalibrates cell voltage parameters within modular BMS banks, extending lifespan and capacity safety.", techSpec: "Battery Lifetime Boost: +30%", nominalVal: "96.5", unit: "SoH %" },
      { id: "tele_sync", title: "GPRS Telemetry Link", subtitle: "24/7 Cloud Tracker", type: "process", iconName: "network", description: "Remote GPRS / Wi-Fi telemetry scans syncing daily generation curves and battery temperatures directly to support centers.", techSpec: "Cloud Upload Sync Frequency: 5 min", nominalVal: "24", unit: "Hrs Link" },
      { id: "sla_dispatch", title: "SLA Emergency Dispatch", subtitle: "Rapid Tech Team", type: "output", iconName: "wrench", description: "Dispatches mobile engineering teams with diagnostic gear to site for critical faults under 4 hours.", techSpec: "Guaranteed Response: Under 4 Hours", nominalVal: "3.5", unit: "Hours SLA" }
    ],
    calcInputs: [
      { id: "panels_count", label: "Total Solar Panels on Site", min: 4, max: 120, step: 4, defaultVal: 12, unit: "Panels", multiplier: 3500 }, // clean & test rate per module
      { id: "battery_capacity", label: "Energy Battery Storage Capacity", min: 5, max: 100, step: 5, defaultVal: 15, unit: "kWh", multiplier: 5000 }, // BMS calibration testing rate
      { id: "years_active", label: "System Installation Active Years", min: 1, max: 10, step: 1, defaultVal: 2, unit: "Years", multiplier: 15000 },
      { id: "site_distance", label: "Distance from City Core Office", min: 5, max: 150, step: 5, defaultVal: 20, unit: "km", multiplier: 1000 }
    ],
    faq: [
      { q: "How often should solar modules receive a professional pressure wash?", a: "In dust-prone regions across Nigeria, especially during the Harmattan season, panels can lose up to 25% of their generating capacity due to thick dust crusts. We recommend professional cleaning cycles every 3 to 6 months." },
      { q: "What is covered in the 24/7 telemetry monitoring SLA?", a: "We monitor your system's battery State of Health, daily solar production levels, and active inverter load ranges, automatically sending alerts to our engineers if any temperature or voltage spikes occur." }
    ]
  }
];

// SIZING CALCULATOR PRESETS (fallback lookup table)
const CALCULATOR_PRESETS: Record<string, {
  name: string;
  inverterSize: string;
  batteryCap: string;
  solarCapacity: string;
  carbonOffset: string;
  appliances: string[];
}> = {
  residential: {
    name: "Luxury Smart Home Duplex Setup",
    inverterSize: "10.0 kVA Pure Sine Wave",
    batteryCap: "15.0 kWh High-Cycle LiFePO4",
    solarCapacity: "5.4 kWp (9x 600W Mono)",
    carbonOffset: "12.4 kg CO2 / day",
    appliances: ["3x Inverter Air Conditioners", "1x Double-Door Freezer", "12x LED Illumination Bulbs", "4x Smart Televisions", "1x Water Pumping Unit"]
  },
  commercial: {
    name: "Standard Enterprise Office Center Setup",
    inverterSize: "30.0 kVA Hybrid Quad-Core",
    batteryCap: "45.0 kWh High-Cycle LiFePO4",
    solarCapacity: "16.2 kWp (27x 600W Mono)",
    carbonOffset: "37.2 kg CO2 / day",
    appliances: ["8x Inverter Air Conditioners", "20x High-End Dev Laptops", "2x Commercial Server Racks", "1x Water Dispensing Grid"]
  },
  industrial: {
    name: "Medium Duty Manufacturing Plant Grid",
    inverterSize: "100.0 kVA Parallel Grid System",
    batteryCap: "120.0 kWh Storage Cabinet System",
    solarCapacity: "54.0 kWp (90x 600W Mono)",
    carbonOffset: "124.0 kg CO2 / day",
    appliances: ["Continuous Injection Molder", "Raw Materials Conveyor Belt", "Heavy Assembly Exhaust Units", "Main Office Facility ACs"]
  }
};

interface ServicesPanelProps {
  onQuoteRequested: (serviceName: string) => void;
  onBookMaintenanceRequested: () => void;
}

export default function ServicesPanel({ onQuoteRequested, onBookMaintenanceRequested }: ServicesPanelProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [liveServices, setLiveServices] = useState<any>(null);

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
        if (active && data.success) {
          setExchangeRate(data.exchangeRate);
          setLiveServices(data.services);
        }
      })
      .catch((err) => {
        console.warn("Gracefully falling back to cached services data:", err.message || err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Flowchart interactive state
  const [activeNodeId, setActiveNodeId] = useState<string>("");
  const [simulatedLoadJitter, setSimulatedLoadJitter] = useState<number>(0);

  // Calculator inputs state
  const [customCalculations, setCustomCalculations] = useState<Record<string, number>>({});
  const [inspectionImageZoom, setInspectionImageZoom] = useState<string | null>(null);

  // Periodic CAD-like telemetry jitter to look highly functional
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedLoadJitter((prev) => {
        const rand = Math.random() * 4 - 2; // -2 to +2%
        return Number((rand).toFixed(1));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Initialize input sliders on category selection
  useEffect(() => {
    if (selectedCategory) {
      const initial: Record<string, number> = {};
      selectedCategory.calcInputs.forEach((inp) => {
        initial[inp.id] = inp.defaultVal;
      });
      setCustomCalculations(initial);

      // Auto-set the first node as active
      if (selectedCategory.flowchartNodes.length > 0) {
        setActiveNodeId(selectedCategory.flowchartNodes[0].id);
      }
    }
  }, [selectedCategory]);

  const handleBackToCatalog = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: document.getElementById("services-section-top")?.offsetTop || 0, behavior: "smooth" });
  };

  const handleCtaClick = (cat: ServiceCategory) => {
    if (cat.id === "maintenance") {
      onBookMaintenanceRequested();
    } else {
      onQuoteRequested(cat.title);
    }
  };

  // Dynamic estimate generator
  const getCalculatedSizingResult = () => {
    if (!selectedCategory) return { totalLoadW: 0, batteryKwh: 0, pvWp: 0, invoicePrice: 0, co2Offset: 0 };
    
    let totalLoadW = 0;
    selectedCategory.calcInputs.forEach((inp) => {
      const userVal = customCalculations[inp.id] !== undefined ? customCalculations[inp.id] : inp.defaultVal;
      totalLoadW += userVal * inp.multiplier;
    });

    // Sizing rules based on cumulative load
    let batteryKwh = Number(((totalLoadW * 8) / 1000).toFixed(1)); // 8 hours of average run
    if (batteryKwh < 5) batteryKwh = 5;
    if (selectedCategory.id === "electrical") {
      // Custom math for Ground grid
      batteryKwh = 0; // Ground pits don't store battery
    } else if (selectedCategory.id === "maintenance") {
      batteryKwh = 0;
    }

    let pvWp = Number((((totalLoadW * 5) / 1000) * 1.2 * 1000).toFixed(0)); // 5 peak sun hours, safety buffer
    if (pvWp < 3000) pvWp = 3000;
    if (selectedCategory.id === "electrical" || selectedCategory.id === "maintenance") {
      pvWp = 0;
    }

    // High quality Naira pricing engine
    let invoicePrice = 0;
    if (selectedCategory.id === "electrical") {
      const circuits = customCalculations["circuits"] || 15;
      const groundPits = customCalculations["earth_points"] || 2;
      const lightRods = customCalculations["lightning_rods"] || 1;
      const surgeRelays = customCalculations["surge_relays"] || 2;
      
      const pitRate = liveServices?.earthing_system?.price || 165000;
      const rodRate = liveServices?.lightning_protection?.price || 95000;
      const baseFee = liveServices?.consultation_fee?.price || 250000;

      invoicePrice = (circuits * 35000) + (groundPits * pitRate) + (lightRods * rodRate) + (surgeRelays * 48000) + baseFee;
    } else if (selectedCategory.id === "maintenance") {
      const panels = customCalculations["panels_count"] || 12;
      const batCap = customCalculations["battery_capacity"] || 15;
      const years = customCalculations["years_active"] || 2;
      const dist = customCalculations["site_distance"] || 20;

      const washRate = liveServices?.maintenance_panel_cleaning?.price || 4000;
      const bmsRate = liveServices?.bms_calibration?.price || 6000;

      invoicePrice = (panels * washRate) + (batCap * bmsRate) + (years * 25000) + (dist * 1200) + 120000;
    } else {
      // standard solar pricing
      const panelRate = exchangeRate ? Math.round(0.28 * exchangeRate) : 450; 
      const batteryCellRate = exchangeRate ? Math.round(200 * exchangeRate) : 320000;
      const inverterBase = exchangeRate ? Math.round(530 * exchangeRate) : 850000;

      invoicePrice = (pvWp * panelRate) + (batteryKwh * batteryCellRate) + inverterBase;
    }

    const co2Offset = Number(((pvWp * 2.3) / 1000).toFixed(1));

    return {
      totalLoadW,
      batteryKwh,
      pvWp,
      invoicePrice,
      co2Offset
    };
  };

  const handleCustomQuoteSubmit = () => {
    if (!selectedCategory) return;
    const res = getCalculatedSizingResult();
    let message = "";
    if (selectedCategory.id === "electrical") {
      message = `Requesting electrical engineering quote: Target Circuits: ${customCalculations["circuits"]}, Earth Pits: ${customCalculations["earth_points"]}, Protection Relays: ${customCalculations["surge_relays"]}. Est Invoice: ₦${res.invoicePrice.toLocaleString()}`;
    } else if (selectedCategory.id === "maintenance") {
      message = `Requesting system check service quote: Site Modules: ${customCalculations["panels_count"]}, Storage size: ${customCalculations["battery_capacity"]}kWh. Est Invoice: ₦${res.invoicePrice.toLocaleString()}`;
    } else {
      message = `Bespoke configuration invoice estimate for ${selectedCategory.title}: Load Capacity: ${res.totalLoadW}W, Required Array: ${res.pvWp}Wp, Required LiFePO4: ${res.batteryKwh}kWh. Estimated Project Invoice: ₦${res.invoicePrice.toLocaleString()}`;
    }
    onQuoteRequested(message);
  };

  const currentResults = getCalculatedSizingResult();

  // Anchor scroll handler to avoid window flash
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="services-section-top" className="w-full relative space-y-8">
      
      {/* Regulatory Badge Header for absolute confidence */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          /* ============================================================ */
          /* PORTAL CATALOG VIEW: DUAL-PANE INTERACTIVE STAGE              */
          /* ============================================================ */
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Minimal Headroom Title Block */}
            <div className="space-y-4 text-center max-w-4xl mx-auto px-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0057B8]/5 border border-[#0057B8]/15 text-[10px] font-black text-[#0057B8] uppercase tracking-widest shadow-xs">
                <Shield className="h-3.5 w-3.5 text-[#00A651]" />
                <span>TAPCO Renewable Registry</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Bespoke Clean Energy <span className="text-[#0057B8]">Sectors</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-medium">
                We design, commission, and protect solar microgrids, advanced battery storage vaults, and high-impedance earthing networks. Select a primary sector below to load active CAD specs.
              </p>

              {/* Regulatory Logos Strip */}
              <div className="pt-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 border-t border-slate-100 max-w-xl mx-auto text-[9px] font-black tracking-wider text-slate-400">
                <span className="uppercase">Certified:</span>
                <div className="flex items-center gap-1 text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0057B8]"></span>
                  <span className="font-mono text-[9px] text-slate-700">COREN REGISTERED</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00A651]"></span>
                  <span className="font-mono text-[9px] text-slate-700">NEMSA LICENSED</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD100]"></span>
                  <span className="font-mono text-[9px] text-slate-700">REAN ADVOCATE</span>
                </div>
              </div>
            </div>

            {/* Catalog Layout: Left Selector, Right Stage (Desktop) */}
            <div className="hidden lg:grid grid-cols-12 gap-10 items-stretch bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

              {/* Left Selector Sidebar */}
              <div className="col-span-5 space-y-2 pr-6 border-r border-slate-100 relative z-10 text-left">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    TAPCO Engineering Registry
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Select a core folder to inspect components and enter simulation.
                  </p>
                </div>

                {SERVICE_CATEGORIES.map((cat, idx) => {
                  const CatIcon = cat.icon;
                  const isActive = hoveredIdx === idx;
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 relative overflow-hidden group border ${
                        isActive
                          ? "bg-[#0F2937] text-white border-[#0F2937] shadow-lg shadow-slate-900/10"
                          : "bg-slate-50/50 hover:bg-slate-50 text-slate-700 border-slate-100/80 hover:border-slate-200"
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#0057B8] transition-transform duration-200 ${isActive ? "scale-y-100" : "scale-y-0"}`} />

                      <div className="flex items-center gap-3.5 pl-1">
                        <span className={`text-[10px] font-mono font-bold ${isActive ? "text-[#FFD100]" : "text-slate-400"}`}>
                          {cat.number}
                        </span>
                        <div className={`p-2 rounded-lg transition-all ${
                          isActive ? "bg-white/10 text-[#FFD100]" : "bg-white text-[#0057B8] shadow-2xs border border-slate-100"
                        }`}>
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs tracking-tight leading-none">
                            {cat.title}
                          </h4>
                          <p className={`text-[10px] truncate max-w-[200px] mt-1 font-semibold font-sans ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                            {cat.tagline}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4.5 w-4.5 transition-all duration-200 ${
                        isActive ? "text-[#FFD100] translate-x-1" : "text-slate-400 group-hover:translate-x-1"
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Showcase Stage (Dynamic Telemetry HUD UI) */}
              <div className="col-span-7 h-[580px] flex flex-col justify-between bg-slate-50/50 border border-slate-150 rounded-2xl overflow-hidden p-6 relative z-10 text-left">
                <AnimatePresence mode="wait">
                  {SERVICE_CATEGORIES.map((cat, idx) => {
                    if (hoveredIdx !== idx) return null;
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 p-6 flex flex-col justify-between h-full"
                      >
                        <div className="space-y-4">
                          <div className="relative rounded-xl overflow-hidden h-56 shadow-sm border border-slate-200 bg-slate-200 flex-shrink-0">
                            <img
                              src={cat.image}
                              alt={cat.title}
                              className="w-full h-full object-cover filter brightness-[0.75]"
                              referrerPolicy="no-referrer"
                            />
                            {/* CAD Simulation overlay */}
                            <div className="absolute inset-x-3 bottom-3 bg-[#0F2937]/90 backdrop-blur-md rounded-lg p-3 border border-white/5 text-white flex items-center justify-between shadow-md">
                              <div>
                                <span className="text-[8px] font-black tracking-widest text-[#FFD100] uppercase block">
                                  ⚡ CAD TELEMETRY HUB
                                </span>
                                <h5 className="text-[11px] font-black uppercase tracking-wide truncate max-w-[170px] mt-0.5">
                                  {cat.title} Setup
                                </h5>
                              </div>
                              <div className="flex gap-3 border-l border-white/10 pl-3 text-right">
                                <div>
                                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Efficiency</span>
                                  <span className="text-[11px] font-mono text-[#00A651] font-black">
                                    {(98.2 + simulatedLoadJitter/10).toFixed(1)}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Distortion</span>
                                  <span className="text-[11px] font-mono text-[#FFD100] font-black">
                                    {(1.15 + simulatedLoadJitter/100).toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className="absolute top-3 right-3 bg-white text-slate-900 text-[8px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md shadow-xs border border-slate-150">
                              Sector {cat.number}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {cat.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed font-sans">
                              {cat.description}
                            </p>
                          </div>
                        </div>

                        {/* Specs Highlight & Entry Button */}
                        <div className="space-y-4 pt-3 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-3">
                            {cat.specs.slice(0, 2).map((sp, sIdx) => (
                              <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                                <div>
                                  <span className="text-[8px] uppercase text-slate-400 font-bold block">{sp.label}</span>
                                  <span className="text-[11px] font-black text-slate-800 leading-none">{sp.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => setSelectedCategory(cat)}
                            className="w-full py-3.5 bg-[#0057B8] hover:bg-[#003B80] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#0057B8]/10 transition-all cursor-pointer"
                          >
                            <span>Open Technical Brochure &amp; Sizing Estimator</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile/Tablet Segmented Tab Layout */}
            <div className="lg:hidden space-y-4 px-2 text-left">
              <div className="flex overflow-x-auto pb-2 gap-1.5 no-scrollbar border-b border-slate-200">
                {SERVICE_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setHoveredIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                      hoveredIdx === idx
                        ? "bg-[#0F2937] text-[#FFD100] border-[#0F2937] shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-150"
                    }`}
                  >
                    <span>{cat.number}</span>
                    <span>{cat.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Showcase displayed mobile card */}
              <AnimatePresence mode="wait">
                {SERVICE_CATEGORIES.map((cat, idx) => {
                  if (hoveredIdx !== idx) return null;
                  const CatIcon = cat.icon;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate-100">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="bg-[#FFD100] text-slate-900 text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded shadow-xs border border-white/10">
                            Sector {cat.number}
                          </span>
                          <div className="h-8 w-8 bg-white/20 text-white rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20">
                            <CatIcon className="h-4.5 w-4.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="space-y-0.5">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">
                            {cat.title}
                          </h3>
                          <span className="text-[10px] text-[#00A651] font-extrabold uppercase tracking-widest block">
                            {cat.tagline}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {cat.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {cat.specs.slice(0, 2).map((sp, sIdx) => (
                            <div key={sIdx} className="bg-slate-50 p-2 rounded-lg border border-slate-150 text-left">
                              <span className="text-[8px] uppercase text-slate-400 font-bold block">{sp.label}</span>
                              <span className="text-xs font-black text-slate-800 leading-tight block">{sp.value}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            window.scrollTo({ top: document.getElementById("services-section-top")?.offsetTop || 0, behavior: "smooth" });
                          }}
                          className="w-full py-3 bg-[#0057B8] hover:bg-[#003B80] text-white rounded-xl text-xs font-black uppercase tracking-wider text-center cursor-pointer transition shadow-xs flex items-center justify-center gap-1"
                        >
                          <span>Launch Full Sizing Sizer &amp; Brochure</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* LANDING PAGE VIEW: PREMIUM INDIVIDUAL SECTOR OVERLAY          */
          /* ============================================================ */
          <motion.div
            key="landing-page"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-12 text-left w-full"
          >
            {/* Header / Sub-Navigation Anchor Bar & Back Controller */}
            <div className="relative md:sticky md:top-20 z-30 bg-white/95 backdrop-blur-md py-3 md:py-4 border-b border-slate-200/80 flex flex-row items-center justify-between gap-4 shadow-sm w-full rounded-2xl px-4 md:px-6">
              <button
                onClick={handleBackToCatalog}
                className="group inline-flex items-center gap-2 text-[10px] md:text-xs font-black text-[#0057B8] hover:text-[#003B80] uppercase tracking-wider transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-2 md:px-4 md:py-2.5 rounded-lg border border-slate-200 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>All Sectors</span>
              </button>

              {/* Scroll Anchors Menu */}
              <div className="hidden md:flex flex-wrap items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                <button onClick={() => handleScrollToSection("overview")} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap">Overview</button>
                <span className="text-slate-200">|</span>
                <button onClick={() => handleScrollToSection("flowchart")} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap">Interactive Flowchart</button>
                <span className="text-slate-200">|</span>
                <button onClick={() => handleScrollToSection("gallery")} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap">Photography Showcase</button>
                <span className="text-slate-200">|</span>
                <button onClick={() => handleScrollToSection("estimator")} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap">Sizing Estimator</button>
                <span className="text-slate-200">|</span>
                <button onClick={() => handleScrollToSection("deliverables")} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap">Scope &amp; Deliverables</button>
              </div>
            </div>

            {/* Immersive Landing Hero Banner */}
            <div id="overview" className="relative rounded-3xl overflow-hidden min-h-[340px] md:min-h-[460px] flex items-end shadow-md w-full border border-slate-200 scroll-mt-36">
              <img
                src={selectedCategory.image}
                alt={selectedCategory.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2937] via-[#0F2937]/60 to-transparent" />
              
              {/* Certification Badge */}
              <div className="absolute top-6 right-6 bg-[#0F2937]/90 backdrop-blur-sm border border-white/10 p-4 rounded-xl hidden md:flex items-center gap-3 shadow-md">
                <FileCheck className="h-7 w-7 text-[#FFD100]" />
                <div className="text-left text-white leading-none">
                  <span className="text-[8px] uppercase tracking-widest font-black text-slate-300 block">
                    Engineering Audit
                  </span>
                  <span className="text-[10px] font-black font-mono text-[#00A651] mt-1 block">
                    COREN &amp; NEMSA CERTIFIED
                  </span>
                </div>
              </div>

              <div className="relative p-8 md:p-14 space-y-3 max-w-4xl text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD100] bg-white/10 px-3.5 py-1.5 rounded-md backdrop-blur-sm border border-white/10 inline-block">
                  Engineering Sector {selectedCategory.number}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                  {selectedCategory.title}
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-semibold max-w-2xl">
                  {selectedCategory.tagline}
                </p>
              </div>
            </div>

            {/* SECTION 1: OVERVIEW & SPECIFICATIONS SIDE-BY-SIDE */}
            <div className="grid gap-8 lg:grid-cols-12 items-start w-full">
              {/* Left: Overview details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 leading-none">
                    <Compass className="h-6 w-6 text-[#00A651]" />
                    Sector Engineering Overview
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                    {selectedCategory.detailedScope}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                    All layouts inside the {selectedCategory.title} sector are simulated based on dynamic thermal models, load-matching configurations, and grid safety tolerances to provide long life-cycles without risking internal building circuits.
                  </p>
                </div>
              </div>

              {/* Right: Technical Specifications */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5 text-left shadow-2xs">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#0057B8]" />
                    Engineering Specifications
                  </h4>

                  <div className="space-y-1.5 border-b border-slate-150 pb-4">
                    {selectedCategory.specs.map((sp, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-150/50 last:border-0 text-[11px] sm:text-xs">
                        <span className="text-slate-500 font-bold">{sp.label}</span>
                        <span className="text-slate-900 font-extrabold text-right ml-2">{sp.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Regulatory Compliance Lines */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-[#00A651] tracking-wider block">
                      ✔ Regulatory Standard Alignment
                    </span>
                    <ul className="space-y-2 text-[10px] text-slate-500 font-semibold">
                      {selectedCategory.compliance.map((comp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-[#00A651]" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: FULL-WIDTH INTERACTIVE ENGINEERING FLOWCHART CANVAS */}
            <div id="flowchart" className="bg-[#0F2937] text-white p-8 rounded-3xl border border-slate-800 space-y-8 scroll-mt-36 relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Activity className="h-5 w-5 text-[#00A651] animate-pulse" />
                    <h3 className="text-base font-black uppercase tracking-wider text-[#FFD100]">Interactive CAD Pipeline Flowchart</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold font-sans">
                    Click on any physical component block to query real-time diagnostics and electrical specifications.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="h-2 w-2 bg-[#00A651] rounded-full animate-ping" />
                  <span className="text-slate-300 font-bold">SIMULATION LINK UP</span>
                </div>
              </div>

              {/* Flowchart Schematic Grid - Spans the whole width beautifully */}
              <div className="relative py-6 z-10 w-full overflow-x-auto no-scrollbar">
                <div className="min-w-[800px] md:min-w-0 grid gap-6 grid-cols-5 items-stretch relative">
                  
                  {/* Connection path drawings behind nodes on desktop */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-slate-700 pointer-events-none z-0" />

                      {selectedCategory.flowchartNodes.map((nd, idx) => {
                        const isCurrent = activeNodeId === nd.id;
                        let typeColorClass = "border-[#0057B8]/40";
                        if (nd.type === "source") typeColorClass = "border-[#FFD100]/40";
                        if (nd.type === "output") typeColorClass = "border-[#00A651]/40";

                        return (
                          <button
                            key={nd.id}
                            onClick={() => setActiveNodeId(nd.id)}
                            className={`w-full text-left p-4.5 rounded-2xl border relative z-10 transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                              isCurrent
                                ? "bg-slate-900 border-[#FFD100] ring-2 ring-[#FFD100]/20 shadow-xl shadow-[#FFD100]/5"
                                : "bg-[#153448] hover:bg-[#1A415A] text-slate-100 " + typeColorClass
                            }`}
                          >
                            {/* Pulse glowing state for selected */}
                            {isCurrent && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD100] opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD100]" />
                              </span>
                            )}

                            <span className="text-[9px] font-mono font-bold uppercase block tracking-wider opacity-65">
                              Stage 0{idx + 1} • {nd.type}
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-white truncate mt-2 leading-none">
                              {nd.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate font-semibold font-sans mt-1">
                              {nd.subtitle}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic HUD Diagnostics Panel for active Node - Full Width */}
                  {(() => {
                    const nd = selectedCategory.flowchartNodes.find((n) => n.id === activeNodeId) || selectedCategory.flowchartNodes[0];
                    if (!nd) return null;
                    
                    // Generate fluctuating active telemetry metrics
                    const metricVal = nd.id === "pv" || nd.id === "pv_mw" || nd.id === "agri_pv" || nd.id === "school_pv"
                      ? (Number(nd.nominalVal) * (1 + simulatedLoadJitter/100)).toFixed(0)
                      : (Number(nd.nominalVal) * (1 + simulatedLoadJitter/120)).toFixed(1);

                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black tracking-widest text-[#00A651] uppercase block">
                              Diagnostic Registry
                            </span>
                            <h4 className="text-sm font-black uppercase text-white tracking-wide">
                              {nd.title} — Live Readout
                            </h4>
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[#FFD100] bg-[#FFD100]/10 px-3 py-1 rounded-full border border-[#FFD100]/15">
                            Active Spec: {nd.techSpec}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
                          {/* Live metric reader */}
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">Live Voltage / Flow</span>
                            <span className="text-lg sm:text-xl font-black font-mono text-[#00A651] mt-1 block">
                              {metricVal} {nd.unit}
                            </span>
                          </div>
                          {/* Simulated Temperature reader */}
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">Component Temperature</span>
                            <span className="text-lg sm:text-xl font-black font-mono text-white mt-1 block">
                              {(34.5 + simulatedLoadJitter/2).toFixed(1)} °C
                            </span>
                          </div>
                          {/* Status rating */}
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
                            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider block">Insulated Health</span>
                            <span className="text-lg sm:text-xl font-black font-mono text-[#00A651] mt-1 flex items-center gap-1.5">
                              ✔ 100% OK
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold font-sans pt-2 border-t border-slate-800/50">
                          {nd.description}
                        </p>
                      </div>
                    );
                  })()}
                </div>

            {/* ============================================================ */}
            {/* DETAILED HIGH-RES PHOTOGRAPHY Showcase Bento Grid             */}
            {/* ============================================================ */}
            <div id="gallery" className="space-y-5 pt-4 scroll-mt-36 w-full">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Equipment Configuration Gallery</h3>
                <p className="text-sm text-slate-500 font-medium">
                  Zoom into high-resolution photography capturing actual engineering materials on site.
                </p>
              </div>

              {/* Made cards bigger and aspect ratio cleaner */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full">
                {selectedCategory.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] shadow-xs hover:shadow-lg transition-all duration-300 bg-slate-100 text-left cursor-pointer"
                    onClick={() => setInspectionImageZoom(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9] group-hover:brightness-[0.8]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5" />
                    
                    <div className="absolute bottom-5 left-5 right-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <h4 className="text-xs font-black tracking-wider uppercase text-[#FFD100]">
                        {img.title}
                      </h4>
                      <p className="text-[10px] text-slate-200 font-semibold truncate mt-1">
                        {img.desc}
                      </p>
                    </div>

                    {/* Expand indicator icon */}
                    <div className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPLETE SERVICES DELIVERABLES GRID */}
            <div id="deliverables" className="space-y-5 pt-4 scroll-mt-36 w-full">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Scope &amp; Included Deliverables</h3>
                <p className="text-sm text-slate-500 font-medium">
                  All systems commissioned in the {selectedCategory.title} class include the following certified deliverables:
                </p>
              </div>

              {/* Expand into a beautiful 3-column bento-like grid of deliverables, cards are larger and highly polished */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {selectedCategory.services.map((item, idx) => {
                  // Premium deliverable rich paragraphs builder
                  const getDeliverableDetails = (serviceItem: string): string => {
                    const normalized = serviceItem.toLowerCase();
                    if (normalized.includes("audit") || normalized.includes("auditing") || normalized.includes("analysis") || normalized.includes("scoping")) {
                      return "Meticulous on-site evaluation of structural loads, shading ratios, and consumption trends to optimize configuration metrics.";
                    }
                    if (normalized.includes("monocrystalline") || normalized.includes("pv") || normalized.includes("panel") || normalized.includes("array") || normalized.includes("farm")) {
                      return "Deploying exclusively Tier-1 monocrystalline half-cell PERC modules designed to maximize solar yields during high dust and rainy seasons.";
                    }
                    if (normalized.includes("inverter") || normalized.includes("inverters") || normalized.includes("power")) {
                      return "Advanced pure sine wave power conversion arrays with smart grid-interactive synchronization capabilities for steady load distribution.";
                    }
                    if (normalized.includes("surge") || normalized.includes("protective") || normalized.includes("relays") || normalized.includes("fuse")) {
                      return "Robust fast-acting surge arrestors protecting internal circuitry from lightning strikes and transient municipal grid feed shocks.";
                    }
                    if (normalized.includes("ground") || normalized.includes("earth") || normalized.includes("earthing") || normalized.includes("grounding") || normalized.includes("pit")) {
                      return "Establishing chemically enriched copper pits to maintain continuous fault leakage paths strictly under the critical 1.0 Ohm limit.";
                    }
                    if (normalized.includes("warranty")) {
                      return "Every configuration is backed by our comprehensive 5-year structural coverage with guaranteed rapid-response engineer dispatch.";
                    }
                    if (normalized.includes("telemetry") || normalized.includes("monitoring") || normalized.includes("scada") || normalized.includes("iot") || normalized.includes("link")) {
                      return "Equipped with active GPRS cell and Wi-Fi transmitters logging battery health status directly to our 24/7 central support desks.";
                    }
                    if (normalized.includes("battery") || normalized.includes("powerwall") || normalized.includes("lfp") || normalized.includes("storage") || normalized.includes("bess")) {
                      return "Safe high-capacity Lithium Iron Phosphate (LiFePO4) storage nodes rated for 6,000+ deep discharge cycles to secure nighttime autonomy.";
                    }
                    if (normalized.includes("switching") || normalized.includes("switchboard") || normalized.includes("switchboards") || normalized.includes("board")) {
                      return "Assembled main switchboard systems featuring heavy-duty copper busbars and dynamic phase-balancing safety isolators.";
                    }
                    if (normalized.includes("vfd") || normalized.includes("starter") || normalized.includes("starters") || normalized.includes("pump")) {
                      return "Integrating smart variable-frequency drive controller nodes to eliminate startup current spikes and protect pump motor lifespans.";
                    }
                    if (normalized.includes("lightning") || normalized.includes("arrestor") || normalized.includes("rod") || normalized.includes("mast")) {
                      return "Installing heavy-duty copper air terminals with dedicated structural down-conductors to safely absorb and route lightning discharges.";
                    }
                    if (normalized.includes("academy") || normalized.includes("science")) {
                      return "Fitted with interactive solar telemetry display nodes as a visual science teaching tool, elevating local engineering educational standards.";
                    }
                    if (normalized.includes("sla") || normalized.includes("support") || normalized.includes("contract") || normalized.includes("team") || normalized.includes("teams")) {
                      return "Guaranteed service SLA ensuring prioritized expert engineer physical site visits within 4 hours during system emergencies.";
                    }
                    return "Certified engineering layout customized, load-balanced, and performance-tested under NEMSA and COREN regulations.";
                  };

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/90 hover:border-[#0057B8]/40 hover:bg-slate-50/30 rounded-3xl p-6.5 transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md group text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-[#0057B8] transition-colors duration-300" />
                      <div className="space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 text-[#0057B8] group-hover:bg-[#0057B8]/10 group-hover:text-[#0057B8] flex items-center justify-center flex-shrink-0 transition-colors duration-300 shadow-2xs border border-slate-100">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="font-black text-slate-900 text-sm leading-tight">
                            {item}
                          </h5>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                            {getDeliverableDetails(item)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 mt-2 border-t border-slate-100/80 flex items-center justify-between text-[8px] sm:text-[9px] font-black text-slate-400 group-hover:text-[#0057B8] uppercase tracking-widest transition-colors duration-300">
                        <span>TAPCO Certified Standard</span>
                        <span>Stage 0{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQS */}
            <div className="space-y-5 pt-4 w-full">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Risk Mitigation &amp; FAQs</h3>
              <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs text-left w-full">
                {selectedCategory.faq.map((item, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 space-y-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-start gap-2">
                      <span className="text-[#0057B8]">Q:</span>
                      <span>{item.q}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold font-sans pl-5 border-l-2 border-slate-100">
                      <span className="text-[#00A651] font-bold mr-1">A:</span>
                      <span>{item.a}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: BESPOKE BLUEPRINT ESTIMATOR & CALL TO ACTION SIDE-BY-SIDE */}
            <div id="estimator" className="grid gap-8 lg:grid-cols-12 items-stretch w-full scroll-mt-36">
              
              {/* Sizing Estimator Card - Left lg:col-span-7 */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Sliders className="h-5 w-5 text-[#0057B8]" />
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Bespoke Blueprint Sizing Estimator</h4>
                  </div>

                  {/* Dynamic inputs rendering */}
                  <div className="space-y-5 text-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Fine-Tune Active Sizing Parameters:
                    </span>

                    <div className="space-y-4">
                      {selectedCategory.calcInputs.map((inp) => {
                        const userVal = customCalculations[inp.id] !== undefined ? customCalculations[inp.id] : inp.defaultVal;
                        return (
                          <div key={inp.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                              <span className="text-slate-700">{inp.label}</span>
                              <span className="text-[#0057B8] font-black bg-[#0057B8]/5 px-2.5 py-0.5 rounded-md">
                                {userVal} {inp.unit}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={inp.min}
                              max={inp.max}
                              step={inp.step}
                              value={userVal}
                              onChange={(e) => {
                                setCustomCalculations((prev) => ({
                                  ...prev,
                                  [inp.id]: Number(e.target.value)
                                }));
                              }}
                              className="w-full accent-[#0057B8] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sizing Blueprint Results Display */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs sm:text-sm mt-4 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase text-[#00A651] tracking-widest block">TAPCO Recommended Sizing:</span>
                    <h5 className="font-black text-slate-900">{selectedCategory.title} Sizer</h5>
                  </div>

                  <div className="space-y-2 border-t border-slate-150 pt-3">
                    {selectedCategory.id !== "electrical" && selectedCategory.id !== "maintenance" && (
                      <>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Total Estimated Load:</span>
                          <span className="font-extrabold text-slate-900">{currentResults.totalLoadW.toLocaleString()} Watts</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">LiFePO4 Storage Battery:</span>
                          <span className="font-extrabold text-[#0057B8]">{currentResults.batteryKwh} kWh</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Required Solar PV Array:</span>
                          <span className="font-extrabold text-[#00A651]">{currentResults.pvWp.toLocaleString()} Wp</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Estimated CO2 Offset:</span>
                          <span className="font-extrabold text-[#00A651]">{currentResults.co2Offset} kg/day</span>
                        </div>
                      </>
                    )}
                    {selectedCategory.id === "electrical" && (
                      <>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Target Wiring Circuits:</span>
                          <span className="font-extrabold text-slate-900">{customCalculations["circuits"] || 15} Circuits</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Safe Ground resistance:</span>
                          <span className="font-extrabold text-[#00A651]">&lt; 1.0 Ohm</span>
                        </div>
                      </>
                    )}
                    {selectedCategory.id === "maintenance" && (
                      <>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Modules to Clean:</span>
                          <span className="font-extrabold text-slate-900">{customCalculations["panels_count"] || 12} panels</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500 font-bold">Diagnostic Scans:</span>
                          <span className="font-extrabold text-[#0057B8]">Active IR &amp; BMS</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-150 pt-3 flex items-center justify-between text-slate-900 font-bold">
                    <span className="font-black text-sm">Estimated Invoice:</span>
                    <span className="font-black text-base sm:text-lg text-[#0057B8]">₦{currentResults.invoicePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Consultation & Booking Callout - Right lg:col-span-5 */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-[#0F2937] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 rounded-bl-full pointer-events-none" />

                <div className="space-y-4 relative z-10 text-left">
                  <span className="text-[9px] uppercase tracking-widest font-black text-[#FFD100] block">
                    Begin Your Consultation
                  </span>
                  <h4 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                    Ready to execute your engineering blueprint?
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-semibold font-sans">
                    Speak directly with lead renewables architect Engr. Louis Olosunde, M.Sc, to map out your site inspection timeline and specific load schedule. We provide custom site scoping and electrical wiring mapping with COREN licensed procedures.
                  </p>
                </div>

                <div className="space-y-4 pt-6 relative z-10 text-left">
                  <button
                    onClick={() => handleCtaClick(selectedCategory)}
                    className="w-full py-4 bg-[#FFD100] text-slate-900 hover:bg-[#E2BB13] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition hover:scale-[1.01] cursor-pointer shadow-lg shadow-black/10"
                  >
                    <span>{selectedCategory.ctaText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleBackToCatalog}
                    className="w-full py-3.5 border border-white/20 text-white hover:bg-white/5 rounded-xl text-xs font-black uppercase tracking-wider text-center cursor-pointer transition"
                  >
                    Return to Sectors Catalog
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                  <span>⚡ COREN Licensed</span>
                  <span>₦0 Hidden Fees</span>
                </div>
              </div>

            </div>
            
            {/* Photography Zoom Modal Overlay */}
            {inspectionImageZoom && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setInspectionImageZoom(null)}
              >
                <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-white/15">
                  <img
                    src={inspectionImageZoom}
                    alt="Inspection Zoomed"
                    className="max-w-full max-h-[80vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-950 border border-white/20 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs tracking-wider cursor-pointer transition">
                    CLOSE INSPECTION
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
