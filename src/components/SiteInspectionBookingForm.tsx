/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, Mail, Phone, CheckCircle2 } from "lucide-react";
import { SiteInspectionBooking } from "../types";

interface SiteInspectionBookingFormProps {
  onBookingSuccess: (booking: SiteInspectionBooking) => void;
}

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM"
];

const INSPECTION_TYPES = [
  { id: "Consultation", name: "System Consultation", desc: "Speak with a solar engineer online or at our office" },
  { id: "Physical Survey", name: "Physical Site Survey", desc: "Our technicians inspect your roof space, cabling pathway, and DB Board" },
  { id: "Thermal/Shade Analysis", name: "Thermal & Shade Analysis", desc: "Advanced sun tracking and shade profiling for maximum performance" }
];

export default function SiteInspectionBookingForm({ onBookingSuccess }: SiteInspectionBookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"Consultation" | "Physical Survey" | "Thermal/Shade Analysis">("Physical Survey");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedBooking, setSavedBooking] = useState<SiteInspectionBooking | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !location) return;

    const newBooking: SiteInspectionBooking = {
      id: "bk-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      date,
      timeSlot,
      location,
      type,
      status: "Confirmed"
    };

    setIsSuccess(true);
    setSavedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDate("");
    setTimeSlot(TIME_SLOTS[0]);
    setLocation("");
    setType("Physical Survey");
    setIsSuccess(false);
    setSavedBooking(null);
  };

  return (
    <div id="booking-system" className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/30 max-w-4xl mx-auto relative overflow-hidden">
      {/* Dynamic background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00A651]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

      {isSuccess && savedBooking ? (
        <div className="text-center py-12 space-y-4 relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00A651]/10 text-[#00A651]">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Site Inspection Confirmed!</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
            Thank you, <span className="text-slate-800 font-extrabold">{savedBooking.name}</span>. Your {savedBooking.type} has been scheduled for <span className="text-slate-800 font-extrabold">{savedBooking.date}</span> during the <span className="text-slate-800 font-extrabold">{savedBooking.timeSlot}</span> slot.
          </p>
          <div className="rounded-2xl bg-slate-50 p-5 max-w-sm mx-auto text-left space-y-2.5 text-xs text-slate-600 border border-slate-100 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Booking Reference:</span>
              <span className="font-mono text-[#0057B8] font-bold">{savedBooking.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Address / Location:</span>
              <span className="text-right font-semibold text-slate-800">{savedBooking.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Contact Number:</span>
              <span className="font-bold text-slate-800">{savedBooking.phone}</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="mt-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 text-xs font-bold transition"
          >
            Book Another Inspection
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Book Professional Site Inspection</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Our engineers will carry out specialized roof load & shade analyzes for your project</p>
          </div>

          {/* Type Selector */}
          <div className="grid gap-3 sm:grid-cols-3">
            {INSPECTION_TYPES.map((t) => (
              <div
                key={t.id}
                onClick={() => setType(t.id as any)}
                className={`cursor-pointer rounded-2xl border p-4 transition duration-300 ${
                  type === t.id
                    ? "border-[#0057B8] bg-[#0057B8]/5 shadow-sm"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100/50"
                }`}
              >
                <p className={`text-xs font-bold ${type === t.id ? "text-[#0057B8]" : "text-slate-800"}`}>{t.name}</p>
                <p className="mt-1.5 text-[10px] text-slate-400 leading-normal font-medium">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Left side inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 812 3456"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Right side inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Inspection Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Preferred Time Slot</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Site Address / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 14 Lekki Expressway, Lagos"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0057B8] px-6 py-4 text-xs font-extrabold text-white uppercase tracking-widest shadow-md hover:bg-[#0057B8]/95 transition duration-200"
          >
            Schedule Professional Site Inspection
          </button>
        </form>
      )}
    </div>
  );
}
