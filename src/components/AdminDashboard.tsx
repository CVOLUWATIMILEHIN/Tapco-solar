import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, Users, Briefcase, ShoppingBag, BookOpen, Receipt, DollarSign,
  MessageSquare, Globe, BarChart3, Sliders, Shield, ShieldCheck, ShieldAlert, Settings,
  ChevronLeft, ChevronRight, Search, Bell, Plus, Calendar, Lock, Unlock, Key,
  Mail, Server, Database, Sparkles, X, Terminal, HelpCircle, CheckCircle, ArrowUpRight, Folder, FileText,
  ArrowLeft, ChevronDown, LogOut, Monitor, Clock, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BrandLogo from "./BrandLogo";

// Modular sub-views
import { 
  ROLES, 
  DEFAULT_MODULE_PERMISSIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_LEADS, 
  INITIAL_PROJECTS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_ACADEMY_STUDENTS, 
  INITIAL_ACADEMY_CLASSES, 
  INITIAL_BOOKINGS, 
  INITIAL_TICKETS, 
  INITIAL_NOTIFICATIONS,
  Customer, Lead, Project, ProductItem, Order, AcademyStudent, AcademyClass, Booking, SupportTicket
} from "./admin/AdminData";

import DashboardHQ from "./admin/DashboardHQ";
import CRMDirectory from "./admin/CRMDirectory";
import ProjectTracker from "./admin/ProjectTracker";
import ProcurementHub from "./admin/ProcurementHub";
import AcademyConsole from "./admin/AcademyConsole";
import SecurityLogs from "./admin/SecurityLogs";

import { useCMS } from "../context/CMSContext";
import HomepageCMS from "./admin/HomepageCMS";
import AboutCMS from "./admin/AboutCMS";
import ServicesCMS from "./admin/ServicesCMS";
import ProjectsCMS from "./admin/ProjectsCMS";
import BlogCMS from "./admin/BlogCMS";
import PopupCMS from "./admin/PopupCMS";
import BookingsManager from "./admin/BookingsManager";
import QuotesManager from "./admin/QuotesManager";
import MediaLibrary from "./admin/MediaLibrary";
import SEOMgmt from "./admin/SEOMgmt";
import ShopCMS from "./admin/ShopCMS";
import AcademyCMS from "./admin/AcademyCMS";

interface AdminDashboardProps {
  onBackToPublic?: () => void;
}

