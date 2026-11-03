import { 
  Users, BookOpen, ShoppingBag, MessageSquare, Shield,
  Layers, BarChart3, Briefcase, Calendar, Receipt, DollarSign,
  Globe, Sliders, ShieldAlert, Kanban
} from "lucide-react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loc: string;
  system: string;
  warranty: string;
  spend: number;
  tickets: number;
  notes: string;
  avatar?: string;
  status: "Active" | "Pending" | "Inactive";
  joinedDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  value: number;
  stage: "Contacted" | "Inspection" | "Design" | "Quotation" | "Negotiation";
  phone: string;
  source: string;
  date: string;
}

export interface Project {
  id: string;
  customer: string;
  phase: "Pre-Planning" | "Design" | "Installation" | "Testing" | "Commissioned";
  progress: number;
  engineer: string;
  cost: number;
  timeline: string;
  doc: string;
  address: string;
  notes: string;
  batterySpecs?: string;
  panelSpecs?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: "panels" | "inverters" | "batteries" | "accessories";
  price: number;
  stock: number;
  supplier: string;
  alert: boolean;
  specs: Record<string, string>;
  image?: string;
  description?: string;
  desc?: string;
}

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  carrier: string;
  payStatus: "Paid" | "Pending" | "Failed";
  trackingNumber?: string;
}

export interface AcademyStudent {
  email: string;
  name: string;
  progress: number;
  score: string;
  status: "Graduated" | "In Progress" | "Suspended";
  enrolledDate: string;
  completedLessons: number;
  totalLessons: number;
}

export interface AcademyClass {
  id: string;
  topic: string;
  date: string;
  instructor: string;
  category: string;
}

export interface Booking {
  id: string;
  type: string;
  name: string;
  date: string;
  time: string;
  loc: string;
  status: "Confirmed" | "Pending" | "Completed";
}

export interface SupportTicket {
  id: string;
  subject: string;
  cust: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  messages: Array<{ sender: "client" | "support", msg: string, time: string }>;
}

export const ROLES = [
  { id: "super_admin", name: "Super Admin", desc: "Universal System Controls & Security Audit Access" },
  { id: "ceo", name: "CEO / Executive", desc: "Financial Supervision & Global Corporate Telemetry" },
  { id: "operations_manager", name: "Operations Manager", desc: "Milestone Logistics, Resource Tracking, Field Surveys" },
  { id: "sales_manager", name: "Sales Manager", desc: "Lead Funnel Optimization, Booking Pipelines, CRM" },
  { id: "finance_manager", name: "Finance Manager", desc: "Financial Ledgers, Invoices, Outstandings, Escrow Audits" },
  { id: "engineering_manager", name: "Engineering Manager", desc: "System Design Reviews, Technical Audits, Asset Catalogs" },
  { id: "academy_manager", name: "Academy Manager", desc: "Solar Curriculum Director, Certification Pipelines" },
  { id: "instructor", name: "Academy Instructor", desc: "Lecture Schedulers, Student Evaluations, Class Notes" },
  { id: "customer_support", name: "Customer Support", desc: "Client Ticket Hubs, Live Chat Sinks, Client Logs" },
  { id: "store_manager", name: "Store Manager", desc: "Inventory Stock Limits, Order Fullfillments, Suppliers" },
  { id: "marketing_manager", name: "Marketing Manager", desc: "Growth Sizing Campaigns, Affiliate Networks, PR Media" },
  { id: "readonly_auditor", name: "Read-Only Auditor", desc: "Full Access to All Logs & Records - Zero Modification Access" }
];

export const DEFAULT_MODULE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security", "settings", "admin_management"],
  ceo: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security", "settings", "admin_management"],
  operations_manager: ["dashboard", "projects", "bookings", "products", "orders", "reports"],
  sales_manager: ["dashboard", "crm", "sales", "bookings", "reports"],
  finance_manager: ["dashboard", "crm", "orders", "finance", "reports"],
  engineering_manager: ["dashboard", "projects", "products", "bookings", "reports"],
  academy_manager: ["dashboard", "academy", "reports"],
  instructor: ["academy"],
  customer_support: ["dashboard", "crm", "support", "bookings"],
  store_manager: ["dashboard", "products", "orders", "reports"],
  marketing_manager: ["dashboard", "marketing", "reports"],
  readonly_auditor: ["dashboard", "crm", "sales", "projects", "products", "orders", "academy", "bookings", "finance", "support", "marketing", "reports", "security"]
};

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: "C-101", name: "Louis Olosunde", email: "olosundelouis@gmail.com", phone: "+234 812 3456", loc: "Abuja, NG", system: "12.4kW Array + 30kWh Battery", warranty: "5 Years left", spend: 27675000, tickets: 0, notes: "Corporate residential setup with net-metering readiness.", status: "Active", joinedDate: "2025-01-12" },
  { id: "C-102", name: "Evelyn Johnson", email: "evelyn.j@gmail.com", phone: "+234 809 9911", loc: "Lekki, Lagos", system: "8.2kW Hybrid + 15kWh Storage", warranty: "4 Years left", spend: 18300000, tickets: 1, notes: "Requires bi-annual dust cleaning service in July.", status: "Active", joinedDate: "2025-04-18" },
  { id: "C-103", name: "Federal School of Tech", email: "admin@fstech.edu.ng", phone: "+234 703 1111", loc: "Kaduna, NG", system: "45kW Microgrid Array", warranty: "9 Years left", spend: 81000000, tickets: 0, notes: "Flagship donor-sponsored 'Energy for Schools' installation.", status: "Active", joinedDate: "2024-11-05" }
];

