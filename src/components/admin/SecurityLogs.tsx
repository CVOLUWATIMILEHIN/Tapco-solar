import React, { useState } from "react";
import { 
  Shield, ShieldCheck, Mail, Database, Server, Smartphone, Key, 
  Search, Eye, Trash2, ArrowUpRight, CheckCircle, RefreshCw, Lock, AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";

interface AuditLog {
  id: string;
  who: string;
  action: string;
  date: string;
  ip: string;
  device: string;
  browser: string;
  location: string;
  status: "SUCCESS" | "BLOCKED" | "WARNING";
}

interface SecurityLogsProps {
  auditLogs: AuditLog[];
  virtualInbox: any[];
  onClearInbox: () => void;
  mfaEnforced: boolean;
  onToggleMfaEnforced: () => void;
  rotateKeysEnforced: boolean;
  onToggleRotateKeys: () => void;
  ipWhitelistEnforced: boolean;
  onToggleIpWhitelist: () => void;
}

export default function SecurityLogs({
  auditLogs,
  virtualInbox,
  onClearInbox,
  mfaEnforced,
  onToggleMfaEnforced,
  rotateKeysEnforced,
  onToggleRotateKeys,
  ipWhitelistEnforced,
  onToggleIpWhitelist
}: SecurityLogsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInboxMsg, setSelectedInboxMsg] = useState<any | null>(null);

  // Security score
  let securityScore = 40;
  if (mfaEnforced) securityScore += 20;
  if (rotateKeysEnforced) securityScore += 20;
  if (ipWhitelistEnforced) securityScore += 20;

  const filteredLogs = auditLogs.filter(log => 
    log.who.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* HEADER */}
      <div>
        <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest">Enterprise Cryptography</span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Security & Identity Audit Hub</h2>
        <p className="text-xs text-slate-400 mt-0.5">Audit zero-trust logs, inspect rolling MFA OTP dispatches, and enforce cryptographic session policies.</p>
      </div>

      {/* 2-COLUMN UPPER LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: SECURITY POLICIES & SCORE CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security Score */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">TAPCO Security Rating</h3>
            
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                {/* Visual SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${securityScore >= 80 ? "text-[#00A651]" : securityScore >= 60 ? "text-amber-500" : "text-rose-500"}`}
                    strokeDasharray={`${securityScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-xl font-black text-slate-800">{securityScore}%</div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Corporate Cryptographic Score</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Compliance rate calculated based on enabled multi-factor rules, key cycles, and network range configurations.
                </p>
              </div>
            </div>

            {/* Checkboxes controls */}
            <div className="pt-2 border-t border-slate-100 space-y-3 text-xs font-semibold text-slate-700">
              <label className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={onToggleMfaEnforced}
                    className="rounded text-[#0057B8] focus:ring-[#0057B8] h-4 w-4"
                  />
                  <span>Enforce Multi-Factor Authorization</span>
                </div>
                <span className="text-[9px] text-[#00A651] font-black uppercase bg-[#00A651]/10 px-2 py-0.5 rounded">+20% Rating</span>
              </label>

              <label className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rotateKeysEnforced}
                    onChange={onToggleRotateKeys}
                    className="rounded text-[#0057B8] focus:ring-[#0057B8] h-4 w-4"
                  />
                  <span>Rotate Active Server API Keys</span>
                </div>
                <span className="text-[9px] text-[#00A651] font-black uppercase bg-[#00A651]/10 px-2 py-0.5 rounded">+20% Rating</span>
              </label>

              <label className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={ipWhitelistEnforced}
                    onChange={onToggleIpWhitelist}
                    className="rounded text-[#0057B8] focus:ring-[#0057B8] h-4 w-4"
                  />
                  <span>Enforce Corporate IP Whitelisting</span>
                </div>
                <span className="text-[9px] text-[#00A651] font-black uppercase bg-[#00A651]/10 px-2 py-0.5 rounded">+20% Rating</span>
              </label>
            </div>
          </div>

          {/* Cryptographic telemetry panel */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">FIPS Encryption Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono font-bold text-slate-500">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span>TLS LAYER</span>
                <span className="text-[#00A651] font-black block mt-1">● TLS v1.3</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span>REPLICAS</span>
                <span className="text-[#0057B8] font-black block mt-1">AES-256 GCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REVIEWS SANDBOX VIRTUAL EMAIL INBOX (7 COLS) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider">Virtual Security Email Dispatcher</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Simulates client email dispatches to inspect MFA tokens and OTP codes instantly.</p>
            </div>
            <button
              onClick={onClearInbox}
              className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hover:text-rose-500 transition cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="grid md:grid-cols-12 gap-4 h-64 items-stretch">
            {/* Messages index (5 COLS) */}
            <div className="md:col-span-5 border-r border-[#E2E8F0] pr-4 space-y-2 overflow-y-auto max-h-60 text-xs">
              {virtualInbox.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedInboxMsg(msg)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-left transition-all ${
                    selectedInboxMsg?.id === msg.id 
                      ? "bg-[#0057B8]/5 border-[#0057B8]/40 shadow-sm" 
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                    <span className="truncate max-w-[100px]">{msg.to}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{msg.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">{msg.subject}</p>
                </div>
              ))}
              {virtualInbox.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-medium">
                  Virtual mailbox is silent.
                </div>
              )}
            </div>

            {/* Message viewport (7 COLS) */}
            <div className="md:col-span-7 pl-2 flex flex-col justify-between text-xs h-60">
              {selectedInboxMsg ? (
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 border-b border-slate-100 pb-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>To: {selectedInboxMsg.to}</span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">{selectedInboxMsg.time}</span>
                    </div>
                    <h4 className="font-extrabold text-[#0057B8]">{selectedInboxMsg.subject}</h4>
                  </div>
                  <p className="font-medium text-slate-600 leading-relaxed overflow-y-auto max-h-32 whitespace-pre-wrap flex-1 py-1">
                    {selectedInboxMsg.body}
                  </p>
                  {selectedInboxMsg.code && (
                    <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-center">
                      <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">DISPATCHED SECURE TOKEN</span>
                      <code className="text-sm font-mono font-black text-[#0057B8] select-all">{selectedInboxMsg.code}</code>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 space-y-2">
                  <Mail className="h-8 w-8 text-slate-300" />
                  <p className="text-[11px] font-semibold">Select a sandbox email to view active verification codes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: REAL-TIME SECURE AUDIT LOGS */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden p-6 text-left space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider">Live System Audit Trail Logs</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time log tracing of identity handshakes, MFA challenges, and remote control access.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit actions or ip..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-4">Trace ID</th>
                <th className="py-3 px-4">Operator Profile</th>
                <th className="py-3 px-4">Security Action</th>
                <th className="py-3 px-4 font-mono">Terminal IP</th>
                <th className="py-3 px-4">Device Node</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-black text-slate-400 text-[10px]">{log.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.who}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 font-bold text-[10px]">{log.ip}</td>
                  <td className="py-3 px-4 font-medium text-slate-500">{log.device}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{log.location}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase ${
                      log.status === "SUCCESS" ? "bg-emerald-500/10 text-[#00A651]" :
                      log.status === "BLOCKED" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      ● {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
