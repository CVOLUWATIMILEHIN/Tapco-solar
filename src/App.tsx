/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from "react";
import {
  Sun,
  Shield,
  BookOpen,
  ShoppingBag,
  Zap,
  GraduationCap,
  LayoutDashboard,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  MessageSquare,
  ChevronRight,
  Briefcase,
  Download,
  Info,
  Award,
  Trash2,
  Lock,
  Menu,
  X,
  Target,
  Eye
} from "lucide-react";

// Import custom components
import { SOLAR_PACKAGES, PRODUCTS, BLOG_POSTS, PROJECT_GALLERY, TESTIMONIALS } from "./data";
import { SolarPackage, Product, CartItem, Order, QuoteRequest, SiteInspectionBooking } from "./types";
import AIChatbot from "./components/AIChatbot";
import LoadCalculator from "./components/LoadCalculator";
import BatteryDischargeEstimator from "./components/BatteryDischargeEstimator";
import SiteInspectionBookingForm from "./components/SiteInspectionBookingForm";
import TrainingAcademy from "./components/TrainingAcademy";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BrandLogo from "./components/BrandLogo";
import ServicesPanel from "./components/ServicesPanel";
import HeaderNavigation from "./components/HeaderNavigation";

// Import homepage modular subcomponents
import TrustIndicators from "./components/TrustIndicators";
import CompanyIntroduction from "./components/CompanyIntroduction";
import WhyChooseUs from "./components/WhyChooseUs";
import HomePackages from "./components/HomePackages";
import HomeCalculatorPreview from "./components/HomeCalculatorPreview";
import FeaturedProducts from "./components/FeaturedProducts";
import SchoolsCampaign from "./components/SchoolsCampaign";
import PartnersWidget from "./components/PartnersWidget";
import HomeCtaBanner from "./components/HomeCtaBanner";
import PremiumHeroSlider from "./components/PremiumHeroSlider";
import { motion, AnimatePresence } from "motion/react";
import { CMSProvider, useCMS } from "./context/CMSContext";

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src !== "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600") {
    target.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600";
  }
};