export const INITIAL_LEADS: Lead[] = [
  { id: "L-301", name: "Dr. Amadi Bello", email: "amadi@belloclinic.org", value: 36750000, stage: "Design", phone: "+234 815 2222", source: "Referral", date: "2026-06-25" },
  { id: "L-302", name: "Prestige Estate Dev", email: "procure@prestige.com", value: 133500000, stage: "Quotation", phone: "+234 901 3333", source: "Ad Campaign", date: "2026-06-28" },
  { id: "L-303", name: "Chevron Housing Coop", email: "coop@chevron.com", value: 217500000, stage: "Inspection", phone: "+234 802 4444", source: "Organic Search", date: "2026-06-29" }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: "P-501", customer: "Prestige Estate", phase: "Testing", progress: 85, engineer: "Engr. Yusuf", cost: 63000000, timeline: "Due Jul 15", doc: "Estate_Blueprints.pdf", address: "Plot 12, Phase 2, Abuja", notes: "Estate microgrid with 15 smart powerwalls.", batterySpecs: "15x BYD 15kWh", panelSpecs: "120x TAPCO 550W Panels" },
  { id: "P-502", customer: "Chevron Housing", phase: "Design", progress: 25, engineer: "Engr. Louis", cost: 106500000, timeline: "Due Aug 30", doc: "Roof_Load_Specs.dwg", address: "Chevron Coop Close, Lekki", notes: "A symmetrical grid tie hybrid array over 20 terrace villas." },
  { id: "P-503", customer: "Federal Tech School", phase: "Commissioned", progress: 100, engineer: "Engr. Amadi", cost: 57000000, timeline: "Completed", doc: "Commissioning_Statement.pdf", address: "Main Campus, Kaduna", notes: "Supplies computing center and administrative corridors fully.", panelSpecs: "80x TAPCO 550W Panels", batterySpecs: "4x BYD 15kWh" }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  { 
    id: "PRD-201", 
    name: "TAPCO Bifacial Monocrystalline Panel 550W", 
    category: "panels", 
    price: 420000, 
    stock: 142, 
    supplier: "JA Solar Ltd", 
    alert: false, 
    specs: { "Cell Type": "Bifacial Half-Cut Mono", "Warranty": "25 Years", "Dimensions": "2278x1134x35mm" },
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60",
    description: "Monocrystalline Half-Cut cell technology. Delivers extreme conversion efficiency up to 21.8% even in overcast or high-temperature tropical climates.",
    desc: "Monocrystalline Half-Cut cell technology. Delivers extreme conversion efficiency up to 21.8% even in overcast or high-temperature tropical climates."
  },
  { 
    id: "PRD-202", 
    name: "TAPCO Smart Hybrid Inverter 10kW MPPT", 
    category: "inverters", 
    price: 2775000, 
    stock: 8, 
    supplier: "Sunsynk Global", 
    alert: true, 
    specs: { "MPPT Channels": "2 Tracker Lines", "Efficiency": "98.4%", "Max PV Input": "13000W" },
    image: "https://images.unsplash.com/photo-1620021601016-91866380a570?w=600&auto=format&fit=crop&q=60",
    description: "Next-gen MPPT dual-input pure sine wave inverter. Integrated Wi-Fi allows complete remote tracking via TAPCO cloud dashboards.",
    desc: "Next-gen MPPT dual-input pure sine wave inverter. Integrated Wi-Fi allows complete remote tracking via TAPCO cloud dashboards."
  },
  { 
    id: "PRD-203", 
    name: "TAPCO LiFePO4 Powerwall Storage 15kWh", 
    category: "batteries", 
    price: 6300000, 
    stock: 19, 
    supplier: "BYD Energy", 
    alert: false, 
    specs: { "Chemistry": "LiFePO4 Lithium", "Cycles": "6000 Cycles @ 80% DOD", "BMS Support": "CAN/RS485" },
    image: "https://images.unsplash.com/photo-1548613053-220bfb808945?w=600&auto=format&fit=crop&q=60",
    description: "Wall-mounted lithium iron phosphate battery. Long cycle life (>6000 cycles) with built-in intelligent Battery Management System (BMS).",
    desc: "Wall-mounted lithium iron phosphate battery. Long cycle life (>6000 cycles) with built-in intelligent Battery Management System (BMS)."
  },
  { 
    id: "PRD-204", 
    name: "Heavy-Duty UV Cabling & Combiner box", 
    category: "accessories", 
    price: 142500, 
    stock: 4, 
    supplier: "Local Grid Suppliers", 
    alert: true, 
    specs: { "Standard": "TUV Certified", "IP Rating": "IP67" },
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    description: "All-in-one professional heavy-duty weather resistant combiner enclosure and UV wiring accessories.",
    desc: "All-in-one professional heavy-duty weather resistant combiner enclosure and UV wiring accessories."
  }
];

