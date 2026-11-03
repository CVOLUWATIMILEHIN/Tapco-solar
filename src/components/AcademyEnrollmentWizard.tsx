/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "motion/react";
import { 
  Check, ArrowRight, ShieldCheck, Mail, Phone, MapPin, 
  Briefcase, GraduationCap, CreditCard, Award, Printer, LogIn 
} from "lucide-react";
import { Course, StudentProfile } from "../types";

interface AcademyEnrollmentWizardProps {
  course: Course;
  onClose: () => void;
  onSuccess: (profile: StudentProfile) => void;
}

export default function AcademyEnrollmentWizard({ 
  course, 
  onClose, 
  onSuccess 
}: AcademyEnrollmentWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  
  // Registration State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Student Google Auth States
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string>("");

  // Fetch dynamic Google Client ID on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/auth/config");
        const data = await res.json();
        if (res.ok && data.clientId) {
          setGoogleClientId(data.clientId);
        }
      } catch (err) {
        console.error("Failed to fetch Google Auth Client ID:", err);
      }
    };
    fetchConfig();
  }, []);

  // Initialize Google Identity Services for students
  useEffect(() => {
    if (step !== 1 || isGoogleLinked || !googleClientId) return;

    const initStudentGsi = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleStudentCallback,
          auto_select: false,
        });

        const btnContainer = document.getElementById("google-student-btn");
        if (btnContainer) {
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            text: "signup_with",
            shape: "rectangular",
            width: btnContainer.clientWidth || 320,
          });
        }
      }
    };

    initStudentGsi();
    const t1 = setTimeout(initStudentGsi, 1000);
    const t2 = setTimeout(initStudentGsi, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step, isGoogleLinked, googleClientId]);

  const handleGoogleStudentCallback = async (response: any) => {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/google/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential, courseId: course.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsGoogleLinked(true);
        setFullName(data.user.name || "");
        setEmail(data.user.email || "");
        
        // If already enrolled in this course, immediately complete registration
        if (data.enrolled) {
          setTransactionRef(data.enrollment?.transactionRef || `TXN-TAPCO-${Math.floor(100000 + Math.random() * 900000)}`);
          setInvoiceDate(data.enrollment?.registrationDate || new Date().toLocaleDateString());
          setStep(5);
        } else {
          setStep(2);
        }
      } else {
        setAuthError(data.error || "Failed to authenticate student Google account.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSimulateStudentLogin = async (simulatedToken: string) => {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/google/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: simulatedToken, courseId: course.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsGoogleLinked(true);
        setFullName(data.user.name || "");
        setEmail(data.user.email || "");
        
        if (data.enrolled) {
          setTransactionRef(data.enrollment?.transactionRef || `TXN-TAPCO-${Math.floor(100000 + Math.random() * 900000)}`);
          setInvoiceDate(data.enrollment?.registrationDate || new Date().toLocaleDateString());
          setStep(5);
        } else {
          setStep(2);
        }
      } else {
        setAuthError(data.error || "Failed to authenticate student Google account.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  const [country, setCountry] = useState("Nigeria");
  const [state, setState] = useState("");
  const [occupation, setOccupation] = useState("");
  const [experience, setExperience] = useState("None");
  
  const [trainingMode, setTrainingMode] = useState<"Online" | "Physical" | "Hybrid">("Hybrid");
  const [paymentOption, setPaymentOption] = useState<"Card" | "Bank Transfer" | "Installments">("Card");

  // Payment/Checkout State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const handleNextStep = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment transaction
    setTimeout(() => {
      const refNumber = `TXN-TAPCO-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      
      setTransactionRef(refNumber);
      setInvoiceDate(currentDate);
      setIsProcessing(false);
      setStep(5);
    }, 2000);
  };

  const handleCompleteRegistration = () => {
    const studentProfile: StudentProfile = {
      id: `std-${Math.floor(100 + Math.random() * 900)}`,
      name: fullName,
      email: email,
      studentId: `TAPCO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      enrolledCourseId: course.id,
      completedLessons: [],
      quizScores: {},
      isGraduated: false,
      registrationDate: invoiceDate || new Date().toLocaleDateString()
    };
    
    // Store professional meta into localStorage to persist custom student properties
    localStorage.setItem(`tapco_student_meta_${studentProfile.id}`, JSON.stringify({
      phone,
      country,
      state,
      occupation,
      experience,
      trainingMode,
      paymentOption,
      transactionRef,
      paymentAmount: course.price,
      courseTitle: course.title,
      date: invoiceDate
    }));

    onSuccess(studentProfile);
  };

  return (
    <div id="enrollment-wizard-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-[#0F172A] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* SIDE BAR COURSE SUMMARY (Stays fixed) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0057B8] via-[#0057B8] to-[#003B80] text-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E2E8F0]/15 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none"></div>
          
          <div className="space-y-6 relative z-10">
            <div>
              <span className="inline-block text-[8px] tracking-widest uppercase bg-white/10 text-[#FFC107] border border-white/15 rounded px-2.5 py-1 font-black leading-none">
                {course.category} SPECIALIZATION
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-3 leading-tight tracking-tight">{course.title}</h3>
            </div>
            
            <p className="text-white/80 text-[11px] font-semibold leading-relaxed">
              {course.description}
            </p>

            <div className="space-y-3.5 pt-4 border-t border-white/15 text-[11px] font-bold">
              <div className="flex items-center gap-2.5 text-white/95">
                <GraduationCap className="h-4.5 w-4.5 text-[#FFC107]" />
                <span>Instructor: {course.instructor}</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/95">
                <Award className="h-4.5 w-4.5 text-[#00A651]" />
                <span>Certificate: {course.certificateBadge || "Accredited"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/95">
                <ShieldCheck className="h-4.5 w-4.5 text-sky-400" />
                <span>Format: {course.trainingMode || "Hybrid"} Labs Included</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/15 mt-8 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-white/70 uppercase font-bold">Tuition Fee</span>
              <div className="text-right">
                {course.originalPrice && (
                  <span className="text-white/60 line-through text-[11px] font-bold mr-2">
                    ${course.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-black text-[#FFC107]">${course.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN WIZARD FORMS */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
          
          {/* Header & Steps Indicator */}
          {step < 5 && (
            <div className="border-b border-[#E2E8F0] pb-4 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#0057B8]">
                  {step === 1 && "Personal Profile"}
                  {step === 2 && "Background Details"}
                  {step === 3 && "Preferences"}
                  {step === 4 && "Tuition Checkout"}
                </h4>
                <span className="text-[10px] font-mono font-bold text-slate-400">Step {step} of 4</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0057B8] to-[#00A651] rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Content container */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Secure Google Registration & Login */}
              {step === 1 && (
                <motion.div 
                  key="step-1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-4 text-center p-2"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-[#0057B8] flex items-center justify-center mx-auto text-lg border border-blue-100">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                      Google Academic Authorization
                    </h3>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                      To safeguard academic credentials, exams, and accredited certificates, TAPCO Solar Academy uses secure, passwordless authentication via your Google Account.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 font-semibold text-center leading-normal">
                      {authError}
                    </div>
                  )}

                  {/* Real Google Auth Button mounting point */}
                  <div className="py-2 flex flex-col items-center">
                    <div 
                      id="google-student-btn" 
                      className="w-full flex justify-center py-2 transition-transform duration-200 active:scale-[0.99] border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100/50"
                    />
                  </div>

                  {/* Phone number input required alongside Google link */}
                  <div className="text-left space-y-1 pt-1">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-500">
                      Mobile Contact Number (Required for lab alerts)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full rounded-xl border border-[#E2E8F0] pl-10 pr-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Simulator buttons */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Academy Preview Simulator
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSimulateStudentLogin("mock-student-token:olosundelouis@gmail.com:Louis Olosunde")}
                        disabled={isAuthLoading}
                        className="py-2.5 px-3 bg-blue-50/50 hover:bg-blue-50 text-left rounded-xl border border-blue-100 transition cursor-pointer"
                      >
                        <span className="block text-[10px] font-black text-slate-800">Louis Olosunde (Authorized)</span>
                        <span className="block text-[8px] text-blue-600 font-semibold">olosundelouis@gmail.com</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateStudentLogin("mock-student-token:student2@gmail.com:Adebayo Yusuf")}
                        disabled={isAuthLoading}
                        className="py-2.5 px-3 bg-rose-50/50 hover:bg-rose-50 text-left rounded-xl border border-rose-100 transition cursor-pointer"
                      >
                        <span className="block text-[10px] font-black text-slate-800">Adebayo Yusuf (Blocked)</span>
                        <span className="block text-[8px] text-rose-600 font-semibold">student2@gmail.com</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Location & Professional Info */}
              {step === 2 && (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Country</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Nigeria"
                        className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">State / Province</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Lagos"
                        className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Current Occupation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Electrical Technician, Student, Consultant"
                        className="w-full rounded-xl border border-[#E2E8F0] pl-10 pr-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Previous Electrical/Solar Experience</label>
                    <select 
                      className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8] cursor-pointer"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option value="None">None (Absolute Beginner)</option>
                      <option value="Basic Electrical">Basic Electrical (Electrician, Student)</option>
                      <option value="Intermediate Solar">Intermediate Solar (Some installation experience)</option>
                      <option value="Advanced Engineer">Advanced Engineer (Degrees, active professional)</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Training Preferences */}
              {step === 3 && (
                <motion.div 
                  key="step-3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Preferred Training Delivery Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { mode: "Online", desc: "100% Virtual self-paced modules" },
                        { mode: "Physical", desc: "Intense hand-on TAPCO workshop labs" },
                        { mode: "Hybrid", desc: "Best of both: online theory + lab focus" }
                      ].map((t) => (
                        <div 
                          key={t.mode}
                          onClick={() => setTrainingMode(t.mode as any)}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                            trainingMode === t.mode 
                              ? "border-[#0057B8] bg-[#0057B8]/5 text-[#0057B8]" 
                              : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold">{t.mode}</div>
                          <div className="text-[8px] text-slate-500 mt-1 leading-tight">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Preferred Tuition Payment Plan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { plan: "Card", label: "Debit/Credit Card", desc: "Secure instant activation" },
                        { plan: "Bank Transfer", label: "Bank Wire / Deposit", desc: "Submit proof of payment" },
                        { plan: "Installments", label: "Split Pay Model", desc: "Two payments of 55%" }
                      ].map((p) => (
                        <div 
                          key={p.plan}
                          onClick={() => setPaymentOption(p.plan as any)}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                            paymentOption === p.plan 
                              ? "border-[#0057B8] bg-[#0057B8]/5 text-[#0057B8]" 
                              : "border-[#E2E8F0] hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold">{p.label}</div>
                          <div className="text-[8px] text-slate-500 mt-1 leading-tight">{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Checkout & Pay */}
              {step === 4 && (
                <motion.div 
                  key="step-4"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-4"
                >
                  {paymentOption === "Card" ? (
                    <form onSubmit={handlePaymentSubmit} className="space-y-3">
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-[#0057B8]" />
                          <div>
                            <div className="text-xs font-bold">Standard Credit Card</div>
                            <div className="text-[9px] text-slate-500">Encrypted checkout via TAPCO gateway</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">${course.price}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Card Number</label>
                        <input 
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4000 1234 5678 9010"
                          className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Expiration Date</label>
                          <input 
                            type="text"
                            required
                            placeholder="MM / YY"
                            className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black tracking-wider text-slate-450">Secure Code (CVC)</label>
                          <input 
                            type="password"
                            required
                            maxLength={4}
                            placeholder="•••"
                            className="w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-xs bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 text-white py-3.5 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#00A651]/10 flex items-center justify-center gap-2 mt-4"
                      >
                        {isProcessing ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                            <span>Processing Secure Bank Authorization...</span>
                          </>
                        ) : (
                          <>
                            <span>Pay Tuition Fee & Start Learning</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3.5">
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-700 font-semibold text-left flex gap-2.5">
                        <span className="text-base leading-none">⚠️</span>
                        <div>
                          <strong>Manual Payment Selected:</strong> Please wire tuition to the TAPCO Solar Academy account below. Activation will take place immediately after wiring.
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0] font-mono text-[10px] space-y-1.5 text-slate-700 text-left shadow-inner">
                        <div>🏦 Bank: <strong>Zenith Bank Nigeria</strong></div>
                        <div>📈 Account Name: <strong>TAPCO Solar Training Academy Ltd</strong></div>
                        <div>💳 Account Number: <strong>1019876543</strong></div>
                        <div>🔍 Reference Memo: <strong>{fullName ? fullName.split(" ")[0].toUpperCase() : "SOLAR"}-{course.id.toUpperCase()}</strong></div>
                      </div>

                      <button 
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white py-3.5 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
                      >
                        {isProcessing ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                            <span>Verifying wire credentials...</span>
                          </>
                        ) : (
                          <span>I Have Completed Bank Transfer</span>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 5: Success & Printable Tax Invoice Receipt */}
              {step === 5 && (
                <motion.div 
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5 text-center"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto text-xl">
                    <Check className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-[#00A651]">TUITION SECURED successfully!</h3>
                    <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto font-medium">
                      Congratulations! Your account has been activated, and a confirmation email was dispatched to <strong>{email}</strong>.
                    </p>
                  </div>

                  {/* TAX RECEIPT BLOCK */}
                  <div id="printable-tax-receipt" className="p-5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-[9px] text-slate-700 space-y-2 text-left relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 transform rotate-12 translate-x-3 -translate-y-3 opacity-[0.03]">
                      <Award className="h-44 w-44" />
                    </div>
                    
                    <div className="border-b border-dashed border-slate-350 pb-2 flex justify-between font-bold">
                      <span>TAPCO SOLAR ENERGY ACADEMY</span>
                      <span>TAX INVOICE</span>
                    </div>

                    <div className="flex justify-between mt-1">
                      <span>RECEIPT NO:</span>
                      <span className="font-bold">{transactionRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DATE:</span>
                      <span>{invoiceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STUDENT:</span>
                      <span className="font-bold">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COURSE ID:</span>
                      <span>{course.id.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TRAINING MODE:</span>
                      <span>{trainingMode.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-slate-350 pt-2 mt-2 text-[11px] font-bold text-[#0F172A]">
                      <span>AMOUNT PAID (NGN):</span>
                      <span>₦{course.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="text-[8px] text-center text-slate-400 mt-2 italic pt-1 border-t border-slate-200">
                      Status: Fully Paid. Authorized Registry Representative.
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider py-3 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Receipt</span>
                    </button>
                    
                    <button 
                      onClick={handleCompleteRegistration}
                      className="flex-1 rounded-xl bg-[#0057B8] text-white hover:bg-[#0057B8]/95 text-[10px] font-black uppercase tracking-wider py-3 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Enter Learning Dashboard</span>
                      <LogIn className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          {step < 5 && (
            <div className="border-t border-[#E2E8F0] pt-4 mt-4 flex justify-between">
              {step > 1 ? (
                <button 
                  onClick={handlePrevStep}
                  className="rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[10px] font-bold text-slate-500 hover:text-[#0F172A] px-4 py-2.5 transition cursor-pointer"
                >
                  Go Back
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="rounded-xl border border-[#E2E8F0] hover:bg-red-50 hover:text-red-500 text-[10px] font-bold text-slate-500 px-4 py-2.5 transition cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button 
                  onClick={handleNextStep}
                  disabled={
                    (step === 1 && (!isGoogleLinked || !phone)) ||
                    (step === 2 && (!country || !state || !occupation))
                  }
                  className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 disabled:opacity-50 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-2.5 transition cursor-pointer flex items-center gap-1 shadow-sm shadow-[#0057B8]/10"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
