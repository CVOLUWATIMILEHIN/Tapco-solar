import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { SiteInspectionBooking } from "../../types";
import { Calendar, UserCheck, Shield, Clock, Check, X, AlertCircle } from "lucide-react";

export default function BookingsManager() {
  const { bookingsList, setBookingsList, addAuditLog } = useCMS();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleUpdateStatus = (id: string, status: SiteInspectionBooking["status"]) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    showToast(`Updated site booking ID: ${id} to ${status}`);
  };

  const filtered = bookingsList.filter(b => {
    if (filterStatus === "all") return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#0057B8]" />
            Site Inspections & Bookings Desk
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Audit physical roof load inspections, coordinate regional engineering visits, and confirm training bookings.
          </p>
        </div>

        {/* Filters */}
        <select
          className="text-xs font-bold text-slate-600 focus:outline-none cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-xl self-end sm:self-auto"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Audit</option>
          <option value="confirmed">Scheduled / Confirmed</option>
          <option value="completed">Completed / Audited</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black text-[#0057B8] bg-[#0057B8]/5 px-2 py-0.5 border border-[#0057B8]/10 rounded">
                  {b.id}
                </span>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{b.name}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">
                  {b.type}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500">
                Location: <span className="text-slate-800">{b.location}</span>
              </p>

              <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                <span>Date: <span className="text-slate-600">{b.date}</span></span>
                <span>•</span>
                <span>Time Slot: <span className="text-slate-600">{b.timeSlot}</span></span>
                <span>•</span>
                <span>Phone: <span className="text-slate-600">{b.phone}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border ${
                b.status === "Completed" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                b.status === "Confirmed" ? "bg-blue-50 border-blue-100 text-blue-700" :
                "bg-amber-50 border-amber-100 text-amber-700"
              }`}>
                {b.status}
              </span>

              <div className="flex gap-1.5">
                {b.status !== "Confirmed" && (
                  <button 
                    onClick={() => handleUpdateStatus(b.id, "Confirmed")}
                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-[#0057B8] transition cursor-pointer"
                    title="Confirm site survey booking"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                {b.status !== "Completed" && (
                  <button 
                    onClick={() => handleUpdateStatus(b.id, "Completed")}
                    className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-[#00A651] transition cursor-pointer"
                    title="Mark audit as fully complete"
                  >
                    <UserCheck className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium text-xs">
            No inspection bookings currently matching parameters.
          </div>
        )}
      </div>
    </div>
  );
}
