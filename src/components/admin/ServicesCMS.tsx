import React, { useState } from "react";
import { useCMS, ServiceCMSItem } from "../../context/CMSContext";
import { 
  Plus, Trash, Edit2, Save, Layers, HelpCircle, 
  Eye, EyeOff, Globe, Image as ImageIcon, Video, X 
} from "lucide-react";

export default function ServicesCMS() {
  const { servicesList, setServicesList, addAuditLog } = useCMS();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceCMSItem>>({});

  const [showAddService, setShowAddService] = useState(false);
  const [newServiceState, setNewServiceState] = useState({
    title: "Agricultural Solar Irrigation",
    desc: "Deploy smart, hybrid DC pumping systems to automate farm irrigation in Northern Nigeria.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    benefit: "Reduces fuel irrigation expense by 100% and secures harvest lines.",
    details: ["Double mppt solar irrigation controllers", "High discharge stainless steel submersible pumps", "Corrosion resistant mounting structures"],
    seoTitle: "Best Solar Irrigation Systems Nigeria - TAPCO Agri-Solar",
    seoDesc: "NEMSA-approved high-efficiency solar water pumps for local crop automation."
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleSelectService = (srv: ServiceCMSItem) => {
    setSelectedServiceId(srv.id);
    setEditingService({ ...srv });
  };

  const handleSaveService = () => {
    if (!selectedServiceId) return;
    setServicesList(prev => prev.map(s => s.id === selectedServiceId ? { ...s, ...editingService } as ServiceCMSItem : s));
    setSelectedServiceId(null);
    showToast(`Saved modifications for service: "${editingService.title}"`);
  };

  const handleTogglePublish = (id: string) => {
    setServicesList(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isPublished;
        showToast(`${nextState ? "Published" : "Deactivated"} service node: "${s.title}"`);
        return { ...s, isPublished: nextState };
      }
      return s;
    }));
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to completely remove this solar service?")) {
      setServicesList(prev => prev.filter(s => s.id !== id));
      if (selectedServiceId === id) setSelectedServiceId(null);
      showToast(`Dismounted service ID: ${id}`);
    }
  };

  const handleAddService = () => {
    const fresh: ServiceCMSItem = {
      id: `srv-${Date.now()}`,
      ...newServiceState,
      isPublished: true,
      gallery: [],
      faqs: [
        { question: "What is the typical warranty?", answer: "We offer a 5-year comprehensive system warranty on our smart pumps." }
      ]
    };
    setServicesList(prev => [...prev, fresh]);
    setShowAddService(false);
    showToast(`Added new solar service: "${fresh.title}"`);
  };

  // Helper arrays update
  const handleUpdateDetailPoint = (idx: number, val: string) => {
    const copy = [...(editingService.details || [])];
    copy[idx] = val;
    setEditingService(p => ({ ...p, details: copy }));
  };

  const handleAddDetailPoint = () => {
    setEditingService(p => ({ ...p, details: [...(p.details || []), "New scope item..."] }));
  };

  const handleRemoveDetailPoint = (idx: number) => {
    setEditingService(p => ({ ...p, details: (p.details || []).filter((_, i) => i !== idx) }));
  };

  // FAQ Helpers
  const handleUpdateFAQ = (idx: number, field: "question" | "answer", val: string) => {
    const copy = [...(editingService.faqs || [])];
    copy[idx][field] = val;
    setEditingService(p => ({ ...p, faqs: copy }));
  };

  const handleAddFAQ = () => {
    setEditingService(p => ({ ...p, faqs: [...(p.faqs || []), { question: "New Question?", answer: "New Answer text..." }] }));
  };

  const handleRemoveFAQ = (idx: number) => {
    setEditingService(p => ({ ...p, faqs: (p.faqs || []).filter((_, i) => i !== idx) }));
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#0057B8]" />
            Solar Services CMS Console
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Build and publish core company services, map detailed technical scopes, write dynamic service FAQs, and inject SEO titles.
          </p>
        </div>

        <button
          onClick={() => setShowAddService(true)}
          className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Services lists */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Core Company Services</span>
          {servicesList.map(srv => (
            <div 
              key={srv.id}
              className={`p-4 border rounded-2xl flex flex-col gap-3 transition cursor-pointer hover:shadow-md ${
                selectedServiceId === srv.id 
                  ? "border-[#0057B8] bg-[#0057B8]/5" 
                  : srv.isPublished ? "border-slate-100" : "border-slate-100 opacity-60 bg-slate-50/50"
              }`}
              onClick={() => handleSelectService(srv)}
            >
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{srv.title}</h4>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => handleTogglePublish(srv.id)}
                    className="p-1 border rounded hover:bg-white transition"
                    title={srv.isPublished ? "Set to draft" : "Publish service"}
                  >
                    {srv.isPublished ? <Eye className="h-3 w-3 text-[#00A651]" /> : <EyeOff className="h-3 w-3 text-amber-500" />}
                  </button>
                  <button 
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1 border border-red-100 text-red-500 rounded hover:bg-red-50 transition"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{srv.desc}</p>
              
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t pt-2 border-slate-100/60 mt-1">
                <span>FAQs: {srv.faqs?.length || 0}</span>
                <span>Scope: {srv.details.length} points</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Editor form */}
        <div className="lg:col-span-2 border border-slate-100 p-6 rounded-[20px] bg-slate-50/20">
          {selectedServiceId ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-black text-[#0057B8] uppercase tracking-wider">Modifying: {editingService.title}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedServiceId(null)}
                    className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveService}
                    className="px-3.5 py-1.5 bg-[#0057B8] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#0057B8]/90"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Service Title</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingService.title || ""}
                    onChange={e => setEditingService(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Image URL</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingService.image || ""}
                    onChange={e => setEditingService(p => ({ ...p, image: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label>Core Marketing Description</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                    value={editingService.desc || ""}
                    onChange={e => setEditingService(p => ({ ...p, desc: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label>Service Benefit / Value Proposition</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                    value={editingService.benefit || ""}
                    onChange={e => setEditingService(p => ({ ...p, benefit: e.target.value }))}
                  />
                </div>
              </div>

              {/* Dynamic list: Scope Points */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Detailed Scope checklist</span>
                  <button 
                    onClick={handleAddDetailPoint}
                    className="px-2 py-1 text-[10px] font-black bg-[#00A651]/10 text-[#00A651] border border-[#00A651]/20 rounded-lg cursor-pointer"
                  >
                    + Add Scope Point
                  </button>
                </div>

                <div className="space-y-2">
                  {editingService.details?.map((pt, ptIdx) => (
                    <div key={ptIdx} className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                        value={pt}
                        onChange={e => handleUpdateDetailPoint(ptIdx, e.target.value)}
                      />
                      <button 
                        onClick={() => handleRemoveDetailPoint(ptIdx)}
                        className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic FAQs Editor */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Dynamic Service FAQs</span>
                  <button 
                    onClick={handleAddFAQ}
                    className="px-2 py-1 text-[10px] font-black bg-[#0057B8]/10 text-[#0057B8] border border-[#0057B8]/20 rounded-lg cursor-pointer"
                  >
                    + Add FAQ Node
                  </button>
                </div>

                <div className="space-y-3">
                  {editingService.faqs?.map((faq, fIdx) => (
                    <div key={fIdx} className="border border-slate-100 p-3 rounded-xl bg-white space-y-2 relative">
                      <button 
                        onClick={() => handleRemoveFAQ(fIdx)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                      
                      <div className="text-xs font-bold text-slate-700 space-y-1 pr-6">
                        <label>Question</label>
                        <input 
                          type="text" 
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                          value={faq.question}
                          onChange={e => handleUpdateFAQ(fIdx, "question", e.target.value)}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-700 space-y-1">
                        <label>Answer details</label>
                        <textarea 
                          rows={2}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-500"
                          value={faq.answer}
                          onChange={e => handleUpdateFAQ(fIdx, "answer", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4 border-t pt-4 text-xs font-bold text-slate-700">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide block">Service Page SEO settings</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label>SEO Title Tag</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      value={editingService.seoTitle || ""}
                      onChange={e => setEditingService(p => ({ ...p, seoTitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label>SEO Meta Description</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                      value={editingService.seoDesc || ""}
                      onChange={e => setEditingService(p => ({ ...p, seoDesc: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col justify-center items-center text-slate-400 font-medium">
              <Layers className="h-10 w-10 text-slate-200 mb-2" />
              <span>Select a core service on the left column to begin adjusting technical parameters.</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Add New Core Solar Service</h3>
              <button onClick={() => setShowAddService(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Service Title</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={newServiceState.title}
                  onChange={e => setNewServiceState(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label>Marketing Description</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                  value={newServiceState.desc}
                  onChange={e => setNewServiceState(p => ({ ...p, desc: e.target.value }))}
                />
              </div>
              <div>
                <label>Primary Image URL</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={newServiceState.image}
                  onChange={e => setNewServiceState(p => ({ ...p, image: e.target.value }))}
                />
              </div>
              <div>
                <label>Benefit Statement</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                  value={newServiceState.benefit}
                  onChange={e => setNewServiceState(p => ({ ...p, benefit: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddService(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddService} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Create Service Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
