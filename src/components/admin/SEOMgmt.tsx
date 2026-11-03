import React, { useState } from "react";
import { useCMS, SEOSettings } from "../../context/CMSContext";
import { Globe, Save, RefreshCw, Download, Settings, Terminal, Shield } from "lucide-react";

export default function SEOMgmt() {
  const { seoSettings, setSeoSettings, addAuditLog } = useCMS();
  const [activePageId, setActivePageId] = useState<string>("home");

  const [robotsTxt, setRobotsTxt] = useState(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://tapcosolar.energy/sitemap.xml`
  );

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleUpdateSEOField = (field: keyof SEOSettings, value: string) => {
    setSeoSettings(prev => prev.map(s => s.id === activePageId ? { ...s, [field]: value } : s));
  };

  const activePageData = seoSettings.find(s => s.id === activePageId) || seoSettings[0];

  const handleDownloadSitemap = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tapcosolar.energy/</loc>
    <lastmod>2026-07-03</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tapcosolar.energy/about</loc>
    <lastmod>2026-07-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tapcosolar.energy/services</loc>
    <lastmod>2026-07-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    const blob = new Blob([xmlContent], { type: "text/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sitemap.xml";
    link.click();
    showToast("Dispatched sitemap.xml to local storage browser downloads.");
  };

  const handleDownloadRobots = () => {
    const blob = new Blob([robotsTxt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "robots.txt";
    link.click();
    showToast("Dispatched robots.txt file to downloads folder.");
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#0057B8]" />
            Search Engine Optimisation & Metadata Controller
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Configure dynamic page header title tags, index search crawlers, configure rich Open Graph Facebook/Twitter cards, and build indexing directives.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadRobots}
            className="px-3.5 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Robots.txt
          </button>
          <button
            onClick={handleDownloadSitemap}
            className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Sitemap.xml
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sitemaps lists */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Select Page Node</span>
          {seoSettings.map(s => (
            <button
              key={s.id}
              onClick={() => setActivePageId(s.id)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold capitalize transition cursor-pointer ${
                activePageId === s.id 
                  ? "border-[#0057B8] bg-[#0057B8]/5 text-[#0057B8]" 
                  : "border-slate-100 hover:bg-slate-50 text-slate-600 bg-white"
              }`}
            >
              {s.id === "home" ? "Homepage Layout" : s.id === "about" ? "About Milestones" : s.id + " page"}
            </button>
          ))}
        </div>

        {/* Form editor */}
        <div className="lg:col-span-3 space-y-6 text-xs font-bold text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label>HTML Title Tag</label>
              <input 
                type="text" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                value={activePageData.title}
                onChange={e => handleUpdateSEOField("title", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label>Sitemap Keywords (Comma separated)</label>
              <input 
                type="text" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                value={activePageData.keywords}
                onChange={e => handleUpdateSEOField("keywords", e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label>HTML Meta Description</label>
              <input 
                type="text" 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                value={activePageData.description}
                onChange={e => handleUpdateSEOField("description", e.target.value)}
              />
            </div>
          </div>

          {/* Social Media Open Graph */}
          <div className="border-t pt-5 space-y-4">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Open Graph & Facebook / WhatsApp Social Previews</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label>OG Social Title</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={activePageData.ogTitle}
                  onChange={e => handleUpdateSEOField("ogTitle", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label>OG Social Preview Image (CDN S3 link)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={activePageData.ogImage}
                  onChange={e => handleUpdateSEOField("ogImage", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label>OG Short Description Card</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                  value={activePageData.ogDescription}
                  onChange={e => handleUpdateSEOField("ogDescription", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Robots.txt editor */}
          <div className="border-t pt-5 space-y-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Edit Robots.txt Directives</span>
            <textarea
              rows={4}
              className="w-full p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px]"
              value={robotsTxt}
              onChange={e => setRobotsTxt(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