export const INITIAL_ORDERS: Order[] = [
  { id: "ORD-901", customer: "Louis Olosunde", amount: 4200000, status: "Shipped", date: "2026-06-29", carrier: "DHL Premium", payStatus: "Paid", trackingNumber: "DHL-NG-91024" },
  { id: "ORD-902", customer: "Kaduna Regional Dealer", amount: 23100000, status: "Processing", date: "2026-06-30", carrier: "GIG Logistics", payStatus: "Pending", trackingNumber: "GIG-KD-20124" }
];

export const INITIAL_ACADEMY_STUDENTS: AcademyStudent[] = [
  { email: "olosundelouis@gmail.com", name: "Louis Olosunde", progress: 100, score: "100%", status: "Graduated", enrolledDate: "2026-01-05", completedLessons: 24, totalLessons: 24 },
  { email: "musa@solartech.ng", name: "Ibrahim Musa", progress: 50, score: "N/A", status: "In Progress", enrolledDate: "2026-05-10", completedLessons: 12, totalLessons: 24 }
];

export const INITIAL_ACADEMY_CLASSES: AcademyClass[] = [
  { id: "L-1", topic: "Bifacial Array Angle Design & Shade Analysis", date: "2026-07-02 10:00 AM", instructor: "Engr. Louis", category: "Engineering" },
  { id: "L-2", topic: "High Voltage Lithium Inverter Fault Diagnostics", date: "2026-07-04 02:00 PM", instructor: "Engr. Yusuf", category: "Troubleshooting" }
];

export const INITIAL_BOOKINGS: Booking[] = [
  { id: "B-701", type: "Site Inspection", name: "Louis Olosunde", date: "2026-07-03", time: "11:00 AM", loc: "Lekki Lagos", status: "Completed" },
  { id: "B-702", type: "Maintenance Visit", name: "Evelyn Johnson", date: "2026-07-05", time: "02:30 PM", loc: "Lagos Victoria Island", status: "Confirmed" }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  { 
    id: "TK-41", 
    subject: "Inverter WiFi Synchronization Issue", 
    cust: "Louis Olosunde", 
    priority: "Medium", 
    status: "Open", 
    date: "2 hours ago",
    messages: [
      { sender: "client", msg: "Hello! My inverter screen states fault code F56. What should I do?", time: "2 hours ago" },
      { sender: "support", msg: "F56 represents DC bus overcurrent. Please shut down your battery switch for 10 seconds, then reboot.", time: "1.5 hours ago" }
    ]
  },
  { 
    id: "TK-42", 
    subject: "BMS Calibration & Balancing Request", 
    cust: "Evelyn Johnson", 
    priority: "High", 
    status: "In Progress", 
    date: "1 day ago",
    messages: [
      { sender: "client", msg: "Hi, one of my lithium cells is reading slightly lower voltage than the other three.", time: "1 day ago" }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: "N1", title: "DC Overvoltage Surge Warning", body: "Lekki Phase II microgrid inverter array 3 reports shade bypass failure.", time: "12m ago" },
  { id: "N2", title: "New Training Course Signup", body: "Louis Olosunde registered for class Off-Grid Solar System Engineering.", time: "44m ago" },
  { id: "N3", title: "Warehouse Stock Alert", body: "LiFePO4 BYD Powerwall units dropped below local buffer capacity threshold (4 left).", time: "2h ago" }
];
