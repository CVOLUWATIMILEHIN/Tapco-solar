import React, { createContext, useContext, useState, useEffect } from "react";
import { SolarPackage, Product, Course, BlogPost, QuoteRequest, SiteInspectionBooking, Order as ClientOrder } from "../types";
import { SOLAR_PACKAGES, PRODUCTS, BLOG_POSTS, PROJECT_GALLERY, TESTIMONIALS } from "../data";
import { 
  INITIAL_CUSTOMERS, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_PRODUCTS,
  INITIAL_ORDERS, INITIAL_ACADEMY_STUDENTS, INITIAL_ACADEMY_CLASSES,
  INITIAL_BOOKINGS, INITIAL_TICKETS, ROLES, DEFAULT_MODULE_PERMISSIONS, Customer, Lead, Project, ProductItem, AcademyStudent, AcademyClass, Booking, SupportTicket, Order
} from "../components/admin/AdminData";

// Define additional CMS types
export interface HeroSlide {
  id: string;
  image: string;
  label: string;
  category: string;
  headline: string;
  description: string;
  secondaryCta: string;
  videoUrl?: string;
  isPublished: boolean;
  scheduledPublish?: string; // ISO date string
  isArchived: boolean;
}

export interface TrustStat {
  id: string;
  value: string;
  label: string;
  desc: string;
}

export interface CompanyIntro {
  badge: string;
  headline: string;
  description: string;
  videoUrl: string;
  stats: Array<{ value: string; label: string }>;
}

export interface WhyUsItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  history: string;
  whatWeDo: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
}

export interface Founder {
  id: string;
  name: string;
  position: string;
  photo: string;
  bio: string;
  message: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  department: string;
  photo: string;
  bio: string;
  orderIdx?: number;
  isPublished?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  photo: string;
  bio: string;
  orderIdx?: number;
  isPublished?: boolean;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  orderIdx?: number;
  isPublished?: boolean;
}

export interface AboutCMSData {
  profileTitle: string;
  profileDesc: string;
  missionText?: string;
  visionText?: string;
  mission: string | { id: string; statement: string; isPublished: boolean };
  vision: string | { id: string; statement: string; isPublished: boolean };
  coreValues: Array<{ id?: string; title: string; desc?: string; description?: string; icon?: string; orderIdx?: number; isPublished?: boolean }>;
  timeline: Array<{ id: string; year: string; title: string; desc: string }>;
  leadership: Array<{ id: string; name: string; role?: string; position?: string; bio: string; image?: string; photo?: string; department?: string; orderIdx?: number; isPublished?: boolean }>;
  certifications: Array<{
    id: string;
    title: string;
    authority: string;
    desc: string;
    certNumber?: string;
    standards?: string;
    expiry?: string;
    auditFreq?: string;
  }>;
  partners: Array<{ id: string; name: string; logoUrl: string }>;

  // New structured properties
  companyInfo: CompanyInfo;
  founder: Founder;
  aboutSections: AboutSection[];
  staffMembers: StaffMember[];
}

export interface ServiceCMSItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  details: string[];
  benefit: string;
  videoUrl?: string;
  seoTitle?: string;
  seoDesc?: string;
  faqs?: Array<{ question: string; answer: string }>;
  gallery?: string[];
  isPublished: boolean;
}

export interface PopupConfig {
  id: string;
  title: string;
  headline: string;
  description: string;
  image?: string;
  videoUrl?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  targetPages: string[]; // e.g. ["home", "store"]
  closeBehaviour: "once" | "always" | "session";
  startDate?: string;
  endDate?: string;
}

export interface SEOSettings {
  id: string; // page id (home, about, etc)
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image";
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
  size: string;
  folder: string;
  tags: string[];
  uploadedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photo: string;
  permissions: string[];
}

interface CMSContextType {
  // Homepage CMS
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  trustStats: TrustStat[];
  setTrustStats: React.Dispatch<React.SetStateAction<TrustStat[]>>;
  companyIntro: CompanyIntro;
  setCompanyIntro: React.Dispatch<React.SetStateAction<CompanyIntro>>;
  whyUsItems: WhyUsItem[];
  setWhyUsItems: React.Dispatch<React.SetStateAction<WhyUsItem[]>>;
  partnersList: string[];
  setPartnersList: React.Dispatch<React.SetStateAction<string[]>>;
  ctaHeadline: string;
  setCtaHeadline: (val: string) => void;
  ctaDescription: string;
  setCtaDescription: (val: string) => void;
  ctaButtonText: string;
  setCtaButtonText: (val: string) => void;
  sectionOrder: string[];
  setSectionOrder: React.Dispatch<React.SetStateAction<string[]>>;

  // About Page CMS
  aboutData: AboutCMSData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutCMSData>>;

  // Services CMS
  servicesList: ServiceCMSItem[];
  setServicesList: React.Dispatch<React.SetStateAction<ServiceCMSItem[]>>;

  // Projects CMS
  projectsList: Project[];
  setProjectsList: React.Dispatch<React.SetStateAction<Project[]>>;

  // Solar Packages
  solarPackages: SolarPackage[];
  setSolarPackages: React.Dispatch<React.SetStateAction<SolarPackage[]>>;