function MainApp() {
  const { aboutData, sectionOrder } = useCMS();
  const [activeTab, setActiveTab] = useState<
    "home" | "about" | "services" | "projects" | "academy" | "store" | "resources" | "schools" | "contact" | "client" | "admin"
  >("home");

  const [isAcademyPortalActive, setIsAcademyPortalActive] = useState(false);
  const [livePackages, setLivePackages] = useState<SolarPackage[]>(SOLAR_PACKAGES);

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
          const updated = SOLAR_PACKAGES.map((p) => {
            const apiPkg = data.packages.find((ap: any) => ap.id === p.id);
            return apiPkg ? { ...p, price: apiPkg.price } : p;
          });
          setLivePackages(updated);
        }
      })
      .catch((err) => {
        console.warn("Gracefully falling back to cached solar packages in App:", err.message || err);
      });
    return () => {
      active = false;
    };
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Projects Gallery Category Filter State
  const [projectFilter, setProjectFilter] = useState("All");

  // E-Store Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Checkout inputs
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");

  // Quotation system inputs
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteLocation, setQuoteLocation] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(SOLAR_PACKAGES[1].id);
  const [averageBill, setAverageBill] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Careers / Partners application forms
  const [careerStatus, setCareerStatus] = useState<string | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null);
  const [previewLoadPreset, setPreviewLoadPreset] = useState<"small" | "medium" | "large">("medium");

  // Selected Service for modal details (TAPCO Style)
  const [selectedService, setSelectedService] = useState<{
    title: string;
    desc: string;
    image: string;
    details: string[];
    benefit: string;
  } | null>(null);

  // Active Quote Database (shown in Client Dashboard / Admin)
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>([
    {
      id: "QT-8809",
      name: "Louis Olosunde",
      email: "olosundelouis@gmail.com",
      phone: "+234 812 3456",
      location: "Lekki Lagos",
      packageId: "pkg-5",
      averageBill: "$200 - $400 / month",
      message: "Ready for active solar installation",
      appliances: [],
      status: "Approved",
      date: "Jun 28, 2026"
    }
  ]);

  // Handle addition to shopping cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCartDrawer(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  // Submit quotation requested from calculator
  const handleCalculatorQuote = (appliances: any[], recommendedPackage: SolarPackage | null, estimatedPrice?: number) => {
    const totalDailyKwh = Math.round(appliances.reduce((a, b) => a + (b.watts * b.count * b.hours), 0) / 1000);
    const totalWatts = appliances.reduce((a, b) => a + (b.watts * b.count), 0);
    const priceDisplay = estimatedPrice ? `₦${estimatedPrice.toLocaleString()} NGN` : (recommendedPackage ? `₦${recommendedPackage.price.toLocaleString()} NGN` : "Custom Sized");

    const newQuote: QuoteRequest = {
      id: "QT-" + Math.floor(1000 + Math.random() * 9000),
      name: "Load Sizing User",
      email: "tapcosolar@gmail.com",
      phone: "09059375492",
      location: "Online Calculator",
      packageId: recommendedPackage?.id || "pkg-custom",
      averageBill: `${totalDailyKwh} kWh/Day (${totalWatts}W Peak) | Est. Investment: ${priceDisplay}`,
      message: `System Sized: ${recommendedPackage?.name || 'Custom Package'} with ${appliances.length} equipment items. Estimated Budget: ${priceDisplay}.`,
      appliances,
      status: "Pending",
      date: new Date().toLocaleDateString()
    };
    setQuotesList((prev) => [newQuote, ...prev]);
    if (recommendedPackage?.id) {
      setSelectedPackageId(recommendedPackage.id);
    }
  };

  const handleManualQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quoteEmail || !quotePhone) return;

    const newQuote: QuoteRequest = {
      id: "QT-" + Math.floor(1000 + Math.random() * 9000),
      name: quoteName,
      email: quoteEmail,
      phone: quotePhone,
      location: quoteLocation,
      packageId: selectedPackageId,
      averageBill,
      message: "Manual Web Application Form",
      appliances: [],
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    setQuotesList((prev) => [newQuote, ...prev]);
    setQuoteSuccess(true);
  };

  // Submit Mock Store Order with secure sandbox payment integration
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutAddress || cart.length === 0) return;

    const subtotal = getCartTotal();
    const shipping = 25000;
    const tax = Math.round(subtotal * 0.075); // 7.5% Nigerian VAT

    const newOrder: Order = {
      id: "TP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      date: new Date().toLocaleDateString(),
      status: "Processing",
      trackingCode: "TRK-" + Math.floor(100000 + Math.random() * 900000),
      paymentMethod: "Secure Card Integration (Flutterwave Hub)",
      shippingAddress: {
        fullName: checkoutName,
        phone: checkoutPhone,
        addressLine: checkoutAddress,
        city: checkoutCity,
        country: "Nigeria"
      }
    };

    setOrderCompleted(newOrder);
    setCart([]); // Clear cart
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#0057B8]/10 selection:text-[#0057B8]">
      
      {/* 1. TOP HEADER & BRAND NAVIGATION */}
      {!(activeTab === "academy" && isAcademyPortalActive) && activeTab !== "admin" && (
        <HeaderNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setProjectFilter={setProjectFilter}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          setShowCartDrawer={setShowCartDrawer}
          setIsAcademyPortalActive={setIsAcademyPortalActive}
        />
      )}

      {/* 2. MAIN CORE APPLICATION SECTIONS */}
      {activeTab === "home" && (
        <PremiumHeroSlider 
          onGetQuoteClick={() => {
            setActiveTab("contact");
            setTimeout(() => {
              const element = document.getElementById("manual-quotation-form");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }, 250);
          }}
          onExploreServicesClick={() => {
            setActiveTab("services");
          }}
        />
      )}

      <main className="flex-1 w-full bg-[#F8FAFC]">
        
        {/* VIEW 1: PREMIUM HOMEPAGE */}
        {activeTab === "home" && (
          <div className="w-full flex flex-col animate-fadeIn">
            
            {/* 1. HERO SECTION (Already rendered at top by PremiumHeroSlider) */}

            {sectionOrder.map((section) => {
              if (section === "trust") {
                return <TrustIndicators key={section} />;
              }
              if (section === "intro") {
                return (
                  <React.Fragment key={section}>
                    <CompanyIntroduction />
                    {/* TRUSTED SOLAR PIONEER & DOWNLOAD CENTER */}
                    <section id="pioneer-section" className="w-full bg-slate-50 border-b border-slate-100 py-24 sm:py-32">
                      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20">
                        <div className="grid gap-12 lg:grid-cols-12 items-center">
                          {/* Left Column (Corporate Profile & Mission/Vision) */}
                          <div className="lg:col-span-7 space-y-10">
                            <div className="space-y-4">
                              <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] block">Engineering Excellence</span>
                              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                Trusted Solar Pioneer
                              </h3>
                              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-3xl">
                                TAPCO Solar Energy Solutions is a global-standard renewable energy engineering firm. Founded on the values of innovation, safety, and deep local impact, we resolve power unreliability by deploying high-efficiency off-grid and smart hybrid solar grids.
                              </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                              <div className="rounded-2xl border-l-4 border-[#0057B8] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/30 space-y-2">
                                <h4 className="text-xs font-black text-[#0057B8] uppercase tracking-wider">Our Mission</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">To replace hazardous generators with clean, dependable, smart solar microgrids across regional communities, residences, and academies.</p>
                              </div>
                              <div className="rounded-2xl border-l-4 border-[#00A651] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/30 space-y-2">
                                <h4 className="text-xs font-black text-[#00A651] uppercase tracking-wider">Our Vision</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">To power clean, continuous learning in over 1,000 schools across developing territories by the year 2030, through our dedicated flagship campaigns.</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (Download Center) */}
                          <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-8 md:p-10 space-y-8 text-center shadow-xl shadow-slate-200/20">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0057B8]/10 text-[#0057B8]">
                              <FileText className="h-7 w-7" />
                            </div>
                            <div className="space-y-2 max-w-sm mx-auto">
                              <h4 className="text-xl font-black text-slate-900 tracking-tight">TAPCO Download Center</h4>
                              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Get copies of our verified certifications, product catalogues, and corporate profiles.</p>
                            </div>
                            <div className="grid gap-4">
                              {[
                                "TAPCO Corporate Profile 2026.pdf",
                                "Solar Installation Best Practices Manual.pdf",
                                "TAPCO Product Catalogue V3.pdf"
                              ].map((doc, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => alert(`Downloading: ${doc}`)}
                                  className="flex items-center justify-between rounded-xl bg-slate-50 hover:bg-[#0057B8]/5 p-4 text-xs text-slate-700 hover:text-[#0057B8] transition-all border border-slate-100 hover:border-[#0057B8]/20 font-bold group"
                                >
                                  <span className="truncate pr-4">{doc}</span>
                                  <Download className="h-4.5 w-4.5 text-slate-400 group-hover:text-[#0057B8] flex-shrink-0 transition-colors" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </React.Fragment>
                );
              }
              if (section === "whyUs") {
                return <WhyChooseUs key={section} />;
              }
              if (section === "services") {
                return (
                  <section id="services-section-anchor" key={section} className="w-full bg-white border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
                    <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-20">
                      <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00A651] block">What We Offer</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                          Comprehensive Solar &amp; Electrical Services Tailored to Power Your World
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                          TAPCO Solar delivers top-tier engineering, premium equipment, and lifetime maintenance support for commercial, residential, and regional deployments.
                        </p>
                      </div>

                      <div className="grid gap-8 lg:grid-cols-12 items-stretch">
                        <div className="lg:col-span-8 rounded-3xl bg-slate-50 border border-slate-100 p-8 md:p-12 flex flex-col justify-between text-left hover:border-slate-200 transition-all shadow-sm">
                          <div className="space-y-6">
                            <span className="text-xs font-black uppercase tracking-widest text-[#00A651] bg-[#00A651]/10 px-3 py-1 rounded-full">Primary Expertise</span>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Turnkey Solar Panel Infrastructure &amp; Engineering</h3>
                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
                              We manage your entire solar transition from initial site scoping and 3D shadow analysis to precise mechanical roof racking and structural electrical integrations. Every installation adheres strictly to standard codes, optimizing daily irradiation collection.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-8">
                            {["Structural Roof Mounting", "Premium String Combiners", "3D Solar Shadow Mapping", "Micro-Inverter Sizing"].map((tag, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-4 rounded-3xl bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-between text-left hover:shadow-xl transition-all shadow-md relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
                          <div className="space-y-6 relative z-10">
                            <span className="text-xs font-black uppercase tracking-widest text-[#FFD100] bg-white/10 px-3 py-1 rounded-full">Critical Power</span>
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Active Lithium Powerwall Storage</h3>
                            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                              Eliminate grid interruptions completely. We integrate premium LiFePO4 cells with automated battery management systems (BMS) for seamless backup.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedService({
                                title: "Active Lithium Storage Systems",
                                desc: "Enterprise-grade backup storage matching dynamic peak load profiles.",
                                image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
                                details: ["High-cycle LFP chemical cells", "Integrated temperature cooling sensors", "Standard charge monitoring via cloud IoT"],
                                benefit: "Seamless backup power roll"
                              });
                            }}
                            className="rounded-xl bg-[#00A651] hover:bg-[#00A651]/90 text-white px-5 py-3 text-xs font-black uppercase tracking-wider mt-8 cursor-pointer relative z-10 text-center animate-bounce"
                          >
                            Explore storage
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-3">
                        {[
                          { title: "Electric Vehicle Charging Stations", desc: "Deploy fast Level 2 AC and high-voltage DC chargers with integrated solar parking canopies.", icon: Zap },
                          { title: "Full Residential Electrical", desc: "Complete household wiring, automatic transfer switches (ATS) integration, and energy monitoring panels.", icon: Shield },
                          { title: "Grid-Tied & Hybrid Sizing", desc: "Maximize return on investment with smart net-metering configuration and load prioritizing.", icon: Sun }
                        ].map((srv, i) => (
                          <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6 space-y-4 text-left hover:border-slate-200 transition-all shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0057B8]/10 text-[#0057B8]">
                              <srv.icon className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-black text-slate-900 tracking-tight">{srv.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">{srv.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }
              if (section === "packages") {
                return (
                  <React.Fragment key={section}>
                    <HomePackages
                      onConfigurePackage={(id) => {
                        setSelectedPackageId(id);
                        setActiveTab("contact");
                        setTimeout(() => {
                          const element = document.getElementById("manual-quotation-form");
                          if (element) element.scrollIntoView({ behavior: "smooth" });
                        }, 250);
                      }}
                      onViewAllPackages={() => {
                        setActiveTab("services");
                      }}
                    />
                  </React.Fragment>
                );
              }
              if (section === "calculator") {
                return (
                  <React.Fragment key={section}>
                    <HomeCalculatorPreview
                      onAdvancedCalculatorClick={() => {
                        setActiveTab("resources");
                      }}
                    />
                  </React.Fragment>
                );
              }
              if (section === "store") {
                return (
                  <React.Fragment key={section}>
                    <FeaturedProducts
                      onAddToCart={(prod) => addToCart(prod)}
                      onExploreStoreClick={() => {
                        setActiveTab("store");
                      }}
                    />
                  </React.Fragment>
                );
              }
              if (section === "schools") {
                return <SchoolsCampaign key={section} />;
              }
              if (section === "gallery") {
                return (
                  <section id="completed-projects-section" key={section} className="w-full bg-slate-50 border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
                    <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
                      <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] block">Project Gallery</span>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our Completed Clean Power Grids</h3>
                        <p className="text-sm md:text-base text-slate-500 font-medium">Explore high-performance residential microgrids, estate systems, and industrial rooftop arrays engineered by our team.</p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {PROJECT_GALLERY.map((proj) => (
                          <div key={proj.id} className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                            <div className="relative overflow-hidden h-64">
                              <img src={proj.image} alt={proj.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                                <span className="text-[9px] uppercase font-black text-[#FFD100] tracking-widest block">{proj.location}</span>
                                <h4 className="text-sm font-black text-white mt-1">{proj.title}</h4>
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-2">{proj.type} Project</span>
                              </div>
                            </div>
                            <div className="p-5 text-left space-y-2 group-hover:bg-[#0F2937]/5 transition-colors">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{proj.location}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest bg-[#00A651]/10 text-[#00A651] px-2 py-0.5 rounded-md">{proj.type}</span>
                              </div>
                              <h4 className="text-sm font-black text-slate-900 line-clamp-1">{proj.title}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }
              if (section === "testimonials") {
                return (
                  <section id="testimonials-section" key={section} className="w-full bg-white border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
                    <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
                      <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-widest text-[#00A651] block">Client Reviews</span>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">What Our Partners Say</h3>
                        <p className="text-sm md:text-base text-slate-500 font-medium">Bespoke references from executive residential developers, hospital administrators, and school administrators.</p>
                      </div>

                      <div className="grid gap-8 md:grid-cols-3">
                        {TESTIMONIALS.map((test, idx) => (
                          <div key={idx} className="rounded-3xl border border-slate-150 p-8 text-left bg-slate-50/50 flex flex-col justify-between shadow-sm hover:border-slate-350 transition-all duration-200">
                            <div className="space-y-4">
                              <div className="flex text-[#FFD100]">
                                {"★".repeat(test.stars)}
                              </div>
                              <p className="text-xs text-slate-600 italic leading-relaxed font-semibold">"{test.quote}"</p>
                            </div>
                            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-150">
                              <div className="h-10 w-10 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-black text-xs flex items-center justify-center uppercase tracking-widest">{test.author.slice(0, 2)}</div>
                              <div>
                                <span className="block text-xs font-black text-slate-900">{test.author}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{test.role}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }
              if (section === "academy") {
                return (
                  <section id="homepage-academy-section" key={section} className="w-full bg-slate-50 border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
                    <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20">
                      <div className="grid gap-12 lg:grid-cols-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-left">
                          <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] block">Educational Development</span>
                          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            TAPCO Solar Training Academy
                          </h3>
                          <p className="text-sm md:text-base text-slate-500 font-semibold leading-relaxed">
                            Building Nigeria's clean-tech workforce. Our accredited Training Academy prepares field electricians, engineers, and energy planners for practical careers in grid sizing, PV array design, and lithium powerwall diagnostics.
                          </p>
                          <div className="grid gap-4 sm:grid-cols-3 pt-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center shadow-sm">
                              <span className="block text-2xl font-black text-[#00A651]">450+</span>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-1">Certified Alumni</span>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center shadow-sm">
                              <span className="block text-2xl font-black text-[#0057B8]">100%</span>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-1">Practical Labs</span>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center shadow-sm">
                              <span className="block text-2xl font-black text-slate-900">NABCEP</span>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-1">Aligned Standard</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-8 md:p-10 space-y-6 text-left shadow-xl shadow-slate-200/15">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A651] bg-[#00A651]/10 px-3 py-1 rounded-full">
                            Bootcamp Spotlight
                          </span>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                            Certified Solar Design &amp; Installation
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            An intensive 8-week physical bootcamp covering electrical engineering codes, roof loading, PV string matching, and live-battery grid failovers.
                          </p>
                          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Next Cohort: Aug 15, 2026</span>
                            <span>Lagos Campus</span>
                          </div>
                          <button
                            onClick={() => setActiveTab("academy")}
                            className="w-full py-4 bg-[#0057B8] hover:bg-[#0057B8]/90 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer shadow-md shadow-[#0057B8]/10"
                          >
                            Browse Academic Curriculums
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }
              if (section === "blog") {
                return (
                  <section id="blog-section" key={section} className="w-full bg-white border-b border-slate-100 py-24 sm:py-32 scroll-mt-24">
                    <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
                      <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] block">Solar Library</span>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Latest Clean-Tech Insights</h3>
                        <p className="text-sm md:text-base text-slate-500 font-medium">Educational resources, solar panel comparisons, and battery life hacks published by TAPCO engineers.</p>
                      </div>

                      <div className="grid gap-8 md:grid-cols-3">
                        {BLOG_POSTS.map((post) => (
                          <article key={post.id} className="group rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between">
                            <div className="relative overflow-hidden h-52">
                              <img src={post.image} alt={post.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                              <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-widest bg-[#0057B8] text-white px-3 py-1 rounded-full">{post.category}</span>
                            </div>
                            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between text-left">
                              <div className="space-y-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.date} • {post.readTime}</span>
                                <h4 className="text-base md:text-lg font-black text-slate-900 leading-snug group-hover:text-[#0057B8] transition-colors">{post.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{post.excerpt}</p>
                              </div>
                              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#0057B8] font-black uppercase tracking-wider">
                                <span>Read Article</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }
              if (section === "partners") {
                return (
                  <React.Fragment key={section}>
                    <PartnersWidget
                      partnerStatus={partnerStatus}
                      onPartnerSubmit={(companyName, region) => {
                        setPartnerStatus(`Partner registration received for ${companyName} in ${region}. Our development team will review it shortly!`);
                      }}
                      careerStatus={careerStatus}
                      onCareerApply={(role) => {
                        setCareerStatus(`Thank you for your interest in the ${role} position. Our HR division has logged your nomination.`);
                      }}
                    />
                  </React.Fragment>
                );
              }
              if (section === "cta") {
                return (
                  <React.Fragment key={section}>
                    <HomeCtaBanner
                      onSiteInspectionClick={() => {
                        setActiveTab("calculator");
                        setTimeout(() => {
                          const element = document.getElementById("booking-form-anchor");
                          if (element) element.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }}
                      onCustomQuoteClick={() => {
                        setActiveTab("calculator");
                        setTimeout(() => {
                          const element = document.getElementById("manual-quotation-form");
                          if (element) element.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }}
                    />
                  </React.Fragment>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* VIEW: ABOUT TAPCO SOLAR */}
        {activeTab === "about" && (
          <div className="w-full bg-white text-slate-900 pb-20">
            {/* 1. Hero Section (About Us) */}
            <div className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white overflow-hidden text-center">
              {/* Animated/gradient background accents */}
              <div className="absolute inset-0 opacity-25">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A651] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0057B8] rounded-full blur-[120px]" />
              </div>
              <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-[#00A651] bg-[#00A651]/10 px-4 py-1.5 rounded-full border border-[#00A651]/20">
                  Who We Are
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  About Us
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-300 font-semibold font-sans max-w-2xl mx-auto leading-relaxed">
                  {aboutData.companyInfo?.tagline || "Eradicating Diesel Reliance Through Tier-1 Solar Microgrids across Nigeria."}
                </p>
              </div>
            </div>

            <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-12 space-y-24">
              {/* 2. About the Company */}
              <div id="about-company" className="grid gap-12 lg:grid-cols-2 items-start">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A651]">Corporate Overview</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {aboutData.companyInfo?.name || "TAPCO Solar Energy Solutions"}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold font-sans">
                    {aboutData.companyInfo?.overview || aboutData.profileDesc}
                  </p>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm">Our Rich History</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                      {aboutData.companyInfo?.history || "Founded with a passion for engineering excellence in Yankaba, Kano in 2021, TAPCO Solar has grown into a leading national clean energy force."}
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm">What We Do</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                      {aboutData.companyInfo?.whatWeDo || "We design, install, and maintain high-yield residential powerwalls, corporate hybrid grids, and agricultural solar irrigation pumps."}
                    </p>
                  </div>
                </div>

                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] border border-slate-100 mt-6 lg:mt-0">
                  <img 
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80" 
                    alt="TAPCO Solar Facility" 
                    onError={handleImageError}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 max-w-[240px]">
                    <div className="h-10 w-10 rounded-lg bg-[#00A651]/10 flex items-center justify-center text-[#00A651]">
                      <Sun className="h-5 w-5 animate-spin-slow" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">Clean Energy Ecosystem</h5>
                      <p className="text-[10px] text-slate-400 font-bold">Unlocking Infinite Power</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Founder / CEO Section */}
              <div id="founder-ceo" className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-8 sm:p-12 lg:p-16">
                <div className="grid gap-12 lg:grid-cols-12 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square max-w-sm w-full border-4 border-white bg-slate-200">
                      <img 
                        src={aboutData.founder?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop"} 
                        alt={aboutData.founder?.name || "Engr. Louis Olosunde"} 
                        onError={handleImageError}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] bg-[#0057B8]/10 px-3.5 py-1.5 rounded-full">
                      Founder &amp; CEO Profile
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {aboutData.founder?.name || "Engr. Louis Olosunde, M.Sc"}
                      </h3>
                      <p className="text-sm font-bold text-[#00A651]">
                        {aboutData.founder?.position || "Founder & CEO"}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-medium">
                        {aboutData.founder?.bio || "Engr. Louis Olosunde is a veteran renewable energy architect with over 12 years of structural engineering and microgrid deployment experience across West Africa. He holds a Master's degree in Renewable Energy Systems and is a certified COREN member."}
                      </p>
                      <div className="border-l-4 border-[#00A651] pl-4 py-2 bg-emerald-50/50 rounded-r-xl">
                        <p className="text-slate-700 italic text-sm font-semibold font-sans">
                          &ldquo;{aboutData.founder?.message || "Our absolute mission is to provide clean, silent, and maintenance-free solar stations engineered to operate perfectly in high-temperature environments. We're replacing erratic power systems, one community at a time."}&rdquo;
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                      {aboutData.founder?.email && (
                        <a href={`mailto:${aboutData.founder.email}`} className="text-slate-500 hover:text-[#0057B8] transition-colors p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                          <Mail className="h-5 w-5" />
                        </a>
                      )}
                      {aboutData.founder?.twitter && (
                        <a href={aboutData.founder.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-500 transition-colors p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {aboutData.founder?.linkedin && (
                        <a href={aboutData.founder.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-700 transition-colors p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Leadership / Staff Section */}
              <div id="leadership-staff" className="space-y-16 pt-6">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A651]">TAPCO Org Chart</span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Our Professional Team</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">
                    Meet the licensed experts, field engineers, and support professionals delivering high-uptime clean energy.
                  </p>
                </div>

                {/* Sub-section: Leadership Team */}
                <div className="space-y-8">
                  <h4 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-2">Leadership Team</h4>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {(aboutData.leadership || []).map((member, idx) => (
                      <div key={member.id || idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition text-left">
                        <img 
                          src={member.photo || member.image || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop"} 
                          alt={member.name} 
                          onError={handleImageError} 
                          className="h-64 w-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-300" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="p-6 space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{member.name}</h4>
                          <p className="text-[10px] text-[#0057B8] font-black uppercase tracking-wider">{member.position || member.role}</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold font-sans">{member.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-section: Staff Members */}
                <div className="space-y-8 pt-6">
                  <h4 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-2">Staff Members</h4>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {(aboutData.staffMembers || []).map((member, idx) => (
                      <div key={member.id || idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition text-left">
                        <img 
                          src={member.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"} 
                          alt={member.name} 
                          onError={handleImageError} 
                          className="h-60 w-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-300" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="p-6 space-y-2">
                          <h5 className="font-extrabold text-slate-900 text-sm">{member.name}</h5>
                          <p className="text-[10px] text-[#00A651] font-black uppercase tracking-wider">{member.position}</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans">{member.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Mission & Vision */}
              <div id="mission-vision" className="relative py-12 sm:py-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/40 px-6 sm:px-12 lg:px-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0057B8]/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00A651]/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10 space-y-12">
                  <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0057B8] bg-[#0057B8]/10 px-3 py-1 rounded-full">Strategic Anchors</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Mission &amp; Vision</h3>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Mission Card */}
                    <div className="group relative bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#0057B8] to-[#00A651]/40" />
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="h-14 w-14 rounded-2xl bg-[#0057B8]/10 text-[#0057B8] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <Target className="h-7 w-7" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#0057B8] bg-[#0057B8]/10 px-3 py-1 rounded-full">Primary Objective</span>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Mission</h4>
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold font-sans">
                            {typeof aboutData.mission === "string" ? aboutData.mission : (aboutData.mission as any)?.statement || aboutData.missionText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vision Card */}
                    <div className="group relative bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#00A651] to-[#0057B8]/40" />
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="h-14 w-14 rounded-2xl bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <Eye className="h-7 w-7" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A651] bg-[#00A651]/10 px-3 py-1 rounded-full">Future Blueprint</span>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Vision</h4>
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold font-sans">
                            {typeof aboutData.vision === "string" ? aboutData.vision : (aboutData.vision as any)?.statement || aboutData.visionText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Core Values */}
              <div id="core-values" className="space-y-8 pt-6">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Our Core Values (I.E.I.P.C.S)</h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">
                    The foundational pillars guiding every project we deliver across West Africa.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(aboutData.coreValues || []).map((val, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition text-left space-y-3">
                      <div className="h-10 w-10 bg-[#00A651]/10 text-[#00A651] rounded-xl flex items-center justify-center font-black text-sm">
                        {val.title ? val.title.charAt(0) : "★"}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{val.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold font-sans">
                        {val.description || val.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Why Choose Us */}
              <div id="why-choose-us" className="space-y-8 pt-6 border-t border-slate-100">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <span className="text-xs font-black uppercase tracking-widest text-[#0057B8] bg-[#0057B8]/10 px-3 py-1 rounded-full">Engineering Edge</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why Choose TAPCO Solar</h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">Our elite technical standards make us West Africa's trusted clean energy partner.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  {[
                    { title: "Licensed Technical Standards", desc: "TAPCO employs COREN licensed engineers and NEMSA certified installers, ensuring every microgrid complies with local grid safety codes." },
                    { title: "Double-Insulated Lightning Earthing", desc: "We design robust surge arresters and symmetrical grounding tracks to completely shield your high-value equipment from electrical thunderstorms." },
                    { title: "Remote Telemetry Monitoring", desc: "Every system runs live Wi-Fi telemetry reporting battery state, hybrid loads, and environmental degradation alerts to Kano HQ." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-3 hover:shadow-sm transition">
                      <div className="h-12 w-12 bg-emerald-50 text-[#00A651] rounded-2xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Partners */}
              <div id="partners" className="space-y-8 pt-6 border-t border-slate-100">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Our Financial &amp; Brand Partners</h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">We co-finance clean solar energy systems alongside leading local and global financial institutions.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {(aboutData.partners || []).map((partner, idx) => (
                    <div key={partner.id || idx} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name} 
                          onError={handleImageError} 
                          className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center font-extrabold text-slate-400 text-xs">
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <h5 className="font-extrabold text-slate-700 text-xs">{partner.name}</h5>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. Call-to-Action */}
              <div id="about-cta" className="relative rounded-[2.5rem] bg-gradient-to-r from-[#0057B8] to-[#00A651] text-white p-8 sm:p-12 lg:p-16 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.15)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-10" />
                <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                    Ready to Settle Your Property Sizing?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-xl mx-auto">
                    Get an engineered Bill of Quantities sized precisely to meet your specific home, office, or institutional energy loads.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button 
                      onClick={() => {
                        setActiveTab("contact");
                        setTimeout(() => {
                          const form = document.getElementById("manual-quotation-form");
                          form?.scrollIntoView({ behavior: "smooth" });
                        }, 200);
                      }}
                      className="bg-white text-slate-900 font-extrabold px-8 py-4 rounded-xl shadow-lg hover:bg-slate-100 transition flex items-center gap-2"
                    >
                      <span>Request Sizing BOQ</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab("services")}
                      className="bg-slate-900/40 text-white font-extrabold px-8 py-4 rounded-xl hover:bg-slate-900/60 transition border border-white/20"
                    >
                      Explore Our Services
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SERVICES (Premium Portal Experience) */}
        {activeTab === "services" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-10 sm:space-y-14 text-left">
            <ServicesPanel
              onQuoteRequested={(serviceName) => {
                setActiveTab("contact");
                setTimeout(() => {
                  const target = document.getElementById("manual-quotation-form");
                  target?.scrollIntoView({ behavior: "smooth" });
                  
                  // Auto-fill quotation comments
                  const msgInput = document.getElementsByName("message")[0] || document.querySelector("textarea");
                  if (msgInput) {
                    (msgInput as HTMLTextAreaElement).value = `Quotation request for ${serviceName}. Please provide technical specification blueprint and cost details.`;
                  }
                }, 300);
              }}
              onBookMaintenanceRequested={() => {
                setActiveTab("contact");
                setTimeout(() => {
                  const target = document.getElementById("site-inspection-booking-form") || document.getElementById("manual-quotation-form");
                  target?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
            />
          </div>
        )}

        {/* VIEW: PROJECTS */}
        {activeTab === "projects" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-10 sm:space-y-14 text-left">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#00A651]">Execution Portfolio</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">TAPCO Solved Installation Gallery</h2>
              <p className="text-sm text-slate-500 font-medium font-sans">Explore live physical solar, battery backup, and electrical engineering installations delivered across Nigeria.</p>
            </div>

            {/* Custom Gallery Component with Category Filtering */}
            <div className="space-y-8">
              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 pb-6">
                {["All", "Residential Solar", "Commercial Solar", "Industrial Solar", "Agricultural Solar", "School Solar Solutions", "Electrical Engineering", "Maintenance & Support"].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setProjectFilter(category);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      projectFilter === category
                        ? "bg-[#0057B8] text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Grid of gallery items */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {PROJECT_GALLERY.filter(item => projectFilter === "All" || item.type === projectFilter).map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
                  >
                    <div className="relative overflow-hidden group">
                      <img src={item.image} alt={item.title} onError={handleImageError} className="h-56 w-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                      <span className="absolute top-4 left-4 bg-[#0057B8] text-white text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-md">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#00A651]" /> {item.location}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase text-[#0057B8] tracking-wider">
                        <span>Status: Operational</span>
                        <span className="text-[#00A651]">✔ Active Microgrid</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ONLINE STORE (Shop with Naira pricing) */}
        {activeTab === "store" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-8 sm:space-y-12 text-left">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#00A651]">Direct Procurement Shop</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Premium Certified Solar Equipment</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium font-sans">Purchase high-grade standalone panels, MPPT controller modules, and long-life lithium batteries directly with secure logistics nationwide.</p>
            </div>
 
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((prod) => (
                <motion.div 
                  key={prod.id} 
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-100 bg-white overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className="relative overflow-hidden">
                    <img src={prod.image} alt={prod.name} onError={handleImageError} className="h-52 w-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest bg-[#0057B8]/10 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <span className="text-xs text-[#FFC107] font-black flex items-center gap-1">★ {prod.rating}</span>
                      </div>
                      <h4 className="mt-2 text-base font-black text-slate-900 tracking-tight leading-snug">{prod.name}</h4>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2 font-semibold font-sans">{prod.description}</p>
                    </div>
 
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">₦{prod.price.toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(prod)}
                        className="rounded-xl bg-[#0057B8] text-white font-extrabold px-4.5 py-2.5 text-xs hover:bg-[#003B80] transition shadow-sm shadow-[#0057B8]/10 cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ENERGY FOR SCHOOLS CAMPAIGN */}
        {activeTab === "schools" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-10 sm:space-y-14 text-left">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0057B8] via-[#003B80] to-[#00A651] border border-slate-200 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-xl shadow-slate-200/50">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
              
              <div className="flex-1 space-y-6 text-left relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                  Flagship CSR Initiative
                </span>
                <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-tight">
                  The <span className="text-[#FFD100]">"Energy for Schools"</span> Campaign
                </h2>
                <p className="text-base text-white/90 max-w-2xl leading-relaxed font-semibold font-sans">
                  Power cutouts force student hostels into darkness, render computers useless, and halt regional water pumps. We design customized off-grid solar complexes to ensure uninterrupted study for schools.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => alert("School Nomination form opened. Please contact Evelyn Johnson at tapcosolar@gmail.com with school details.")}
                    className="rounded-xl bg-[#FFD100] text-slate-900 font-extrabold px-6 py-4 text-xs uppercase tracking-wider hover:bg-[#FFD100]/90 transition shadow-lg shadow-black/15 cursor-pointer"
                  >
                    Nominate a School Campus
                  </button>
                  <button
                    onClick={() => alert("Downloading Corporate Sponsorship proposal deck...")}
                    className="rounded-xl border border-white/20 bg-white/10 text-white font-extrabold px-6 py-4 text-xs uppercase tracking-wider hover:bg-white/20 transition cursor-pointer"
                  >
                    Download Sponsor Prospectus
                  </button>
                </div>
              </div>
 
              {/* Dynamic Impact Metrics */}
              <div className="flex-1 w-full max-w-md relative z-10">
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 space-y-6 text-center text-white">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD100]">Campaign Statistics</h3>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/70 font-semibold block uppercase tracking-wider">Schools Equipped</span>
                      <span className="text-2xl font-black text-white mt-1 block">14 Campuses</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/70 font-semibold block uppercase tracking-wider">Students Served</span>
                      <span className="text-2xl font-black text-white mt-1 block">18,500+ Kids</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed italic font-semibold font-sans">
                    By eliminating high grid utility costs, schools redirect funds directly to recruiting teachers and supplying textbooks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RESOURCES / BLOG */}
        {activeTab === "resources" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-12 sm:space-y-16 text-left">
            {/* Dynamic solar load calculator */}
            <LoadCalculator onQuoteRequested={handleCalculatorQuote} />

            {/* Battery Discharge & Autonomy Estimator */}
            <BatteryDischargeEstimator />

            {/* Custom Download Center & Tariff Guides */}
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Download Center */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-left space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">TAPCO Download Center</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold font-sans">Get official engineering schematics, product datasheets, and legal tariff guides.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { file: "TAPCO Corporate Profile 2026.pdf", size: "4.2 MB", desc: "TAPCO full engineering credentials, leadership profile, and case studies." },
                    { file: "Solar Installation Manual.pdf", size: "8.5 MB", desc: "Our field-approved handbook for residential & commercial earthing best practices." },
                    { file: "Solar Product Catalogue V3.pdf", size: "12.1 MB", desc: "Full catalog of standalone pure-sine wave inverters and high-cycle batteries." },
                    { file: "REAN 0% Custom Duty Waiver.pdf", size: "1.8 MB", desc: "Legal guide detailing Nigeria's zero-customs duty policy on solar modules." }
                  ].map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Downloading: ${doc.file} (${doc.size}) from TAPCO Secure CDN`)}
                      className="flex flex-col text-left justify-between rounded-2xl bg-slate-50 hover:bg-[#0057B8]/5 p-5 text-slate-700 hover:text-[#0057B8] transition-all border border-slate-100 hover:border-[#0057B8]/20 group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black block group-hover:text-[#0057B8] truncate">{doc.file}</span>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed font-sans">{doc.desc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 w-full text-[9px] font-black uppercase text-slate-400 group-hover:text-[#0057B8] tracking-widest pt-2 border-t border-slate-200/50">
                        <span>{doc.size}</span>
                        <Download className="h-4.5 w-4.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nigerian Solar Tax & Tariff Guide */}
              <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-xl text-left space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#FFD100] tracking-widest bg-[#FFD100]/10 px-3 py-1 rounded-full">Regulatory Insight</span>
                  <h3 className="text-2xl font-black tracking-tight text-white leading-tight">Nigerian Customs Duty Waivers &amp; Pioneer Status Incentive (PSI)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold font-sans">
                    The Federal Government of Nigeria, through clean energy advocacy and REAN alignment, offers exceptional legal and financial benefits for commercial solar developers.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-400 font-semibold font-sans">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00A651] mt-1.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-200 block">0% Customs Duty (VAT Waiver)</strong>
                        <span>Under the approved HS Code framework, completely assembled photovoltaic solar panels and cells enter Nigeria with 0% customs import tariff.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00A651] mt-1.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-200 block">Pioneer Status Corporate Tax Holiday</strong>
                        <span>Solar developers and clean microgrid companies enjoy a 3 to 5-year corporate income tax (CIT) exemption, facilitating faster project amortization.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => alert("Connecting you to a TAPCO regulatory consultant for incentive matching...")}
                  className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-center bg-[#FFD100] hover:bg-[#E2BB13] text-slate-900 transition shadow-lg shadow-[#FFD100]/10 cursor-pointer"
                >
                  Consult Regulatory Expert
                </button>
              </div>
            </div>

            {/* Custom Solar Library Blog Section */}
            <div className="space-y-8 pt-6 border-t border-slate-100">
              <div className="text-left space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">The TAPCO Solar Library</h3>
                <p className="text-xs text-slate-500 font-medium font-sans">Practical solar guides, battery engineering walkthroughs, and news written by our lead engineers.</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {BLOG_POSTS.map((post) => (
                  <div key={post.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between text-left">
                    <img src={post.image} alt={post.title} onError={handleImageError} className="h-48 w-full object-cover" referrerPolicy="no-referrer" />
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between font-sans">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-black text-[#00A651] tracking-widest bg-[#00A651]/10 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">{post.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                        <span>{post.readTime}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CONTACT & BOOKING HUB */}
        {activeTab === "contact" && (
          <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-0 pb-12 sm:pt-2 sm:pb-20 space-y-12 sm:space-y-16 text-left">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#00A651]">Project Intake Hub</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Get In Touch With TAPCO Engineers</h2>
              <p className="text-sm text-slate-500 font-medium font-sans">Book a rigorous site inspection or submit your detailed power requirement parameters for a custom bill of quantities.</p>
            </div>

            {/* Custom Quotation Form */}
            <div id="manual-quotation-form" className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/30 max-w-4xl mx-auto">
              {quoteSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00A651]/10 text-[#00A651]">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Quotation Request Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold font-sans">
                    Thank you! Our technical appraisal team is matching your appliance requirements against our stock. An engineer will follow up shortly.
                  </p>
                  <button
                    onClick={() => {
                      setQuoteSuccess(false);
                      setQuoteName("");
                      setQuoteEmail("");
                      setQuotePhone("");
                    }}
                    className="mt-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 text-xs"
                  >
                    Submit Another Quote Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleManualQuoteSubmit} className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Request Custom Quotation</h3>
                    <p className="text-xs text-slate-400 mt-1 font-semibold font-sans">Provide details of your location and target configuration and we will draft your invoice statement.</p>
                  </div>
 
                  <div className="grid gap-6 sm:grid-cols-2 text-slate-700">
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="Louis Olosunde"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="olosundelouis@gmail.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                        placeholder="09059375492"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Location / City</label>
                      <input
                        type="text"
                        required
                        value={quoteLocation}
                        onChange={(e) => setQuoteLocation(e.target.value)}
                        placeholder="e.g. Yankaba Kano, Lekki Lagos, Abuja"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Package</label>
                      <select
                        value={selectedPackageId}
                        onChange={(e) => setSelectedPackageId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      >
                        {livePackages.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} - Starting from ₦{p.price.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Average Electricity Bill</label>
                      <input
                        type="text"
                        required
                        value={averageBill}
                        onChange={(e) => setAverageBill(e.target.value)}
                        placeholder="e.g. ₦120,000 / Month"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
 
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0057B8] text-white font-extrabold px-5 py-4 text-xs uppercase tracking-wider hover:bg-[#003B80] transition shadow-md shadow-[#0057B8]/10 cursor-pointer"
                  >
                    Send Quotation Request
                  </button>
                </form>
              )}
            </div>

            {/* Site inspection booking scheduler */}
            <SiteInspectionBookingForm onBookingSuccess={(b) => alert(`Site Survey Confirmed! Ref: ${b.id.toUpperCase()}`)} />

            {/* Direct Contact info block with Phone, Email, Office addresses */}
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-left space-y-2">
                <span className="text-[9px] font-black uppercase text-[#00A651] tracking-widest block">Direct Hotlines</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Call/Chat Support</h4>
                <p className="text-xs text-slate-600 font-semibold font-sans">Open Mon-Sat, 8:00 AM - 6:00 PM</p>
                <p className="text-base font-black text-[#0057B8] pt-1">09059375492</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-left space-y-2">
                <span className="text-[9px] font-black uppercase text-[#00A651] tracking-widest block">Corporate Email</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Engineering Appraisal</h4>
                <p className="text-xs text-slate-600 font-semibold font-sans">Send detailed drawings/RFPs</p>
                <p className="text-base font-black text-[#0057B8] pt-1 font-sans">tapcosolar@gmail.com</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-left space-y-2">
                <span className="text-[9px] font-black uppercase text-[#00A651] tracking-widest block">Head Office Address</span>
                <h4 className="font-extrabold text-slate-900 text-sm">TAPCO Kano HQ</h4>
                <p className="text-xs text-slate-600 font-semibold font-sans">Yankaba Solutions Center</p>
                <p className="text-xs font-black text-[#0057B8] pt-1 font-sans">Hadeja Road, Kano, Nigeria</p>
              </div>
            </div>
          </div>
        )}
 
        {/* VIEW 6: SOLAR TRAINING ACADEMY */}
        {activeTab === "academy" && (
          <TrainingAcademy onPortalActiveChange={setIsAcademyPortalActive} />
        )}
 
        {/* VIEW 7: CLIENT DASHBOARD */}
        {activeTab === "client" && (
          <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 lg:px-8 py-10 sm:py-12">
            <CustomerDashboard />
          </div>
        )}
 
        {/* VIEW 8: EXECUTIVE ADMIN DASHBOARD */}
        {activeTab === "admin" && (
          <div className="w-full min-h-screen bg-[#F8FAFC]">
            <AdminDashboard onBackToPublic={() => setActiveTab("home")} />
          </div>
        )}
 
      </main>
 
      {/* 3. FOOTER */}
      {!(activeTab === "academy" && isAcademyPortalActive) && activeTab !== "admin" && (
        <footer className="bg-[#0F2937] border-t border-slate-800 text-xs text-slate-400 py-16">
        
        {/* Newsletter Section */}
        <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pb-12 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="max-w-xl space-y-2 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              Signup for our newsletter to get update information, news, insight or promotions.
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Stay connected with clean energy engineering tips, tax incentive guides, and commercial financing opportunities.
            </p>
          </div>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="px-4.5 py-3.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-[#FFD100] w-full lg:w-80 transition"
            />
            <button 
              type="button"
              onClick={() => alert("Thank you for subscribing to our TAPCO Solar news and insights newsletter!")}
              className="rounded-lg bg-[#FFD100] hover:bg-[#E2BB13] text-slate-900 font-extrabold px-7 py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-all duration-200 shadow-md"
            >
              <Mail className="h-4 w-4 text-slate-900" />
              Sign Up
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Services */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-widest text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A651]"></span> Services
            </h4>
            <ul className="space-y-3 font-semibold text-left">
              <li>
                <button 
                  onClick={() => { 
                    setSelectedService({
                      title: "Solar Panel Installation",
                      desc: "Transform your energy use with expert solar panel installation, delivering clean, cost-effective power for your home or business.",
                      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80",
                      details: ["Precision Shading Analysis with 3D shadow mapping", "High-Efficiency Tier-1 Monocrystalline modules", "Custom wind-resistant aluminum roof mount structures", "Engineered DC cabling and weatherproof combiner grids"],
                      benefit: "Reduces dependency on the grid by up to 100%, yielding massive lifetime savings."
                    });
                  }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Solar Panel Installation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    setSelectedService({
                      title: "Battery Backup Services",
                      desc: "Ensure energy access with our solar battery backup installation, keeping your home or business powered even during outages.",
                      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
                      details: ["High-cycle LiFePO4 battery banks", "Built-in smart Battery Management Systems (BMS)", "Automatic Transfer Switch (ATS) for instantaneous sub-second failover", "Intelligent load prioritisation"],
                      benefit: "Provides absolute energy security and continuity during outages."
                    });
                  }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Battery Backup Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    setSelectedService({
                      title: "EV Charger Installation",
                      desc: "Charge your electric vehicle conveniently and efficiently with our professional EV charger installation tailored to your home.",
                      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
                      details: ["Level 2 high-speed smart EV chargers", "Solar-routing logic to charge on excess generation", "Safe weatherproof outdoor-rated mounts", "Built-in overcurrent/surge protection"],
                      benefit: "Power your electric vehicle directly from pure sunshine, zero emissions."
                    });
                  }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  EV Charger Installation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    setSelectedService({
                      title: "Residential Electrical",
                      desc: "Trusted residential electrical services to ensure your home stays safe, efficient, and powered for everyday modern living.",
                      image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=800&auto=format&fit=crop&q=80",
                      details: ["Electrical subpanel upgrades for solar integrations", "Surge protective device grid integration", "Whole-house load-balancing audit", "Certified smart-breaker diagnostics"],
                      benefit: "Guarantees safety compliance under international electrical codes."
                    });
                  }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Residential Electrical
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    setSelectedService({
                      title: "Solar Array Design",
                      desc: "Our custom solar array designs, tailored to maximize efficiency and suit your property's unique needs.",
                      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
                      details: ["Roof angle and local latitude optimization", "3D panel layout schematic blueprint", "Inverter string sizing calculations", "Structural weight load calculations"],
                      benefit: "Maximizes energy yield per square foot of roof space."
                    });
                  }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Solar Array Design
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-widest text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A651]"></span> Company
            </h4>
            <ul className="space-y-3 font-semibold text-left">
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); setTimeout(() => { document.getElementById("blog-section-anchor")?.scrollIntoView({ behavior: "smooth" }); }, 150); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Blog & News
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); setTimeout(() => { document.getElementById("milestones-section-anchor")?.scrollIntoView({ behavior: "smooth" }); }, 150); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("Frequently Asked Questions:\n\nQ: How much does home solar cost in Nigeria?\nA: Custom systems scale from $850 for a starter flat/apartment up to $7,800 for pro commercial configurations depending on your total load requirements.\n\nQ: Do you offer financing?\nA: Yes! Standard 12 to 36-month flexible financing plans are available through our Nigerian banking partners, including Sterling Bank Sunsola and the Bank of Industry (BOI).\n\nQ: What is the lifespan of modern batteries?\nA: Our premium LiFePO4 Lithium batteries are rated for 6,000+ cycles, which translates to 15-20 years of continuous daily use.")} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-widest text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A651]"></span> Resources
            </h4>
            <ul className="space-y-3 font-semibold text-left">
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); setTimeout(() => { document.getElementById("blog-section-anchor")?.scrollIntoView({ behavior: "smooth" }); }, 150); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Solar Insights Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("Nigerian Customs Waiver & Pioneer Status Incentives:\n\nUnder current Nigerian clean energy directives, imports of solar panels and deep-cycle lithium batteries enjoy a 0% customs duty waiver. Furthermore, corporate clients investing in clean energy microgrids qualify for Pioneer Status Incentives (PSI) under the NIPC, granting up to 5 years of corporate income tax holidays.")} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Customs & Tax Incentives
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("BOI & Bank Solar Sponsoring:\n\nWe coordinate zero-deposit solar asset leases, commercial Power Purchase Agreements (PPAs), and specialized solar intervention funds via Sterling Bank (Sunsola), FCMB, and the Bank of Industry (BOI). This keeps monthly financing payments lower than your prior diesel and grid expenses.")} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  BOI & Bank Solar Finance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); setTimeout(() => { document.getElementById("gallery-section-anchor")?.scrollIntoView({ behavior: "smooth" }); }, 150); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Solar Projects Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab("home"); setTimeout(() => { document.getElementById("dealer-section-anchor")?.scrollIntoView({ behavior: "smooth" }); }, 150); }} 
                  className="hover:text-white text-left transition-colors text-slate-400"
                >
                  Partners & Memberships
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in touch */}
          <div className="space-y-4 text-left">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-widest text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A651]"></span> Get in touch
            </h4>
            <ul className="space-y-3 font-semibold text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FFD100] flex-shrink-0" />
                <a href="mailto:tapcosolar@gmail.com" className="hover:text-white transition">tapcosolar@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 border-t border-slate-800/60 pt-3">
                <MapPin className="h-4 w-4 text-[#FFD100] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300 leading-normal">
                  <span className="text-slate-500 block font-bold uppercase tracking-wider text-[9px] mb-0.5">Head Office & Solutions Center:</span>
                  Hadeja Road, Yankaba, Kano State, Nigeria
                </div>
              </li>
              <li className="space-y-1.5 border-t border-slate-800/60 pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Kano Solutions (Hotline):</span>
                  <a href="tel:+2347051112222" className="hover:text-white transition">+234 705 111 2222</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Lagos Office Desk:</span>
                  <a href="tel:+2348031234567" className="hover:text-white transition">+234 803 123 4567</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Abuja Desk Support:</span>
                  <a href="tel:+2349069876543" className="hover:text-white transition">+234 906 987 6543</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Local chamber memberships row */}
        <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 border-t border-slate-800/60 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center md:text-left">
            <span>Corporate Alliance network:</span>
            <div className="flex flex-wrap gap-2.5">
              <span className="border border-slate-800 bg-slate-900/60 text-slate-400 px-3 py-1.5 rounded-lg font-mono font-bold tracking-tight">REAN Member (Renewable Energy Assoc. of Nigeria)</span>
              <span className="border border-slate-800 bg-slate-900/60 text-slate-400 px-3 py-1.5 rounded-lg font-mono font-bold tracking-tight">NACC Member (Nigerian-American Chamber)</span>
              <span className="border border-[#00A651]/20 bg-[#00A651]/5 text-[#00A651] px-3 py-1.5 rounded-lg font-mono font-bold tracking-tight">ISO 9001:2015 & NEMSA APPROVED</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Opening Facebook page..."); }}
              className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-[#FFD100] text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all duration-200"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/>
              </svg>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Opening Instagram feed..."); }}
              className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-[#FFD100] text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert("Opening LinkedIn profile..."); }}
              className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-[#FFD100] text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all duration-200"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 border-t border-slate-800/40 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider gap-4">
          <span>© {new Date().getFullYear()} TAPCO Solar Energy Solutions. All Rights Reserved.</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Secure payment processed via integrated banking gateways."); }} className="hover:text-slate-300">Payment Terms</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy guidelines verified under GDPR regulations."); }} className="hover:text-slate-300">Privacy Policy</a>
            <span className="text-slate-700">|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("client"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-slate-600 hover:text-slate-300 transition" id="footer-customer-portal-btn">Customer Portal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsAcademyPortalActive(true); setActiveTab("academy"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-slate-600 hover:text-slate-300 transition" id="footer-academy-portal-btn">Academy Portal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("admin"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-slate-600 hover:text-slate-300 transition flex items-center gap-1" title="Control Center (Admin Area)" id="admin-control-center-icon-btn">
              <Shield className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
      )}
 
      {/* 4. CHATBOT FLOATING ICON & ASSISTANT */}
      <AIChatbot />
 
      {/* 5. SHOPPING CART DRAWER PANEL */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between h-full border-l border-slate-100">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                  <ShoppingBag className="h-5 w-5 text-[#0057B8]" />
                  Your Shopping Cart
                </h3>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    setOrderCompleted(null);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
 
              {orderCompleted ? (
                /* Checkout Completed Mock State */
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00A651]/10 text-[#00A651]">
                    <CheckCircle className="h-8 w-8 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Secure Order Dispatched</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Payment successfully processed via encrypted credentials sandbox.
                  </p>
                  <div className="rounded-2xl bg-slate-50 p-5 text-left space-y-2 text-[11px] text-slate-600 border border-slate-100 font-medium">
                    <div>Order Ref: <span className="font-mono text-[#0057B8] font-bold">{orderCompleted.id}</span></div>
                    <div>Tracking: <span className="font-mono font-bold text-slate-800">{orderCompleted.trackingCode}</span></div>
                    <div>Destination: <span className="font-semibold text-slate-800">{orderCompleted.shippingAddress.addressLine}</span></div>
                    <div className="border-t border-slate-100 pt-2 font-bold text-[#00A651] text-xs">Total: ₦{orderCompleted.total.toLocaleString()} NGN</div>
                  </div>
                  <button
                    onClick={() => {
                      setOrderCompleted(null);
                      setShowCartDrawer(false);
                    }}
                    className="mt-6 w-full rounded-xl bg-[#0057B8] text-white py-3.5 text-xs font-bold hover:bg-[#0057B8]/95 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-20 text-center text-slate-400 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 border border-slate-100 shadow-inner">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Your shopping cart is empty</p>
                    <button
                      onClick={() => {
                        setShowCartDrawer(false);
                        setActiveTab("store");
                      }}
                      className="text-xs text-[#0057B8] hover:underline font-bold mt-2 inline-block"
                    >
                      Browse Solar Store Inventory
                    </button>
                  </div>
                </div>
              ) : (
                /* Cart Items List */
                <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 max-w-[200px] truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-[#0057B8] font-bold mt-1">₦{item.product.price.toLocaleString()} NGN</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-bold">Qty: {item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
 
            {/* Cart checkout footer with billing inputs */}
            {!orderCompleted && cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-slate-100 pt-6 space-y-5 bg-white text-slate-700">
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cart Subtotal:</span>
                    <span className="font-bold text-slate-800">₦{getCartTotal().toLocaleString()} NGN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Secure Packaging & Shipping:</span>
                    <span className="font-bold text-slate-800">₦25,000 NGN</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 font-bold text-xs text-[#00A651]">
                    <span>Total Amount (incl. 7.5% VAT):</span>
                    <span className="text-sm font-black text-slate-900">₦{(Math.round(getCartTotal() * 1.075) + 25000).toLocaleString()} NGN</span>
                  </div>
                </div>
 
                {/* Shipping info */}
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Shipping Name"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-medium"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Delivery Phone Number"
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-medium"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Detailed Shipping Address"
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-medium"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City / State"
                    value={checkoutCity}
                    onChange={(e) => setCheckoutCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-medium"
                  />
                </div>
 
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0057B8] py-3.5 text-xs font-extrabold text-white uppercase tracking-wider shadow-md hover:bg-[#0057B8]/95 transition"
                >
                  Confirm Secure Purchase (₦{(Math.round(getCartTotal() * 1.075) + 25000).toLocaleString()})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. SERVICE DETAILS POPUP MODAL (TAPCO Solar Style) */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white p-2 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Service Hero Image */}
              <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="w-12 h-1 bg-[#00A651] rounded-full mb-3" />
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-8 sm:p-10 space-y-8 overflow-y-auto text-slate-700">
                <p className="text-base font-semibold text-slate-600 leading-relaxed italic border-l-4 border-[#00A651] pl-4">
                  "{selectedService.desc}"
                </p>

                {/* Scope of Work Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Engineered Scope of Work
                  </h4>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {selectedService.details.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50/70 hover:bg-white hover:shadow-md hover:border-[#0057B8]/20 p-5 rounded-2xl border border-slate-100 transition-all duration-300">
                        <CheckCircle className="h-5 w-5 text-[#00A651] flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* High Value Benefit Box */}
                <div className="bg-[#0057B8]/5 border border-[#0057B8]/10 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
                  <Shield className="h-6 w-6 text-[#0057B8] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-[#0057B8] uppercase tracking-wider mb-1">
                      Certified Strategic Benefit
                    </h5>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {selectedService.benefit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion Buttons Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setActiveTab("calculator");
                    setTimeout(() => {
                      document.getElementById("manual-quotation-form")?.scrollIntoView({ behavior: "smooth" });
                    }, 200);
                  }}
                  className="flex-1 rounded-xl bg-[#0057B8] text-white py-3.5 text-xs font-extrabold uppercase tracking-wider hover:bg-[#0057B8]/95 transition-all shadow-md shadow-[#0057B8]/10 hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Request Direct Quotation
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setActiveTab("calculator");
                    setTimeout(() => {
                      document.getElementById("site-inspection-booking-form")?.scrollIntoView({ behavior: "smooth" });
                    }, 200);
                  }}
                  className="flex-1 rounded-xl bg-[#FFD100] text-slate-900 py-3.5 text-xs font-black uppercase tracking-wider hover:bg-[#E2BB13] transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Book Site Survey ($150)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <MainApp />
    </CMSProvider>
  );
}
