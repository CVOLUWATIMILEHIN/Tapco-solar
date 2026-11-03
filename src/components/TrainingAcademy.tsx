/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent, useEffect } from "react";
import { 
  GraduationCap, Flame, Trophy, Sun, Moon, User, ArrowLeft, 
  ShieldCheck, Clock, BookOpen
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCMS } from "../context/CMSContext";
import { Course, StudentProfile } from "../types";

// Import modular subcomponents
import AcademyLanding from "./AcademyLanding";
import AcademyDashboard from "./AcademyDashboard";
import AcademyClassroom from "./AcademyClassroom";
import AcademyCourseDetails from "./AcademyCourseDetails";
import AcademyEnrollmentWizard from "./AcademyEnrollmentWizard";

// Extrapolated courses with richer metadata for the Premium Academy catalogue
const ACADEMY_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Professional Solar PV System Design & Sizing",
    category: "Design",
    instructor: "Engr. Louis Olosunde, M.Sc (Renewable Energy)",
    instructorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    duration: "4 Weeks",
    lessonsCount: 5,
    studentsEnrolled: 342,
    price: 199,
    originalPrice: 249,
    discountBadge: "Save 20%",
    rating: 4.9,
    skillLevel: "Intermediate",
    trainingMode: "Hybrid",
    coverImage: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
    certificateBadge: "NERC Certified",
    startDate: "July 15, 2026",
    seatsRemaining: 12,
    schedule: "Saturdays 10:00 AM - 2:00 PM (Lagos time)",
    description: "Master the science of precise solar sizing. Learn load calculations, thermal derating, panel layout optimization, and hybrid inverter configuration matching.",
    lessons: [
      {
        id: "c1-l1",
        title: "Introduction to Solar Photovoltaic Systems",
        duration: "18 mins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Learn the fundamentals of photovoltaic conversion, solar irradiance maps, and core system topologies (off-grid, on-grid, and smart hybrid systems).",
        materials: ["Module 1 Guide.pdf", "Irradiance Coefficients.xlsx"]
      },
      {
        id: "c1-l2",
        title: "Accurate Load Calculation & Sizing Worksheets",
        duration: "25 mins",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        description: "Detailed walkthrough of calculating appliance watts, continuous vs surge startup loads, and designing balanced energy budgets.",
        materials: ["Load Estimator Template.xlsx", "Surge Multiplier Reference Chart.pdf"]
      },
      {
        id: "c1-l3",
        title: "Selecting Inverters & MPPT Charging Technologies",
        duration: "22 mins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Examine inverter duty cycle sizing, voltage ranges, and optimizing MPPT PV-string series-parallel configurations.",
        materials: ["MPPT Sizing Formulas.pdf"]
      },
      {
        id: "c1-l4",
        title: "Designing Lithium & Lead-Acid Battery Storage",
        duration: "30 mins",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        description: "Deep dive into battery chemistry safety, depth of discharge (DoD), temperature coefficients, and battery management systems (BMS).",
        materials: ["BMS Integration Manual.pdf", "Thermal Derating Table.pdf"]
      },
      {
        id: "c1-l5",
        title: "Solar Design Project & Assessment Guidelines",
        duration: "15 mins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Complete your final solar PV layout blueprint. Submit your schematics for instructor grading.",
        materials: ["Final Project Guidelines.pdf", "TAPCO CAD Template.dwg"]
      }
    ],
    quizzes: [
      {
        id: "c1-q1",
        question: "Which of the following describes the function of an MPPT controller?",
        options: [
          "It converts DC to AC electricity directly.",
          "It dynamically matches PV output to optimize charge currents.",
          "It cools the battery during high charge states.",
          "It regulates the home appliance grid frequency."
        ],
        correctAnswer: 1
      },
      {
        id: "c1-q2",
        question: "What is the typical multiplier range for an inductive electric motor startup surge?",
        options: [
          "1.0x to 1.2x",
          "1.5x to 2.0x",
          "3.0x to 5.0x",
          "10.0x to 15.0x"
        ],
        correctAnswer: 2
      },
      {
        id: "c1-q3",
        question: "Why are LiFePO4 batteries preferred over standard Lead-Acid batteries in modern systems?",
        options: [
          "They have shorter cycle life.",
          "They are much heavier and structurally sound.",
          "They offer deeper Depth of Discharge (DoD) up to 90% without capacity loss.",
          "They require manual acid level topping every month."
        ],
        correctAnswer: 2
      }
    ],
    outcomes: [
      "Perform accurate appliance load auditing and continuous/surge current analysis.",
      "Design string layout diagrams with appropriate series-parallel wiring configurations.",
      "Size lithium iron phosphate (LiFePO4) battery banks based on DoD & temperature coefficients.",
      "Prepare comprehensive system schematics and bills of materials for client proposals."
    ],
    requirements: [
      "Basic understanding of electrical concepts (Voltage, Current, Power, Resistance).",
      "A laptop or computer capable of running basic spreadsheet software.",
      "Passion for renewable energy technology and sustainable engineering."
    ],
    faqs: [
      { question: "Do I get a physical certificate?", answer: "Yes, you will receive a verifiable digital smart certificate containing a custom QR code immediately, and a high-quality printed diploma upon graduation." },
      { question: "Is this course accredited?", answer: "Yes, our curriculum framework is accredited under NERC and NEMSA solar engineering standards." }
    ],
    reviews: [
      { studentName: "Musa Abubakar", rating: 5, date: "June 10, 2026", comment: "The structural sizing spreadsheets and live workbench simulations were absolutely brilliant. I highly recommend this to anyone entering the solar field.", initial: "M" },
      { studentName: "Adeola Balogun", rating: 5, date: "May 25, 2026", comment: "Outstanding content! Engr. Louis is extremely practical and answers every engineering question thoroughly.", initial: "A" }
    ]
  },
  {
    id: "course-2",
    title: "Advanced Solar Installation, Wiring & Safety Standards",
    category: "Installation",
    instructor: "Alhaji Ibrahim Musa, Senior Solar Field Engineer",
    instructorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    duration: "5 Weeks",
    lessonsCount: 4,
    studentsEnrolled: 219,
    price: 249,
    originalPrice: 299,
    discountBadge: "Save 16%",
    rating: 4.8,
    skillLevel: "Advanced",
    trainingMode: "Physical",
    coverImage: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&q=80",
    certificateBadge: "NEMSA Approved",
    startDate: "July 20, 2026",
    seatsRemaining: 8,
    schedule: "Tuesdays & Thursdays 9:00 AM - 4:00 PM (TAPCO Workshop)",
    description: "A complete hands-on guide to physical solar installations. Learn panel mounting engineering, DC string wiring, earthing/lightning protection, and smart commissioning.",
    lessons: [
      {
        id: "c2-l1",
        title: "Structural Engineering: Mounting Racks & Roof Penetration",
        duration: "24 mins",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        description: "Master physical roof anchoring, angle calculations for latitude optimization, and wind-load balancing.",
        materials: ["Roof Anchoring Guide.pdf", "Wind Load Coefficients.pdf"]
      },
      {
        id: "c2-l2",
        title: "High-Voltage DC Wiring, Crimping & Combiner Boxes",
        duration: "28 mins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Learn proper cable routing, secure crimping using MC4 connectors, and building weatherproof combiners.",
        materials: ["MC4 Safety Best Practices.pdf", "Combiner Diagram.png"]
      },
      {
        id: "c2-l3",
        title: "Earthing, Grounding & AC/DC Surge Protective Devices (SPD)",
        duration: "20 mins",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        description: "Crucial safety lesson. Design adequate earthing grids, connect copper ground rods, and configure lightning surge protectors.",
        materials: ["NEC Grounding Rules.pdf"]
      },
      {
        id: "c2-l4",
        title: "System Startup, Commissioning, and Load Testing",
        duration: "19 mins",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Step-by-step procedure to safely power up hybrid systems, program battery profiles, and perform mock load tests.",
        materials: ["Commissioning Checklist.docx"]
      }
    ],
    quizzes: [
      {
        id: "c2-q1",
        question: "Which component protects a solar system from lightning-induced voltage surges?",
        options: [
          "Bypass diode",
          "AC/DC Surge Protective Device (SPD)",
          "Anodized aluminum mounting bracket",
          "MPPT charging controller"
        ],
        correctAnswer: 1
      },
      {
        id: "c2-q2",
        question: "When connecting panels in series, what happens to the total voltage and current?",
        options: [
          "Voltage increases, current stays the same",
          "Current increases, voltage stays the same",
          "Both voltage and current double",
          "Both voltage and current stay completely unchanged"
        ],
        correctAnswer: 0
      }
    ],
    outcomes: [
      "Install physical solar roof racks and ground mounting structural supports safely.",
      "Perform professional DC crimping, MC4 connector assembly, and combiner box wiring.",
      "Design adequate earthing grids, ground rods, and configure lightning surge protection.",
      "Execute safe system startups, program inverter charging profiles, and run load diagnostics."
    ],
    requirements: [
      "Completion of the TAPCO Solar Sizing course or basic electrical background.",
      "Appropriate footwear (work boots) for practical workshop laboratory sessions.",
      "Familiarity with standard electrical hand tools and digital multimeters."
    ],
    faqs: [
      { question: "Where do physical classes take place?", answer: "Physical workshops are hosted at the TAPCO Training Workshop equipped with modular training benches." },
      { question: "Are materials provided?", answer: "Yes, we provide all training kits, MC4 crimping tools, cables, and hybrid inverter workbench access." }
    ],
    reviews: [
      { studentName: "Chinedu Okechukwu", rating: 5, date: "June 15, 2026", comment: "Excellent hands-on experience! We actually wired a hybrid system and programmed three different inverter configurations.", initial: "C" }
    ]
  },
  {
    id: "course-3",
    title: "Industrial Microgrids & Utility-Scale Sizing",
    category: "Design",
    instructor: "Dr. Chidi Obi, Chief Grid Sizing Architect",
    instructorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    duration: "6 Weeks",
    lessonsCount: 6,
    studentsEnrolled: 184,
    price: 349,
    originalPrice: 399,
    discountBadge: "Specialist Rate",
    rating: 5.0,
    skillLevel: "Advanced",
    trainingMode: "Hybrid",
    coverImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    certificateBadge: "NERC Grid Specialization",
    startDate: "August 01, 2026",
    seatsRemaining: 15,
    schedule: "Fridays 3:00 PM - 7:00 PM (Online + 1 Weekend Lab)",
    description: "Design multi-megawatt solar configurations, three-phase commercial hybrid power balancing, transformer derating, and high-voltage grid integrations.",
    lessons: [
      { id: "c3-l1", title: "Industrial Three-Phase Vector Group Sizing", duration: "25 mins", videoUrl: "https://www.w3schools.com/html/movie.mp4", description: "Configuring delta-star grid couplings and balanced load distribution rules.", materials: ["3-Phase Vector Manual.pdf"] },
      { id: "c3-l2", title: "MW-Scale Battery Container Safety & HVAC", duration: "30 mins", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", description: "BMS thermal runaway management in localized container bays.", materials: ["Battery Container Sizing.pdf"] }
    ],
    quizzes: [
      { id: "c3-q1", question: "Which vector group is most common for solar grid-tied step-up transformers?", options: ["Dyn11", "Yy0", "Dd0", "Dz11"], correctAnswer: 0 }
    ],
    outcomes: [
      "Model large-scale commercial solar arrays on rooftop blueprints and ground structures.",
      "Understand three-phase load balancing, transformer derating, and vector groups.",
      "Design utility-scale lithium container banks with localized thermal management systems.",
      "Conform designs to NERC utility integration and net-metering regulatory codes."
    ],
    requirements: [
      "Prior solar PV design experience or an electrical engineering diploma/degree.",
      "A computer with reliable internet capable of running PV simulation software.",
      "Familiarity with three-phase power equations and basic transformer models."
    ],
    faqs: [
      { question: "Is software training included?", answer: "Yes, we teach layout drafting, shade analysis, and output yield projections with industry software." }
    ],
    reviews: [
      { studentName: "Fatima Yusuf", rating: 5, date: "May 12, 2026", comment: "The segment on three-phase vector balancing alone is worth the entire course fee. Truly graduate-level solar training.", initial: "F" }
    ]
  },
  {
    id: "course-4",
    title: "Renewable Energy Entrepreneurship & Solar Business",
    category: "Solar Business",
    instructor: "Mrs. Toyin Adebayo, Founder SolarCapital",
    instructorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
    duration: "3 Weeks",
    lessonsCount: 3,
    studentsEnrolled: 145,
    price: 149,
    originalPrice: 199,
    discountBadge: "Save 25%",
    rating: 4.7,
    skillLevel: "Beginner",
    trainingMode: "Online",
    coverImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    certificateBadge: "Entrepreneurship Certificate",
    startDate: "July 25, 2026",
    seatsRemaining: 25,
    schedule: "Self-paced with weekly live mentorship on Wednesday evenings",
    description: "Learn to build a profitable solar enterprise. Master bidding, project pitching, sourcing premium tier-1 components, and structuring financing models like Pay-As-You-Go.",
    lessons: [
      { id: "c4-l1", title: "Structuring Pay-As-You-Go (PAYG) Models", duration: "20 mins", videoUrl: "https://www.w3schools.com/html/movie.mp4", description: "Learn consumer financing structures, rent-to-own credit risks, and mobile money ledger integrations.", materials: ["PAYG Business Model.pdf"] },
      { id: "c4-l2", title: "RFP Bidding & Pitching for Mini-Grids", duration: "25 mins", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Drafting competitive proposals for governmental mini-grid tenders and international solar grants.", materials: ["Sample Solar Proposal Template.docx"] }
    ],
    quizzes: [
      { id: "c4-q1", question: "Which billing model is most suited for low-income rural electrification setups?", options: ["Flat upfront fee", "Power Purchase Agreement (PPA) / PAYG", "Post-paid manual invoicing"], correctAnswer: 1 }
    ],
    outcomes: [
      "Develop a robust business plan for establishing a regional solar consultation or installation enterprise.",
      "Understand leasing structures, consumer financing, and Power Purchase Agreements (PPAs).",
      "Draft competitive bidding proposals for residential developments and government microgrid projects.",
      "Secure wholesale trade agreements and reliable supply chains for tier-1 solar inverters and cells."
    ],
    requirements: [
      "No technical engineering background required; ideal for business development enthusiasts and contractors.",
      "Basic business math understanding and access to standard communication software."
    ],
    faqs: [
      { question: "Are actual bidding templates provided?", answer: "Yes, you will download editable proposal drafts, pricing calculators, and legal contracts." }
    ],
    reviews: [
      { studentName: "Kofi Mensah", rating: 5, date: "June 22, 2026", comment: "I learned how to write solar project pitches. Just landed a major residential estate contract following Mrs. Toyin's formulas!", initial: "K" }
    ]
  }
];

export default function TrainingAcademy({ onPortalActiveChange }: { onPortalActiveChange?: (isActive: boolean) => void }) {
  const { coursesList } = useCMS();
  const currentCourses = coursesList && coursesList.length > 0 ? coursesList : ACADEMY_COURSES;

  // Navigation & View controllers
  const [currentView, setCurrentView] = useState<"landing" | "course-details" | "classroom" | "dashboard" | "instructor" | "admin">("landing");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("course-1");
  const [dashboardTab, setDashboardTab] = useState<"home" | "courses" | "certificates" | "assignments" | "downloads" | "live" | "community" | "messages" | "achievements" | "simulator" | "payments" | "settings">("home");
  
  // Theme state: default to Light Mode as per branding instructions!
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Portal active evaluation
  const isPortalActive = currentView === "dashboard" || currentView === "classroom" || currentView === "instructor" || currentView === "admin";

  useEffect(() => {
    if (onPortalActiveChange) {
      onPortalActiveChange(isPortalActive);
    }
    return () => {
      if (onPortalActiveChange) {
        onPortalActiveChange(false);
      }
    };
  }, [isPortalActive, onPortalActiveChange]);

  // Authentication & Profile states
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Classroom Player states
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);
  const [classroomNotes, setClassroomNotes] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // Interactive Sizing Game State
  const [simulatorGoal] = useState({
    clinic: "Enugu Regional Healthcare Outpost",
    loadRequirement: 4000,
    dailyEnergyUsage: 13000,
    sunHours: 5
  });
  const [selectedPanelType, setSelectedPanelType] = useState<string>("");
  const [selectedInverterType, setSelectedInverterType] = useState<string>("");
  const [selectedBatteryType, setSelectedBatteryType] = useState<string>("");
  const [cablesConnected, setCablesConnected] = useState<boolean>(false);
  const [simulatorMessage, setSimulatorMessage] = useState<{ status: "idle" | "success" | "error"; text: string }>({ status: "idle", text: "" });

  // AI Tutor Integration States
  const [chatMessage, setChatMessage] = useState("");
  const [aiHistory, setAiHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hello! I am your TAPCO Solar Academy AI Tutor. Sizing calculations can be tricky. Ask me about battery depths, continuous surges, three-phase groups or vector couplings!" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Gamification & Log State
  const [xpPoints, setXpPoints] = useState<number>(1420);
  const [streakDays, setStreakDays] = useState<number>(8);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(["Solar Pioneer", "Load Master"]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Webinars State
  const [academyWebinars] = useState([
    { id: "webinar-1", title: "MW-Scale Industrial Microgrid Protection Coordination", date: "July 05, 2026 - 4:00 PM (GMT+1)", instructor: "Dr. Chidi Obi", status: "Upcoming" },
    { id: "webinar-2", title: "Bank of Industry (BoI) Solar Project Pitching Procedures", date: "July 12, 2026 - 2:00 PM (GMT+1)", instructor: "Mrs. Toyin Adebayo", status: "Upcoming" }
  ]);
  const [activeBroadcastWebinar, setActiveBroadcastWebinar] = useState<string | null>(null);
  const [webinarChatText, setWebinarChatText] = useState("");
  const [webinarChatHistory, setWebinarChatHistory] = useState([
    { sender: "System", text: "Interactive stream sync online. Low-latency broadcast connected." },
    { sender: "Ibrahim (Abuja)", text: "Good afternoon! Excited for this advanced session." },
    { sender: "Funmi (Lagos)", text: "Will we get vector drawing sheets after the lecture?" }
  ]);

  const [adminStudents] = useState([
    { id: "std-707", name: "Chinedu Okechukwu", email: "chinedu.solar@gmail.com", studentId: "TAPCO-2026-7077", course: "Professional Solar PV System Design", progress: 65, certified: false },
    { id: "std-102", name: "Halima Ibrahim", email: "halima.ib@gmail.com", studentId: "TAPCO-2026-1024", course: "Industrial Microgrids & Utility-Scale Sizing", progress: 100, certified: true }
  ]);

  const selectedCourse = currentCourses.find(c => c.id === selectedCourseId) || currentCourses[0];

  // Demo Student Profile Loader
  const handleLoadDemoStudent = () => {
    const demoStudent: StudentProfile = {
      id: "std-707",
      name: "Chinedu Okechukwu",
      email: "chinedu.solar@gmail.com",
      studentId: "TAPCO-2026-7077",
      enrolledCourseId: "course-1",
      completedLessons: ["c1-l1"],
      quizScores: {},
      isGraduated: false,
      registrationDate: "June 05, 2026"
    };
    setStudent(demoStudent);
    setCurrentView("dashboard");
    setDashboardTab("home");
    setXpPoints(1850);
    setStreakDays(12);
    setUnlockedBadges(["Solar Pioneer", "Load Master", "Grid Inspector"]);
  };

  // Student Auth Submissions
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newProfile: StudentProfile = {
      id: `std-${Math.floor(100 + Math.random() * 900)}`,
      name: name || email.split("@")[0],
      email: email,
      studentId: `TAPCO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      enrolledCourseId: selectedCourseId,
      completedLessons: [],
      quizScores: {},
      isGraduated: false,
      registrationDate: new Date().toLocaleDateString()
    };

    setStudent(newProfile);
    setIsRegistering(false);
    setCurrentView("dashboard");
    setDashboardTab("home");
  };

  const handleEnrollCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (!student) {
      setIsRegistering(true);
    } else {
      setStudent({
        ...student,
        enrolledCourseId: courseId
      });
      setCurrentView("classroom");
      setActiveLessonIndex(0);
      setIsLessonCompleted(false);
    }
  };

  const toggleWishlist = (courseId: string) => {
    if (wishlist.includes(courseId)) {
      setWishlist(wishlist.filter(id => id !== courseId));
    } else {
      setWishlist([...wishlist, courseId]);
    }
  };

  // Virtual Workbench Simulation Commissioning
  const handleRunSimulatorTest = () => {
    setSimulatorMessage({ status: "idle", text: "" });
    if (!selectedPanelType || !selectedInverterType || !selectedBatteryType) {
      setSimulatorMessage({ status: "error", text: "🔧 Engineering Error: All primary system nodes (PV Array, Smart Inverter, Battery Pack) must be selected before grid bridging." });
      return;
    }
    if (!cablesConnected) {
      setSimulatorMessage({ status: "error", text: "🔌 Grid Alert: Safety breaker open. Connect the DC cables and grid terminals first!" });
      return;
    }

    const isCorrectInverter = selectedInverterType === "inverter-5kva";
    const isCorrectBattery = selectedBatteryType === "battery-3powerwall";
    const isCorrectPanels = selectedPanelType === "panels-10x";

    if (isCorrectInverter && isCorrectBattery && isCorrectPanels) {
      setSimulatorMessage({
        status: "success",
        text: "🟢 COMMISSIONING SUCCESSFUL! Your 4.5kW Panel Array matched with a 5kVA Smart Hybrid Inverter and 14.4kWh Lithium-LFP bank is perfectly balanced. Operating efficiency is 96.4%. You earned +250 XP & 'Simulator Architect' badge!"
      });
      setXpPoints(prev => prev + 250);
      if (!unlockedBadges.includes("Simulator Architect")) {
        setUnlockedBadges([...unlockedBadges, "Simulator Architect"]);
      }
    } else {
      let mismatchMsg = "🔴 BALANCE CONVERGENCE FAIL: ";
      if (!isCorrectPanels) mismatchMsg += "The selected PV Array does not balance the Enugu clinic daylight requirements. ";
      if (!isCorrectInverter) mismatchMsg += "The selected inverter continuous threshold trips on compressor starting surges. ";
      if (!isCorrectBattery) mismatchMsg += "The battery storage depth leads to deep cell drainage cycles overnight. ";
      mismatchMsg += "Recalculate continuous watt guidelines and restart commissioning.";
      setSimulatorMessage({ status: "error", text: mismatchMsg });
    }
  };

  // AI Tutor Server-Side Integration Call
  const handleSendAiMessage = async (e?: FormEvent, quickPrompt?: string) => {
    if (e) e.preventDefault();
    const promptText = quickPrompt || chatMessage;
    if (!promptText.trim()) return;

    const userMsg = { role: "user" as const, content: promptText };
    setAiHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Solar Academy Student]: ${promptText}. Respond as a professional, encouraging tutor.`,
          history: aiHistory
        })
      });

      const data = await res.json();
      if (data.reply) {
        setAiHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
        setXpPoints(prev => prev + 15);
      } else {
        setAiHistory(prev => [...prev, { role: "assistant", content: "Continuous load calculation balance: Total Wh = Watts * Hours. For safe margins apply a 1.25x safety multiplier. Ask me another calculation topic!" }]);
      }
    } catch (err) {
      setAiHistory(prev => [...prev, { role: "assistant", content: "Load Sizing guideline: Battery Wh size = (Load Wh / Depth of Discharge) * Safety Factor. Let me know if you would like me to detail wiring blueprints." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const paddingClass = "px-6 md:px-12 lg:px-[72px] xl:px-[96px]";

  return (
    <div id="tapco-academy-root" className="w-full bg-white text-[#0F172A] min-h-screen font-sans transition-colors duration-300 relative pb-20">
      
      {/* GLOBAL HEADER (Hides in public mode to prevent double headers with site nav) */}
      {isPortalActive && (
        <header className="sticky top-0 z-40 border-b bg-white border-[#E2E8F0] backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0057B8] to-[#00A651] text-white font-bold shadow">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <div className="text-left">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-1.5 leading-none">
                TAPCO <span className="text-[#00A651] font-black font-mono">SOLAR ACADEMY</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">AFRICA PRO</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-450 font-bold mt-1">Renewable Energy Training & Certification Hub</p>
            </div>
          </div>

          {/* Global Toolbar */}
          <div className="flex items-center gap-3">
            {/* Gamification Indicator */}
            {student && (
              <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[#E2E8F0] text-xs font-bold bg-white shadow-inner">
                <div className="flex items-center gap-1 text-amber-600">
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>{streakDays}d Streak</span>
                </div>
                <div className="flex items-center gap-1 text-[#00A651]">
                  <Trophy className="h-4 w-4 text-[#00A651]" />
                  <span>{xpPoints} XP</span>
                </div>
              </div>
            )}

            {/* Role selector */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <button 
                onClick={() => {
                  setCurrentView("landing");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === "landing" || currentView === "dashboard" || currentView === "classroom" || currentView === "course-details"
                    ? "bg-[#0057B8] text-white" 
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>🎓 Student</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentView("instructor");
                  if (!student) handleLoadDemoStudent();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === "instructor" 
                    ? "bg-[#00A651] text-white" 
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>👨‍🏫 Instructor</span>
              </button>
            </div>

            {student ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setCurrentView("dashboard");
                    setDashboardTab("home");
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${currentView === "dashboard" ? "bg-[#0057B8] text-white" : "bg-[#00A651] text-white hover:bg-[#00A651]/95"}`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => setStudent(null)}
                  className="hidden md:block text-xs font-bold hover:underline text-rose-500 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoadDemoStudent}
                className="bg-[#00A651] text-white hover:bg-[#00A651]/95 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm"
              >
                Enter Academy
              </button>
            )}
            
            {/* Exit Workspace */}
            <button 
              onClick={() => {
                setCurrentView("landing");
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-white border border-[#E2E8F0] text-slate-700 hover:bg-[#F8FAFC] hover:text-[#0F172A] flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Return to Public Website"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#0057B8]" />
              <span className="hidden sm:inline">Exit Portal</span>
            </button>

          </div>
        </header>
      )}

      {/* CORE VIEWPORT */}
      <main className="w-full">
        
        {/* VIEW 1: LANDING */}
        {currentView === "landing" && (
          <AcademyLanding 
            courses={currentCourses}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            handleEnrollCourse={handleEnrollCourse}
            setCurrentView={setCurrentView}
            setSelectedCourseId={setSelectedCourseId}
            handleLoadDemoStudent={handleLoadDemoStudent}
            student={student}
            darkMode={darkMode}
          />
        )}

        {/* VIEW 2: COURSE DETAILS */}
        {currentView === "course-details" && (
          <AcademyCourseDetails 
            course={selectedCourse}
            allCourses={currentCourses}
            onBack={() => setCurrentView("landing")}
            onEnroll={(courseId) => handleEnrollCourse(courseId)}
          />
        )}

        {/* VIEW 3: STUDENT DASHBOARD */}
        {currentView === "dashboard" && student && (
          <div className={`w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto ${paddingClass} py-10`}>
            <AcademyDashboard 
              student={student}
              dashboardTab={dashboardTab}
              setDashboardTab={setDashboardTab}
              xpPoints={xpPoints}
              streakDays={streakDays}
              unlockedBadges={unlockedBadges}
              selectedCourse={selectedCourse}
              setCurrentView={setCurrentView}
              setActiveLessonIndex={setActiveLessonIndex}
              
              // Simulator
              simulatorGoal={simulatorGoal}
              selectedPanelType={selectedPanelType}
              setSelectedPanelType={setSelectedPanelType}
              selectedInverterType={selectedInverterType}
              setSelectedInverterType={setSelectedInverterType}
              selectedBatteryType={selectedBatteryType}
              setSelectedBatteryType={setSelectedBatteryType}
              cablesConnected={cablesConnected}
              setCablesConnected={setCablesConnected}
              simulatorMessage={simulatorMessage}
              handleRunSimulatorTest={handleRunSimulatorTest}

              // AI Tutor
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              aiHistory={aiHistory}
              isAiLoading={isAiLoading}
              handleSendAiMessage={handleSendAiMessage}

              // Webinar
              academyWebinars={academyWebinars}
              activeBroadcastWebinar={activeBroadcastWebinar}
              setActiveBroadcastWebinar={setActiveBroadcastWebinar}
              webinarChatText={webinarChatText}
              setWebinarChatText={setWebinarChatText}
              webinarChatHistory={webinarChatHistory}
              setWebinarChatHistory={setWebinarChatHistory}
            />
          </div>
        )}

        {/* VIEW 4: Netflix CLASSROOM */}
        {currentView === "classroom" && student && (
          <div className={`w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto ${paddingClass} py-10`}>
            <AcademyClassroom 
              student={student}
              setStudent={setStudent}
              selectedCourse={selectedCourse}
              activeLessonIndex={activeLessonIndex}
              setActiveLessonIndex={setActiveLessonIndex}
              isLessonCompleted={isLessonCompleted}
              setIsLessonCompleted={setIsLessonCompleted}
              classroomNotes={classroomNotes}
              setClassroomNotes={setClassroomNotes}
              savedNotes={savedNotes}
              setSavedNotes={setSavedNotes}
              xpPoints={xpPoints}
              setXpPoints={setXpPoints}
              darkMode={darkMode}
              setCurrentView={setCurrentView}
              setDashboardTab={setDashboardTab}
            />
          </div>
        )}

        {/* VIEW 5: INSTRUCTOR DESK */}
        {currentView === "instructor" && (
          <div className={`w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto ${paddingClass} py-10 space-y-6 text-left`}>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 text-left">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">👨‍🏫 TAPCO Instructor Desk</h3>
                <p className="text-xs text-[#64748B] font-semibold">Manage curriculums, trainees progress, and webinars calendars.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-left">
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-1 shadow-sm">
                <div className="text-[9px] uppercase font-black text-slate-400">Accredited Specializations</div>
                <div className="text-2xl font-black text-[#0F172A]">4 Active Diplomas</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-1 shadow-sm">
                <div className="text-[9px] uppercase font-black text-slate-400">Total Enrolled Trainees</div>
                <div className="text-2xl font-black text-[#0F172A]">1,420 Active Students</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-1 shadow-sm">
                <div className="text-[9px] uppercase font-black text-slate-400">Commissioned Outposts</div>
                <div className="text-2xl font-black text-[#0F172A]">14 Healthcare Hubs</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm text-left">
              <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Trainee Progress Roster</div>
              <div className="space-y-2">
                {adminStudents.map((std, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center text-xs">
                    <div className="text-left">
                      <div className="font-bold text-[#0F172A]">{std.name}</div>
                      <div className="text-[10px] text-[#64748B] font-semibold">{std.email} • ID: {std.studentId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[#00A651] font-bold">{std.progress}% Done</div>
                      <span className="text-[9px] text-[#64748B] font-extrabold uppercase">{std.certified ? "VERIFIED CONTRACTOR" : "IN TRAINING"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PORTAL REGISTER POPUP (PREMIUM WIZARD) */}
      <AnimatePresence>
        {isRegistering && (
          <AcademyEnrollmentWizard 
            course={selectedCourse}
            onClose={() => setIsRegistering(false)}
            onSuccess={(newProfile) => {
              setStudent(newProfile);
              setIsRegistering(false);
              setCurrentView("dashboard");
              setDashboardTab("home");
              
              // Increment achievements
              setXpPoints(prev => prev + 150);
              if (!unlockedBadges.includes("Solar Pioneer")) {
                setUnlockedBadges([...unlockedBadges, "Solar Pioneer"]);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center border-t text-[10px] font-mono bg-white border-[#E2E8F0] text-[#64748B]">
        <span>© 2026 TAPCO Solar Training Academy. NERC & NEMSA Compliant Curriculum Framework.</span>
      </footer>

    </div>
  );
}
