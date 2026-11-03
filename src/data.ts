/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SolarPackage, Product, Course, BlogPost } from "./types";

export const SOLAR_PACKAGES: SolarPackage[] = [
  {
    id: "pkg-1",
    name: "TAPCO Starter (1kVA)",
    capacity: "1kVA / 1kW",
    price: 1250000,
    description: "Ideal for small apartments, security kiosks, or basic power setups. Keeps your lights, fans, and routers running uninterrupted.",
    specs: {
      panels: "2x 350W Monocrystalline Panels",
      inverter: "1kVA Smart Hybrid Pure Sine Wave Inverter",
      battery: "12V 100Ah LiFePO4 Lithium Battery",
      accessories: "TAPCO High-Grade Roof Mounting Rack, 20m MC4 Solar Cable, DC Disconnect Box"
    },
    suitableFor: [
      "Small apartments / flats",
      "Off-grid security cabins",
      "Emergency lighting system"
    ],
    recommendedAppliances: [
      "5x LED Bulbs (10W each)",
      "2x DC Ceiling Fans (40W each)",
      "1x Internet Router (15W)",
      "1x Laptop Charger (65W)",
      "1x LED TV (60W)"
    ],
    installationTime: "24 - 48 Hours",
    warranty: "3 Years Inverter, 25 Years Panels, 5 Years Battery",
    recommendedUse: "Basic Power Backup"
  },
  {
    id: "pkg-3",
    name: "TAPCO Classic (3kVA)",
    capacity: "3kVA / 3kW",
    price: 3600000,
    description: "The perfect balance for medium-sized homes. Easily powers standard household appliances including refrigerators, LED TVs, and laptops.",
    specs: {
      panels: "6x 450W Premium Monocrystalline Panels",
      inverter: "3kVA Hybrid Smart Inverter with MPPT",
      battery: "24V 150Ah LiFePO4 Lithium Battery Module",
      accessories: "Wind-Resistant Mounting Brackets, 30m Dual Solar Cable, DC/AC Surge Protection"
    },
    suitableFor: [
      "2-3 Bedroom standard residential homes",
      "Small retail shops or pharmacy stores",
      "Branch offices & medical consultation rooms"
    ],
    recommendedAppliances: [
      "10x LED Bulbs (10W each)",
      "4x Ceiling Fans (50W each)",
      "1x Energy-Star Refrigerator (150W)",
      "2x LED TVs (75W each)",
      "1x Microwave (700W - intermittent)",
      "2x Laptops / Phones (100W)"
    ],
    installationTime: "2 - 3 Days",
    warranty: "5 Years Inverter, 25 Years Panels, 10 Years Battery",
    recommendedUse: "Standard Residential Power Autonomy"
  },
  {
    id: "pkg-5",
    name: "TAPCO Premium (5kVA)",
    capacity: "5kVA / 5kW",
    price: 5800000,
    description: "Our bestselling system. Built for modern family villas and medium offices. Supports heavy induction cookers, water pumps, and eco air conditioners.",
    specs: {
      panels: "10x 450W High-Efficiency Half-Cell Panels",
      inverter: "5kVA Multi-core Smart Parallel Hybrid Inverter",
      battery: "48V 100Ah (4.8kWh) Premium Lithium Powerwall",
      accessories: "Industrial Mounting Structure, DC Combiner Box, AC Breaker Panel, Wi-Fi IoT Monitoring Module"
    },
    suitableFor: [
      "Large family homes (4-5 rooms)",
      "Medium business offices",
      "Private medical clinics & diagnostics center"
    ],
    recommendedAppliances: [
      "15x LED Bulbs (10W each)",
      "6x Ceiling Fans (50W each)",
      "1x Double-Door Smart Refrigerator (250W)",
      "1x Domestic Water Pump (1HP - daytime)",
      "1x Inverter Air Conditioner (1.5 Ton - daytime)",
      "Home entertainment systems & washing machines"
    ],
    installationTime: "3 - 4 Days",
    warranty: "5 Years Inverter, 25 Years Panels, 10 Years Battery",
    recommendedUse: "Premium Home & Business Uninterrupted Backup"
  },
  {
    id: "pkg-10",
    name: "TAPCO Pro Commercial (10kVA)",
    capacity: "10kVA / 10kW",
    price: 11500000,
    description: "Heavy-duty commercial system. Designed for luxury estates, manufacturing shops, or schools. Features parallel grid-tie integration.",
    specs: {
      panels: "20x 500W Ultra-Performance Panels",
      inverter: "10kVA Three-Phase Industrial Hybrid Inverter",
      battery: "2x 48V 100Ah (9.6kWh total) Stackable LiFePO4 Rack Batteries",
      accessories: "TAPCO Heavy Ground-Mount or Roof Structure, Rapid Shutdown Switch, Intelligent Smart Energy Meter"
    },
    suitableFor: [
      "Luxury smart estates",
      "Farming machinery / drip irrigation setups",
      "Corporate head offices",
      "School campuses and digital labs"
    ],
    recommendedAppliances: [
      "Full lighting system (30+ LEDs)",
      "8+ Office/Home Fans",
      "2x Inverter Air Conditioners (simultaneous)",
      "Laser printers, plotters, and server racks",
      "Deep well water pumps",
      "Commercial refrigerators & chest freezers"
    ],
    installationTime: "4 - 5 Days",
    warranty: "5 Years Inverter, 25 Years Panels, 10 Years Battery",
    recommendedUse: "High-Performance Business Infrastructure"
  },
  {
    id: "pkg-20",
    name: "TAPCO Industrial (20kVA)",
    capacity: "20kVA / 20kW",
    price: 22000000,
    description: "Designed for school complexes, medical centers, and agricultural hubs. Ensures absolute zero downtime for mission-critical operations.",
    specs: {
      panels: "40x 500W High-Efficiency Monocrystalline Panels",
      inverter: "20kVA Commercial Three-Phase Smart Hybrid Inverter",
      battery: "4x 48V 100Ah (19.2kWh total) Heavy-Duty Stackable Cabinets",
      accessories: "Engineered Mounting Racks, Grid-Tie Parallel Synchronizer, Advanced Fire-Suppressant Cabinet"
    },
    suitableFor: [
      "Educational institutions / colleges",
      "Hospitals and operating rooms",
      "Mid-sized factories or warehouses",
      "Large agricultural storage & cooling plants"
    ],
    recommendedAppliances: [
      "Complete school IT labs (50+ computers)",
      "Multiple industrial cooling rooms",
      "Office buildings with continuous AC & elevator lighting",
      "Agricultural irrigation systems (up to 5HP pumps)"
    ],
    installationTime: "5 - 7 Days",
    warranty: "5 Years Inverter, 25 Years Panels, 10 Years Battery",
    recommendedUse: "Heavy Commercial & Institutional Grid Autonomy"
  },
  {
    id: "pkg-40",
    name: "TAPCO Mega Enterprise (40kVA)",
    capacity: "40kVA / 40kW",
    price: 41000000,
    description: "The ultimate power grid. Highly customizable system designed for massive factories, complete boarding schools, and large rural electrification grids.",
    specs: {
      panels: "80x 550W Bifacial High-Power Solar Panels",
      inverter: "40kVA Megawatt-Grade Hybrid Power Center",
      battery: "8x 48V 100Ah (38.4kWh total) Premium Power Cabinets",
      accessories: "Custom engineered heavy-gauge structures, fiber-optic telemetry, micro-grid active controller"
    },
    suitableFor: [
      "Universities and high schools (Energy for Schools Flagship)",
      "Food processing factories",
      "Data centers or network operation centers",
      "Off-grid local village energy microgrids"
    ],
    recommendedAppliances: [
      "Industrial fabrication machinery",
      "School hostels, labs, and main lecture auditoriums",
      "Large-scale commercial central air units",
      "Continuous server operations & backup power generators"
    ],
    installationTime: "7 - 10 Days",
    warranty: "10 Years Inverter, 25 Years Panels, 12 Years Battery",
    recommendedUse: "Mega Enterprise Grid Replacement"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "TAPCO Premium 450W Solar Panel",
    category: "panels",
    price: 250000,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Monocrystalline Half-Cut cell technology. Delivers extreme conversion efficiency up to 21.8% even in overcast or high-temperature tropical climates.",
    specs: {
      "Power Rating": "450W Max Output",
      "Cell Type": "Monocrystalline Silicon",
      "Dimensions": "2094 x 1038 x 35 mm",
      "Efficiency": "21.8%",
      "Warranty": "25-Year Linear Performance Warranty"
    },
    inStock: true,
    rating: 4.9
  },
  {
    id: "prod-2",
    name: "TAPCO Hybrid Smart Inverter 5kW",
    category: "inverters",
    price: 1750000,
    image: "https://images.unsplash.com/photo-1620021601016-91866380a570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Next-gen MPPT dual-input pure sine wave inverter. Integrated Wi-Fi allows complete remote tracking via TAPCO cloud dashboards.",
    specs: {
      "Output Capacity": "5000W Pure Sine Wave",
      "MPPT Tracking": "Dual tracking input",
      "Efficiency": "97.5% Peak Efficiency",
      "Cooling": "Smart silent fan systems",
      "Safety": "Overload, short-circuit, and anti-islanding"
    },
    inStock: true,
    rating: 4.8
  },
  {
    id: "prod-3",
    name: "TAPCO Lithium LiFePO4 Powerwall 4.8kWh",
    category: "batteries",
    price: 2600000,
    image: "https://images.unsplash.com/photo-1548613053-220bfb808945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Wall-mounted lithium iron phosphate battery. Long cycle life (>6000 cycles) with built-in intelligent Battery Management System (BMS).",
    specs: {
      "Voltage": "48V Nominal",
      "Capacity": "100Ah (4800Wh)",
      "Chemistry": "Lithium Iron Phosphate (LiFePO4)",
      "Cycle Life": "6000+ Cycles at 80% DoD",
      "Smart BMS": "Integrated temperature, cell-balance, and voltage protection"
    },
    inStock: true,
    rating: 5.0
  },
  {
    id: "prod-4",
    name: "TAPCO Industrial MC4 Crimping Toolkit",
    category: "accessories",
    price: 95000,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "All-in-one professional toolkit for secure solar cable preparation, crimping, and joint locking.",
    specs: {
      "Includes": "Heavy Crimper, Stripper, MC4 wrenches, 10 pairs of premium MC4 connectors",
      "Quality": "High carbon steel with non-slip handle"
    },
    inStock: true,
    rating: 4.7
  },
  {
    id: "prod-5",
    name: "TAPCO Solar Double-Shielded 6mm Cable (50m)",
    category: "accessories",
    price: 140000,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Ultra-flexible, halogen-free, UV-resistant crosslinked solar cable with outstanding weather resistance.",
    specs: {
      "Gauge": "6mm² Core",
      "Rating": "1500V DC Max",
      "Temperature Range": "-40°C to +90°C",
      "Certification": "TUV and CE Certified"
    },
    inStock: true,
    rating: 4.9
  },
  {
    id: "prod-6",
    name: "TAPCO 120A MPPT Solar Charge Controller",
    category: "inverters",
    price: 480000,
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Ultra-fast Maximum Power Point Tracking (MPPT). Boosts energy harvesting from solar arrays by up to 30% compared to PWM controllers.",
    specs: {
      "Current Rating": "120A Max Charge Current",
      "PV Input Voltage": "150V DC Max",
      "Display": "Backlit LCD screen for live telemetry"
    },
    inStock: true,
    rating: 4.8
  }
];

