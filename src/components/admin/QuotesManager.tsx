import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { QuoteRequest } from "../../types";
import { FileText, ClipboardList, Shield, Check, X, User, MessageSquare } from "lucide-react";

export default function QuotesManager() {
  const { quotesList, setQuotesList, addAuditLog } = useCMS();
  const [filterStage, setFilterStage] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleUpdateStatus = (id: string, status: QuoteRequest["status"]) => {
    setQuotesList(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    showToast(`Quote request ID ${id} set to status ${status}`);
  };

  const handleSaveNotes = (id: string) => {
    setQuotesList(prev => prev.map(q => q.id === id ? { ...q, message: tempNotes } : q));
    setEditingNotesId(null);
    showToast(`Saved follow-up ledger notes for Quote ID ${id}.`);
  };

  const filtered = quotesList.filter(q => {
    if (filterStage === "all") return true;
    return q.status.toLowerCase() === filterStage.toLowerCase();
  });

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#0057B8]" />
            Enterprise Quotation & BoQ requests
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Review detailed solar configurations calculated from client-facing load calculators. Dispatch sizing BoQs and assign staff engineers.
          </p>
        </div>

        <select
          className="text-xs font-bold text-slate-600 focus:outline-none cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-xl self-end sm:self-auto"
          value={filterStage}
          onChange={e => setFilterStage(e.target.value)}
        >
          <option value="all">All Inquiries</option>
          <option value="pending">Pending Review</option>
          <option value="reviewed">Audited / Sized</option>
          <option value="contacted">Negotiation / Contacted</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(q => {
          // Calculate cumulative load metrics
          const cumulativeWatts = q.appliances?.reduce((sum, app) => sum + (app.count * app.watts), 0) || 0;
          return (
            <div key={q.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100/60 pb-3 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {q.id}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{q.name}</h4>
                  {cumulativeWatts > 0 && (
                    <span className="text-[9px] font-black text-[#0057B8] bg-[#0057B8]/5 border border-[#0057B8]/10 px-2 py-0.5 rounded uppercase">
                      Peak Sized: {cumulativeWatts}W
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border ${
                    q.status === "Approved" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                    q.status === "Reviewed" ? "bg-blue-50 border-blue-100 text-blue-700" :
                    q.status === "Contacted" ? "bg-cyan-50 border-cyan-100 text-cyan-700" :
                    "bg-amber-50 border-amber-100 text-amber-700"
                  }`}>
                    {q.status}
                  </span>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleUpdateStatus(q.id, "Reviewed")}
                      className="px-2 py-1 bg-white border rounded text-[10px] font-extrabold hover:bg-slate-50 cursor-pointer"
                    >
                      Audit
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(q.id, "Contacted")}
                      className="px-2 py-1 bg-white border rounded text-[10px] font-extrabold hover:bg-slate-50 cursor-pointer"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              {/* Appliances list from load calculator */}
              {q.appliances && q.appliances.length > 0 && (
                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100/60">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Appliance Checklist</span>
                  <div className="flex flex-wrap gap-2">
                    {q.appliances.map((app, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-100/60 rounded-lg text-[10px] font-bold text-slate-600">
                        {app.name} (x{app.count}) • {app.watts}W • {app.hours}h
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inquiry details / notes */}
              <div className="space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Follow-Up Sizing notes</span>
                  {editingNotesId !== q.id && (
                    <button 
                      onClick={() => { setEditingNotesId(q.id); setTempNotes(q.message); }}
                      className="text-[#0057B8] hover:underline text-[10px] font-black flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Edit Notes
                    </button>
                  )}
                </div>

                {editingNotesId === q.id ? (
                  <div className="space-y-2">
                    <textarea 
                      rows={3}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600"
                      value={tempNotes}
                      onChange={e => setTempNotes(e.target.value)}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => setEditingNotesId(null)} className="px-2.5 py-1 bg-white border rounded-lg text-[10px] font-extrabold cursor-pointer">
                        Cancel
                      </button>
                      <button onClick={() => handleSaveNotes(q.id)} className="px-2.5 py-1 bg-[#0057B8] text-white rounded-lg text-[10px] font-extrabold cursor-pointer">
                        Save notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {q.message || "No custom sizing specifications recorded."}
                  </p>
                )}
              </div>

              {/* Meta details footer */}
              <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                <span>Contact Email: <span className="text-slate-600 font-semibold">{q.email}</span></span>
                <span>•</span>
                <span>Phone: <span className="text-slate-600 font-semibold">{q.phone}</span></span>
                <span>•</span>
                <span>Site Location: <span className="text-slate-600 font-semibold">{q.location}</span></span>
                <span>•</span>
                <span>Average monthly bill: <span className="text-[#0057B8] font-bold">{q.averageBill}</span></span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium text-xs">
            No sizing inquiries currently found matching search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
