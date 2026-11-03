/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ShoppingBag,
  Lock,
  Menu,
  X,
  Phone,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  Users,
  Building2,
  Home,
  CheckCircle,
  HelpCircle,
  FileText,
  Video,
  Download,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Flame,
  Sun,
  Zap,
  Battery,
  Shield,
  MessageSquare
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { motion, AnimatePresence } from "motion/react";
import { useCMS } from "../context/CMSContext";

interface HeaderNavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setProjectFilter?: (filter: string) => void;
  cartCount: number;
  setShowCartDrawer: (show: boolean) => void;
  setIsAcademyPortalActive?: (active: boolean) => void;
}

export default function HeaderNavigation({
  activeTab,
  setActiveTab,
  setProjectFilter,
  cartCount,
  setShowCartDrawer,
  setIsAcademyPortalActive
}: HeaderNavigationProps) {
  const { productsList, solarPackages, blogsList } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearchModal]);

  const toggleAccordion = (key: string) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectFilterClick = (filter: string) => {
    if (setProjectFilter) {
      setProjectFilter(filter);
    }
    handleNavClick("projects");
  };

  const handleAcademyPortalClick = () => {
    if (setIsAcademyPortalActive) {
      setIsAcademyPortalActive(true);
    }
    handleNavClick("academy");
  };

  // Live search filtering across products, packages, and blog posts
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { products: [], packages: [], blogs: [] };
    const query = searchQuery.toLowerCase();

    const filteredProducts = (productsList as any[]).filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    ).slice(0, 3);

    const filteredPackages = solarPackages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.capacity.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query)
    ).slice(0, 3);

    const filteredBlogs = blogsList.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
    ).slice(0, 3);

    return {
      products: filteredProducts,
      packages: filteredPackages,
      blogs: filteredBlogs
    };
  };

  const searchResults = getSearchResults();
  const hasSearchResults =
    searchResults.products.length > 0 ||
    searchResults.packages.length > 0 ||
    searchResults.blogs.length > 0;

  // Dropdown Configurations
  const dropdownItems = {
    about: [
      { label: "About TAPCO", desc: "Our credentials as West Africa's premium solar firm", icon: Shield, action: () => handleNavClick("about") },
      { label: "Our Story", desc: "How we started and our engineering milestones", icon: BookOpen, action: () => handleNavClick("about") },
      { label: "Mission & Vision", desc: "Eradicating power outages across the region", icon: Sparkles, action: () => handleNavClick("about") },
      { label: "Leadership Team", desc: "Meet our COREN licensed engineers and team", icon: Users, action: () => handleNavClick("about") },
      { label: "Certifications & Accreditations", desc: "NEMSA, REAN and ISO compliant profiles", icon: Award, action: () => handleNavClick("about") },
      { label: "Our Partners", desc: "Leading global technology providers we work with", icon: Building2, action: () => handleNavClick("about") },
      { label: "Careers", desc: "Join our professional engineering crew", icon: Briefcase, action: () => handleNavClick("about") }
    ],
    projects: [
      { label: "Residential Projects", desc: "Custom residential off-grid & hybrid solar installations", filter: "Residential" },
      { label: "Commercial Projects", desc: "High-capacity commercial real estate and estate microgrids", filter: "Commercial" },
      { label: "Industrial Projects", desc: "Heavy-duty 3-phase factory and manufacturing microgrids", filter: "Industrial" },
      { label: "Agricultural Projects", desc: "Solar irrigation pumps and solar-powered farm machinery", filter: "Agricultural" },
      { label: "School Projects", desc: "High-impact educational microgrid donor setups", filter: "Schools" },
      { label: "Project Gallery", desc: "Browse high-resolution photographs of actual builds", filter: "All" },
      { label: "Case Studies", desc: "Technical breakdown of load matching & grid-tie audits", filter: "All" }
    ],
    academy: [
      { label: "Academy Home", desc: "Professional technical training center for solar engineering", icon: Home, action: () => handleNavClick("academy") },
      { label: "Browse Courses", desc: "Advanced design, installations and SCADA integrations", icon: BookOpen, action: () => handleNavClick("academy") },
      { label: "Certification Programs", desc: "COREN & REAN endorsed enterprise installer credentials", icon: Award, action: () => handleNavClick("academy") },
      { label: "Training Calendar", desc: "Upcoming cohort sessions, bootcamps, and on-site training", icon: Layers, action: () => handleNavClick("academy") },
      { label: "Student Login", desc: "Access course worksheets, schematics, and class portal", icon: GraduationCap, action: () => handleAcademyPortalClick() },
      { label: "Instructor Portal", desc: "Academic management panel for licensed trainers", icon: Lock, action: () => handleNavClick("academy") },
      { label: "FAQs", desc: "Everything about enrollment, course duration, and certification", icon: HelpCircle, action: () => handleNavClick("academy") }
    ],
    resources: [
      { label: "Blog", desc: "Insights, industry updates, and expert solar guides", icon: FileText, action: () => handleNavClick("resources") },
      { label: "Solar Guides", desc: "Whitepapers on battery cycles, MPPT sizing, and inverters", icon: Shield, action: () => handleNavClick("resources") },
      { label: "Downloads", desc: "Engineering calculation templates and sizing sheets", icon: Download, action: () => handleNavClick("resources") },
      { label: "Product Catalogues", desc: "Technical specifications of Tier-1 solar systems", icon: Layers, action: () => handleNavClick("resources") },
      { label: "FAQs", desc: "Frequently asked questions regarding solar investments", icon: HelpCircle, action: () => handleNavClick("resources") },
      { label: "News & Updates", desc: "Latest developments in the clean energy industry", icon: Sparkles, action: () => handleNavClick("resources") },
      { label: "Video Library", desc: "Walkthrough of site inspections and solar panels mounting", icon: Video, action: () => handleNavClick("resources") }
    ],
    schools: [
      { label: "Overview", desc: "Clean noise-free solar power for academic institutions", icon: GraduationCap, action: () => handleNavClick("schools") },
      { label: "Our Impact", desc: "Empowering computer labs and lighting student corridors", icon: Shield, action: () => handleNavClick("schools") },
      { label: "How to Apply", desc: "Submit nominations for institutional microgrid grants", icon: FileText, action: () => handleNavClick("schools") },
      { label: "Success Stories", desc: "How solar changed learning environments across Nigeria", icon: CheckCircle, action: () => handleNavClick("schools") },
      { label: "Partner With Us", desc: "Corporate CSR and international donor matching pipelines", icon: Users, action: () => handleNavClick("schools") },
      { label: "Donate / Sponsor (Optional)", desc: "Fund clean energy for a school of your choice", icon: Sparkles, action: () => handleNavClick("schools") }
    ],
    contact: [
      { label: "Contact Us", desc: "Get in touch with our support desks and offices", icon: MessageSquare, action: () => handleNavClick("contact") },
      { label: "Book Site Inspection", desc: "Schedule physical shade analysis & energy audits", icon: MapPin, action: () => handleNavClick("contact") },
      { label: "Request a Quote", desc: "Custom sizing bill of quantities for your property", icon: FileText, action: () => handleNavClick("contact") },
      { label: "Support Centre", desc: "24/7 technical helpdesk for commissioned systems", icon: Shield, action: () => handleNavClick("contact") },
      { label: "Office Locations", desc: "Kano main office, Abuja and Lagos regional desks", icon: MapPin, action: () => handleNavClick("contact") }
    ]
  };

  return (
    <div ref={dropdownRef} className="sticky top-0 z-50 w-full">
      {/* Upper Micro Header - Enterprise Vibe */}
      <div className="hidden lg:flex w-full bg-[#0F2937] text-white py-2 px-6 md:px-12 lg:px-16 xl:px-20 border-b border-white/5 text-[10px] font-bold tracking-widest uppercase justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Phone className="h-3.5 w-3.5 text-[#00A651]" />
            Hotline: <a href="tel:09059375492" className="hover:text-[#00A651] transition">09059375492</a>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-[#00A651]" />
            HQ: Hadeja Road, Yankaba, Kano
          </span>
        </div>
      </div>

      {/* Main Premium Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm shadow-slate-100/40 h-20 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 xl:px-20 flex flex-row items-center justify-between">
          
          {/* Logo */}
          <div className="shrink-0">
            <BrandLogo size="md" lightModeText={true} onClick={() => handleNavClick("home")} />
          </div>

          {/* Desktop Premium Navigation (Tesla / Apple Style) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "services", label: "Services" },
              { id: "projects", label: "Projects" },
              { id: "academy", label: "Academy" },
              { id: "store", label: "Shop" },
              { id: "resources", label: "Resources" },
              { id: "schools", label: "Energy for Schools" },
              { id: "contact", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id as any)}
                className={`relative px-3 py-2 rounded-xl text-[11px] uppercase tracking-wider font-extrabold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-[#0057B8]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0057B8] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions (Search, Cart & CTA button) */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 hover:text-[#0057B8] border border-slate-200 text-slate-600 shadow-xs transition duration-200 active:scale-95 cursor-pointer"
              title="Search Portal content"
            >
              <Search className="h-4.5 w-4.5 font-bold" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 hover:text-[#0057B8] border border-slate-200 text-slate-600 shadow-xs transition duration-200 active:scale-95 cursor-pointer"
              title="View Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5 font-bold" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#00A651] text-[9px] font-black text-white animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Trigger */}
            <button
              onClick={() => handleNavClick("admin")}
              className={`p-2.5 rounded-xl border transition duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-[#0057B8] text-white border-[#0057B8] shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 hover:text-[#0057B8] border-slate-200 text-slate-600"
              }`}
              title="TAPCO Admin Control Center"
            >
              <Shield className="h-4.5 w-4.5" />
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-extrabold">Admin</span>
            </button>

            {/* CTA: Get a Quote */}
            <button
              onClick={() => handleNavClick("contact")}
              className="hidden sm:flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] uppercase tracking-wider font-extrabold bg-[#0057B8] hover:bg-[#003B80] text-white border border-transparent shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN SLIDE-OUT MOBILE NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto"
          >
            {/* Mobile Header Block */}
            <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <BrandLogo size="sm" lightModeText={true} onClick={() => handleNavClick("home")} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation List */}
            <div className="flex-1 px-6 py-6 space-y-2 overflow-y-auto text-left">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "services", label: "Services" },
                { id: "projects", label: "Projects" },
                { id: "academy", label: "Academy" },
                { id: "store", label: "Shop" },
                { id: "resources", label: "Resources" },
                { id: "schools", label: "Energy for Schools" },
                { id: "contact", label: "Contact & BOQ" },
                { id: "client", label: "Customer Portal" },
                { id: "admin", label: "Admin Control Center", isSpecial: true }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleNavClick(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-3.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border-b border-slate-100/60 flex items-center justify-between transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#0057B8]/10 text-[#0057B8]"
                      : tab.isSpecial
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.isSpecial && <Shield className="h-4 w-4 text-[#FFD100]" />}
                    {tab.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Mobile Footer Area with direct Dial/CTA */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4 shrink-0">
              <a
                href="tel:09059375492"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#00A651] hover:bg-[#008F45] text-white font-black uppercase tracking-wider text-xs rounded-xl transition shadow-md shadow-[#00A651]/10"
              >
                <Phone className="h-4.5 w-4.5 animate-bounce" />
                <span>Call Hotline (09059375492)</span>
              </a>
              <button
                onClick={() => handleNavClick("contact")}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#0057B8] hover:bg-[#003B80] text-white font-black uppercase tracking-wider text-xs rounded-xl transition shadow-md shadow-[#0057B8]/10"
              >
                <span>Request a BOQ Sizing Quote</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal box */}
            <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-100 shadow-2xl mt-12 sm:mt-20 flex flex-col text-left"
              >
                {/* Search Header */}
                <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, solar packages, courses, guides, articles..."
                    className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm font-bold focus:ring-0 focus:outline-hidden"
                  />
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Search Results / Recommendation Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                  {searchQuery ? (
                    hasSearchResults ? (
                      <div className="space-y-6">
                        {/* 1. Solar Packages Results */}
                        {searchResults.packages.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0057B8] flex items-center gap-1.5">
                              <Zap className="h-3.5 w-3.5" />
                              Sized Solar Packages ({searchResults.packages.length})
                            </h4>
                            <div className="grid gap-2">
                              {searchResults.packages.map((pkg) => (
                                <button
                                  key={pkg.id}
                                  onClick={() => {
                                    setShowSearchModal(false);
                                    handleNavClick("home");
                                    // Optionally scroll to packages
                                    setTimeout(() => {
                                      const pBox = document.getElementById("packages-section");
                                      if (pBox) pBox.scrollIntoView({ behavior: "smooth" });
                                    }, 200);
                                  }}
                                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-[#0057B8]/20 hover:bg-white hover:shadow-xs transition text-left space-y-1 group"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-[#0057B8] transition">
                                      {pkg.name}
                                    </h5>
                                    <span className="text-[10px] font-bold text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded-full">
                                      {pkg.capacity}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold font-sans line-clamp-1">
                                    {pkg.description}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Products Results */}
                        {searchResults.products.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00A651] flex items-center gap-1.5">
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Hardware &amp; Solar Store ({searchResults.products.length})
                            </h4>
                            <div className="grid gap-2">
                              {searchResults.products.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    setShowSearchModal(false);
                                    handleNavClick("store");
                                  }}
                                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-[#00A651]/20 hover:bg-white hover:shadow-xs transition text-left flex items-center gap-4 group"
                                >
                                  <div className="h-11 w-11 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-[#00A651] transition">
                                        {p.name}
                                      </h5>
                                      <span className="text-[11px] font-black text-slate-900">
                                        ₦{p.price.toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold leading-none font-sans uppercase tracking-wider">
                                      Category: {p.category}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. Blog Results */}
                        {searchResults.blogs.length > 0 && (
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              Technical Guides &amp; Blog ({searchResults.blogs.length})
                            </h4>
                            <div className="grid gap-2">
                              {searchResults.blogs.map((b) => (
                                <button
                                  key={b.id}
                                  onClick={() => {
                                    setShowSearchModal(false);
                                    handleNavClick("resources");
                                  }}
                                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-[#0057B8]/20 hover:bg-white hover:shadow-xs transition text-left space-y-1 group"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-[#0057B8] transition">
                                      {b.title}
                                    </h5>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                      {b.date}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold font-sans line-clamp-1">
                                    {b.excerpt}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center space-y-2">
                        <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
                        <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          No Matching Results Found
                        </h5>
                        <p className="text-[11px] text-slate-400 font-bold max-w-sm mx-auto font-sans leading-relaxed">
                          We couldn't find anything matching "{searchQuery}". Try searching for categories like "panels", "lithium", "inverters", or "courses".
                        </p>
                      </div>
                    )
                  ) : (
                    /* Search Recommendations (When empty query) */
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Recommended Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "LiFePO4",
                            "Inverters",
                            "Solar Panels",
                            "Sizing",
                            "Kano",
                            "Courses",
                            "Donations"
                          ].map((kw) => (
                            <button
                              key={kw}
                              onClick={() => setSearchQuery(kw)}
                              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide transition cursor-pointer"
                            >
                              {kw}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Primary Enterprise Contacts
                        </h4>
                        <div className="grid gap-2.5">
                          <a
                            href="tel:09059375492"
                            className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#00A651]/5 hover:border-[#00A651]/20 transition"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 flex items-center justify-center text-[#00A651]">
                              <Phone className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-900 uppercase">
                                Direct Phone Hotline
                              </h5>
                              <p className="text-[10px] text-slate-500 font-bold font-sans">
                                Call Engr. Louis Olosunde at 09059375492
                              </p>
                            </div>
                          </a>
                          <div
                            onClick={() => {
                              setShowSearchModal(false);
                              handleNavClick("contact");
                            }}
                            className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#0057B8]/5 hover:border-[#0057B8]/20 transition cursor-pointer"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#0057B8]/10 flex items-center justify-center text-[#0057B8]">
                              <FileText className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-900 uppercase">
                                Request formal BOQ invoice
                              </h5>
                              <p className="text-[10px] text-slate-500 font-bold font-sans">
                                Fill out our professional site inspection booking form
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer info banner */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest font-sans">
                    TAPCO Solar Energy Solutions • Certified Regulatory Clean Power Systems
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