  // Products & Shop CMS
  productsList: ProductItem[];
  setProductsList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  ordersList: Order[];
  setOrdersList: React.Dispatch<React.SetStateAction<Order[]>>;
  couponsList: Array<{ code: string; discount: number; isActive: boolean }>;
  setCouponsList: React.Dispatch<React.SetStateAction<Array<{ code: string; discount: number; isActive: boolean }>>>;

  // Academy CMS
  coursesList: Course[];
  setCoursesList: React.Dispatch<React.SetStateAction<Course[]>>;
  studentsList: AcademyStudent[];
  setStudentsList: React.Dispatch<React.SetStateAction<AcademyStudent[]>>;

  // Blog CMS
  blogsList: BlogPost[];
  setBlogsList: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  downloadsList: Array<{ id: string; name: string; url: string; category: string }>;
  setDownloadsList: React.Dispatch<React.SetStateAction<Array<{ id: string; name: string; url: string; category: string }>>>;

  // Popups CMS
  popupsList: PopupConfig[];
  setPopupsList: React.Dispatch<React.SetStateAction<PopupConfig[]>>;

  // Operational Lists
  quotesList: QuoteRequest[];
  setQuotesList: React.Dispatch<React.SetStateAction<QuoteRequest[]>>;
  bookingsList: SiteInspectionBooking[];
  setBookingsList: React.Dispatch<React.SetStateAction<SiteInspectionBooking[]>>;
  customersList: Customer[];
  setCustomersList: React.Dispatch<React.SetStateAction<Customer[]>>;
  leadsList: Lead[];
  setLeadsList: React.Dispatch<React.SetStateAction<Lead[]>>;
  supportTicketsList: SupportTicket[];
  setSupportTicketsList: React.Dispatch<React.SetStateAction<SupportTicket[]>>;

  // Security & Audit
  auditLogs: any[];
  setAuditLogs: React.Dispatch<React.SetStateAction<any[]>>;
  addAuditLog: (action: string, who: string, status: "SUCCESS" | "BLOCKED" | "WARNING") => void;

  // Team Directory
  teamList: TeamMember[];
  setTeamList: React.Dispatch<React.SetStateAction<TeamMember[]>>;

  // Media Library
  mediaFiles: MediaItem[];
  setMediaFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;

  // SEO Management
  seoSettings: SEOSettings[];
  setSeoSettings: React.Dispatch<React.SetStateAction<SEOSettings[]>>;

