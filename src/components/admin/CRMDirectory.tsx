import React, { useState } from "react";
import { 
  Users, Mail, Phone, MapPin, Search, PlusCircle, Trash2, Edit,
  X, ShieldAlert, DollarSign, Calendar, FileText, Send, Check, MessageSquare, Clock, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Customer, Lead } from "./AdminData";

interface CRMDirectoryProps {
  customers: Customer[];
  leads: Lead[];
  onAddCustomer: (cust: Omit<Customer, "id" | "spend" | "tickets" | "joinedDate">) => void;
  onDeleteCustomer: (id: string) => void;
  onAddLead: (lead: Omit<Lead, "id" | "date">) => void;
  onDeleteLead: (id: string) => void;
}

export default function CRMDirectory({
  customers,
  leads,
  onAddCustomer,
  onDeleteCustomer,
  onAddLead,
  onDeleteLead
}: CRMDirectoryProps) {
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "leads">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  
  // Detail views state
  const [profileTab, setProfileTab] = useState<"overview" | "timeline" | "payments" | "documents" | "notes">("overview");
  
  // Note auto-save helper
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({});
  const [noteSaving, setNoteSaving] = useState(false);

  // Forms modal
  const [showCustModal, setShowCustModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: "", email: "", phone: "", loc: "", system: "", notes: "", status: "Active" as const });

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", value: 15000000, stage: "Design" as const, source: "Referral" });

  const handleNoteChange = (custId: string, value: string) => {
    setCustomerNotes(prev => ({ ...prev, [custId]: value }));
    setNoteSaving(true);
    setTimeout(() => {
      setNoteSaving(false);
    }, 800);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest">Enterprise CRM Hub</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Client & Lead Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track multi-million Naira energy bids, customer warranties, and installation agreements.</p>
        </div>
        <div className="flex gap-2">
          {activeSubTab === "directory" ? (
            <button
              onClick={() => setShowCustModal(true)}
              className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#0057B8]/15"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Register Customer</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLeadModal(true)}
              className="rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00A651]/15"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Pipeline Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND TAB NAV BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => {
              setActiveSubTab("directory");
              setSelectedCust(null);
            }}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeSubTab === "directory" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Registered Customers ({customers.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab("leads");
              setSelectedCust(null);
            }}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeSubTab === "leads" ? "bg-white text-[#00A651] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Bidding Sales Leads ({leads.length})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab === "directory" ? "customers" : "leads"}...`}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:border-[#0057B8] transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CORE CONTENT LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COMPONENT: DIRECTORY TABLE (Expansive Grid Layout) */}
        <div className={`transition-all duration-300 ${selectedCust ? "lg:col-span-7" : "lg:col-span-12"} bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden`}>
          {activeSubTab === "directory" ? (
            /* CUSTOMERS TABLE */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">ID & Customer Profile</th>
                    <th className="py-4 px-6">Assigned Solar Array</th>
                    <th className="py-4 px-6">Naira Volume</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredCustomers.map(cust => (
                    <tr 
                      key={cust.id}
                      onClick={() => {
                        setSelectedCust(cust);
                        setProfileTab("overview");
                      }}
                      className={`hover:bg-[#0057B8]/5 cursor-pointer transition-colors ${selectedCust?.id === cust.id ? "bg-[#0057B8]/5" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-bold flex items-center justify-center text-sm uppercase shrink-0">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{cust.name}</h4>
                            <span className="text-[10px] text-slate-400 font-medium block">{cust.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-semibold">{cust.system}</td>
                      <td className="py-4 px-6 text-xs font-black text-slate-800">₦{cust.spend.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${cust.status === "Active" ? "bg-emerald-500/10 text-[#00A651]" : "bg-slate-100 text-slate-500"}`}>
                          ● {cust.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onDeleteCustomer(cust.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer inline-block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-xs">
                        No clients found matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* LEADS TABLE */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Sales Bid Lead</th>
                    <th className="py-4 px-6">Project Value (₦)</th>
                    <th className="py-4 px-6">Current Bid Phase</th>
                    <th className="py-4 px-6">Source</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{lead.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium block">{lead.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs font-black text-[#0057B8]">₦{lead.value.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-[#0057B8] px-2.5 py-0.5 text-[9px] font-black uppercase">
                          ● {lead.stage}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">{lead.source}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer inline-block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-xs">
                        No active pipeline sales bids found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: CRM PROFILE SIDE SLIDER PANEL (5 COLS) */}
        <AnimatePresence>
          {selectedCust && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[24px] shadow-lg overflow-hidden flex flex-col h-full text-left"
            >
              {/* Profile Card Header */}
              <div className="p-6 bg-slate-50/60 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#0057B8]/15 text-[#0057B8] font-black flex items-center justify-center text-base uppercase shrink-0">
                    {selectedCust.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{selectedCust.name}</h3>
                    <span className="text-[10px] text-[#00A651] font-black block mt-0.5">● VIP CLIENT PROFILE</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCust(null)}
                  className="p-2 hover:bg-slate-200/50 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              {/* Slider tabs navigation */}
              <div className="flex border-b border-[#E2E8F0] overflow-x-auto text-[9px] font-black uppercase tracking-wider bg-white">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "timeline", label: "Milestones" },
                  { id: "payments", label: "Invoices" },
                  { id: "documents", label: "Vault" },
                  { id: "notes", label: "Auto-Notes" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`flex-1 py-3 text-center border-b-2 transition ${profileTab === tab.id ? "border-[#0057B8] text-[#0057B8]" : "border-transparent text-slate-400 hover:text-slate-700"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Slider Tab Contents */}
              <div className="p-6 flex-1 overflow-y-auto space-y-5 text-slate-700 text-xs">
                {profileTab === "overview" && (
                  <div className="space-y-4">
                    <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Enterprise System Grid</span>
                      <p className="font-bold text-slate-800 text-sm">{selectedCust.system}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-[#E2E8F0]">
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Total Valuation Spend</span>
                        <p className="font-black text-slate-800 text-sm mt-1">₦{selectedCust.spend.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-[#E2E8F0]">
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Local Warranty Status</span>
                        <p className="font-semibold text-slate-800 text-sm mt-1 text-[#00A651]">{selectedCust.warranty}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Mail className="h-4 w-4" /> <span>{selectedCust.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Phone className="h-4 w-4" /> <span>{selectedCust.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <MapPin className="h-4 w-4" /> <span>{selectedCust.loc}</span>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === "timeline" && (
                  <div className="space-y-4 relative border-l-2 border-slate-100 pl-4 ml-2 pt-2">
                    <div className="space-y-1 relative">
                      <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full bg-[#00A651] border-2 border-white shadow-sm" />
                      <h4 className="font-black text-slate-900">Corporate System Inspection Completed</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">2026-06-30</p>
                      <p className="text-slate-500">TAPCO engineers completed primary array sizing diagnostics on site location.</p>
                    </div>
                    <div className="space-y-1 relative pt-2">
                      <div className="absolute -left-6 top-3 h-3.5 w-3.5 rounded-full bg-[#0057B8] border-2 border-white shadow-sm" />
                      <h4 className="font-black text-slate-900">Procurement Orders Dispatched</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">2026-06-28</p>
                      <p className="text-slate-500">Panel array components loaded onto transit fleet from warehousing docks.</p>
                    </div>
                  </div>
                )}

                {profileTab === "payments" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-[#E2E8F0]">
                      <div>
                        <h4 className="font-bold text-slate-900">Invoice #INV-2026-104</h4>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Due June 30</span>
                      </div>
                      <span className="text-xs font-black text-[#00A651] bg-[#00A651]/10 px-3 py-1 rounded-full uppercase">PAID</span>
                    </div>
                  </div>
                )}

                {profileTab === "documents" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-[#E2E8F0] hover:border-[#0057B8]/30 transition">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#0057B8]" />
                        <span className="font-semibold text-slate-700">TAPCO_Grid_Warranty.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">1.2 MB</span>
                    </div>
                  </div>
                )}

                {profileTab === "notes" && (
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Internal Team Notes (Autosaved)</label>
                      {noteSaving && (
                        <span className="text-[9px] text-[#0057B8] font-bold uppercase animate-pulse flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
                        </span>
                      )}
                    </div>
                    <textarea
                      placeholder="Input private client details, site specifics, or service contract updates..."
                      className="w-full h-40 p-4 border border-[#E2E8F0] rounded-2xl focus:outline-none focus:border-[#0057B8] text-xs font-medium bg-slate-50 focus:bg-white transition-colors leading-relaxed"
                      value={customerNotes[selectedCust.id] || selectedCust.notes || ""}
                      onChange={e => handleNoteChange(selectedCust.id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CUSTOMER REGISTRATION MODAL */}
      {showCustModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-lg w-full p-8 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Register Customer</h3>
              <button onClick={() => setShowCustModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aliko Dangote"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#0057B8]"
                  value={newCust.name}
                  onChange={e => setNewCust(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. client@dangote.com"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#0057B8]"
                    value={newCust.email}
                    onChange={e => setNewCust(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Phone Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +234 812..."
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#0057B8]"
                    value={newCust.phone}
                    onChange={e => setNewCust(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Site Coordinates / Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lekki Phase II, Lagos"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#0057B8]"
                  value={newCust.loc}
                  onChange={e => setNewCust(prev => ({ ...prev, loc: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Assigned Solar Array Tier</label>
                <select
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none focus:border-[#0057B8]"
                  value={newCust.system}
                  onChange={e => setNewCust(prev => ({ ...prev, system: e.target.value }))}
                >
                  <option value="8.2kW Array + 15kWh Battery">8.2kW Array Starter Pack</option>
                  <option value="12.4kW Array + 30kWh Battery">12.4kW Array Premium Pack</option>
                  <option value="45kW Corporate Microgrid Array">45kW Enterprise Microgrid</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newCust.name || !newCust.email) return;
                onAddCustomer({
                  name: newCust.name,
                  email: newCust.email,
                  phone: newCust.phone || "+234 800 000 0000",
                  loc: newCust.loc || "Lagos, NG",
                  system: newCust.system,
                  warranty: "5-Year Core Grid",
                  notes: newCust.notes,
                  status: newCust.status
                });
                setShowCustModal(false);
                setNewCust({ name: "", email: "", phone: "", loc: "", system: "8.2kW Array + 15kWh Battery", notes: "", status: "Active" });
              }}
              className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 py-3 text-xs font-bold uppercase text-white transition shadow-lg"
            >
              Dispatch Profile Creation
            </button>
          </div>
        </div>
      )}

      {/* LEAD PIPELINE REGISTRATION MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-lg w-full p-8 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Pipeline Lead</h3>
              <button onClick={() => setShowLeadModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Lead Contact Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chief Oba"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newLead.name}
                  onChange={e => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Contact Email</label>
                  <input 
                    type="email" 
                    placeholder="e.g. oba@palace.ng"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newLead.email}
                    onChange={e => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Quotation Bid Value (₦)</label>
                  <input 
                    type="number" 
                    placeholder="Value in Naira"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newLead.value}
                    onChange={e => setNewLead(prev => ({ ...prev, value: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Sales Channel Source</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={newLead.source}
                    onChange={e => setNewLead(prev => ({ ...prev, source: e.target.value }))}
                  >
                    <option value="Organic Search">Organic Search</option>
                    <option value="Referral">Referral</option>
                    <option value="Ad Campaign">Ad Campaign</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Current Pipeline Phase</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={newLead.stage}
                    onChange={e => setNewLead(prev => ({ ...prev, stage: e.target.value as any }))}
                  >
                    <option value="Inspection">Inspection</option>
                    <option value="Design">Design</option>
                    <option value="Quotation">Quotation</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newLead.name || !newLead.email) return;
                onAddLead({
                  name: newLead.name,
                  email: newLead.email,
                  phone: newLead.phone || "+234 811 000 0000",
                  value: newLead.value,
                  stage: newLead.stage,
                  source: newLead.source
                });
                setShowLeadModal(false);
                setNewLead({ name: "", email: "", phone: "", value: 15000000, stage: "Design", source: "Organic Search" });
              }}
              className="w-full rounded-xl bg-[#00A651] hover:bg-[#00A651]/95 py-3 text-xs font-bold uppercase text-white transition shadow-lg"
            >
              Add Lead to Pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
