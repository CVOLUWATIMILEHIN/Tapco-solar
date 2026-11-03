import React, { useState } from "react";
import { useCMS, AboutCMSData, LeadershipMember, StaffMember, AboutSection } from "../../context/CMSContext";
import { 
  Plus, Trash, Edit2, Save, FileText, RefreshCw, X, 
  HelpCircle, User, Briefcase, Target, Eye, Shield, 
  Award, Globe, Phone, Mail, MapPin, Link2
} from "lucide-react";

export default function AboutCMS() {
  const { aboutData, setAboutData, addAuditLog } = useCMS();
  const [activeSubTab, setActiveSubTab] = useState<"company" | "founder" | "team" | "ethics" | "timeline" | "certs">("company");

  // State managers for editing items
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneEditState, setMilestoneEditState] = useState({ year: "", title: "", desc: "" });
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneState, setNewMilestoneState] = useState({ year: "", title: "", desc: "" });

  // Leadership state managers
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadEditState, setLeadEditState] = useState({ name: "", position: "", department: "", photo: "", bio: "" });
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadState, setNewLeadState] = useState({ name: "", position: "", department: "Executive", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "" });

  // Staff members state managers
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffEditState, setStaffEditState] = useState({ name: "", position: "", department: "", photo: "", bio: "" });
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaffState, setNewStaffState] = useState({ name: "", position: "", department: "Support", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "" });

  // Partner state managers
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartnerState, setNewPartnerState] = useState({ name: "", logoUrl: "" });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  // --- Core Field Updating Helpers ---
  const handleUpdateField = (field: keyof AboutCMSData, value: any) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCompanyInfo = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const handleUpdateFounder = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      founder: {
        ...prev.founder,
        [field]: value
      }
    }));
  };

  const handleUpdateMissionVision = (field: "mission" | "vision", val: string) => {
    setAboutData(prev => {
      const current = prev[field];
      if (typeof current === "object" && current !== null) {
        return {
          ...prev,
          [field]: { ...current, statement: val }
        };
      }
      return {
        ...prev,
        [field]: val,
        [`${field}Text`]: val
      };
    });
  };

  // --- Core Values Actions ---
  const handleUpdateCoreValue = (vIdx: number, field: "title" | "description", value: string) => {
    const copy = [...aboutData.coreValues];
    copy[vIdx] = {
      ...copy[vIdx],
      [field]: value
    };
    setAboutData(prev => ({ ...prev, coreValues: copy }));
  };

  // --- Timeline Actions ---
  const handleSaveMilestone = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      timeline: prev.timeline.map(m => m.id === id ? { ...m, ...milestoneEditState } : m)
    }));
    setEditingMilestoneId(null);
    showToast(`Updated timeline milestone year: ${milestoneEditState.year}`);
  };

  const handleAddMilestone = () => {
    const fresh = { id: `mile-${Date.now()}`, ...newMilestoneState };
    setAboutData(prev => ({
      ...prev,
      timeline: [...prev.timeline, fresh]
    }));
    setShowAddMilestone(false);
    setNewMilestoneState({ year: "", title: "", desc: "" });
    showToast(`Added timeline milestone event: "${fresh.title}"`);
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm("Are you sure you want to remove this historical event from the timeline?")) {
      setAboutData(prev => ({ ...prev, timeline: prev.timeline.filter(m => m.id !== id) }));
      showToast(`Removed timeline milestone.`);
    }
  };

  // --- Leadership Actions ---
  const handleSaveLead = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      leadership: prev.leadership.map(l => l.id === id ? { ...l, ...leadEditState } : l)
    }));
    setEditingLeadId(null);
    showToast(`Updated leadership bio for: ${leadEditState.name}`);
  };

  const handleAddLead = () => {
    const fresh = { id: `lead-${Date.now()}`, ...newLeadState, isPublished: true, orderIdx: aboutData.leadership.length + 1 };
    setAboutData(prev => ({
      ...prev,
      leadership: [...prev.leadership, fresh]
    }));
    setShowAddLead(false);
    setNewLeadState({ name: "", position: "", department: "Executive", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "" });
    showToast(`Added leadership member: "${fresh.name}"`);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Remove this leader from active profiles?")) {
      setAboutData(prev => ({ ...prev, leadership: prev.leadership.filter(l => l.id !== id) }));
      showToast(`Removed leadership member.`);
    }
  };

  // --- Staff Actions ---
  const handleSaveStaff = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      staffMembers: prev.staffMembers.map(s => s.id === id ? { ...s, ...staffEditState } : s)
    }));
    setEditingStaffId(null);
    showToast(`Updated staff biography for: ${staffEditState.name}`);
  };

  const handleAddStaff = () => {
    const fresh = { id: `staff-${Date.now()}`, ...newStaffState, isPublished: true, orderIdx: aboutData.staffMembers.length + 1 };
    setAboutData(prev => ({
      ...prev,
      staffMembers: [...prev.staffMembers, fresh]
    }));
    setShowAddStaff(false);
    setNewStaffState({ name: "", position: "", department: "Support", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "" });
    showToast(`Added staff member: "${fresh.name}"`);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Remove this staff member from active profiles?")) {
      setAboutData(prev => ({ ...prev, staffMembers: prev.staffMembers.filter(s => s.id !== id) }));
      showToast(`Removed staff member.`);
    }
  };

  // --- Partners Actions ---
  const handleAddPartner = () => {
    const fresh = { id: `part-${Date.now()}`, ...newPartnerState };
    setAboutData(prev => ({
      ...prev,
      partners: [...prev.partners, fresh]
    }));
    setShowAddPartner(false);
    setNewPartnerState({ name: "", logoUrl: "" });
    showToast(`Added partner: "${fresh.name}"`);
  };

  const handleDeletePartner = (id: string) => {
    if (confirm("Are you sure you want to remove this brand partner?")) {
      setAboutData(prev => ({ ...prev, partners: prev.partners.filter(p => p.id !== id) }));
      showToast(`Removed brand partner.`);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0057B8]" />
            About Page CMS Console
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Reorganize, update, and manage every single section of your corporate About page dynamically.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm("Restore original corporate profiles to factory config?")) {
              localStorage.removeItem("tapco_cms_about");
              window.location.reload();
            }
          }}
          className="px-3.5 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Factory Defaults
        </button>
      </div>

      {/* Roster Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {[
          { id: "company", label: "1. About Company" },
          { id: "founder", label: "2. Founder & CEO" },
          { id: "team", label: "3. Leadership & Staff" },
          { id: "ethics", label: "4. Mission & Values" },
          { id: "timeline", label: "5. Milestones Timeline" },
          { id: "certs", label: "6. Certs & Partners" }
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

      {/* RENDER FOR SUBTABS */}
      <div className="text-left">
        {/* TAB 1: ABOUT COMPANY */}
        {activeSubTab === "company" && (
          <div className="space-y-6 text-xs font-bold text-slate-700">
            <h3 className="text-sm font-black text-slate-900 border-b pb-2">Company Overview & Descriptive Fields</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label>Company Legal Name</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.companyInfo?.name || ""}
                  onChange={e => handleUpdateCompanyInfo("name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>Brand Tagline</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.companyInfo?.tagline || ""}
                  onChange={e => handleUpdateCompanyInfo("tagline", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label>Company Overview Paragraph</label>
              <textarea 
                rows={4}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                value={aboutData.companyInfo?.overview || ""}
                onChange={e => handleUpdateCompanyInfo("overview", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label>Company History & Establishment</label>
              <textarea 
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                value={aboutData.companyInfo?.history || ""}
                onChange={e => handleUpdateCompanyInfo("history", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label>What We Do / Technical Scope</label>
              <textarea 
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                value={aboutData.companyInfo?.whatWeDo || ""}
                onChange={e => handleUpdateCompanyInfo("whatWeDo", e.target.value)}
              />
            </div>

            <h3 className="text-sm font-black text-slate-900 border-b pb-2 pt-4">Corporate Metadata & Contact details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label>Company Phone</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.companyInfo?.phone || ""}
                  onChange={e => handleUpdateCompanyInfo("phone", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>Company Email</label>
                <input 
                  type="email" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.companyInfo?.email || ""}
                  onChange={e => handleUpdateCompanyInfo("email", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>Company Logo URL</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={aboutData.companyInfo?.logo || ""}
                  onChange={e => handleUpdateCompanyInfo("logo", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label>Company HQ Street Address</label>
              <input 
                type="text" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                value={aboutData.companyInfo?.address || ""}
                onChange={e => handleUpdateCompanyInfo("address", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: FOUNDER & CEO PROFILE */}
        {activeSubTab === "founder" && (
          <div className="space-y-6 text-xs font-bold text-slate-700">
            <h3 className="text-sm font-black text-slate-900 border-b pb-2">Founder &amp; CEO Biography Editor</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.founder?.name || ""}
                  onChange={e => handleUpdateFounder("name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>Corporate Position</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={aboutData.founder?.position || ""}
                  onChange={e => handleUpdateFounder("position", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label>Professional Photo URL</label>
              <input 
                type="text" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                value={aboutData.founder?.photo || ""}
                onChange={e => handleUpdateFounder("photo", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label>Professional Biography / Background</label>
              <textarea 
                rows={5}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                value={aboutData.founder?.bio || ""}
                onChange={e => handleUpdateFounder("bio", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label>Message / Quote from the CEO</label>
              <textarea 
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 italic"
                value={aboutData.founder?.message || ""}
                onChange={e => handleUpdateFounder("message", e.target.value)}
              />
            </div>

            <h3 className="text-sm font-black text-slate-900 border-b pb-2 pt-4">Social Network Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label>Twitter Link</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={aboutData.founder?.twitter || ""}
                  onChange={e => handleUpdateFounder("twitter", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>LinkedIn Link</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={aboutData.founder?.linkedin || ""}
                  onChange={e => handleUpdateFounder("linkedin", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label>Direct Work Email</label>
                <input 
                  type="email" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={aboutData.founder?.email || ""}
                  onChange={e => handleUpdateFounder("email", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEADERSHIP & STAFF ROSTERS */}
        {activeSubTab === "team" && (
          <div className="space-y-10">
            {/* SUB-SECTION 1: LEADERSHIP TEAM */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-black text-slate-900">Executive Leadership Team ({aboutData.leadership?.length || 0})</h3>
                <button
                  onClick={() => setShowAddLead(true)}
                  className="px-3 py-1.5 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Executive
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(aboutData.leadership || []).map((lead) => (
                  <div key={lead.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 flex gap-4 items-start">
                    <div className="h-16 w-16 bg-slate-200 rounded-xl overflow-hidden shrink-0 border">
                      <img src={lead.photo || lead.image} alt={lead.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex-1 space-y-3">
                      {editingLeadId === lead.id ? (
                        <div className="space-y-3 text-xs font-bold text-slate-700">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label>Name</label>
                              <input 
                                type="text" 
                                className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                                value={leadEditState.name}
                                onChange={e => setLeadEditState(p => ({ ...p, name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label>Position</label>
                              <input 
                                type="text" 
                                className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                                value={leadEditState.position}
                                onChange={e => setLeadEditState(p => ({ ...p, position: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label>Photo URL</label>
                            <input 
                              type="text" 
                              className="p-2 bg-white border border-slate-200 rounded-lg w-full font-mono"
                              value={leadEditState.photo}
                              onChange={e => setLeadEditState(p => ({ ...p, photo: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label>Short Biography</label>
                            <textarea 
                              rows={3}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-500"
                              value={leadEditState.bio}
                              onChange={e => setLeadEditState(p => ({ ...p, bio: e.target.value }))}
                            />
                          </div>
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setEditingLeadId(null)} className="px-2 py-1 bg-white border rounded-lg cursor-pointer">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveLead(lead.id)} className="px-2.5 py-1 bg-[#0057B8] text-white rounded-lg cursor-pointer">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{lead.name}</h4>
                            <span className="text-[10px] text-[#0057B8] font-bold block">{lead.position || lead.role}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{lead.bio}</p>
                          <div className="flex justify-end gap-1 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => {
                                setEditingLeadId(lead.id);
                                setLeadEditState({ 
                                  name: lead.name, 
                                  position: lead.position || lead.role || "", 
                                  department: lead.department || "Executive", 
                                  photo: lead.photo || lead.image || "", 
                                  bio: lead.bio 
                                });
                              }}
                              className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" /> Edit Profile
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Trash className="h-3 w-3" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: STAFF MEMBERS */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-black text-slate-900">General Staff Members ({aboutData.staffMembers?.length || 0})</h3>
                <button
                  onClick={() => setShowAddStaff(true)}
                  className="px-3 py-1.5 bg-[#00A651] hover:bg-[#00A651]/95 text-white text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Staff Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(aboutData.staffMembers || []).map((staff) => (
                  <div key={staff.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 flex gap-4 items-start">
                    <div className="h-16 w-16 bg-slate-200 rounded-xl overflow-hidden shrink-0 border">
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex-1 space-y-3">
                      {editingStaffId === staff.id ? (
                        <div className="space-y-3 text-xs font-bold text-slate-700">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label>Name</label>
                              <input 
                                type="text" 
                                className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                                value={staffEditState.name}
                                onChange={e => setStaffEditState(p => ({ ...p, name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label>Position</label>
                              <input 
                                type="text" 
                                className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                                value={staffEditState.position}
                                onChange={e => setStaffEditState(p => ({ ...p, position: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label>Photo URL</label>
                            <input 
                              type="text" 
                              className="p-2 bg-white border border-slate-200 rounded-lg w-full font-mono"
                              value={staffEditState.photo}
                              onChange={e => setStaffEditState(p => ({ ...p, photo: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label>Biographical Note</label>
                            <textarea 
                              rows={2}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-500"
                              value={staffEditState.bio}
                              onChange={e => setStaffEditState(p => ({ ...p, bio: e.target.value }))}
                            />
                          </div>
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setEditingStaffId(null)} className="px-2 py-1 bg-white border rounded-lg cursor-pointer">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveStaff(staff.id)} className="px-2.5 py-1 bg-[#00A651] text-white rounded-lg cursor-pointer">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{staff.name}</h4>
                            <span className="text-[10px] text-[#00A651] font-bold block">{staff.position}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{staff.bio}</p>
                          <div className="flex justify-end gap-1 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => {
                                setEditingStaffId(staff.id);
                                setStaffEditState({ 
                                  name: staff.name, 
                                  position: staff.position, 
                                  department: staff.department || "Support", 
                                  photo: staff.photo || "", 
                                  bio: staff.bio 
                                });
                              }}
                              className="p-1 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" /> Edit Profile
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="p-1 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Trash className="h-3 w-3" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODALS */}
            {/* Add Executive Modal */}
            {showAddLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-900">Add Executive Leader Bio</h3>
                    <button onClick={() => setShowAddLead(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div>
                      <label>Photo URL</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newLeadState.photo}
                        onChange={e => setNewLeadState(prev => ({ ...prev, photo: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newLeadState.name}
                        onChange={e => setNewLeadState(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Corporate Position</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newLeadState.position}
                        onChange={e => setNewLeadState(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Biography summary</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                        value={newLeadState.bio}
                        onChange={e => setNewLeadState(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button onClick={() => setShowAddLead(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleAddLead} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                      Create Executive
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Staff Modal */}
            {showAddStaff && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-900">Add General Staff Member</h3>
                    <button onClick={() => setShowAddStaff(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div>
                      <label>Photo URL</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newStaffState.photo}
                        onChange={e => setNewStaffState(prev => ({ ...prev, photo: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newStaffState.name}
                        onChange={e => setNewStaffState(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Department Role</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newStaffState.position}
                        onChange={e => setNewStaffState(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Short Biography Note</label>
                      <textarea 
                        rows={2}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                        value={newStaffState.bio}
                        onChange={e => setNewStaffState(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button onClick={() => setShowAddStaff(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleAddStaff} className="px-4 py-2 bg-[#00A651] text-white rounded-xl text-xs font-bold hover:bg-[#00A651]/90 cursor-pointer">
                      Create Staff
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MISSION, VISION, & VALUES */}
        {activeSubTab === "ethics" && (
          <div className="space-y-6 text-xs font-bold text-slate-700">
            <h3 className="text-sm font-black text-slate-900 border-b pb-2">Strategic Core Anchors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-slate-800 text-xs font-black">Official Mission Statement</label>
                <textarea 
                  rows={4}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 leading-relaxed"
                  value={typeof aboutData.mission === "string" ? aboutData.mission : (aboutData.mission as any)?.statement || aboutData.missionText || ""}
                  onChange={e => handleUpdateMissionVision("mission", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-800 text-xs font-black">Official Vision Statement</label>
                <textarea 
                  rows={4}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 leading-relaxed"
                  value={typeof aboutData.vision === "string" ? aboutData.vision : (aboutData.vision as any)?.statement || aboutData.visionText || ""}
                  onChange={e => handleUpdateMissionVision("vision", e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Core Corporate Values &amp; Ethics (I.E.I.P.C.S)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(aboutData.coreValues || []).map((v, vIdx) => (
                  <div key={vIdx} className="border border-slate-100 p-4 rounded-xl bg-slate-50/30 space-y-3">
                    <div className="space-y-1">
                      <label>Ethic Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                        value={v.title}
                        onChange={e => handleUpdateCoreValue(vIdx, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Description</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 leading-normal"
                        value={v.description || v.desc || ""}
                        onChange={e => handleUpdateCoreValue(vIdx, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORICAL TIMELINE */}
        {activeSubTab === "timeline" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left block">
                Historical Milestone Nodes ({aboutData.timeline?.length || 0})
              </span>
              <button
                onClick={() => setShowAddMilestone(true)}
                className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Event
              </button>
            </div>

            <div className="space-y-3">
              {(aboutData.timeline || []).map((mile) => (
                <div key={mile.id} className="border border-slate-100 rounded-xl p-4 flex justify-between items-start bg-slate-50/30 text-left">
                  {editingMilestoneId === mile.id ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
                      <div>
                        <label>Milestone Year</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl mt-1 font-black text-[#0057B8]"
                          value={milestoneEditState.year}
                          onChange={e => setMilestoneEditState(p => ({ ...p, year: e.target.value }))}
                        />
                      </div>
                      <div className="md:col-span-3 space-y-3">
                        <div>
                          <label>Milestone Title</label>
                          <input 
                            type="text" 
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl mt-1"
                            value={milestoneEditState.title}
                            onChange={e => setMilestoneEditState(p => ({ ...p, title: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label>Event Description Summary</label>
                          <textarea 
                            rows={2}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500 mt-1"
                            value={milestoneEditState.desc}
                            onChange={e => setMilestoneEditState(p => ({ ...p, desc: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingMilestoneId(null)} className="px-3 py-1.5 border rounded-lg text-xs font-bold cursor-pointer bg-white">
                            Cancel
                          </button>
                          <button onClick={() => handleSaveMilestone(mile.id)} className="px-3 py-1.5 bg-[#0057B8] text-white rounded-lg text-xs font-bold cursor-pointer">
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#0057B8] font-mono">{mile.year}</span>
                          <span className="text-xs font-extrabold text-slate-800">— {mile.title}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl leading-relaxed">{mile.desc}</p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingMilestoneId(mile.id);
                            setMilestoneEditState({ year: mile.year, title: mile.title, desc: mile.desc });
                          }}
                          className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-600 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(mile.id)}
                          className="p-1.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add Milestone Modal */}
            {showAddMilestone && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-900">Add Timeline Milestone Node</h3>
                    <button onClick={() => setShowAddMilestone(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div>
                      <label>Year</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newMilestoneState.year}
                        onChange={e => setNewMilestoneState(prev => ({ ...prev, year: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Headline Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={newMilestoneState.title}
                        onChange={e => setNewMilestoneState(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Supporting Event details</label>
                      <textarea 
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600"
                        value={newMilestoneState.desc}
                        onChange={e => setNewMilestoneState(prev => ({ ...prev, desc: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button onClick={() => setShowAddMilestone(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleAddMilestone} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                      Create Node
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CERTS & PARTNERS */}
        {activeSubTab === "certs" && (
          <div className="space-y-10">
            {/* SUB-SECTION 1: CERTS */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Official Regulatory Standards &amp; Certifications ({(aboutData.certifications || []).length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(aboutData.certifications || []).map((cert, cIdx) => (
                  <div key={cert.id} className="border border-slate-100 p-5 rounded-xl bg-slate-50/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-amber-500" />
                      <span className="text-xs font-black text-slate-800">{cert.title}</span>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-700 text-left">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label>Certificate Title</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                            value={cert.title}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].title = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Issuing Authority</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                            value={cert.authority}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].authority = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label>Certificate Number</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full font-mono text-slate-600"
                            placeholder="e.g. ISO-9001-2026-QMS"
                            value={cert.certNumber || ""}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].certNumber = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Reference Standard</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full font-mono text-slate-600"
                            placeholder="e.g. QMS ISO 9001:2015"
                            value={cert.standards || ""}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].standards = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label>Expiration Date</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                            placeholder="e.g. May 2028"
                            value={cert.expiry || ""}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].expiry = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Audit Frequency</label>
                          <input 
                            type="text" 
                            className="p-2 bg-white border border-slate-200 rounded-lg w-full"
                            placeholder="e.g. Annual Surveillance"
                            value={cert.auditFreq || ""}
                            onChange={e => {
                              const copy = [...aboutData.certifications];
                              copy[cIdx].auditFreq = e.target.value;
                              setAboutData(prev => ({ ...prev, certifications: copy }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label>Scope / Clearance parameters</label>
                        <input 
                          type="text" 
                          className="p-2 bg-white border border-slate-200 rounded-lg w-full font-medium text-slate-500"
                          value={cert.desc}
                          onChange={e => {
                            const copy = [...aboutData.certifications];
                            copy[cIdx].desc = e.target.value;
                            setAboutData(prev => ({ ...prev, certifications: copy }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: PARTNERS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Co-Financing &amp; Brand Partners ({(aboutData.partners || []).length})
                </span>
                <button
                  onClick={() => setShowAddPartner(true)}
                  className="px-3 py-1 bg-[#00A651] hover:bg-[#00A651]/95 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Partner
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(aboutData.partners || []).map((part) => (
                  <div key={part.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col justify-between items-center text-center space-y-3 relative">
                    <button
                      onClick={() => handleDeletePartner(part.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-slate-200 text-red-500 rounded-full transition cursor-pointer"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                    {part.logoUrl ? (
                      <img src={part.logoUrl} alt={part.name} className="h-10 object-contain max-w-[80%]" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-10 w-10 bg-slate-200 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs">
                        {part.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[10px] font-black text-slate-800 block truncate w-full">{part.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Partner Modal */}
            {showAddPartner && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-900">Add Brand Partner</h3>
                    <button onClick={() => setShowAddPartner(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                      <X className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div>
                      <label>Partner Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        placeholder="e.g. Sterling Bank Sunsola"
                        value={newPartnerState.name}
                        onChange={e => setNewPartnerState(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Partner Logo URL (Optional)</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                        placeholder="https://..."
                        value={newPartnerState.logoUrl}
                        onChange={e => setNewPartnerState(prev => ({ ...prev, logoUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3">
                    <button onClick={() => setShowAddPartner(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleAddPartner} className="px-4 py-2 bg-[#00A651] text-white rounded-xl text-xs font-bold hover:bg-[#00A651]/90 cursor-pointer">
                      Create Partner
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
