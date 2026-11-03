import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { Project } from "../../components/admin/AdminData";
import { 
  Plus, Trash, Edit2, Save, Briefcase, FileText, 
  MapPin, User, DollarSign, Clock, Settings, X, Star
} from "lucide-react";

export default function ProjectsCMS() {
  const { projectsList, setProjectsList, addAuditLog } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Partial<Project>>({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [newState, setNewState] = useState<Omit<Project, "id" | "progress">>({
    customer: "Kano Teaching Hospital",
    phase: "Design",
    engineer: "Engr. Louis Olosunde",
    cost: 45000000,
    timeline: "Due Oct 2026",
    doc: "Hospital_Rooftop_Sizing.pdf",
    address: "Zaria Road, Kano",
    notes: "Clinical backup with emergency room failover banks.",
    batterySpecs: "4x Sunsynk 15kWh LFP",
    panelSpecs: "40x TAPCO 550W Bifacial"
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setEditState({ ...proj });
  };

  const handleSave = () => {
    if (!editingId) return;
    setProjectsList(prev => prev.map(p => p.id === editingId ? { ...p, ...editState } as Project : p));
    setEditingId(null);
    showToast(`Updated Grid Project: ${editState.customer}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to completely de-register this solar installation project?")) {
      setProjectsList(prev => prev.filter(p => p.id !== id));
      showToast(`Removed project registry ID: ${id}`);
    }
  };

  const handleAdd = () => {
    const fresh: Project = {
      id: `P-${500 + projectsList.length + 1}`,
      ...newState,
      progress: 0
    };
    setProjectsList(prev => [...prev, fresh]);
    setShowAddModal(false);
    showToast(`Registered new Solar Power Grid Project: ${fresh.customer}`);
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setProjectsList(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
    showToast(`Advanced Project ID ${id} progress to ${progress}%`);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#0057B8]" />
            Solar Power Grids CMS (Projects)
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Publish completed/ongoing microgrid assets, monitor engineering progress, set costs, and declare physical hardware specifications.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Register Solar Grid
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 gap-6">
        {projectsList.map((proj) => (
          <div key={proj.id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/20 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100/60 pb-3 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-black text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">{proj.id}</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{proj.customer}</h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                  proj.phase === "Commissioned" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                  proj.phase === "Testing" ? "bg-cyan-50 border-cyan-100 text-cyan-700" :
                  proj.phase === "Installation" ? "bg-blue-50 border-blue-100 text-blue-700" :
                  "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  {proj.phase}
                </span>

                <span className="text-xs font-black text-[#0057B8] bg-[#0057B8]/5 border border-[#0057B8]/10 px-2.5 py-1 rounded-lg">
                  ₦{(proj.cost / 1000000).toFixed(1)}M Naira
                </span>

                <div className="flex gap-1 ml-auto">
                  <button 
                    onClick={() => handleEdit(proj)}
                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 border border-red-100 bg-white text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editing State fields */}
            {editingId === proj.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Customer Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.customer || ""}
                    onChange={e => setEditState(p => ({ ...p, customer: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Assigned Engineer</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.engineer || ""}
                    onChange={e => setEditState(p => ({ ...p, engineer: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Timeline / Due Date</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.timeline || ""}
                    onChange={e => setEditState(p => ({ ...p, timeline: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Cost Value (Naira)</label>
                  <input 
                    type="number" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.cost || 0}
                    onChange={e => setEditState(p => ({ ...p, cost: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Location / Address</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.address || ""}
                    onChange={e => setEditState(p => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Technical Blueprint (File Ref)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.doc || ""}
                    onChange={e => setEditState(p => ({ ...p, doc: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Battery Specifications</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 15x BYD 15kWh"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.batterySpecs || ""}
                    onChange={e => setEditState(p => ({ ...p, batterySpecs: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Panel Specifications</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 120x TAPCO 550W Panels"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.panelSpecs || ""}
                    onChange={e => setEditState(p => ({ ...p, panelSpecs: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Phase Stage</label>
                  <select 
                    className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl"
                    value={editState.phase}
                    onChange={e => setEditState(p => ({ ...p, phase: e.target.value as any }))}
                  >
                    <option value="Pre-Planning">Pre-Planning</option>
                    <option value="Design">Design</option>
                    <option value="Installation">Installation</option>
                    <option value="Testing">Testing</option>
                    <option value="Commissioned">Commissioned</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label>Grid Notes & Progress Details</label>
                  <textarea 
                    rows={2}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                    value={editState.notes || ""}
                    onChange={e => setEditState(p => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 border-t pt-3">
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 border rounded-lg bg-white cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-3.5 py-1.5 bg-[#0057B8] text-white rounded-lg cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Specs metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#0057B8]" />
                    <span>Engineer: <span className="text-slate-600">{proj.engineer}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0057B8]" />
                    <span>Location: <span className="text-slate-600">{proj.address}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#0057B8]" />
                    <span>Due: <span className="text-slate-600">{proj.timeline}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#0057B8]" />
                    <span>Blueprint: <span className="text-slate-600">{proj.doc}</span></span>
                  </div>
                </div>

                {proj.notes && (
                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 border border-slate-100/40 p-3 rounded-xl">
                    {proj.notes}
                  </p>
                )}

                {/* Specs tags */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#0057B8]">
                  {proj.panelSpecs && (
                    <span className="px-2.5 py-1 bg-slate-100/50 rounded-lg">Panels: {proj.panelSpecs}</span>
                  )}
                  {proj.batterySpecs && (
                    <span className="px-2.5 py-1 bg-slate-100/50 rounded-lg">Battery: {proj.batterySpecs}</span>
                  )}
                </div>

                {/* Physical Progress Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-slate-500">Installation Progress</span>
                    <span className="text-[#0057B8]">{proj.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      className="flex-1 accent-[#0057B8] h-1 bg-slate-100 rounded-lg cursor-pointer"
                      value={proj.progress}
                      onChange={e => handleUpdateProgress(proj.id, Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Register New Solar Power Grid</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div>
                <label>Customer Name</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.customer}
                  onChange={e => setNewState(prev => ({ ...prev, customer: e.target.value }))}
                />
              </div>

              <div>
                <label>Engineer Assigned</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.engineer}
                  onChange={e => setNewState(prev => ({ ...prev, engineer: e.target.value }))}
                />
              </div>

              <div>
                <label>Project Cost (Naira)</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.cost}
                  onChange={e => setNewState(prev => ({ ...prev, cost: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label>Timeline Due Date</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.timeline}
                  onChange={e => setNewState(prev => ({ ...prev, timeline: e.target.value }))}
                />
              </div>

              <div className="col-span-2">
                <label>Location / Site Address</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.address}
                  onChange={e => setNewState(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <label>Battery Chemistry Sizing</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4x Sunsynk 15kWh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.batterySpecs}
                  onChange={e => setNewState(prev => ({ ...prev, batterySpecs: e.target.value }))}
                />
              </div>

              <div>
                <label>Panel Array Wattage</label>
                <input 
                  type="text" 
                  placeholder="e.g. 40x TAPCO 550W"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newState.panelSpecs}
                  onChange={e => setNewState(prev => ({ ...prev, panelSpecs: e.target.value }))}
                />
              </div>

              <div className="col-span-2">
                <label>Initial Logistics / Sizing Notes</label>
                <textarea 
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500 mt-1"
                  value={newState.notes}
                  onChange={e => setNewState(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAdd} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Register Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