  // Save changes triggers
  saveAllData: () => void;
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial value helper
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error(`Error loading CMS key: ${key}`, e);
      return fallback;
    }
  };

  // 1. Hero Slides
  const defaultSlides: HeroSlide[] = [
    {
      id: "slide-1",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      label: "Modern Residential Rooftop Solar, Lagos",
      category: "Residential Solar",
      headline: "Noise-Free Luxury & Clean Power for Nigerian Homes",
      description: "Equip your duplex or estate with premium rooftop solar panels and intelligent hybrid systems. Escape grid outages and enjoy seamless 24/7 electricity.",
      secondaryCta: "Explore Home Solar",
      isPublished: true,
      isArchived: false
    },
    {
      id: "slide-2",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
      label: "Corporate Commercial Complex, Victoria Island",
      category: "Commercial & Industrial Solar",
      headline: "Scale Your Business With High-Yield Solar Microgrids",
      description: "Power corporate offices, factories, and warehouses in Lagos or Abuja. Reduce dependence on costly diesel generators by up to 75% with zero-emission carports and arrays.",
      secondaryCta: "Explore Enterprise Solutions",
      isPublished: true,
      isArchived: false
    },
    {
      id: "slide-3",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80",
      label: "Solar Irrigation Farm, Northern Nigeria",
      category: "Agricultural Solar",
      headline: "Boost Harvest Yields with Solar-Powered Irrigation",
      description: "Modernize farms across Northern and Western Nigeria. TAPCO delivers smart agricultural irrigation and agro-processing microgrids designed for high operational uptime.",
      secondaryCta: "Explore Agri-Solar",
      isPublished: true,
      isArchived: false
    },
    {
      id: "slide-4",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
      label: "Solar-Powered Healthcare Facility Clinic",
      category: "Solar for Schools & Hospitals",
      headline: "Continuous Power for Health Centers & Universities",
      description: "Powering life-saving maternal clinics, medical hubs, and public or private schools across Nigeria with premium high-capacity solar batteries and microgrids.",
      secondaryCta: "Explore Institutional Solar",
      isPublished: true,
      isArchived: false
    },
    {
      id: "slide-5",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=80",
      label: "TAPCO Professional Certified Engineers at Work",
      category: "Engineers at Work",
      headline: "Certified Engineering and Operational Excellence",
      description: "Our elite team of professional male and female Nigerian engineers works in hard hats and reflective vests to deliver safe, premium, and zero-defect solar installations.",
      secondaryCta: "Our Technical Standards",
      isPublished: true,
      isArchived: false
    },
    {
      id: "slide-6",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1920&q=80",
      label: "Premium Hybrid Inverters and Battery Bank Array",
      category: "Solar & Electrical Products",
      headline: "Premium Hybrid Inverters & LFP Battery Storage",
      description: "We supply tier-1 high-density monocrystalline solar panels, state-of-the-art intelligent hybrid inverters, and long-life Lithium Iron Phosphate (LFP) energy storage banks.",
      secondaryCta: "View Product Catalog",
      isPublished: true,
      isArchived: false
    }
  ];

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => loadInitial("tapco_cms_hero_slides", defaultSlides));

  // 2. Trust Indicators / Stats
  const defaultStats: TrustStat[] = [
    { id: "stat-1", value: "98%", label: "Grid Independence", desc: "Average energy bill savings reported by residential Powerwall customers" },
    { id: "stat-2", value: "14+", label: "Schools Funded", desc: "Fully-functional solar microgrids installed under CSR donor pipelines" },
    { id: "stat-3", value: "3.2MW", label: "Installed Capacity", desc: "Active solar generation managed across regional commercial grids" },
    { id: "stat-4", value: "24/7", label: "Critical Support", desc: "Automated remote telemetry warning systems & emergency engineering" }
  ];
  const [trustStats, setTrustStats] = useState<TrustStat[]>(() => loadInitial("tapco_cms_trust_stats", defaultStats));

  // 3. Company Introduction
  const defaultIntro: CompanyIntro = {
    badge: "ENGINEERING NIGERIA'S POWER SHIELD",
    headline: "Eradicating Diesel Reliance Through Tier-1 Solar Microgrids",
    description: "TAPCO Solar Energy Solutions designs, finances, and commissions high-performance off-grid and smart hybrid energy networks. Licensed by COREN and NEMSA, we replace erratic grids and expensive fuel engines with clean, silent, and maintenance-free solar stations engineered to operate perfectly in high-temperature environments.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    stats: [
      { value: "48 Hr", label: "Rapid Delivery" },
      { value: "25 Yr", label: "Certified Lifespan" },
      { value: "0% VAT", label: "Customs Exempt" }
    ]
  };
  const [companyIntro, setCompanyIntro] = useState<CompanyIntro>(() => loadInitial("tapco_cms_company_intro", defaultIntro));

  // 4. Why Choose Us
  const defaultWhyUs: WhyUsItem[] = [
    { id: "why-1", title: "Double-Insulated Symmetrical Earthing", desc: "We construct rigorous ground protection to insulate standard household grids against heavy thunderstorms and lightning surge lines.", iconName: "Shield" },
    { id: "why-2", title: "Intelligent Remote IoT Telemetry", desc: "Every system we deploy communicates directly with the Kano HQ Command Palette via Wi-Fi networks to predict battery limits.", iconName: "Laptop" },
    { id: "why-3", title: "Certified COREN Engineering", desc: "We employ strictly licensed professionals wearing protective gear to size, test, and sign-off on your critical electrical arrays.", iconName: "Users" }
  ];
  const [whyUsItems, setWhyUsItems] = useState<WhyUsItem[]>(() => loadInitial("tapco_cms_why_us", defaultWhyUs));

  // 5. Section Order
  const defaultSectionOrder = ["hero", "trust", "intro", "whyUs", "services", "packages", "calculator", "store", "schools", "gallery", "testimonials", "academy", "blog", "partners", "cta"];
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => loadInitial("tapco_cms_section_order", defaultSectionOrder));

  // 6. Partners
  const defaultPartners = ["REAN Member", "NACC Member", "ISO 9001:2015 Approved", "NEMSA Certified", "Sunsynk Authorized", "BYD Partner"];
  const [partnersList, setPartnersList] = useState<string[]>(() => loadInitial("tapco_cms_partners", defaultPartners));

  // 7. CTA Banner
  const [ctaHeadline, setCtaHeadlineState] = useState(() => loadInitial("tapco_cms_cta_headline", "Ready to Upgrade to Uninterrupted Solar Energy?"));
  const [ctaDescription, setCtaDescriptionState] = useState(() => loadInitial("tapco_cms_cta_description", "Get an engineered bill of quantities sized precisely for your appliances in under 60 seconds. Our experts are ready to audit your property."));
  const [ctaButtonText, setCtaButtonTextState] = useState(() => loadInitial("tapco_cms_cta_button", "Request direct sizing boq"));

  const setCtaHeadline = (val: string) => { setCtaHeadlineState(val); localStorage.setItem("tapco_cms_cta_headline", JSON.stringify(val)); };
  const setCtaDescription = (val: string) => { setCtaDescriptionState(val); localStorage.setItem("tapco_cms_cta_description", JSON.stringify(val)); };
  const setCtaButtonText = (val: string) => { setCtaButtonTextState(val); localStorage.setItem("tapco_cms_cta_button", JSON.stringify(val)); };

  // 8. About Page Data
  const defaultAbout: AboutCMSData = {
    profileTitle: "ABOUT TAPCO SOLAR ENERGY SOLUTIONS",
    profileDesc: "At TAPCO Solar Energy Solutions, we are committed to transforming the way homes, businesses, schools, and institutions across Nigeria access electricity. We provide reliable, cost-effective, and sustainable solar energy systems designed to eliminate the challenges of unreliable grid power and rising energy costs.",
    mission: {
      id: "miss-1",
      statement: "To deliver innovative, reliable, and affordable renewable energy solutions that empower homes, businesses, schools, and communities with clean, uninterrupted power while exceeding customer expectations through engineering excellence and exceptional service.",
      isPublished: true
    },
    vision: {
      id: "vis-1",
      statement: "To become Africa's leading renewable energy and engineering company, recognized for transforming lives through sustainable energy solutions, technological innovation, and world-class service.",
      isPublished: true
    },
    missionText: "To deliver innovative, reliable, and affordable renewable energy solutions that empower homes, businesses, schools, and communities with clean, uninterrupted power while exceeding customer expectations through engineering excellence and exceptional service.",
    visionText: "To become Africa's leading renewable energy and engineering company, recognized for transforming lives through sustainable energy solutions, technological innovation, and world-class service.",
    coreValues: [
      { id: "val-1", title: "Integrity", description: "We uphold honesty, transparency, and ethical practices in every project.", icon: "Shield", orderIdx: 1, isPublished: true },
      { id: "val-2", title: "Excellence", description: "We are committed to delivering the highest standards of quality and professionalism.", icon: "Award", orderIdx: 2, isPublished: true },
      { id: "val-3", title: "Innovation", description: "We embrace modern technologies and creative solutions to meet evolving energy needs.", icon: "Lightbulb", orderIdx: 3, isPublished: true },
      { id: "val-4", title: "Professionalism", description: "We execute every project with competence, discipline, and accountability.", icon: "Briefcase", orderIdx: 4, isPublished: true },
      { id: "val-5", title: "Customer-Centricity", description: "Our customers are at the heart of everything we do, and their satisfaction is our priority.", icon: "Users", orderIdx: 5, isPublished: true },
      { id: "val-6", title: "Sustainability", description: "We promote clean energy solutions that protect the environment and create lasting value for future generations.", icon: "Leaf", orderIdx: 6, isPublished: true }
    ],
    timeline: [
      { id: "time-1", year: "2021", title: "Inception in Yankaba, Kano", desc: "Started as a regional distributor of solar mounting systems and high-grade copper cables." },
      { id: "time-2", year: "2023", title: "Launch of Training Academy", desc: "Established certified technical training for solar designers, enrolling over 150 local students." },
      { id: "time-3", year: "2025", title: "Flagship School Projects", desc: "Delivered 14 fully-donor-funded clean grids under the 'Energy for Schools Campaign'." }
    ],
    leadership: [
      { id: "lead-1", name: "Alhaji Ibrahim Musa", position: "Managing Director", department: "Executive", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop", bio: "Musa manages corporate relationships with Nigerian banking partners, steering solar intervention finances.", orderIdx: 1, isPublished: true },
      { id: "lead-2", name: "Engr. Yusuf Bello", position: "Chief Field Engineer", department: "Engineering", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", bio: "Yusuf oversees on-site microgrid deployment, surge protection sizing, and heavy civil mounting works.", orderIdx: 2, isPublished: true }
    ],
    certifications: [
      { 
        id: "cert-1", 
        title: "ISO 9001:2015 Quality Management", 
        authority: "International Standards Org", 
        desc: "Fully accredited for design, assembly, and on-site testing procedures.",
        certNumber: "ISO-9001-2026-QMS-3029",
        standards: "QMS Audit ISO 9001:2015",
        expiry: "May 2028",
        auditFreq: "Annual Surveillance"
      },
      { 
        id: "cert-2", 
        title: "NEMSA Class-A Installation Licence", 
        authority: "Nigerian Electricity Management", 
        desc: "Legally certified to implement grid-tie synchronization and industrial arrays up to 5MW.",
        certNumber: "NEMSA-CLASS-A-4029-NIG",
        standards: "NEMSA Grid-Tie Act 2023",
        expiry: "December 2029",
        auditFreq: "Bi-Annual Inspection"
      }
    ],
    partners: [
      { id: "part-1", name: "Sterling Bank Sunsola", logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop" },
      { id: "part-2", name: "Bank of Industry (BOI) Solar", logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&h=100&fit=crop" }
    ],
    companyInfo: {
      id: "comp-1",
      name: "TAPCO Solar Energy Solutions",
      tagline: "Eradicating Diesel Reliance Through Tier-1 Solar Microgrids",
      overview: "At TAPCO Solar Energy Solutions, we are committed to transforming the way homes, businesses, schools, and institutions across Nigeria access electricity. We provide reliable, cost-effective, and sustainable solar energy systems designed to eliminate the challenges of unreliable grid power and rising energy costs.",
      history: "Founded with a passion for engineering excellence and innovation in Yankaba, Kano in 2021, TAPCO Solar has grown into a leading national clean energy force.",
      whatWeDo: "We design, install, and maintain tier-1 residential solar powerwalls, hybrid industrial grids, and agricultural solar irrigation pumps.",
      logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200",
      phone: "+234 812 000 0000",
      email: "support@tapcosolar.com",
      address: "Plot 105, Corporate Boulevard, Lekki, Lagos, Nigeria"
    },
    founder: {
      id: "founder-1",
      name: "Engr. Louis Olosunde, M.Sc",
      position: "Founder & CEO",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
      bio: "Engr. Louis Olosunde is a veteran renewable energy architect with over 12 years of structural engineering and microgrid deployment experience across West Africa. He holds a Master's degree in Renewable Energy Systems and is a certified COREN member.",
      message: "Our absolute mission is to provide clean, silent, and maintenance-free solar stations engineered to operate perfectly in high-temperature environments. We're replacing erratic power systems, one community at a time.",
      twitter: "https://twitter.com/tapcosolar",
      linkedin: "https://linkedin.com/company/tapcosolar",
      email: "olosundelouis@gmail.com"
    },
    aboutSections: [
      { id: "sec-1", title: "2021: Inception in Yankaba, Kano", content: "Started as a regional distributor of solar mounting systems and high-grade copper cables.", image: "", orderIdx: 1, isPublished: true },
      { id: "sec-2", title: "2023: Launch of Training Academy", content: "Established certified technical training for solar designers, enrolling over 150 local students.", image: "", orderIdx: 2, isPublished: true },
      { id: "sec-3", title: "2025: Flagship School Projects", content: "Delivered 14 fully-donor-funded clean grids under the 'Energy for Schools Campaign'.", image: "", orderIdx: 3, isPublished: true }
    ],
    staffMembers: [
      { id: "staff-1", name: "Mrs. Chioma Nwachukwu", position: "Head of Customer Experience", department: "Support", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop", bio: "Chioma coordinates client grid telemetry, off-grid audits, and warranty scheduling.", orderIdx: 1, isPublished: true },
      { id: "staff-2", name: "Muhammadu Lawal", position: "Senior Solar Designer", department: "Engineering", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop", bio: "Lawal designs complex hybrid string configurations and CAD roof sizing templates.", orderIdx: 2, isPublished: true }
    ]
  };
  const [aboutData, setAboutData] = useState<AboutCMSData>(() => {
    const loaded = loadInitial("tapco_cms_about", defaultAbout);
    if (loaded && loaded.profileDesc && loaded.profileDesc.includes("Yankaba, Kano")) {
      return defaultAbout;
    }
    return loaded;
  });

  // 9. Services List
  const defaultServices: ServiceCMSItem[] = [
    {
      id: "srv-1",
      title: "Solar Panel Installation",
      desc: "Transform your energy use with expert solar panel installation, delivering clean, cost-effective power for your home or business.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80",
      details: ["Precision Shading Analysis with 3D shadow mapping", "High-Efficiency Tier-1 Monocrystalline modules", "Custom wind-resistant aluminum roof mount structures", "Engineered DC cabling and weatherproof combiner grids"],
      benefit: "Reduces dependency on the grid by up to 100%, yielding massive lifetime savings.",
      isPublished: true,
      seoTitle: "Best Solar Panel Installation Kano Lagos Nigeria - TAPCO Solar",
      seoDesc: "Professional tier-1 solar panel installation by NEMSA licensed engineers. Symmetrical roof brackets and weatherproof DC grids."
    },
    {
      id: "srv-2",
      title: "Battery Backup Services",
      desc: "Ensure energy access with our solar battery backup installation, keeping your home or business powered even during outages.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
      details: ["High-cycle LiFePO4 battery banks", "Built-in smart Battery Management Systems (BMS)", "Automatic Transfer Switch (ATS) for instantaneous sub-second failover", "Intelligent load prioritisation"],
      benefit: "Provides absolute energy security and continuity during outages.",
      isPublished: true
    },
    {
      id: "srv-3",
      title: "EV Charger Installation",
      desc: "Charge your electric vehicle conveniently and efficiently with our professional EV charger installation tailored to your home.",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
      details: ["Level 2 high-speed smart EV chargers", "Solar-routing logic to charge on excess generation", "Safe weatherproof outdoor-rated mounts", "Built-in overcurrent/surge protection"],
      benefit: "Power your electric vehicle directly from pure sunshine, zero emissions.",
      isPublished: true
    }
  ];
  const [servicesList, setServicesList] = useState<ServiceCMSItem[]>(() => loadInitial("tapco_cms_services", defaultServices));

  // 10. Projects CMS (Solar Power Grids)
  const defaultProjects: Project[] = INITIAL_PROJECTS;
  const [projectsList, setProjectsList] = useState<Project[]>(() => loadInitial("tapco_cms_projects", defaultProjects));

  // 10b. Solar Packages CMS
  const [solarPackages, setSolarPackages] = useState<SolarPackage[]>(() => {
    const stored = localStorage.getItem("tapco_cms_solar_packages");
    if (!stored) {
      import("../data").then(m => {
        setSolarPackages(m.SOLAR_PACKAGES);
        localStorage.setItem("tapco_cms_solar_packages", JSON.stringify(m.SOLAR_PACKAGES));
      });
      return [];
    }
    return JSON.parse(stored);
  });

  // 11. Products / Catalog & Warehousing
  const defaultProducts: ProductItem[] = INITIAL_PRODUCTS;
  const [productsList, setProductsList] = useState<ProductItem[]>(() => loadInitial("tapco_cms_products", defaultProducts));

  // 12. Orders Ledger
  const defaultOrders: Order[] = INITIAL_ORDERS;
  const [ordersList, setOrdersList] = useState<Order[]>(() => loadInitial("tapco_cms_orders", defaultOrders));

  // 13. Coupons List
  const defaultCoupons = [
    { code: "TAPCO_SUN_10", discount: 10, isActive: true },
    { code: "KANO_ACADEMY_15", discount: 15, isActive: true },
    { code: "GREEN_BUILD_20", discount: 20, isActive: false }
  ];
  const [couponsList, setCouponsList] = useState(() => loadInitial("tapco_cms_coupons", defaultCoupons));

  // 14. Academy Courses & Students
  const defaultCourses: Course[] = loadInitial("tapco_cms_academy_courses", []); // Handled natively or dynamically
  const [coursesList, setCoursesList] = useState<Course[]>(() => {
    // If local storage is empty, preseed with data.ts
    const stored = localStorage.getItem("tapco_cms_academy_courses");
    if (!stored) {
      import("../data").then(m => {
        setCoursesList(m.COURSES);
        localStorage.setItem("tapco_cms_academy_courses", JSON.stringify(m.COURSES));
      });
      return [];
    }
    return JSON.parse(stored);
  });

  const [studentsList, setStudentsList] = useState<AcademyStudent[]>(() => loadInitial("tapco_cms_academy_students", INITIAL_ACADEMY_STUDENTS));

  // 15. Blog & Resources
  const [blogsList, setBlogsList] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem("tapco_cms_blogs");
    if (!stored) {
      // Lazy load from data
      import("../data").then(m => {
        setBlogsList(m.BLOG_POSTS);
        localStorage.setItem("tapco_cms_blogs", JSON.stringify(m.BLOG_POSTS));
      });
      return [];
    }
    return JSON.parse(stored);
  });

  const defaultDownloads = [
    { id: "dl-1", name: "TAPCO Solar Sizing & Irradiance Workbook", url: "#", category: "worksheets" },
    { id: "dl-2", name: "LiFePO4 Powerwall Technical Datasheers", url: "#", category: "catalogs" },
    { id: "dl-3", name: "Corporate Clean Energy Tax Incentives PDF", url: "#", category: "guides" }
  ];
  const [downloadsList, setDownloadsList] = useState(() => loadInitial("tapco_cms_downloads", defaultDownloads));

  // 16. Popups CMS
  const defaultPopups: PopupConfig[] = [
    {
      id: "popup-1",
      title: "Holiday Solar Coupon Banner",
      headline: "Save 10% Off Premium LFP Storage",
      description: "Secure your home with a noise-free TAPCO Premium Hybrid System. Enter code TAPCO_SUN_10 at checkout.",
      buttonText: "Shop Solar Batteries",
      buttonLink: "#",
      isActive: true,
      targetPages: ["home", "store"],
      closeBehaviour: "once"
    }
  ];
  const [popupsList, setPopupsList] = useState<PopupConfig[]>(() => loadInitial("tapco_cms_popups", defaultPopups));

  // 17. Live logs and queues
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>(() => loadInitial("tapco_cms_quotes_queue", []));
  const [bookingsList, setBookingsList] = useState<SiteInspectionBooking[]>(() => loadInitial("tapco_cms_bookings_queue", []));
  const [customersList, setCustomersList] = useState<Customer[]>(() => loadInitial("tapco_cms_customers", INITIAL_CUSTOMERS));
  const [leadsList, setLeadsList] = useState<Lead[]>(() => loadInitial("tapco_cms_leads", INITIAL_LEADS));
  const [supportTicketsList, setSupportTicketsList] = useState<SupportTicket[]>(() => loadInitial("tapco_cms_support_tickets", INITIAL_TICKETS));

  // 18. Audit Trails Log Database
  const defaultAuditLogs = [
    { id: "LOG-5001", who: "olosundelouis@gmail.com", action: "User Creation", date: "Today, 08:30 AM", ip: "197.210.64.22", device: "MacBook Pro M3", browser: "Chrome v126", location: "Abuja, NG", status: "SUCCESS" },
    { id: "LOG-5003", who: "olosundelouis@gmail.com", action: "Login Success", date: "Yesterday, 09:45 AM", ip: "197.210.88.94", device: "iPhone 15 Pro", browser: "Safari v17.4", location: "Lagos, NG", status: "SUCCESS" }
  ];
  const [auditLogs, setAuditLogs] = useState<any[]>(() => loadInitial("tapco_cms_audit_logs", defaultAuditLogs));

  const addAuditLog = (action: string, who: string, status: "SUCCESS" | "BLOCKED" | "WARNING") => {
    const newLog = {
      id: `LOG-${Math.floor(5000 + Math.random() * 5000)}`,
      who,
      action,
      date: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: "102.89.2.14",
      device: "MacBook Pro M3",
      browser: "Chrome v126",
      location: "Abuja, NG",
      status
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem("tapco_cms_audit_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // 19. Team List
  const defaultTeam: TeamMember[] = [
    { id: "TM-1", name: "Engr. Louis Olosunde", role: "Chief Architect", department: "Engineering", email: "olosundelouis@gmail.com", phone: "09059375492", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", permissions: ["all"] },
    { id: "TM-1b", name: "TAPCO Solar Administrator", role: "Co-Administrator", department: "Executive", email: "tapcosolar@gmail.com", phone: "08120000000", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", permissions: ["all"] },
    { id: "TM-2", name: "Alhaji Ibrahim Musa", role: "Managing Director", department: "Executive", email: "musa@solartech.ng", phone: "08031112222", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop", permissions: ["finance", "crm"] }
  ];
  const [teamList, setTeamList] = useState<TeamMember[]>(() => loadInitial("tapco_cms_team", defaultTeam));

  // 20. Media Library
  const defaultMedia: MediaItem[] = [
    { id: "med-1", name: "Rooftop_Solar_Lagos.jpg", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600", type: "image", size: "1.2 MB", folder: "Home Gallery", tags: ["residential", "installations"], uploadedAt: "2026-06-15" },
    { id: "med-2", name: "TAPCO_Sizing_Calculations.xlsx", url: "#", type: "document", size: "340 KB", folder: "Academy Documents", tags: ["sizing", "spreadsheets"], uploadedAt: "2026-06-20" }
  ];
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>(() => loadInitial("tapco_cms_media", defaultMedia));

  // 21. SEO Settings
  const defaultSEO: SEOSettings[] = [
    { id: "home", title: "Premium Symmetrical Solar Grid Systems Kano Lagos Nigeria - TAPCO Solar Solutions", description: "West Africa's leading commercial solar microgrids and off-grid residential hybrid powerwalls. Highly stable LiFePO4 batteries and tier-1 modules.", keywords: "solar panel Nigeria, solar system kano, lithium battery lagos, off-grid microgrid, clean energy finance", ogTitle: "TAPCO Solar Energy Solutions - Elite Clean Power Grids", ogDescription: "Eradicating diesel reliance across Nigeria with licensed COREN engineers and high-performance hybrid systems.", ogImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200", twitterCard: "summary_large_image" },
    { id: "about", title: "Certified Professional Engineering Profile - About TAPCO Solar", description: "Our NEMSA and REAN certified engineering milestones. We install zero-defect high-yield arrays for major industries.", keywords: "COREN engineers, NEMSA class-A, solar standards Nigeria", ogTitle: "TAPCO Solar - About Our Technical Standard", ogDescription: "West Africa's certified solar contractors, delivering robust wind-resistant structures.", ogImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200", twitterCard: "summary_large_image" }
  ];
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>(() => loadInitial("tapco_cms_seo", defaultSEO));

  const [isLoadedFromServer, setIsLoadedFromServer] = useState(false);

  // Load initial CMS configuration from backend database on mount
  useEffect(() => {
    let active = true;
    const fetchCMS = async () => {
      try {
        const response = await fetch("/api/cms/load");
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data && active) {
            const d = res.data;
            if (d.heroSlides) setHeroSlides(d.heroSlides);
            if (d.servicesList) setServicesList(d.servicesList);
            if (d.projectsList) setProjectsList(d.projectsList);
            if (d.solarPackages) setSolarPackages(d.solarPackages);
            if (d.productsList) setProductsList(d.productsList);
            if (d.ordersList) setOrdersList(d.ordersList);
            if (d.couponsList) setCouponsList(d.couponsList);
            if (d.coursesList) setCoursesList(d.coursesList);
            if (d.studentsList) setStudentsList(d.studentsList);
            if (d.blogsList) setBlogsList(d.blogsList);
            if (d.downloadsList) setDownloadsList(d.downloadsList);
            if (d.popupsList) setPopupsList(d.popupsList);
            if (d.quotesList) setQuotesList(d.quotesList);
            if (d.bookingsList) setBookingsList(d.bookingsList);
            if (d.customersList) setCustomersList(d.customersList);
            if (d.leadsList) setLeadsList(d.leadsList);
            if (d.supportTicketsList) setSupportTicketsList(d.supportTicketsList);
            if (d.teamList) setTeamList(d.teamList);
            if (d.mediaFiles) setMediaFiles(d.mediaFiles);
            if (d.seoSettings) setSeoSettings(d.seoSettings);
            if (d.auditLogs) setAuditLogs(d.auditLogs);
            if (d.aboutData) setAboutData(d.aboutData);
            
            setIsLoadedFromServer(true);
            console.log("TAPCO Solar CMS successfully synchronized from persistent server-side database.");
          }
        }
      } catch (err) {
        console.error("Failed to load CMS from server:", err);
      }
    };
    fetchCMS();
    return () => {
      active = false;
    };
  }, []);

  // Bulk save changes to local storage and backend on trigger
  const saveAllData = async () => {
    try {
      localStorage.setItem("tapco_cms_hero_slides", JSON.stringify(heroSlides));
      localStorage.setItem("tapco_cms_trust_stats", JSON.stringify(trustStats));
      localStorage.setItem("tapco_cms_company_intro", JSON.stringify(companyIntro));
      localStorage.setItem("tapco_cms_why_us", JSON.stringify(whyUsItems));
      localStorage.setItem("tapco_cms_section_order", JSON.stringify(sectionOrder));
      localStorage.setItem("tapco_cms_partners", JSON.stringify(partnersList));
      localStorage.setItem("tapco_cms_about", JSON.stringify(aboutData));
      localStorage.setItem("tapco_cms_services", JSON.stringify(servicesList));
      localStorage.setItem("tapco_cms_projects", JSON.stringify(projectsList));
      localStorage.setItem("tapco_cms_solar_packages", JSON.stringify(solarPackages));
      localStorage.setItem("tapco_cms_products", JSON.stringify(productsList));
      localStorage.setItem("tapco_cms_orders", JSON.stringify(ordersList));
      localStorage.setItem("tapco_cms_coupons", JSON.stringify(couponsList));
      localStorage.setItem("tapco_cms_academy_courses", JSON.stringify(coursesList));
      localStorage.setItem("tapco_cms_academy_students", JSON.stringify(studentsList));
      localStorage.setItem("tapco_cms_blogs", JSON.stringify(blogsList));
      localStorage.setItem("tapco_cms_downloads", JSON.stringify(downloadsList));
      localStorage.setItem("tapco_cms_popups", JSON.stringify(popupsList));
      localStorage.setItem("tapco_cms_quotes_queue", JSON.stringify(quotesList));
      localStorage.setItem("tapco_cms_bookings_queue", JSON.stringify(bookingsList));
      localStorage.setItem("tapco_cms_customers", JSON.stringify(customersList));
      localStorage.setItem("tapco_cms_leads", JSON.stringify(leadsList));
      localStorage.setItem("tapco_cms_support_tickets", JSON.stringify(supportTicketsList));
      localStorage.setItem("tapco_cms_team", JSON.stringify(teamList));
      localStorage.setItem("tapco_cms_media", JSON.stringify(mediaFiles));
      localStorage.setItem("tapco_cms_seo", JSON.stringify(seoSettings));

      if (isLoadedFromServer) {
        await fetch("/api/cms/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heroSlides, trustStats, companyIntro, whyUsItems, sectionOrder, partnersList,
            aboutData, servicesList, projectsList, solarPackages, productsList, ordersList, couponsList,
            coursesList, studentsList, blogsList, downloadsList, popupsList, quotesList,
            bookingsList, customersList, leadsList, supportTicketsList, teamList, mediaFiles,
            seoSettings, auditLogs
          })
        });
      }
    } catch (e) {
      console.error("Failed to commit CMS data state to storage:", e);
    }
  };

  // Sync state triggers
  useEffect(() => {
    saveAllData();
  }, [
    heroSlides, trustStats, companyIntro, whyUsItems, sectionOrder, partnersList,
    aboutData, servicesList, projectsList, solarPackages, productsList, ordersList, couponsList,
    coursesList, studentsList, blogsList, downloadsList, popupsList, quotesList,
    bookingsList, customersList, leadsList, supportTicketsList, teamList, mediaFiles, seoSettings,
    isLoadedFromServer
  ]);

  const resetToDefaults = async () => {
    localStorage.clear();
    setHeroSlides(defaultSlides);
    setTrustStats(defaultStats);
    setCompanyIntro(defaultIntro);
    setWhyUsItems(defaultWhyUs);
    setSectionOrder(defaultSectionOrder);
    setPartnersList(defaultPartners);
    setAboutData(defaultAbout);
    setServicesList(defaultServices);
    setProjectsList(defaultProjects);
    setSolarPackages([]);
    setProductsList(defaultProducts);
    setOrdersList(defaultOrders);
    setCouponsList(defaultCoupons);
    setStudentsList(INITIAL_ACADEMY_STUDENTS);
    setDownloadsList(defaultDownloads);
    setPopupsList(defaultPopups);
    setQuotesList([]);
    setBookingsList([]);
    setCustomersList(INITIAL_CUSTOMERS);
    setLeadsList(INITIAL_LEADS);
    setSupportTicketsList(INITIAL_TICKETS);
    setAuditLogs(defaultAuditLogs);
    setTeamList(defaultTeam);
    setMediaFiles(defaultMedia);
    setSeoSettings(defaultSEO);
    
    // Refresh lists from static imports
    import("../data").then(m => {
      setCoursesList(m.COURSES);
      setBlogsList(m.BLOG_POSTS);
      setSolarPackages(m.SOLAR_PACKAGES);
    });

    if (isLoadedFromServer) {
      await fetch("/api/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroSlides: defaultSlides,
          trustStats: defaultStats,
          companyIntro: defaultIntro,
          whyUsItems: defaultWhyUs,
          sectionOrder: defaultSectionOrder,
          partnersList: defaultPartners,
          aboutData: defaultAbout,
          servicesList: defaultServices,
          projectsList: defaultProjects,
          solarPackages: SOLAR_PACKAGES,
          productsList: defaultProducts,
          ordersList: defaultOrders,
          couponsList: defaultCoupons,
          studentsList: INITIAL_ACADEMY_STUDENTS,
          downloadsList: defaultDownloads,
          popupsList: defaultPopups,
          quotesList: [],
          bookingsList: [],
          customersList: INITIAL_CUSTOMERS,
          leadsList: INITIAL_LEADS,
          supportTicketsList: INITIAL_TICKETS,
          teamList: defaultTeam,
          mediaFiles: defaultMedia,
          seoSettings: defaultSEO,
          auditLogs: defaultAuditLogs
        })
      });
    }
  };

  return (
    <CMSContext.Provider value={{
      heroSlides, setHeroSlides,
      trustStats, setTrustStats,
      companyIntro, setCompanyIntro,
      whyUsItems, setWhyUsItems,
      partnersList, setPartnersList,
      ctaHeadline, setCtaHeadline,
      ctaDescription, setCtaDescription,
      ctaButtonText, setCtaButtonText,
      sectionOrder, setSectionOrder,

      aboutData, setAboutData,
      servicesList, setServicesList,
      projectsList, setProjectsList,
      solarPackages, setSolarPackages,
      productsList, setProductsList,
      ordersList, setOrdersList,
      couponsList, setCouponsList,

      coursesList, setCoursesList,
      studentsList, setStudentsList,

      blogsList, setBlogsList,
      downloadsList, setDownloadsList,

      popupsList, setPopupsList,

      quotesList, setQuotesList,
      bookingsList, setBookingsList,
      customersList, setCustomersList,
      leadsList, setLeadsList,
      supportTicketsList, setSupportTicketsList,

      auditLogs, setAuditLogs, addAuditLog,
      teamList, setTeamList,
      mediaFiles, setMediaFiles,
      seoSettings, setSeoSettings,

      saveAllData,
      resetToDefaults
    }}>
      {children}
    </CMSContext.Provider>
  );
};
