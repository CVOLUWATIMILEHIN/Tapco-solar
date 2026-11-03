import React, { useState } from "react";
import { useCMS, HeroSlide, TrustStat, WhyUsItem } from "../../context/CMSContext";
import { 
  Sliders, Plus, Trash, ArrowUp, ArrowDown, Image as ImageIcon, 
  Video, Eye, EyeOff, Save, Check, RefreshCw, Layers, Edit2, 
  CheckCircle, FileText, Globe, Star, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomepageCMS() {
  const { 
    heroSlides, setHeroSlides,
    trustStats, setTrustStats,
    companyIntro, setCompanyIntro,
    whyUsItems, setWhyUsItems,
    sectionOrder, setSectionOrder,
    partnersList, setPartnersList,
    ctaHeadline, setCtaHeadline,
    ctaDescription, setCtaDescription,
    ctaButtonText, setCtaButtonText,
    addAuditLog
  } = useCMS();

  const [activeSubTab, setActiveSubTab] = useState<"hero" | "stats" | "intro" | "why" | "sections">("hero");
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideEditState, setSlideEditState] = useState<Partial<HeroSlide>>({});
  
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [newSlideState, setNewSlideState] = useState({
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    label: "Custom Symmetrical Grid Station",
    category: "Residential Grid Upgrade",
    headline: "Uninterrupted Smart Power Sized Specially for You",
    description: "Empower your family with premium solar systems and sub-second ATS failover grids.",
    secondaryCta: "Sizing Quote"
  });

  const showToast = (msg: string) => {
    // Rely on window alerts or mock toast, we will add action logging
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  // --- Hero Slider Actions ---
  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideEditState({ ...slide });
  };

  const handleSaveSlideEdit = () => {
    if (!editingSlideId) return;
    setHeroSlides(prev => prev.map(s => s.id === editingSlideId ? { ...s, ...slideEditState } as HeroSlide : s));
    setEditingSlideId(null);
    showToast(`Updated Hero slide: "${slideEditState.headline}"`);
  };

  const handleTogglePublishSlide = (id: string) => {
    setHeroSlides(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isPublished;
        showToast(`${nextState ? "Published" : "Unpublished"} Hero slide ID ${id}`);
        return { ...s, isPublished: nextState };
      }
      return s;
    }));
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm("Are you sure you want to completely delete this hero slide from rotation?")) {
      setHeroSlides(prev => prev.filter(s => s.id !== id));
      showToast(`Removed Hero slide ID: ${id}`);
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= heroSlides.length) return;
    
    setHeroSlides(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
  };

  const handleAddSlide = () => {
    const fresh: HeroSlide = {
      id: `slide-${Date.now()}`,
      ...newSlideState,
      isPublished: true,
      isArchived: false
    };
    setHeroSlides(prev => [...prev, fresh]);
    setShowAddSlide(false);
    showToast(`Created new Hero slider item: "${fresh.headline}"`);
  };

  // --- Reordering Homepage Sections ---
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sectionOrder.length) return;
    setSectionOrder(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
    showToast(`Shifted homepage section layout sequence.`);
  };

  // --- Stats Actions ---
  const handleUpdateStat = (id: string, field: keyof TrustStat, value: string) => {
    setTrustStats(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // --- Why Choose Us Actions ---
  const handleUpdateWhyUs = (id: string, field: keyof WhyUsItem, value: string) => {
    setWhyUsItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#0057B8]" />
            Homepage Design & Content Manager
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Reorder main sections, adjust slides, modify copywriting, and control published statuses live.
          </p>
        </div>
        
        {/* Reset / Preset */}
        <button
          onClick={() => {
            if (confirm("Reset homepage config to initial factory defaults?")) {
              localStorage.removeItem("tapco_cms_hero_slides");
              localStorage.removeItem("tapco_cms_trust_stats");
              localStorage.removeItem("tapco_cms_company_intro");
              localStorage.removeItem("tapco_cms_why_us");
              localStorage.removeItem("tapco_cms_section_order");
              window.location.reload();
            }
          }}
          className="px-3.5 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Factory Defaults
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {[
          { id: "hero", label: "Hero Slider Nodes" },
          { id: "stats", label: "Trust Metrics" },
          { id: "intro", label: "Corporate Intro" },
          { id: "why", label: "Why Choose TAPCO" },
          { id: "sections", label: "Layout Section Sequence" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-[#0057B8]/10 text-[#0057B8] border border-[#0057B8]/20"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}
      <div>
        {activeSubTab === "hero" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Active Slide Sequence ({heroSlides.length})
              </span>
              <button
                onClick={() => setShowAddSlide(true)}
                className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg shadow-[#0057B8]/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Slider Node
              </button>
            </div>

            {/* Slider items lists */}
            <div className="grid grid-cols-1 gap-4">
              {heroSlides.map((slide, idx) => (
                <div 
                  key={slide.id} 
                  className={`border rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start bg-white transition duration-200 hover:shadow-md ${
                    slide.isPublished ? "border-slate-100" : "border-amber-100 bg-amber-50/10"
                  }`}
                >
                  {/* Slide Preview thumbnail */}
                  <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                    <img 
                      src={slide.image} 
                      alt={slide.label} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/85 text-[9px] font-extrabold uppercase rounded text-white tracking-widest">
                      {slide.category}
                    </div>
                  </div>

                  {/* Slide Information */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">#{idx+1}</span>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">{slide.headline}</h4>
                      {!slide.isPublished && (
                        <span className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-[9px] text-amber-700 font-extrabold uppercase rounded">
                          Unpublished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{slide.description}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                      <span>Label: <span className="text-slate-600">{slide.label}</span></span>
                      <span>•</span>
                      <span>CTA: <span className="text-[#0057B8]">{slide.secondaryCta}</span></span>
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex md:flex-col justify-end gap-1.5 w-full md:w-auto self-stretch shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="flex gap-1 mr-auto md:mr-0">
                      <button 
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, "up")}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                      >
                        <ArrowUp className="h-3.5 w-3.5 text-slate-600" />
                      </button>
                      <button 
                        disabled={idx === heroSlides.length - 1}
                        onClick={() => handleMoveSlide(idx, "down")}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                      >
                        <ArrowDown className="h-3.5 w-3.5 text-slate-600" />
                      </button>
                    </div>

                    <div className="flex md:flex-col gap-1.5">
                      <button 
                        onClick={() => handleTogglePublishSlide(slide.id)}
                        className={`p-1.5 border rounded-lg transition flex items-center justify-center gap-1 cursor-pointer text-xs font-bold ${
                          slide.isPublished 
                            ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" 
                            : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        }`}
                        title={slide.isPublished ? "Unpublish slide" : "Publish slide"}
                      >
                        {slide.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span className="hidden md:inline">{slide.isPublished ? "Draft" : "Publish"}</span>
                      </button>

                      <button 
                        onClick={() => handleEditSlide(slide)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center gap-1 cursor-pointer text-xs font-bold"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Edit</span>
                      </button>

                      <button 
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer text-xs font-bold"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing Slide Modal */}
            {editingSlideId && (
              <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] border border-slate-100 max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Modify Hero Rotation Node</h3>
                    <button onClick={() => setEditingSlideId(null)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-bold text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={slideEditState.image || ""}
                          onChange={e => setSlideEditState(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label>Category Label</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={slideEditState.category || ""}
                          onChange={e => setSlideEditState(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label>Headline Copy</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={slideEditState.headline || ""}
                        onChange={e => setSlideEditState(prev => ({ ...prev, headline: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label>Description Paragraph</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                        value={slideEditState.description || ""}
                        onChange={e => setSlideEditState(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label>Label</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={slideEditState.label || ""}
                          onChange={e => setSlideEditState(prev => ({ ...prev, label: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label>CTA Button Text</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={slideEditState.secondaryCta || ""}
                          onChange={e => setSlideEditState(prev => ({ ...prev, secondaryCta: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button 
                      onClick={() => setEditingSlideId(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveSlideEdit}
                      className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Slide Modal */}
            {showAddSlide && (
              <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] border border-slate-100 max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Add New Hero Slider Node</h3>
                    <button onClick={() => setShowAddSlide(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-bold text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={newSlideState.image}
                          onChange={e => setNewSlideState(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label>Category Label</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={newSlideState.category}
                          onChange={e => setNewSlideState(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label>Headline Copy</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newSlideState.headline}
                        onChange={e => setNewSlideState(prev => ({ ...prev, headline: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label>Description Paragraph</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                        value={newSlideState.description}
                        onChange={e => setNewSlideState(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label>Label</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={newSlideState.label}
                          onChange={e => setNewSlideState(prev => ({ ...prev, label: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label>CTA Button Text</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          value={newSlideState.secondaryCta}
                          onChange={e => setNewSlideState(prev => ({ ...prev, secondaryCta: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button 
                      onClick={() => setShowAddSlide(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddSlide}
                      className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer"
                    >
                      Create Slide Node
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "stats" && (
          <div className="space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Global Trust indicators / Counter Badges
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trustStats.map(stat => (
                <div key={stat.id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black font-mono text-slate-400">{stat.id.toUpperCase()}</span>
                    <span className="text-xs font-bold text-[#00A651] bg-[#00A651]/5 border border-[#00A651]/10 px-2 py-0.5 rounded-lg">Live badge</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                    <div className="space-y-1">
                      <label>Metric Value</label>
                      <input 
                        type="text" 
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-[#0057B8]"
                        value={stat.value}
                        onChange={e => handleUpdateStat(stat.id, "value", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <label>Label</label>
                      <input 
                        type="text" 
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        value={stat.label}
                        onChange={e => handleUpdateStat(stat.id, "label", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-bold text-slate-700">
                    <label>Brief Supporting Description</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-500"
                      value={stat.desc}
                      onChange={e => handleUpdateStat(stat.id, "desc", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "intro" && (
          <div className="space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Company Introduction Copy & Video Sinks
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-1">
                  <label>Section Badge</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={companyIntro.badge}
                    onChange={e => setCompanyIntro(prev => ({ ...prev, badge: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Main Section Headline</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={companyIntro.headline}
                    onChange={e => setCompanyIntro(prev => ({ ...prev, headline: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Full Introduction Description</label>
                  <textarea 
                    rows={6}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 leading-relaxed"
                    value={companyIntro.description}
                    onChange={e => setCompanyIntro(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/40">
                <div className="space-y-1">
                  <label>Company Intro Background Video URL</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={companyIntro.videoUrl}
                    onChange={e => setCompanyIntro(prev => ({ ...prev, videoUrl: e.target.value }))}
                  />
                  <span className="text-[10px] text-slate-400 block font-semibold">Provide direct MP4 link or YouTube embeds</span>
                </div>

                <div className="space-y-3">
                  <label>Mini Stats Badges</label>
                  {companyIntro.stats.map((m, mIdx) => (
                    <div key={mIdx} className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Value" 
                        className="p-2 bg-white border border-slate-200 rounded-lg font-black text-[#0057B8]"
                        value={m.value}
                        onChange={e => {
                          const copy = [...companyIntro.stats];
                          copy[mIdx].value = e.target.value;
                          setCompanyIntro(prev => ({ ...prev, stats: copy }));
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Label" 
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold"
                        value={m.label}
                        onChange={e => {
                          const copy = [...companyIntro.stats];
                          copy[mIdx].label = e.target.value;
                          setCompanyIntro(prev => ({ ...prev, stats: copy }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner Config */}
            <div className="border-t pt-6 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Bottom Floating CTA Sizing Banner
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                <div className="md:col-span-2 space-y-1">
                  <label>CTA Headline</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={ctaHeadline}
                    onChange={e => setCtaHeadline(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label>CTA Button Text</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={ctaButtonText}
                    onChange={e => setCtaButtonText(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label>CTA Description Copy</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                    value={ctaDescription}
                    onChange={e => setCtaDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "why" && (
          <div className="space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Why Choose TAPCO Section Benefits
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyUsItems.map(item => (
                <div key={item.id} className="border border-slate-100 p-5 rounded-2xl bg-white space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#0057B8]/5 text-[#0057B8] border border-[#0057B8]/10 rounded-lg flex items-center justify-center font-bold text-xs">
                      {item.iconName.substring(0, 2)}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 font-mono">{item.id.toUpperCase()}</span>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    <div className="space-y-1">
                      <label>Benefit Header</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={item.title}
                        onChange={e => handleUpdateWhyUs(item.id, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label>Detailed Explanation</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 leading-relaxed"
                        value={item.desc}
                        onChange={e => handleUpdateWhyUs(item.id, "desc", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "sections" && (
          <div className="space-y-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Manage Drag-And-Drop Layout section positions
            </span>

            <div className="max-w-md border border-slate-100 p-4 rounded-2xl bg-slate-50/40 space-y-2">
              {sectionOrder.map((sec, idx) => (
                <div 
                  key={sec} 
                  className="bg-white border border-slate-100 px-4 py-3.5 rounded-xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black text-slate-300">#{idx+1}</span>
                    <span className="text-xs font-black text-slate-700 capitalize tracking-wider">
                      {sec === "intro" ? "Company Introduction" : 
                       sec === "trust" ? "Trust Metrics Counter" :
                       sec === "whyUs" ? "Benefits (Why Choose Us)" :
                       sec === "packages" ? "Sized Solar Packages" :
                       sec === "calculator" ? "Load Sizing Calculator" :
                       sec === "schools" ? "Schools Campaign Banner" :
                       sec === "gallery" ? "Projects Showcase" :
                       sec === "cta" ? "Bottom CTA Banner" :
                       sec + " Section"}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                      className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                    <button 
                      disabled={idx === sectionOrder.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                      className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                    >
                      <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
