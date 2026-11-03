/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, Star, Users, Clock, Award, ShieldCheck, CheckCircle, 
  Search, Filter, SlidersHorizontal, BookOpen, GraduationCap, 
  Briefcase, ArrowRight, Heart, HeartOff, Zap, RefreshCw, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Course } from "../types";

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src !== "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600") {
    target.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600";
  }
};

interface AcademyLandingProps {
  courses: Course[];
  wishlist: string[];
  toggleWishlist: (courseId: string) => void;
  handleEnrollCourse: (courseId: string) => void;
  setCurrentView: (view: "landing" | "course-details" | "classroom" | "dashboard" | "instructor" | "admin" | "register" | "payment" | "payment-success") => void;
  setSelectedCourseId: (courseId: string) => void;
  handleLoadDemoStudent: () => void;
  student: any;
  darkMode: boolean;
}

const ROADMAP_TIMELINE = [
  { stage: "Phase 1", title: "Sizing Foundations", desc: "Audit residential Watt thresholds and define local sun radiation values.", icon: "📐" },
  { stage: "Phase 2", title: "Grid Configurations", desc: "Sizing string arrays, MPPT charging efficiency, and bypass diodes.", icon: "⚡" },
  { stage: "Phase 3", title: "Storage Integration", desc: "Lithium storage deep-cycles and continuous surge thermal margins.", icon: "🔋" },
  { stage: "Phase 4", title: "Commercial Design", desc: "Three-phase balance matrices and industrial delta-star vector couplings.", icon: "🏢" },
  { stage: "Phase 5", title: "Standards & Compliance", desc: "NERC regulation pathways and final practical NEMSA field tests.", icon: "📜" },
  { stage: "Phase 6", title: "TAPCO Professional", desc: "Full practical project commissioning and accredited solar diploma.", icon: "🏆" }
];

