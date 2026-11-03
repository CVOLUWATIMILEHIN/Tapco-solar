import React, { useState } from "react";
import { 
  Briefcase, Search, PlusCircle, Trash2, Check, HelpCircle,
  X, ShieldAlert, DollarSign, Calendar, FileText, Settings, UserCheck, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "./AdminData";

interface ProjectTrackerProps {
  projects: Project[];
  onAddProject: (proj: Omit<Project, "id" | "progress">) => void;
  onUpdateProjectProgress: (id: string, progress: number) => void;
  onUpdateProjectPhase: (id: string, phase: Project["phase"]) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectTracker({
  projects,
  onAddProject,
  onUpdateProjectProgress,
  onUpdateProjectPhase,
  onDeleteProject
}: ProjectTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [selectedProj, setSelectedProj] = useState<Project | null>(null);
  
  // New Project form modal
  const [showModal, setShowModal] = useState(false);
  const [newProj, setNewProj] = useState({
    customer: "",
    phase: "Design" as Project["phase"],
    engineer: "Engr. Louis",
    cost: 45000000,
    timeline: "Due Oct 15",
    doc: "Blueprints.pdf",
    address: "",
    notes: ""
  });

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.customer.toLowerCase().includes(searchQuery.toLowerCase()) || proj.engineer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = phaseFilter === "all" || proj.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest">Engineering Operations</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Solar Grid Portfolio</h2>
          <p className="text-xs text-slate-400 mt-0.5">Oversee real-time microgrid construction, site audits, and certification inspections.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Launch Grid Project</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm text-left">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {["all", "Pre-Planning", "Design", "Installation", "Testing", "Commissioned"].map(phase => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${phaseFilter === phase ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              {phase === "all" ? "All Grid Projects" : phase}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search grids or engineers..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* COMPACT BENTO CARD GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map(proj => (
          <motion.div
            key={proj.id}
            layoutId={proj.id}
            onClick={() => setSelectedProj(proj)}
            className={`bg-white border transition-all hover:border-[#0057B8]/40 p-6 rounded-[24px] shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between text-left space-y-4 ${selectedProj?.id === proj.id ? "border-[#0057B8]/60 ring-1 ring-[#0057B8]/20" : "border-[#E2E8F0]"}`}
            whileHover={{ y: -3 }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{proj.id}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase ${
                  proj.phase === "Commissioned" ? "bg-emerald-500/10 text-[#00A651]" :
                  proj.phase === "Testing" ? "bg-amber-500/10 text-amber-600" :
                  proj.phase === "Installation" ? "bg-blue-500/10 text-[#0057B8]" : "bg-slate-100 text-slate-500"
                }`}>
                  ● {proj.phase}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900">{proj.customer} Clean Grid</h3>
              <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-300" />
                {proj.address || "Abuja site cluster"}
              </p>
            </div>

            {/* Linear Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-extrabold font-mono text-slate-400">
                <span>INSTALLATION PIPELINE</span>
                <span className="text-[#0057B8]">{proj.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0057B8] to-[#00A651] transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-[9px] uppercase text-[#0057B8]">
                  {proj.engineer.slice(6, 8).toUpperCase()}
                </div>
                <span>{proj.engineer}</span>
              </div>
              <span className="font-extrabold text-slate-900">₦{(proj.cost / 1000000).toFixed(1)}M Valuation</span>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="md:col-span-3 py-16 bg-white border border-[#E2E8F0] rounded-[24px] text-center space-y-4">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">No active grids matched</h4>
              <p className="text-[11px] text-slate-400 font-medium">Verify your filter contexts or launch a brand new clean power grid.</p>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / SLIDER MODAL */}
      <AnimatePresence>
        {selectedProj && (
          <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-2xl w-full p-8 shadow-2xl space-y-6 text-left relative"
            >
              <button 
                onClick={() => setSelectedProj(null)} 
                className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#0057B8] uppercase tracking-widest bg-[#0057B8]/10 px-2.5 py-1 rounded-md">
                  Active Project Spec Sheet
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-2">{selectedProj.customer} Grid (ID: {selectedProj.id})</h3>
                <p className="text-xs text-slate-400 font-semibold">{selectedProj.timeline}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Grid Lead Engineer</span>
                  <p className="font-extrabold text-slate-800 text-sm mt-1">{selectedProj.engineer}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Contract Cost Valuation</span>
                  <p className="font-black text-slate-800 text-sm mt-1">₦{selectedProj.cost.toLocaleString()}</p>
                </div>
              </div>

              {/* Specs & Hardware parameters */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Equipment Checklist</h4>
                <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-600 font-semibold bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-400 uppercase block tracking-wide">Panels Array Specs</span>
                    <span className="text-slate-800 font-bold">{selectedProj.panelSpecs || "160x Monocrystalline Cells"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-400 uppercase block tracking-wide">Battery Storage Specs</span>
                    <span className="text-slate-800 font-bold">{selectedProj.batterySpecs || "2x LiFePO4 Powerwalls"}</span>
                  </div>
                </div>
              </div>

              {/* Progress and Phase controls */}
              <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Update Installation Phase</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={selectedProj.phase}
                    onChange={e => {
                      onUpdateProjectPhase(selectedProj.id, e.target.value as any);
                      setSelectedProj(prev => prev ? { ...prev, phase: e.target.value as any } : null);
                    }}
                  >
                    <option value="Pre-Planning">Pre-Planning</option>
                    <option value="Design">Design</option>
                    <option value="Installation">Installation</option>
                    <option value="Testing">Testing</option>
                    <option value="Commissioned">Commissioned</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] uppercase font-black text-slate-400 tracking-wider">
                    <label>Pipeline Percentage</label>
                    <span className="text-[#0057B8] font-bold text-xs">{selectedProj.progress}%</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(0, selectedProj.progress - 10);
                        onUpdateProjectProgress(selectedProj.id, next);
                        setSelectedProj(prev => prev ? { ...prev, progress: next } : null);
                      }}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition uppercase cursor-pointer"
                    >
                      -10% Drop
                    </button>
                    <button
                      onClick={() => {
                        const next = Math.min(100, selectedProj.progress + 10);
                        onUpdateProjectProgress(selectedProj.id, next);
                        setSelectedProj(prev => prev ? { ...prev, progress: next } : null);
                      }}
                      className="flex-1 py-2.5 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/95 transition uppercase cursor-pointer"
                    >
                      +10% Advance
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW PROJECT CREATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-lg w-full p-8 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Onboard Power Grid</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Project Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chevron Housing Scheme"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newProj.customer}
                  onChange={e => setNewProj(prev => ({ ...prev, customer: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Installation Address Coordinates</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 41, Lekki-Epe Axis, Lagos"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newProj.address}
                  onChange={e => setNewProj(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Assigned Grid Engineer</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={newProj.engineer}
                    onChange={e => setNewProj(prev => ({ ...prev, engineer: e.target.value }))}
                  >
                    <option value="Engr. Louis">Engr. Louis Olosunde</option>
                    <option value="Engr. Yusuf">Engr. Yusuf Bello</option>
                    <option value="Engr. Amadi">Engr. Amadi Ibrahim</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Grid Project Phase</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={newProj.phase}
                    onChange={e => setNewProj(prev => ({ ...prev, phase: e.target.value as any }))}
                  >
                    <option value="Pre-Planning">Pre-Planning</option>
                    <option value="Design">Design</option>
                    <option value="Installation">Installation</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Contract Valuation Spend (₦)</label>
                  <input
                    type="number"
                    placeholder="Naira cost"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newProj.cost}
                    onChange={e => setNewProj(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Due Completion Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. Due Nov 15"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newProj.timeline}
                    onChange={e => setNewProj(prev => ({ ...prev, timeline: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newProj.customer || !newProj.address) return;
                onAddProject({
                  customer: newProj.customer,
                  phase: newProj.phase,
                  engineer: newProj.engineer,
                  cost: newProj.cost,
                  timeline: newProj.timeline,
                  doc: newProj.doc,
                  address: newProj.address,
                  notes: newProj.notes
                });
                setShowModal(false);
                setNewProj({ customer: "", phase: "Design", engineer: "Engr. Louis", cost: 45000000, timeline: "Due Oct 15", doc: "Blueprints.pdf", address: "", notes: "" });
              }}
              className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 py-3 text-xs font-bold uppercase text-white transition shadow-lg"
            >
              Dispatch Project Engineering Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