export const COURSES: Course[] = [
  {
    id: "course-1",
    title: "Professional Solar PV System Design & Sizing",
    category: "Design",
    instructor: "Engr. Louis Olosunde, M.Sc (Renewable Energy)",
    duration: "4 Weeks (Self-Paced / Hybrid)",
    lessonsCount: 5,
    studentsEnrolled: 342,
    price: 250000,
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
    ]
  },
  {
    id: "course-2",
    title: "Advanced Solar Installation, Wiring & Safety Standards",
    category: "Installation",
    instructor: "Alhaji Ibrahim Musa, Senior Solar Field Engineer",
    duration: "5 Weeks (Includes Practical Lab)",
    lessonsCount: 4,
    studentsEnrolled: 219,
    price: 350000,
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
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Why LiFePO4 Batteries are Revolutionizing Home Solar Systems",
    category: "Technology",
    author: "TAPCO Tech Labs",
    date: "June 15, 2026",
    excerpt: "Discover why lithium iron phosphate (LiFePO4) storage batteries outlive lead-acid modules by more than 10 years, offering far better safety and capacity.",
    content: "If you are planning to install a solar energy system for your home or business, your choice of battery technology will determine your lifetime investment costs. For decades, deep-cycle lead-acid batteries were the default backup solution. However, Lithium Iron Phosphate (LiFePO4) batteries are rapidly taking over. LiFePO4 batteries offer massive advantages: they support a Depth of Discharge (DoD) of 80% to 95% compared to just 50% for lead-acid. This means you get almost twice the usable energy from the same capacity rating. Furthermore, they are rated for over 6,000 charge-discharge cycles. Under normal daily usage, a LiFePO4 battery will easily last 15 to 20 years, while lead-acid batteries usually fail and require replacement within 2 to 4 years. At TAPCO Solar, we bundle premium LiFePO4 Powerwalls with all of our classic, premium, and commercial configurations to guarantee our clients maximum return on investment.",
    readTime: "5 mins read",
    image: "https://images.unsplash.com/photo-1548613053-220bfb808945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "blog-2",
    title: "How to Correctly Calculate Your Home's Solar Load",
    category: "Education",
    author: "Engr. Louis Olosunde",
    date: "May 28, 2026",
    excerpt: "Avoid over-sizing or under-sizing your solar investment. Follow our engineering-approved step-by-step load calculation formula.",
    content: "Sizing a solar power system shouldn't be guesswork. If your system is under-sized, your inverter will trip on overload when heavy appliances boot up. If your system is over-sized, you are paying unnecessary thousands of dollars for solar panels and batteries that will stay under-utilized. To calculate your home's load correctly: 1) List all appliances you intend to power; 2) Look up their power rating (in Watts); 3) Note how many hours each appliance runs daily; 4) Check for heavy inductive loads (like refrigerators, water pumps, or air conditioners) that have a high starting surge; 5) Sum the continuous running watts. The resulting total watt-hours will guide your battery storage needs, and the peak load in watts will determine the kVA inverter capacity. Use our built-in Solar Load Calculator to size your dream TAPCO system in under 60 seconds!",
    readTime: "6 mins read",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "blog-3",
    title: "TAPCO Energy for Schools: Powering Clean Learning and Education",
    category: "Corporate Social Responsibility",
    author: "TAPCO PR Team",
    date: "April 10, 2026",
    excerpt: "An update on our flagship project. We have successfully powered 14 schools across regional communities, providing clean, continuous electricity.",
    content: "We believe that educational access is a basic human right, but power cuts often leave computer rooms silent, water pumps dry, and hostels in the dark. To address this, TAPCO Solar launched the 'Energy for Schools Campaign'. In partnership with local organizations and development donors, we install customized off-grid solar microgrids on school campuses. These systems completely eliminate energy bills for beneficiary schools, ensuring that computer labs operate uninterrupted, boarding halls have safety lighting, and students can study in comfort. Our systems are also used as active educational assets, helping high school students learn about engineering and renewable solar power systems firsthand. Our latest installation is a robust 40kVA multi-phase solar station at Community Technical Academy, serving over 1,200 students.",
    readTime: "4 mins read",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const PROJECT_GALLERY = [
  {
    id: "gal-1",
    title: "15kVA Premium Smart Residential Powerwall Grid",
    location: "Asokoro District, Abuja",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Residential Solar"
  },
  {
    id: "gal-2",
    title: "40kVA Community Boarding School Microgrid",
    location: "Yankaba, Kano State",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "School Solar Solutions"
  },
  {
    id: "gal-3",
    title: "100kW Commercial Roof-Mount Net-Metering Arrays",
    location: "Lekki Phase 1, Lagos",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Commercial Solar"
  },
  {
    id: "gal-4",
    title: "Deep-Well Solar Irrigation & Farm Machinery Power",
    location: "Zaria Road, Kaduna State",
    image: "https://images.unsplash.com/photo-1620021601016-91866380a570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Agricultural Solar"
  },
  {
    id: "gal-5",
    title: "250kVA Mega Industrial Manufacturing Microgrid",
    location: "Challawa Industrial Estate, Kano",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Industrial Solar"
  },
  {
    id: "gal-6",
    title: "Advanced AC Subpanel Balancing & Earthing Systems",
    location: "Victoria Island, Lagos",
    image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Electrical Engineering"
  },
  {
    id: "gal-7",
    title: "Wi-Fi Telemetry & Smart BMS Maintenance Audit",
    location: "Maitama, Abuja",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Maintenance & Support"
  },
  {
    id: "gal-8",
    title: "TAPCO Executive Solutions Center & Team",
    location: "Yankaba Solutions Center, Kano",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    type: "Office & Team"
  }
];

export const TESTIMONIALS = [
  {
    quote: "TAPCO installed our 10kVA solar system. For 6 months now, our clinic has enjoyed 24/7 power. Our cooling units for vaccines are perfectly stable. This is a game-changer!",
    author: "Dr. Amara Williams",
    role: "Medical Director, Williams Family Clinic",
    stars: 5
  },
  {
    quote: "The Solar Training Academy was outstanding! The structure of lessons, custom spreadsheets for load sizing, andEngr. Louis's guidance enabled me to launch my own solar consulting business.",
    author: "Musa Abubakar",
    role: "TAPCO Academy Graduate, Solar Tech Consultant",
    stars: 5
  },
  {
    quote: "Our secondary school was selected for the Energy for Schools campaign. The light in our computer rooms and the safe lighting at night has transformed our students' performance. Remarkable team!",
    author: "Mrs. Evelyn Johnson",
    role: "Principal, Community Technical Academy",
    stars: 5
  }
];
