/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  motion 
} from "motion/react";
import { 
  ArrowLeft, Clock, BookOpen, Star, Sparkles, Calendar, 
  MapPin, CheckCircle, Shield, Award, HelpCircle, ArrowRight 
} from "lucide-react";
import { Course } from "../types";

interface AcademyCourseDetailsProps {
  course: Course;
  allCourses: Course[];
  onBack: () => void;
  onEnroll: (courseId: string) => void;
}

export default function AcademyCourseDetails({ 
  course, 
  allCourses, 
  onBack, 
  onEnroll 
}: AcademyCourseDetailsProps) {
  
  // Find related courses in the same category or overall
  const relatedCourses = allCourses
    .filter((c) => c.id !== course.id)
    .slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="w-full text-slate-900 bg-[#F8FAFC]"
    >
      {/* 1. HERO HEADER COVER */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-[#0F172A] flex items-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-[0.7] contrast-[1.1]" style={{ backgroundImage: `url(${course.coverImage || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80"})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 flex flex-col justify-end h-full pb-8 md:pb-12 text-white">
          <button 
            onClick={onBack}
            className="self-start flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl mb-6 backdrop-blur-md transition cursor-pointer border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </button>

          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] uppercase font-black bg-[#0057B8] px-3 py-1 rounded-full border border-blue-400/20 tracking-wider">
                {course.category}
              </span>
              <span className="text-[9px] uppercase font-black bg-[#00A651] px-3 py-1 rounded-full border border-green-400/20 tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse text-[#FFC107]" />
                {course.skillLevel || "Intermediate"} Specialization
              </span>
              {course.discountBadge && (
                <span className="text-[9px] uppercase font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full tracking-wider">
                  {course.discountBadge}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm md:text-base text-slate-250 leading-relaxed font-medium">
              {course.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-bold pt-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
                <span className="text-white">{course.rating || "4.9"}</span>
                <span className="text-slate-400 font-medium">({course.studentsEnrolled + 40} Ratings)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-450" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-slate-450" />
                <span>{course.lessonsCount} Core Modules</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY GRID */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Outcomes Block */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-6 tracking-tight flex items-center gap-2">
                <CheckCircle className="h-5.5 w-5.5 text-[#00A651]" />
                What You Will Master in This Program
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.outcomes && course.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-3 text-xs sm:text-[13px] leading-relaxed font-semibold text-slate-700 text-left">
                    <span className="text-emerald-500 font-black text-lg select-none leading-none">✓</span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum Modules */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-6 tracking-tight flex items-center gap-2">
                <BookOpen className="h-5.5 w-5.5 text-[#0057B8]" />
                Course Curriculum & Lesson Outline
              </h3>
              <div className="space-y-4">
                {course.lessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id} 
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition duration-200 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#00A651] uppercase tracking-wider block">
                          Module 0{idx + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#0F172A] mt-1">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">{lesson.description}</p>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-450 bg-slate-100 border px-2.5 py-1 rounded-full whitespace-nowrap leading-none">
                        {lesson.duration} Video
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor Profile Card */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-6 tracking-tight">Your Specialist Academic Advisor</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img 
                  src={course.instructorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"} 
                  alt={course.instructor}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-sm shrink-0"
                />
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A]">{course.instructor}</h4>
                    <p className="text-xs text-[#00A651] font-bold">Senior Faculty, TAPCO Solar Training Hub</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    An expert grid scaling architect with over 15 years of technical renewable installations. 
                    Has designed, simulated, and deployed more than 45 commercial mini-grid infrastructures 
                    conforming to NERC and NEMSA wiring frameworks.
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-450 font-bold pt-1">
                    <span>🌟 4.9 Course Rating</span>
                    <span>🎓 NERC Certified Instructor</span>
                    <span>⚡ 10k+ Certified Graduates</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Program Requirements */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-4 tracking-tight">Technical Prerequisites</h3>
              <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-semibold list-disc pl-5">
                {course.requirements && course.requirements.map((req, idx) => (
                  <li key={idx} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </section>

            {/* Standard FAQs */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-6 tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0057B8]" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {course.faqs && course.faqs.map((faq, idx) => (
                  <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">{faq.question}</h4>
                    <p className="text-xs text-slate-500 mt-2 font-semibold leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Student Reviews Case */}
            <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="text-base sm:text-lg font-black text-[#0057B8] mb-6 tracking-tight">Active Student Feedback</h3>
              <div className="space-y-6">
                {course.reviews && course.reviews.map((rev, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {rev.initial}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-850">{rev.studentName}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-550 italic leading-relaxed font-semibold pl-12">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN STICKY ENROLLMENT PANEL (4/12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-lg p-6 text-left">
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100 block w-max mb-4">
                Registration Active • Verified Hub
              </span>

              <div className="flex items-end justify-between border-b border-slate-100 pb-5 mb-5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Complete Fee</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#0F172A]">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-slate-400 text-xs line-through font-bold">${course.originalPrice}</span>
                    )}
                  </div>
                </div>
                {course.discountBadge && (
                  <span className="text-[9px] font-bold text-[#00A651] bg-[#00A651]/5 border border-[#00A651]/15 px-2.5 py-1 rounded-full uppercase">
                    {course.discountBadge}
                  </span>
                )}
              </div>

              {/* Course Features Metadata */}
              <div className="space-y-3.5 text-xs font-semibold text-slate-600 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#0057B8]" /> Format / Mode:
                  </span>
                  <span className="text-[#0F172A] font-extrabold">{course.trainingMode || "Hybrid"} Sizing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0057B8]" /> Enrollment Starts:
                  </span>
                  <span className="text-[#0F172A] font-extrabold">{course.startDate || "July 15, 2026"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#0057B8]" /> Professional Diploma:
                  </span>
                  <span className="text-[#0F172A] font-extrabold">Accredited QR Code</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0057B8]" /> Workshop Labs:
                  </span>
                  <span className="text-[#0F172A] font-extrabold">Enugu & Lagos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-bold flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#0057B8]" /> Seats Remaining:
                  </span>
                  <span className="text-amber-600 font-extrabold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px]">
                    {course.seatsRemaining || 12} Seats Left
                  </span>
                </div>
              </div>

              {/* ENROLL PRIMARY ACTION BUTTON */}
              <button 
                onClick={() => onEnroll(course.id)}
                className="w-full rounded-2xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white py-4 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-[#0057B8]/10 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>Enroll in Specialized Class</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed font-semibold">
                By registering, you gain lifetime portal access, downloadable worksheets, 
                instructor graded projects, and a verifiable smart cert.
              </p>
            </div>

            {/* Support Hotline Widget */}
            <div className="bg-[#0F172A] text-white rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0057B8]/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10 space-y-3 text-left">
                <Shield className="h-7 w-7 text-[#FFC107]" />
                <h4 className="text-sm font-black text-white">Need B2B Corporate Sizing?</h4>
                <p className="text-[11px] text-slate-300 leading-normal font-semibold">
                  We license academy curriculum to corporate power departments, state micro-utility cooperatives, and engineering agencies.
                </p>
                <a 
                  href="mailto:tapcosolar@gmail.com"
                  className="inline-block text-[10px] font-black uppercase tracking-widest text-[#FFC107] hover:text-[#FFC107]/90 transition"
                >
                  Contact registrar desk →
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED COURSES ROW */}
        <div className="border-t border-[#E2E8F0] pt-12 mt-12 text-left">
          <h3 className="text-lg font-black text-[#0F172A] mb-6">Explore Related Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedCourses.map((rc) => (
              <div 
                key={rc.id}
                className="bg-white border border-[#E2E8F0] p-5 rounded-3xl flex flex-col md:flex-row gap-4 hover:shadow-md transition duration-200"
              >
                <img 
                  src={rc.coverImage || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80"} 
                  alt={rc.title}
                  className="w-full md:w-32 h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                />
                <div className="flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-[#0057B8]">{rc.category}</span>
                    <h4 className="text-xs font-black text-[#0F172A] line-clamp-1">{rc.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{rc.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-extrabold text-[#00A651]">${rc.price}</span>
                    <button 
                      onClick={() => onEnroll(rc.id)}
                      className="text-[9px] uppercase font-black tracking-wider text-[#0057B8] hover:text-[#0057B8]/80 cursor-pointer"
                    >
                      Quick Enroll →
                    </button> control panel
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