export default function AdminDashboard({ onBackToPublic }: AdminDashboardProps = {}) {
  // Authentication & Security States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [customSimEmail, setCustomSimEmail] = useState("");
  const [formEmail, setFormEmail] = useState("olosundelouis@gmail.com");
  const [formPassword, setFormPassword] = useState("TAPCO_Secure_2026!");

  // Session Locking & Timeout States
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(5); // In minutes
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const lastActiveTimeRef = useRef<number>(Date.now());

  const [googleConfigured, setGoogleConfigured] = useState<boolean | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string>("");

  // Check active session on mount and load Google OAuth config
  useEffect(() => {
    const checkSessionAndConfig = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (meRes.ok && meData.success && meData.user && meData.user.role !== "student") {
          setIsAuthenticated(true);
          setLoginEmail(meData.user.email);
          setAdminUser(meData.user);
        }

        const configRes = await fetch("/api/auth/config");
        const configData = await configRes.json();
        if (configRes.ok) {
          setGoogleConfigured(configData.googleConfigured);
          setGoogleClientId(configData.clientId || "MOCK_CLIENT_ID.apps.googleusercontent.com");
        }
      } catch (err) {
        console.error("Initialization check failed:", err);
      }
    };
    checkSessionAndConfig();
  }, []);


  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/password/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, password: formPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginEmail(data.user.email);
        setAdminUser(data.user);
        showToast("Administrative session initialized successfully.");
      } else {
        setErrorMsg(data.error || "Login Failed: Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/google/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginEmail(data.user.email);
        setAdminUser(data.user);
        showToast("Sign in successful. Welcome to TAPCO Control Center.");
      } else {
        setErrorMsg(data.error || "Access Denied: The Google account is not authorized.");
      }
    } catch (err: any) {
      setErrorMsg("Google Authentication is not configured correctly. Please contact the administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateGoogleLogin = async (simulatedToken: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/google/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: simulatedToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setLoginEmail(data.user.email);
        setAdminUser(data.user);
        showToast("Simulation: Google login verified. Console unlocked.");
      } else {
        setErrorMsg(data.error || "Access Denied: The Google account is not authorized.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Check lockout on interval or change
  useEffect(() => {
    if (lockoutUntil) {
      const interval = setInterval(() => {
        if (Date.now() >= lockoutUntil) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          setUnlockError("");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  // Track activity to auto-lock on idle
  useEffect(() => {
    if (!isAuthenticated || isSessionLocked) return;

    const handleActivity = () => {
      lastActiveTimeRef.current = Date.now();
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const interval = setInterval(() => {
      if (idleTimeoutMinutes > 0) {
        const elapsedMs = Date.now() - lastActiveTimeRef.current;
        if (elapsedMs >= idleTimeoutMinutes * 60 * 1000) {
          setIsSessionLocked(true);
          addAuditLog("Administrative terminal auto-locked due to inactivity threshold", loginEmail, "WARNING");
          showToast("Session secured automatically due to inactivity.");
        }
      }
    }, 5000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, isSessionLocked, idleTimeoutMinutes, loginEmail]);

  // Handle Lockscreen Unlocking Submit
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingMin = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setUnlockError(`Unlocking blocked. Please try again in ${remainingMin} minutes or switch accounts.`);
      return;
    }

    setIsUnlocking(true);
    setUnlockError("");

    setTimeout(() => {
      setIsUnlocking(false);
      // Validate unlocking password against secure corporate passcode
      if (unlockPassword === "TAPCO_Secure_2026!") {
        setIsSessionLocked(false);
        setUnlockPassword("");
        setFailedAttempts(0);
        showToast("Session unlocked. Work state restored.");
        addAuditLog("Administrative terminal unlocked successfully", loginEmail, "SUCCESS");
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        addAuditLog(`Failed session unlock attempt (${nextFailed}/5)`, loginEmail, "BLOCKED");

        if (nextFailed >= 5) {
          const timeout = Date.now() + 15 * 60 * 1000; // 15 mins temporary lockout
          setLockoutUntil(timeout);
          setUnlockError("Access temporarily blocked due to 5 failed attempts. Please wait 15 minutes, or Switch Account to reset.");
        } else {
          setUnlockError(`Incorrect password. ${5 - nextFailed} unlock attempt(s) remaining before automatic lockout.`);
        }
      }
    }, 1000);
  };
  const [inputMfaCode, setInputMfaCode] = useState("");
  const [mfaSelection, setMfaSelection] = useState<"authenticator" | "email">("authenticator");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpValue, setEmailOtpValue] = useState("");

  // Enterprise Global Databases States
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [students, setStudents] = useState<AcademyStudent[]>(INITIAL_ACADEMY_STUDENTS);
  const [classes, setClasses] = useState<AcademyClass[]>(INITIAL_ACADEMY_CLASSES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Layout & UI Navigation States
  const [currentRole, setCurrentRole] = useState("super_admin");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [pinnedModules, setPinnedModules] = useState<string[]>(["dashboard", "crm", "projects"]);
  const [currentCompany, setCurrentCompany] = useState("TAPCO West Africa");
  const [toast, setToast] = useState<string | null>(null);

  // Command Palette & Floating AI States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiHistory, setAiHistory] = useState<Array<{ sender: "user" | "ai", text: string }>>([
    { sender: "ai", text: "Hello! I am the TAPCO Enterprise Intelligence agent. Ask me about revenues, active microgrids, or warehouse stock alerts." }
  ]);
  const [aiInput, setAiInput] = useState("");

  // Security policies configurations
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [rotateKeysEnforced, setRotateKeysEnforced] = useState(false);
  const [ipWhitelistEnforced, setIpWhitelistEnforced] = useState(false);

  // Virtual Inbox Simulation Logs
  const [virtualInbox, setVirtualInbox] = useState<any[]>([
    { id: "EM-0", to: "olosundelouis@gmail.com", subject: "Welcome to TAPCO Secure Identity Console", body: "Hello Louis, your corporate administrator account is fully active and secured with multi-factor policies.", code: "", time: "10m ago" },
    { id: "EM-1b", to: "tapcosolar@gmail.com", subject: "Welcome to TAPCO Secure Identity Console", body: "Hello TAPCO Solar Admin, your corporate administrator account is fully active and secured with multi-factor policies.", code: "", time: "5m ago" }
  ]);

  // Audit Trails Log Database
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: "LOG-5001", who: "olosundelouis@gmail.com", action: "User Creation", date: "Today, 08:30 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG", status: "SUCCESS" },
    { id: "LOG-5002", who: "tapcosolar@gmail.com", action: "Co-Admin Activated", date: "Today, 08:32 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG", status: "SUCCESS" },
    { id: "LOG-5003", who: "olosundelouis@gmail.com", action: "Login Success", date: "Yesterday, 09:45 AM", ip: "197.210.88.94", device: "iPhone 15 Pro", browser: "Safari v17.4", location: "Lagos, NG", status: "SUCCESS" },
    { id: "LOG-5005", who: "hacker@evil.com", action: "Failed Login System Block", date: "2 days ago", ip: "45.227.254.12", device: "Linux PC", browser: "Firefox v120", location: "Unknown (VPN Location)", status: "BLOCKED" }
  ]);

  // Command Palette keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toast Helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const addAuditLog = (action: string, who: string, status: "SUCCESS" | "BLOCKED" | "WARNING") => {
    const newLog = {
      id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
      who,
      action,
      date: "Just Now",
      ip: "102.89.2.14",
      device: "MacBook Pro M3",
      browser: "Chrome v126",
      location: "Abuja, NG",
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const sendSimulatedEmail = (to: string, subject: string, body: string, code: string = "") => {
    const newEmail = {
      id: `EM-${Date.now()}`,
      to,
      subject,
      body,
      code,
      time: "Just now"
    };
    setVirtualInbox(prev => [newEmail, ...prev]);
    showToast(`Simulation Dispatch: Email sent to ${to}.`);
  };

  // State mutation actions passed to modular views
  const handleAddCustomer = (newC: Omit<Customer, "id" | "spend" | "tickets" | "joinedDate">) => {
    const fresh: Customer = {
      ...newC,
      id: `C-${100 + customers.length + 1}`,
      spend: 0,
      tickets: 0,
      joinedDate: "2026-07-03"
    };
    setCustomers(prev => [...prev, fresh]);
    showToast(`Customer ${newC.name} registered successfully.`);
    addAuditLog(`Created Customer profile for ${newC.name}`, loginEmail, "SUCCESS");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast(`Customer profile dismounted.`);
    addAuditLog(`Dismounted Customer record ID: ${id}`, loginEmail, "SUCCESS");
  };

  const handleAddLead = (newL: Omit<Lead, "id" | "date">) => {
    const fresh: Lead = {
      ...newL,
      id: `L-${300 + leads.length + 1}`,
      date: "2026-07-03"
    };
    setLeads(prev => [...prev, fresh]);
    showToast(`Lead ${newL.name} piped to sales funnel.`);
    addAuditLog(`Piped new sales lead: ${newL.name}`, loginEmail, "SUCCESS");
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast(`Lead pipeline closed.`);
  };

  const handleAddProject = (newP: Omit<Project, "id" | "progress">) => {
    const fresh: Project = {
      ...newP,
      id: `P-${500 + projects.length + 1}`,
      progress: 0
    };
    setProjects(prev => [...prev, fresh]);
    showToast(`Power Grid installation initialized.`);
    addAuditLog(`Initialized Grid Project: ${newP.customer}`, loginEmail, "SUCCESS");
  };

  const handleUpdateProjectProgress = (id: string, progress: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
    showToast(`Grid installation progress set to ${progress}%.`);
  };

  const handleUpdateProjectPhase = (id: string, phase: Project["phase"]) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, phase } : p));
    showToast(`Grid stage set to ${phase}.`);
    addAuditLog(`Advanced Project ID: ${id} to stage ${phase}`, loginEmail, "SUCCESS");
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast(`Project record dismounted.`);
  };

  const handleUpdateProductPrice = (id: string, price: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p));
    showToast(`Product pricing sheet adjusted.`);
  };

  const handleUpdateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Order dispatch status adjusted to ${status}.`);
  };

  const handleAddProduct = (newPr: Omit<ProductItem, "id" | "alert">) => {
    const fresh: ProductItem = {
      ...newPr,
      id: `PRD-${200 + products.length + 1}`,
      alert: newPr.stock < 10
    };
    setProducts(prev => [...prev, fresh]);
    showToast(`Equipment ${newPr.name} registered.`);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Equipment dismounted from catalog.`);
  };

  const handleUpdateStudentStatus = (email: string, status: AcademyStudent["status"]) => {
    setStudents(prev => prev.map(s => s.email === email ? { ...s, status } : s));
    showToast(`Student graduation status set to ${status}.`);
  };

  const handleUpdateStudentScore = (email: string, score: string) => {
    setStudents(prev => prev.map(s => s.email === email ? { ...s, score } : s));
    showToast(`Student score sheet adjusted.`);
  };

  const handleAddStudent = (newS: Omit<AcademyStudent, "progress" | "score">) => {
    const fresh: AcademyStudent = {
      ...newS,
      progress: 0,
      score: "N/A"
    };
    setStudents(prev => [...prev, fresh]);
    showToast(`Student ${newS.name} enrolled.`);
  };

  const handleDeleteStudent = (email: string) => {
    setStudents(prev => prev.filter(s => s.email !== email));
    showToast(`Student record dismounted.`);
  };

  // Secure Authentication Flow Handlers
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(true);



  // AI Assistant Instant simulated responses
  const handleAiAsk = () => {
    if (!aiInput.trim()) return;
    const q = aiInput.trim();
    const historyItem = { sender: "user" as const, text: q };
    setAiHistory(prev => [...prev, historyItem]);
    setAiInput("");

    setTimeout(() => {
      let reply = "I've scanned all West African grids and assets. Could you clarify your parameters?";
      const lower = q.toLowerCase();

      if (lower.includes("revenue") || lower.includes("today's revenue") || lower.includes("revenue flow")) {
        const totalRev = customers.reduce((sum, c) => sum + c.spend, 0) + orders.reduce((sum, o) => sum + o.amount, 0);
        reply = `Our total corporate revenue flow stands at ₦${(totalRev / 1000000).toFixed(2)}M Naira across the Prestige, Chevron, and academic sectors.`;
      } else if (lower.includes("overdue") || lower.includes("overdue projects") || lower.includes("overdue installations")) {
        reply = "Currently, zero installation grids are overdue! Prestige Estate microgrid is on track for live testing sequence next week (85% progress).";
      } else if (lower.includes("quotation") || lower.includes("quotations pending") || lower.includes("pending")) {
        const pendingLeads = leads.filter(l => l.stage === "Quotation").length;
        reply = `There are currently ${pendingLeads} active enterprise quotations pending review under Chevron and Prestige developer pipeline.`;
      } else if (lower.includes("inventory") || lower.includes("low inventory") || lower.includes("stock")) {
        const low = products.filter(p => p.stock < 10);
        reply = `Warehouse stock warning: ${low.length} units are below critical capacity. Low Stock elements include:\n- ${low.map(i => i.name).join("\n- ")}`;
      }

      setAiHistory(prev => [...prev, { sender: "ai" as const, text: reply }]);
    }, 550);
  };

  // Navigation category layout items
  const menuCategories = [
    {
      group: "Command & Telemetry",
      items: [
        { id: "dashboard", label: "Executive OS", icon: Layers },
        { id: "security", label: "Identity & Cryptography", icon: ShieldCheck }
      ]
    },
    {
      group: "Website CMS Portal",
      items: [
        { id: "homepage-cms", label: "Homepage Slider & Stats", icon: Sliders },
        { id: "about-cms", label: "About Page CMS", icon: FileText },
        { id: "services-cms", label: "Services Catalog CMS", icon: Layers },
        { id: "blog-cms", label: "Publications & Resources", icon: MessageSquare },
        { id: "popup-cms", label: "Overlay Promo Pop-ups", icon: Calendar },
        { id: "seo-cms", label: "SEO & Robots Directives", icon: Globe }
      ]
    },
    {
      group: "Operational Pipelines",
      items: [
        { id: "crm", label: "CRM Client Directories", icon: Users },
        { id: "projects", label: "Engineering Power Grids", icon: Briefcase },
        { id: "quotes-cms", label: "Inquiry Quotation Manager", icon: Receipt },
        { id: "bookings-cms", label: "Site Inspection Surveys", icon: Calendar }
      ]
    },
    {
      group: "Procurement & Academy",
      items: [
        { id: "products", label: "Hardware Inventory", icon: ShoppingBag },
        { id: "shop-cms", label: "Store Orders & Coupons", icon: ShoppingBag },
        { id: "academy", label: "Academy Council Directory", icon: BookOpen },
        { id: "academy-cms", label: "Academy Course Syllabus", icon: BookOpen },
        { id: "media-library", label: "Corporate Media Assets", icon: Folder }
      ]
    }
  ];

  const handleTabSelection = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsSidebarExpanded(false);
    }
  };

  const handleQuickCreateClick = (type: string) => {
    setActiveTab("crm");
    showToast(`Navigated to CRM. Initializing client onboarding window.`);
  };

  // Command Palette execution
  const executeCommand = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
    setCommandQuery("");
  };

  const commandOptions = [
    { label: "Navigate to Executive HQ Dashboard", action: () => setActiveTab("dashboard") },
    { label: "Navigate to Homepage Slider CMS", action: () => setActiveTab("homepage-cms") },
    { label: "Navigate to About Us Page CMS", action: () => setActiveTab("about-cms") },
    { label: "Navigate to Services Catalog CMS", action: () => setActiveTab("services-cms") },
    { label: "Navigate to Publications & Resources CMS", action: () => setActiveTab("blog-cms") },
    { label: "Navigate to Overlay Promo Pop-Ups CMS", action: () => setActiveTab("popup-cms") },
    { label: "Navigate to SEO & Robots Crawler Settings", action: () => setActiveTab("seo-cms") },
    { label: "Navigate to Client CRM Directories", action: () => setActiveTab("crm") },
    { label: "Navigate to Engineering Grids Tracker", action: () => setActiveTab("projects") },
    { label: "Navigate to Inquiry Quotations Billing Manager", action: () => setActiveTab("quotes-cms") },
    { label: "Navigate to Site Inspection & Survey Bookings", action: () => setActiveTab("bookings-cms") },
    { label: "Navigate to Hardware Inventory", action: () => setActiveTab("products") },
    { label: "Navigate to Store Orders & Discount Coupons", action: () => setActiveTab("shop-cms") },
    { label: "Navigate to Academy Student Council", action: () => setActiveTab("academy") },
    { label: "Navigate to Academy Course Syllabus CMS", action: () => setActiveTab("academy-cms") },
    { label: "Navigate to Corporate Media Asset Storage", action: () => setActiveTab("media-library") },
    { label: "Navigate to Cryptography & Security Console", action: () => setActiveTab("security") },
    { label: "Lock Active Terminal Session", action: () => setIsAuthenticated(false) }
  ].filter(opt => opt.label.toLowerCase().includes(commandQuery.toLowerCase()));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Side - Modern Premium Split Screen */}
        <div className="hidden md:flex md:w-1/2 lg:w-[45%] xl:w-[40%] bg-slate-900 text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden shrink-0">
          {/* Background image & overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
              alt="TAPCO Solar Power Infrastructure"
              className="w-full h-full object-cover object-center scale-105 animate-[subtle-zoom_20s_ease-out_infinite_alternate]"
              referrerPolicy="no-referrer"
            />
            {/* Dark premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#0057B8]/20 mix-blend-color" />
          </div>

          {/* Top Logo Section */}
          <div className="relative z-10 flex items-center gap-3">
            <BrandLogo showText={false} size="sm" />
            <div>
              <h1 className="text-xs uppercase font-black text-white tracking-widest leading-none">TAPCO</h1>
              <span className="text-[9px] text-[#00A651] font-black tracking-widest uppercase mt-1 block">
                CONTROL CENTER
              </span>
            </div>
          </div>

          {/* Bottom Tagline Section */}
          <div className="relative z-10 space-y-4">
            <div className="h-1 w-12 bg-[#00A651] rounded-full" />
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Engineering Reliable<br />Energy Solutions
            </h2>
            <p className="text-slate-300 text-sm max-w-sm font-medium leading-relaxed">
              Powering West Africa's leading industries, smart grids, and microgrid installations with clean, robust, and continuous power networks.
            </p>
          </div>
        </div>

        {/* Right Side - Elegant, minimalist Login Panel */}
        <div className="flex-1 bg-[#F8FAFC] flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md bg-white rounded-[24px] shadow-xl border border-slate-100 p-8 sm:p-10 space-y-8 relative z-10">
            
            {onBackToPublic && (
              <div className="flex justify-start -mb-4">
                <button
                  onClick={onBackToPublic}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0057B8] transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Website</span>
                </button>
              </div>
            )}

            {/* Header: Logo & Titles */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Company Logo */}
              <BrandLogo showText={false} size="md" />
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#00A651] uppercase tracking-wider block">
                  Welcome Back
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Sign in to TAPCO Control Center
                </h2>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                >
                  <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700 leading-relaxed">
                    {errorMsg}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Standard Username & Password login section */}
            <form onSubmit={handlePasswordLogin} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
                  Admin Username (Corporate Email)
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@tapco.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0057B8] focus:bg-white transition text-slate-900"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0057B8] focus:bg-white transition text-slate-900"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white hover:bg-[#0057B8]/95 transition font-black uppercase text-xs tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0057B8]/10"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <span>Access Control Center</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* CSS Keyframes for subtle background image zoom */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes subtle-zoom {
            0% { transform: scale(1.03); }
            100% { transform: scale(1.10); }
          }
        `}} />
      </div>
    );
  }

  if (isAuthenticated && isSessionLocked) {
    const adminName = loginEmail === "olosundelouis@gmail.com" 
      ? "Louis Olosunde" 
      : loginEmail === "tapcosolar@gmail.com" 
        ? "TAPCO Solar Admin" 
        : "Administrator";

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background image & heavy premium glass-morphism backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
            alt="TAPCO Solar Power"
            className="w-full h-full object-cover opacity-30 scale-105 filter blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
        </div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-[28px] border border-white/15 p-8 sm:p-10 space-y-8 relative z-10 text-white shadow-2xl">
          
          {/* Header section with Organization logo */}
          <div className="flex flex-col items-center text-center space-y-5">
            <BrandLogo showText={false} size="md" />
            
            {/* User profile picture */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                alt={adminName}
                className="h-20 w-20 rounded-full border-4 border-white/20 shadow-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-amber-500 border-2 border-slate-950 rounded-full flex items-center justify-center" title="Session Locked">
                <Lock className="h-3 w-3 text-slate-950" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">{adminName}</h2>
              <span className="text-[10px] uppercase font-black text-[#00A651] tracking-widest block bg-[#00A651]/10 px-2.5 py-1 rounded-full border border-[#00A651]/20">
                Session Locked
              </span>
            </div>
          </div>

          {/* Session locked message / help info */}
          <p className="text-slate-300 text-xs text-center font-medium leading-relaxed">
            Your terminal has been secured. Enter your administrative passcode to immediately restore active workspace state.
          </p>

          {/* Unlock Form */}
          <form onSubmit={handleUnlockSubmit} className="space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-[10px] uppercase font-black text-slate-300 block tracking-wider">
                Enter Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#0057B8] focus:ring-4 focus:ring-[#0057B8]/20 transition"
                  value={unlockPassword}
                  onChange={e => setUnlockPassword(e.target.value)}
                  disabled={isUnlocking || lockoutUntil !== null}
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {unlockError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                >
                  <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-red-200 leading-relaxed">
                    {unlockError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={isUnlocking || lockoutUntil !== null}
              className="w-full h-11 rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/90 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0057B8]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUnlocking ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Unlocking Terminal...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Restore Session</span>
                </span>
              )}
            </button>
          </form>

          {/* Action Footer Buttons (Switch Account / Return to Public Website) */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={async () => {
                // Securely Switch Account / Full Logout
                try {
                  await fetch("/api/auth/logout", { method: "POST" });
                } catch (e) {
                  console.error(e);
                }
                setIsAuthenticated(false);
                setIsSessionLocked(false);
                setUnlockPassword("");
                setFailedAttempts(0);
                setLockoutUntil(null);
                addAuditLog("Administrative session terminated (Switch Account)", loginEmail, "SUCCESS");
                showToast("Logged out of session.");
              }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition font-black uppercase text-[10px] tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Switch Account</span>
            </button>

            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition font-black uppercase text-[10px] tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Web</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      
      {/* REAL-TIME GLOBAL TOAST ALERTS */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl text-xs font-bold border border-slate-700/50"
          >
            <CheckCircle className="h-4 w-4 text-[#00A651]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. FLOATING GLASS-EFFECT SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarExpanded ? 280 : 80 }}
        className="h-full bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 relative z-20 shadow-sm"
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="h-10 w-10 rounded-[14px] bg-[#0057B8] text-white flex items-center justify-center font-black text-base shrink-0">
                T
              </div>
              {isSidebarExpanded && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-left min-w-0"
                >
                  <h1 className="text-xs uppercase font-black text-slate-900 tracking-wider">TAPCO OS</h1>
                  <span className="text-[9px] text-[#00A651] font-black tracking-widest uppercase flex items-center gap-1.5">
                    ● TELEMETRY HQ
                  </span>
                </motion.div>
              )}
            </div>

            {/* Expander Arrow */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Category list */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuCategories.map((group, gIdx) => (
              <div key={group.group} className="space-y-1.5 text-left">
                {isSidebarExpanded && (
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest px-3 block">
                    {group.group}
                  </span>
                )}

                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-xs font-bold transition-all ${
                        isActive 
                          ? "bg-[#0057B8]/10 text-[#0057B8] shadow-sm" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {isSidebarExpanded && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-col gap-2">
          {isSidebarExpanded ? (
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-black flex items-center justify-center text-xs uppercase shrink-0">
                  {(loginEmail || "AD").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-black text-slate-900 truncate leading-tight">{loginEmail}</span>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-0.5">
                    SUPER ADMINISTRATOR
                  </span>
                </div>
              </div>
              {onBackToPublic && (
                <button
                  onClick={onBackToPublic}
                  className="w-full py-2 bg-[#0057B8] hover:bg-[#0057B8]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group font-sans"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Public Website</span>
                </button>
              )}
              <button
                onClick={() => setIsAuthenticated(false)}
                className="w-full py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock Terminal</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              {onBackToPublic && (
                <button
                  onClick={onBackToPublic}
                  title="Back to Public Website"
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-[#0057B8] rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsAuthenticated(false)}
                title="Lock Terminal"
                className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition cursor-pointer"
              >
                <Lock className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* 2. MAIN SYSTEM CONSOLE AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* TOP BAR / INTERACTIVE GLASS FLOATING HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 sm:px-8 flex items-center justify-between shrink-0 relative z-30">
          
          {/* Breadcrumb Workspace indicators */}
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="text-slate-900 font-extrabold flex items-center gap-2 uppercase tracking-wide shrink-0">
              <Shield className="h-4.5 w-4.5 text-[#0057B8]" />
              <span className="hidden sm:inline">{currentCompany}</span>
              <span className="sm:hidden">{currentCompany.split(" ")[0]}</span>
            </span>
            <span>/</span>
            <span className="font-extrabold uppercase tracking-wide truncate max-w-[100px] sm:max-w-none">
              {activeTab === "dashboard" ? "Executive HQ" : activeTab}
            </span>
          </div>

          {/* Quick interactive parameters */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Global search trigger (Ctrl+K help indicator) */}
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="relative cursor-pointer hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] rounded-xl text-xs font-medium text-slate-400 transition"
            >
              <Search className="h-4 w-4" />
              <span>Search catalogs, clients...</span>
              <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold text-slate-400 shadow-sm">
                Ctrl+K
              </kbd>
            </div>

            {/* Quick Action (+) Trigger */}
            <div className="relative group cursor-pointer">
              <button
                className="p-2 bg-[#0057B8] text-white rounded-xl hover:bg-[#0057B8]/95 transition flex items-center justify-center shadow-lg shadow-[#0057B8]/10 cursor-pointer"
                title="Quick Add Menu"
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-2 text-left text-xs font-semibold space-y-1 z-40">
                <button
                  onClick={() => { setActiveTab("crm"); showToast("CRM Active: Onboarding client."); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  Onboard Customer
                </button>
                <button
                  onClick={() => { setActiveTab("projects"); showToast("Projects: Onboarding power grid."); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  Launch Grid Project
                </button>
                <button
                  onClick={() => { setActiveTab("products"); showToast("Catalog: Registering hardware."); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  Register Equipment
                </button>
              </div>
            </div>

            {/* Return to Public Website Button */}
            {onBackToPublic && (
              <button
                onClick={onBackToPublic}
                className="p-2 bg-slate-50 text-slate-600 hover:text-[#0057B8] border border-[#E2E8F0] rounded-xl hover:bg-blue-50/50 transition flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider px-3 shadow-sm"
                title="View Public Website"
              >
                <Monitor className="h-4 w-4 shrink-0 text-[#0057B8]" />
                <span className="hidden md:inline">View Website</span>
              </button>
            )}

            {/* Lock Session Button */}
            <button
              onClick={() => {
                setIsSessionLocked(true);
                showToast("Session manually locked. Securing active workspace state.");
                addAuditLog("Administrative terminal manually locked from top bar", loginEmail, "WARNING");
              }}
              className="p-2 bg-rose-50 text-rose-600 hover:text-white border border-rose-100 rounded-xl hover:bg-rose-500 hover:border-rose-500 transition flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider px-3 shadow-sm"
              title="Lock Session immediately"
            >
              <Lock className="h-4 w-4 shrink-0 text-rose-500 hover:text-inherit" />
              <span className="hidden md:inline">Lock Session</span>
            </button>

            {/* Floating AI Assistant Trigger */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="p-2 bg-[#00A651]/10 text-[#00A651] rounded-xl hover:bg-[#00A651]/15 border border-[#00A651]/20 transition flex items-center justify-center cursor-pointer relative"
              title="AI Intelligence Agent"
            >
              <Sparkles className="h-4 w-4" />
            </button>

            {/* Notifications Alert Dropdown */}
            <div className="relative group cursor-pointer">
              <div className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 border border-[#E2E8F0] transition relative">
                <Bell className="h-4 w-4 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                  {notifications.length}
                </span>
              </div>

              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-4 space-y-3 z-40">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Hardware Telemetry Warnings</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto text-left text-xs font-sans">
                  {notifications.map(not => (
                    <div key={not.id} className="p-2.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100 hover:border-[#0057B8]/20 transition">
                      <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                        <span>{not.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{not.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{not.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile Menu with Configurable Options */}
            <div className="relative group cursor-pointer">
              <button className="flex items-center gap-1.5 sm:gap-2 p-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition cursor-pointer bg-white shadow-sm">
                <div className="h-8 w-8 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-black flex items-center justify-center text-xs uppercase shadow-sm border border-white">
                  {loginEmail.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-black text-slate-700 hidden sm:inline-block max-w-[100px] truncate">
                  {loginEmail === "olosundelouis@gmail.com" ? "Louis O." : "Solar Admin"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-4 space-y-4 z-40 text-left font-sans">
                {/* Account details card */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-black flex items-center justify-center text-xs uppercase shrink-0">
                    {loginEmail.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-slate-900 truncate leading-tight">
                      {loginEmail === "olosundelouis@gmail.com" ? "Louis Olosunde" : "Solar Admin"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                      SUPER ADMIN
                    </span>
                  </div>
                </div>

                {/* Inactivity timeout configuration */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Auto-Lock Timeout</span>
                  </span>
                  
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                    {[1, 5, 15, 0].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdleTimeoutMinutes(mins);
                          showToast(mins === 0 ? "Inactivity auto-lock disabled." : `Auto-lock interval set to ${mins} minute(s).`);
                        }}
                        className={`py-1 rounded-lg border transition cursor-pointer ${
                          idleTimeoutMinutes === mins
                            ? "bg-[#0057B8] border-[#0057B8] text-white"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        {mins === 0 ? "OFF" : `${mins}m`}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block italic leading-tight">
                    Secures the terminal automatically after idle period.
                  </span>
                </div>

                {/* Direct Action triggers */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSessionLocked(true);
                      showToast("Session locked.");
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Lock Session Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await fetch("/api/auth/logout", { method: "POST" });
                      } catch (err) {
                        console.error("Logout failed:", err);
                      }
                      setIsAuthenticated(false);
                      setIsSessionLocked(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-rose-50 transition text-xs font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Full Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Company switcher */}
            <select
              value={currentCompany}
              onChange={e => setCurrentCompany(e.target.value)}
              className="text-xs font-bold text-[#0057B8] focus:outline-none cursor-pointer bg-slate-50 border border-[#E2E8F0] p-2 rounded-xl hidden xl:block"
            >
              <option value="TAPCO West Africa">TAPCO West Africa</option>
              <option value="TAPCO East Africa">TAPCO East Africa</option>
              <option value="TAPCO Solar Academy">TAPCO Academy Group</option>
            </select>
          </div>
        </header>

        {/* WORKSPACE VIEW ROUTER */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-7xl mx-auto"
            >
              {activeTab === "dashboard" && (
                <DashboardHQ
                  customers={customers}
                  projects={projects}
                  products={products}
                  orders={orders}
                  leads={leads}
                  onNavigate={setActiveTab}
                  onQuickCreate={handleQuickCreateClick}
                  role={currentRole}
                />
              )}

              {activeTab === "crm" && (
                <CRMDirectory
                  customers={customers}
                  leads={leads}
                  onAddCustomer={handleAddCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onAddLead={handleAddLead}
                  onDeleteLead={handleDeleteLead}
                />
              )}

              {activeTab === "projects" && (
                <ProjectTracker
                  projects={projects}
                  onAddProject={handleAddProject}
                  onUpdateProjectProgress={handleUpdateProjectProgress}
                  onUpdateProjectPhase={handleUpdateProjectPhase}
                  onDeleteProject={handleDeleteProject}
                />
              )}

              {activeTab === "products" && (
                <ProcurementHub
                  products={products}
                  orders={orders}
                  onUpdateProductPrice={handleUpdateProductPrice}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === "academy" && (
                <AcademyConsole
                  students={students}
                  classes={classes}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onUpdateStudentScore={handleUpdateStudentScore}
                  onAddStudent={handleAddStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              )}

              {activeTab === "security" && (
                <SecurityLogs
                  auditLogs={auditLogs}
                  virtualInbox={virtualInbox}
                  onClearInbox={() => setVirtualInbox([])}
                  mfaEnforced={mfaEnforced}
                  onToggleMfaEnforced={() => setMfaEnforced(!mfaEnforced)}
                  rotateKeysEnforced={rotateKeysEnforced}
                  onToggleRotateKeys={() => setRotateKeysEnforced(!rotateKeysEnforced)}
                  ipWhitelistEnforced={ipWhitelistEnforced}
                  onToggleIpWhitelist={() => setIpWhitelistEnforced(!ipWhitelistEnforced)}
                />
              )}

              {/* WEBSITE CMS PORTAL SUBVIEWS */}
              {activeTab === "homepage-cms" && <HomepageCMS />}
              {activeTab === "about-cms" && <AboutCMS />}
              {activeTab === "services-cms" && <ServicesCMS />}
              {activeTab === "blog-cms" && <BlogCMS />}
              {activeTab === "popup-cms" && <PopupCMS />}
              {activeTab === "seo-cms" && <SEOMgmt />}

              {/* OPERATIONAL PIPELINES SUBVIEWS */}
              {activeTab === "quotes-cms" && <QuotesManager />}
              {activeTab === "bookings-cms" && <BookingsManager />}

              {/* PROCUREMENT & LEDGER CMS SUBVIEWS */}
              {activeTab === "shop-cms" && <ShopCMS />}
              {activeTab === "academy-cms" && <AcademyCMS />}
              {activeTab === "media-library" && <MediaLibrary />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. CTRL+K QUICK COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-xl w-full p-4 shadow-2xl space-y-4 text-left"
            >
              <div className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or directory..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none"
                  value={commandQuery}
                  onChange={e => setCommandQuery(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block px-2.5">
                  Available Commands
                </span>
                <div className="space-y-1">
                  {commandOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeCommand(opt.action)}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center"
                    >
                      <span>{opt.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  ))}
                  {commandOptions.length === 0 && (
                    <div className="text-center py-6 text-slate-400 font-medium">
                      No matching quick commands.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. FLOATING CHAT AI ASSISTANT PANEL DRAWER */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-96 bg-white h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col justify-between text-left"
            >
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-[#00A651]/10 text-[#00A651] rounded-xl flex items-center justify-center border border-[#00A651]/20">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">TAPCO Enterprise AI</h3>
                    <span className="text-[8.5px] text-[#00A651] font-black block tracking-widest mt-0.5">● ONLINE CHIP</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiAssistantOpen(false)}
                  className="p-1.5 hover:bg-slate-200/50 rounded-full transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5 text-slate-500" />
                </button>
              </div>

              {/* Chat log messages viewport */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs font-medium">
                {aiHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      item.sender === "user" 
                        ? "bg-[#0057B8] text-white ml-auto" 
                        : "bg-slate-50 text-slate-700 border border-slate-100"
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Suggestions & Text input panel */}
              <div className="p-6 border-t border-[#E2E8F0] bg-slate-50/50 space-y-4 shrink-0">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Quick Prompts</span>
                  <div className="flex flex-wrap gap-1.5 text-[9px] font-extrabold uppercase">
                    {[
                      { q: "Show today's revenue", label: "Revenue" },
                      { q: "Which projects are overdue?", label: "Overdue" },
                      { q: "Show low inventory", label: "Low stock" }
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => { setAiInput(p.q); }}
                        className="px-2.5 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#0057B8]/30 hover:bg-[#0057B8]/5 rounded-lg transition text-slate-600 cursor-pointer uppercase tracking-wider"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask standard billing/telemetry questions..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0057B8]"
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAiAsk(); }}
                  />
                  <button
                    onClick={handleAiAsk}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0057B8] text-white rounded-lg hover:bg-[#0057B8]/95 transition cursor-pointer"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
