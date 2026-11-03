/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { MessageSquare, X, Send, Bot, Shield, Sparkles, Loader2 } from "lucide-react";
import { ChatMessage } from "../types";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! Welcome to TAPCO Solar Energy Solutions. I am your automated solar guide. Would you like assistance calculating your load, booking a site inspection, or exploring our premium solar packages (1kVA to 40kVA)?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Map history for API
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history })
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I am processing your request. Please let me know how I can help.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to fetch chat reply", err);
      // Fallback
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Our servers are experiencing heavy traffic. To book a consultation or check pricing instantly, you can use our Solar Load Calculator or Booking Form in the main sections!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="floating-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0057B8] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#003B80] focus:outline-none focus:ring-2 focus:ring-[#0057B8] active:scale-95 cursor-pointer"
        title="Open AI Solar Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chatbox Panel */}
      {isOpen && (
        <div
          id="chat-drawer-panel"
          className="fixed right-6 bottom-24 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-300/40 transition-all duration-300 sm:w-80 md:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0057B8] via-[#003B80] to-[#00A651] px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0057B8] shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">TAPCO Solar AI</h3>
                <span className="flex items-center text-[9px] font-bold text-emerald-300 uppercase tracking-widest">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Expert
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
            <div className="flex items-center space-x-2 rounded-xl bg-white p-2.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider border border-slate-100 shadow-sm">
              <Shield className="h-4 w-4 text-[#0057B8] flex-shrink-0" />
              <span>Full-Stack Secure Endpoint</span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-[#0057B8] text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  <span
                    className={`block mt-1 text-[8px] text-right font-medium ${
                      m.role === "user" ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 text-slate-500 text-xs font-semibold rounded-tl-none shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-[#0057B8]" />
                  <span>TAPCO AI is analyzing solar capacity...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-100 bg-white p-3.5 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about 10kVA pricing, specs..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0057B8] focus:outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0057B8] text-white transition-all hover:bg-[#003B80] disabled:opacity-50 cursor-pointer"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
