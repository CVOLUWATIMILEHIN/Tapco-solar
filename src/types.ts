/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SolarPackage {
  id: string;
  name: string;
  capacity: string; // e.g., "3kVA"
  price: number;
  description: string;
  specs: {
    panels: string;
    inverter: string;
    battery: string;
    accessories: string;
  };
  suitableFor: string[];
  recommendedAppliances: string[];
  installationTime?: string;
  warranty?: string;
  recommendedUse?: string;
}

export interface Product {
  id: string;
  name: string;
  category: "panels" | "inverters" | "batteries" | "accessories";
  price: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  rating: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string; // Embed or mock video player
  description: string;
  materials: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  category: "Design" | "Installation" | "Troubleshooting" | "Solar Business";
  instructor: string;
  duration: string;
  lessonsCount: number;
  studentsEnrolled: number;
  description: string;
  price: number;
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  coverImage?: string;
  discountBadge?: string;
  rating?: number;
  skillLevel?: "Beginner" | "Intermediate" | "Advanced";
  trainingMode?: "Online" | "Physical" | "Hybrid";
  instructorPhoto?: string;
  certificateBadge?: string;
  originalPrice?: number;
  schedule?: string;
  requirements?: string[];
  outcomes?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ studentName: string; rating: number; date: string; comment: string; initial: string }>;
  startDate?: string;
  seatsRemaining?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  packageId?: string;
  averageBill: string;
  message: string;
  appliances: Array<{ name: string; count: number; watts: number; hours: number }>;
  status: "Pending" | "Reviewed" | "Approved" | "Contacted";
  date: string;
}

export interface SiteInspectionBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  location: string;
  type: "Consultation" | "Physical Survey" | "Thermal/Shade Analysis";
  status: "Confirmed" | "Pending" | "Completed";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  trackingCode: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    country: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  image: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  enrolledCourseId: string;
  completedLessons: string[]; // lesson ids
  quizScores: Record<string, number>; // quizId -> score (percent)
  isGraduated: boolean;
  registrationDate: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
}
