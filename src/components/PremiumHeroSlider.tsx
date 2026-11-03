/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Shield, ArrowRight, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCMS } from "../context/CMSContext";

interface PremiumHeroSliderProps {
  onGetQuoteClick: () => void;
  onExploreServicesClick: () => void;
}

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    label: "Modern Residential Rooftop Solar, Lagos",
    category: "Residential Solar",
    headline: "Noise-Free Luxury & Clean Power for Nigerian Homes",
    description: "Equip your duplex or estate with premium rooftop solar panels and intelligent hybrid systems. Escape grid outages and enjoy seamless 24/7 electricity.",
    secondaryCta: "Explore Home Solar"
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    label: "Corporate Commercial Complex, Victoria Island",
    category: "Commercial & Industrial Solar",
    headline: "Scale Your Business With High-Yield Solar Microgrids",
    description: "Power corporate offices, factories, and warehouses in Lagos or Abuja. Reduce dependence on costly diesel generators by up to 75% with zero-emission carports and arrays.",
    secondaryCta: "Explore Enterprise Solutions"
  },
  {
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80",
    label: "Solar Irrigation Farm, Northern Nigeria",
    category: "Agricultural Solar",
    headline: "Boost Harvest Yields with Solar-Powered Irrigation",
    description: "Modernize farms across Northern and Western Nigeria. TAPCO delivers smart agricultural irrigation and agro-processing microgrids designed for high operational uptime.",
    secondaryCta: "Explore Agri-Solar"
  },
  {
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
    label: "Solar-Powered Healthcare Facility Clinic",
    category: "Solar for Schools & Hospitals",
    headline: "Continuous Power for Health Centers & Universities",
    description: "Powering life-saving maternal clinics, medical hubs, and public or private schools across Nigeria with premium high-capacity solar batteries and microgrids.",
    secondaryCta: "Explore Institutional Solar"
  },
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=80",
    label: "TAPCO Professional Certified Engineers at Work",
    category: "Engineers at Work",
    headline: "Certified Engineering and Operational Excellence",
    description: "Our elite team of professional male and female Nigerian engineers works in hard hats and reflective vests to deliver safe, premium, and zero-defect solar installations.",
    secondaryCta: "Our Technical Standards"
  },
  {
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1920&q=80",
    label: "Premium Hybrid Inverters and Battery Bank Array",
    category: "Solar & Electrical Products",
    headline: "Premium Hybrid Inverters & LFP Battery Storage",
    description: "We supply tier-1 high-density monocrystalline solar panels, state-of-the-art intelligent hybrid inverters, and long-life Lithium Iron Phosphate (LFP) energy storage banks.",
    secondaryCta: "View Product Catalog"
  }
];

