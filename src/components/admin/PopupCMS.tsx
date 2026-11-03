import React, { useState } from "react";
import { useCMS, PopupConfig } from "../../context/CMSContext";
import { Sliders, Plus, Trash, Edit2, Save, X, Eye, EyeOff, Calendar } from "lucide-react";

export default function PopupCMS() {
  const { popupsList, setPopupsList, addAuditLog } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Partial<PopupConfig>>({});

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleEdit = (pop: PopupConfig) => {
    setEditingId(pop.id);
    setEditState({ ...pop });
  };

  const handleSave = () => {
    if (!editingId) return;
    setPopupsList(prev => prev.map(p => p.id === editingId ? { ...p, ...editState } as PopupConfig : p));
    setEditingId(null);
    showToast(`Updated smart popup parameters.`);
  };

  const handleToggleActive = (id: string) => {
    setPopupsList(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isActive;
        showToast(`${nextState ? "Engaged" : "Disengaged"} promotional popup.`);
        return { ...p, isActive: nextState };
      }
      return p;
    }));
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#0057B8]" />
          Smart Promotional Pop-Up Manager
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Configure marketing overlays, set checkout incentives, target specific page directories, and establish dismissal cookies.
        </p>
      </div>

      <div className="space-y-4">
        {popupsList.map(pop => (
          <div key={pop.id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/30 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-slate-400">ID: {pop.id}</span>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{pop.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                  pop.isActive ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-slate-100 border text-slate-500"
                }`}>
                  {pop.isActive ? "Active / Engaged" : "Draft / Inactive"}
                </span>

                <button 
                  onClick={() => handleToggleActive(pop.id)}
                  className="px-2.5 py-1 bg-white border rounded-lg text-[10px] font-black cursor-pointer hover:bg-slate-50 text-slate-600"
                >
                  {pop.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </div>

            {editingId === pop.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Popup Title (Internal)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.title || ""}
                    onChange={e => setEditState(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Promo Headline (Visitor Facing)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.headline || ""}
                    onChange={e => setEditState(p => ({ ...p, headline: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Visitor Image URL (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.image || ""}
                    onChange={e => setEditState(p => ({ ...p, image: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Action Button Text</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.buttonText || ""}
                    onChange={e => setEditState(p => ({ ...p, buttonText: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Action Button Link</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editState.buttonLink || ""}
                    onChange={e => setEditState(p => ({ ...p, buttonLink: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Dismissal Policy</label>
                  <select 
                    className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl"
                    value={editState.closeBehaviour}
                    onChange={e => setEditState(p => ({ ...p, closeBehaviour: e.target.value as any }))}
                  >
                    <option value="once">Once per visitor (Recommended)</option>
                    <option value="always">Show on every reload</option>
                    <option value="session">Once per browser session</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label>Full Promotional Description Copy</label>
                  <textarea 
                    rows={2}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                    value={editState.description || ""}
                    onChange={e => setEditState(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 border-t pt-3">
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 border rounded-lg bg-white cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-3.5 py-1.5 bg-[#0057B8] text-white rounded-lg cursor-pointer">
                    Save Parameters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                <div className="md:col-span-3 space-y-2">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">Headline: {pop.headline}</h5>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed bg-white p-3 rounded-xl border border-slate-100/50">
                    {pop.description}
                  </p>
                  <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                    <span>Target Page directories: <span className="text-slate-600">{pop.targetPages.join(", ")}</span></span>
                    <span>Dismissal Behaviour: <span className="text-[#0057B8]">{pop.closeBehaviour}</span></span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={() => handleEdit(pop)}
                    className="px-3.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer text-center"
                  >
                    Edit Layout Config
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