export default function AcademyLanding({
  courses,
  wishlist,
  toggleWishlist,
  handleEnrollCourse,
  setCurrentView,
  setSelectedCourseId,
  handleLoadDemoStudent,
  student,
  darkMode
}: AcademyLandingProps) {

  const paddingClass = "px-6 md:px-12 lg:px-16 xl:px-20";

  // Marketplace states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Clear filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSelectedMode("All");
    setSelectedPrice("All");
    setSelectedDuration("All");
  };

  // Filter processing
  const filteredCourses = courses.filter((course) => {
    // 1. Search Query
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Category
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    
    // 3. Level
    const matchesLevel = selectedLevel === "All" || course.skillLevel === selectedLevel;
    
    // 4. Mode
    const matchesMode = selectedMode === "All" || course.trainingMode === selectedMode;
    
    // 5. Price
    let matchesPrice = true;
    if (selectedPrice === "under-200") matchesPrice = course.price < 200;
    else if (selectedPrice === "200-300") matchesPrice = course.price >= 200 && course.price <= 300;
    else if (selectedPrice === "over-300") matchesPrice = course.price > 300;
    
    // 6. Duration
    let matchesDuration = true;
    if (selectedDuration === "under-4") {
      const weeks = parseInt(course.duration);
      matchesDuration = !isNaN(weeks) && weeks < 4;
    } else if (selectedDuration === "4-5") {
      const weeks = parseInt(course.duration);
      matchesDuration = !isNaN(weeks) && (weeks === 4 || weeks === 5);
    } else if (selectedDuration === "over-5") {
      const weeks = parseInt(course.duration);
      matchesDuration = !isNaN(weeks) && weeks > 5;
    }
    
    return matchesSearch && matchesCategory && matchesLevel && matchesMode && matchesPrice && matchesDuration;
  });

  const handleBrowseCoursesClick = () => {
    const section = document.getElementById("marketplace-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="academy-landing-root" className="w-full bg-[#F8FAFC] text-slate-900 font-sans overflow-x-hidden">
      
      {/* 1. EXPANSIVE FULL-WIDTH HERO SECTION WITH TRANSPARENT IMAGE OVERLAY */}
      <section className="relative w-full h-[540px] md:h-[640px] overflow-hidden bg-[#0F172A] flex items-center">
        {/* Background Image showing Solar Engineers and practical installations */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-referrer opacity-50 filter brightness-[0.75]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80')" }}></div>
        
        {/* Warm visual gradients to bridge light theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#0F172A]/30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"></div>

        <div className={`relative z-10 w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto ${paddingClass} text-white space-y-8 text-left`}>
          
          <div className="space-y-4 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0057B8]/40 to-[#00A651]/40 border border-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFC107] animate-pulse" />
              <span>Accredited Solar Center of Excellence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none"
            >
              Become a Certified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-[#FFC107]">
                Solar Energy Professional
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-slate-250 text-xs sm:text-sm md:text-base leading-relaxed font-semibold max-w-2xl"
            >
              Gain practical, industry-recognized skills in solar installation, system design, maintenance, battery technology, and renewable energy entrepreneurship. Earn credentials approved by NERC & NEMSA.
            </motion.p>
          </div>

          {/* Epic Conversion-focused Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <button 
              onClick={handleBrowseCoursesClick}
              className="rounded-2xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white font-black text-xs uppercase tracking-widest px-8 py-4 shadow-lg shadow-[#0057B8]/20 transition cursor-pointer flex items-center gap-2 group"
            >
              <span>Browse Programs</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {student ? (
              <button 
                onClick={() => {
                  setCurrentView("dashboard");
                }}
                className="rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest px-7 py-4 transition cursor-pointer backdrop-blur-md border border-white/15 flex items-center gap-2"
              >
                <span>Enter Workspace</span>
              </button>
            ) : (
              <button 
                onClick={handleLoadDemoStudent}
                className="rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest px-7 py-4 transition cursor-pointer backdrop-blur-md border border-white/15 flex items-center gap-2"
              >
                <span>Register Portal Account</span>
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. BEAUTIFUL INTERACTIVE STATS COUNTERS */}
      <section className="relative z-20 -mt-10 max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: "12,420+", label: "Students Trained", desc: "Engineers, installers & leaders", icon: <Users className="h-5 w-5 text-[#0057B8]" />, bg: "from-blue-50/50 to-white" },
            { metric: "8+ Specialized", label: "Industry Tracks", desc: "Sizing to microgrids", icon: <BookOpen className="h-5 w-5 text-[#00A651]" />, bg: "from-emerald-50/50 to-white" },
            { metric: "9,850+", label: "Certified Graduates", desc: "NERC Smart Credentials", icon: <Award className="h-5 w-5 text-amber-500" />, bg: "from-amber-50/50 to-white" },
            { metric: "45+", label: "Industry Partners", desc: "Employing our trainees", icon: <ShieldCheck className="h-5 w-5 text-indigo-500" />, bg: "from-indigo-50/50 to-white" }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`bg-white border border-[#E2E8F0] p-5 sm:p-6 rounded-3xl shadow-md transition duration-300 hover:shadow-lg hover:-translate-y-1 text-left bg-gradient-to-br ${stat.bg}`}
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">{stat.metric}</h3>
              <p className="text-xs font-extrabold text-[#0F172A] mt-1">{stat.label}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-none">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE SEARCH & ADVANCED FILTER PANEL */}
      <section id="marketplace-section" className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-16 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-black tracking-widest text-[#0057B8] block">Discover Specialists</span>
            <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Accredited Course Catalogue</h2>
            <p className="text-xs text-slate-500 font-medium">Browse our physical, hybrid and online classes to unlock accredited engineering certifications.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${showAdvancedFilters ? "border-[#0057B8] text-[#0057B8] bg-[#0057B8]/5" : "border-[#E2E8F0] text-slate-600 hover:bg-slate-50"}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              { (selectedCategory !== "All" || selectedLevel !== "All" || selectedMode !== "All" || selectedPrice !== "All" || selectedDuration !== "All") && (
                <span className="h-2 w-2 rounded-full bg-[#00A651] animate-ping"></span>
              )}
            </button>
            
            {(searchQuery || selectedCategory !== "All" || selectedLevel !== "All" || selectedMode !== "All" || selectedPrice !== "All" || selectedDuration !== "All") && (
              <button 
                onClick={resetFilters}
                className="rounded-xl border border-red-100 hover:border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-4 h-4.5 w-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by course topic, tools, instructor name or category..."
            className="w-full rounded-2xl border border-[#E2E8F0] pl-11 pr-4 py-3.5 text-xs sm:text-sm bg-white text-[#0F172A] focus:outline-none focus:border-[#0057B8] focus:ring-1 focus:ring-[#0057B8]/20 transition shadow-inner placeholder-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Collapsible Filter Console */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-[#E2E8F0] bg-white rounded-3xl p-6 shadow-md text-left space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Category */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Category</label>
                  <select 
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-[#0057B8]"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Design">Design & Sizing</option>
                    <option value="Installation">Field Installation</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                    <option value="Solar Business">Solar Business</option>
                  </select>
                </div>

                {/* 2. Skill Level */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Skill Level</label>
                  <select 
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-[#0057B8]"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <option value="All">All Skill Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* 3. Training Mode */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Training Mode</label>
                  <select 
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-[#0057B8]"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    <option value="All">All Delivery Modes</option>
                    <option value="Online">Online Classes</option>
                    <option value="Physical">Physical Workshops</option>
                    <option value="Hybrid">Hybrid Delivery</option>
                  </select>
                </div>

                {/* 4. Price Tier */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Price Tier</label>
                  <select 
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-[#0057B8]"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option value="All">All Price Points</option>
                    <option value="under-200">Under $200</option>
                    <option value="200-300">$200 to $300</option>
                    <option value="over-300">Over $300</option>
                  </select>
                </div>

                {/* 5. Course Duration */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-450 tracking-wider">Duration</label>
                  <select 
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-xs bg-white text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-[#0057B8]"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    <option value="All">All Durations</option>
                    <option value="under-4">Short (Under 4 Weeks)</option>
                    <option value="4-5">Medium (4 - 5 Weeks)</option>
                    <option value="over-5">Long (Over 5 Weeks)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. PREMIUM COURSE CATALOGUE CARDS GRID */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 pt-4">
            {filteredCourses.map((course) => {
              const isWishlisted = wishlist.includes(course.id);
              
              return (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all text-left relative"
                >
                  
                  {/* Card Image Overlay Cover */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0 border-b border-slate-50">
                    <img 
                      src={course.coverImage || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"} 
                      alt={course.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Visual gradients over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Badge Pill Cases */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[85%]">
                      <span className="text-[8px] uppercase font-black bg-[#0057B8] text-white px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                        {course.category}
                      </span>
                      <span className="text-[8px] uppercase font-black bg-[#00A651] text-white px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                        {course.trainingMode || "Hybrid"} Sizing
                      </span>
                      {course.discountBadge && (
                        <span className="text-[8px] uppercase font-black bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                          {course.discountBadge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(course.id);
                      }}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center cursor-pointer shadow-sm transition"
                    >
                      {isWishlisted ? (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="h-4 w-4 text-slate-500" />
                      )}
                    </button>

                    {/* Price and duration overlays */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black">{course.rating || "4.9"}</span>
                        <span className="text-[10px] text-slate-350 font-semibold">({course.studentsEnrolled + 20} enrolled)</span>
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                        {course.duration}
                      </span>
                    </div>

                  </div>

                  {/* Course Details Block */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={course.instructorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80"} 
                          alt={course.instructor}
                          onError={handleImageError}
                          className="h-5 w-5 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-[10px] text-slate-500 font-extrabold">{course.instructor}</span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-snug line-clamp-1">
                        {course.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Accreditation Badge and pricing grid */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[9px] text-[#00A651] font-black uppercase">
                        <Award className="h-4 w-4" />
                        <span>{course.certificateBadge || "Smart Credential"}</span>
                      </div>
                      
                      <div className="text-right">
                        {course.originalPrice && (
                          <span className="text-slate-400 line-through text-[10px] font-bold mr-1.5">${course.originalPrice}</span>
                        )}
                        <span className="text-base font-black text-[#0F172A]">${course.price}</span>
                      </div>
                    </div>

                    {/* Main CTA Operations */}
                    <div className="flex gap-2.5 pt-1">
                      <button 
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setCurrentView("course-details");
                        }}
                        className="flex-1 rounded-xl border border-slate-200 hover:bg-[#F8FAFC] text-[10px] font-black uppercase tracking-wider py-3 transition text-center cursor-pointer text-slate-600 hover:text-[#0F172A]"
                      >
                        Syllabus Details
                      </button>
                      
                      <button 
                        onClick={() => handleEnrollCourse(course.id)}
                        className="flex-1 rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-[10px] font-black uppercase tracking-wider py-3 transition text-center cursor-pointer shadow-sm shadow-[#0057B8]/10 flex items-center justify-center gap-1 hover:scale-[1.01]"
                      >
                        <span>Enroll Now</span>
                        <Zap className="h-3 w-3 text-[#FFC107] fill-[#FFC107]" />
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border-2 border-dashed border-[#E2E8F0] bg-white text-slate-450 space-y-3">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-black text-[#0F172A]">No Solar Tracks Match Your Filter Selection</h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Try resetting or modifying your selected training mode, category, price tiers, or search term query.</p>
            <button 
              onClick={resetFilters}
              className="rounded-xl bg-[#0057B8] text-white text-xs font-bold px-4 py-2 mt-2 transition cursor-pointer"
            >
              Clear Filter Toggles
            </button>
          </div>
        )}
      </section>

      {/* 5. ROADMAP SYLLABUS GRID (Linear / Apple style timeline roadmap) */}
      <section className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-16 border-t border-[#E2E8F0] bg-white">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[9px] uppercase font-black text-[#0057B8] tracking-widest block">Academic Syllabus Curriculum</span>
          <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">Structured Path to Solar Expert Status</h2>
          <p className="text-xs text-slate-500 font-medium">We design sequential practical training blocks that take students from zero electrical background into self-sufficient, certified solar designers and installers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROADMAP_TIMELINE.map((step, idx) => (
            <div 
              key={idx}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 hover:shadow-md transition text-left space-y-3 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-[0.03] select-none text-9xl font-black text-[#0F172A] pointer-events-none group-hover:scale-105 transition-transform">
                {idx + 1}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm text-xs leading-none">
                  {step.icon}
                </span>
                <span className="text-[9px] uppercase font-black text-[#00A651] tracking-wider">
                  {step.stage}
                </span>
              </div>
              <h4 className="text-sm font-black text-[#0F172A] tracking-tight">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-normal font-semibold">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNERS AND ACCREDITATIONS CAROUSEL ROW */}
      <section className="w-full max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="text-left shrink-0 max-w-xs">
            <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-widest">Global Solar Partners</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
              TAPCO curriculum matches strict local guidelines and international renewable energy frameworks.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center flex-1 justify-items-center opacity-85">
            {[
              { name: "NERC Nigeria", title: "NERC Standards", tag: "Accredited syllabus" },
              { name: "NEMSA Approved", title: "NEMSA Inspections", tag: "Safety compliance" },
              { name: "Bank of Industry", title: "BOI Funded Grants", tag: "Trainee scholarship partner" },
              { name: "Huawei Solar", title: "Tier-1 Hardware", tag: "Equipment certification" }
            ].map((p, idx) => (
              <div key={idx} className="text-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm w-full max-w-[150px]">
                <div className="text-xs font-black text-[#0F172A] uppercase tracking-wide leading-none">{p.name}</div>
                <div className="text-[8px] text-[#00A651] font-black uppercase mt-1.5 tracking-wider leading-none">{p.title}</div>
                <div className="text-[7px] text-slate-400 font-bold mt-0.5 leading-none">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