export default function PremiumHeroSlider({
  onGetQuoteClick,
  onExploreServicesClick
}: PremiumHeroSliderProps) {
  let slidesToUse = SLIDES;
  let trustStatsToUse = [
    { metric: "500+", label: "Projects Completed" },
    { metric: "98%", label: "Customer Satisfaction" },
    { metric: "10+", label: "Years Experience" },
    { metric: "24/7", label: "Customer Support" }
  ];

  try {
    const cms = useCMS();
    if (cms?.heroSlides && cms.heroSlides.length > 0) {
      slidesToUse = cms.heroSlides;
    }
    if (cms?.trustStats && cms.trustStats.length > 0) {
      trustStatsToUse = cms.trustStats.map(s => ({
        metric: s.value,
        label: s.label
      }));
    }
  } catch (e) {
    // Graceful fallback
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play control: transition exactly every 5 seconds as requested
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying, slidesToUse.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesToUse.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slidesToUse.length) % slidesToUse.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Swiping support for mobile users
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft) {
      handleNext();
    } else if (isSwipeRight) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeSlide = slidesToUse[currentIndex] || slidesToUse[0] || SLIDES[0];

  return (
    <div
      id="premium-hero-slider-container"
      className="relative w-full h-[520px] sm:h-[calc(100vh-80px)] overflow-hidden bg-slate-950 flex items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. SLIDER BACKGROUNDS (Smooth Fades & Ken Burns Zoom Effect) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {slidesToUse.map((slide, idx) => {
            if (idx !== currentIndex) return null;
            return (
              <motion.div
                key={slide.image + idx}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              >
                {/* Slow Ken Burns scale animation reset on each slide transition */}
                <motion.img
                  src={slide.image}
                  alt={slide.label}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover pointer-events-none origin-center"
                  initial={{ scale: 1.0 }}
                  animate={{ scale: 1.12 }}
                  transition={{ duration: 5.2, ease: "linear" }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Cinematic deep dark blue gradient overlay for outstanding readability */}
        <div
          id="cinematic-overlay"
          className="absolute inset-0 bg-gradient-to-r from-[#01162C]/90 via-[#01162C]/70 to-[#01162C]/40 z-10"
        />
        {/* Soft bottom blend to slate background */}
        <div
          id="bottom-blend"
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none"
        />
      </div>

      {/* 2. SLIDER CONTENT (Expansive layout designed to match Tesla/Apple) */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 xl:px-20 max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto flex flex-col justify-between h-full pt-12 md:pt-16 pb-12">
        
        {/* Top Active Image Description Banner */}
        <div className="flex items-center justify-between w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] md:text-xs font-black tracking-widest text-[#FFC107] uppercase backdrop-blur-md"
          >
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            POWERING A GREENER NIGERIA
          </motion.div>
        </div>

        {/* Main Content Body */}
        <div className="max-w-[850px] text-left text-white space-y-6 md:space-y-8 my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="space-y-6"
            >
              {/* Category */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#FFC107] uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
                {activeSlide.category}
              </motion.div>

              {/* Dynamic Headline */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-sm"
              >
                {activeSlide.headline}
              </motion.h1>

              {/* Dynamic Subheading */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="text-base sm:text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl drop-shadow-md"
              >
                {activeSlide.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
                }}
                className="flex flex-wrap items-center gap-4 pt-4 md:pt-6"
              >
                <button
                  onClick={onGetQuoteClick}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-sm font-black text-slate-950 shadow-xl shadow-amber-500/10 hover:bg-[#FFC107]/90 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                >
                  Get a Free Quote
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
                
                <button
                  onClick={onExploreServicesClick}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-black/10 backdrop-blur-md hover:bg-white/10 px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-sm font-bold text-white transition cursor-pointer"
                >
                  {activeSlide.secondaryCta || "Our Technical Standards"}
                </button>

                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 px-5 py-3.5 md:px-6 md:py-4 text-xs md:text-sm font-bold text-white transition cursor-pointer"
                >
                  <Video className="h-4 w-4 text-[#FFC107]" />
                  Watch Video
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. ANIMATED STATISTICS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10"
        >
          {trustStatsToUse.map((stat, index) => (
            <div key={index} className="space-y-1">
              <span className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FFC107] block tracking-tight font-sans">
                {stat.metric}
              </span>
              <span className="text-xs md:text-sm text-slate-300 font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>

      {/* 4. SLIDER NAVIGATION ARROWS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 lg:left-12 z-30 p-3 rounded-full border border-white/10 bg-slate-950/20 hover:bg-slate-950/80 text-white transition-all cursor-pointer hover:scale-105 active:scale-95 group backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:text-[#FFC107] transition-colors" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 lg:right-12 z-30 p-3 rounded-full border border-white/10 bg-slate-950/20 hover:bg-slate-950/80 text-white transition-all cursor-pointer hover:scale-105 active:scale-95 group backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:text-[#FFC107] transition-colors" />
      </button>

      {/* 5. PROGRESS PAGINATION DOTS & PLAY/PAUSE */}
      <div className="absolute bottom-8 right-5 md:right-12 lg:right-24 z-30 flex items-center gap-4 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-slate-400 hover:text-white transition cursor-pointer"
          title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5 text-[#FFC107]" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        <div className="h-3 w-px bg-white/20" />

        <div className="flex items-center space-x-2">
          {slidesToUse.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="relative flex items-center justify-center p-1 group cursor-pointer"
              title={`Go to slide ${index + 1}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-[#FFC107]"
                    : "w-1.5 bg-white/40 group-hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 6. EXPANSIVE EMBEDDED PROJECT VIDEO MODAL */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
          >
            <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-slate-900/80 text-white hover:text-[#FFC107] hover:scale-105 active:scale-95 transition cursor-pointer border border-white/10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Seamless high-quality clean energy presentation background looping placeholder video */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/g8vB7sP0iA4?autoplay=1&mute=0"
                title="TAPCO Solar Smart Energy Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
