import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { BlogPost } from "../../types";
import { 
  Plus, Trash, Edit2, Save, FileText, Download, 
  Tag, User, Calendar, RefreshCw, X, Eye, EyeOff 
} from "lucide-react";

export default function BlogCMS() {
  const { blogsList, setBlogsList, downloadsList, setDownloadsList, addAuditLog } = useCMS();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});

  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostState, setNewPostState] = useState({
    title: "Understanding Off-Grid Symmetrical Sizing in Yankaba",
    category: "Technical Standards",
    author: "Engr. Louis Olosunde",
    excerpt: "Learn how to calculate actual inductive motor peak currents for proper inverter safety sizing.",
    content: "When sizing smart hybrid solar power grids for Nigerian duplex residences, many installers fail to account for inductive compressor in-rush surges. This technical memo guides you on double-sizing peak thresholds...",
    readTime: "5 Min read",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600"
  });

  const [showAddDownload, setShowAddDownload] = useState(false);
  const [newDownloadState, setNewDownloadState] = useState({
    name: "Standard Symmetrical Earth System Manual",
    url: "#",
    category: "manuals"
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleSelectPost = (p: BlogPost) => {
    setSelectedPostId(p.id);
    setEditingPost({ ...p });
  };

  const handleSavePost = () => {
    if (!selectedPostId) return;
    setBlogsList(prev => prev.map(p => p.id === selectedPostId ? { ...p, ...editingPost } as BlogPost : p));
    setSelectedPostId(null);
    showToast(`Saved article: "${editingPost.title}"`);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to completely archive and delete this publication node?")) {
      setBlogsList(prev => prev.filter(p => p.id !== id));
      if (selectedPostId === id) setSelectedPostId(null);
      showToast(`Removed blog article ID: ${id}`);
    }
  };

  const handleAddPost = () => {
    const fresh: BlogPost = {
      id: `blog-${Date.now()}`,
      ...newPostState,
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    };
    setBlogsList(prev => [fresh, ...prev]);
    setShowAddPost(false);
    showToast(`Published article: "${fresh.title}"`);
  };

  // Downloads resources
  const handleAddDownload = () => {
    const fresh = { id: `dl-${Date.now()}`, ...newDownloadState };
    setDownloadsList(prev => [...prev, fresh]);
    setShowAddDownload(false);
    setNewDownloadState({ name: "", url: "#", category: "manuals" });
    showToast(`Registered downloadable resource asset: "${fresh.name}"`);
  };

  const handleDeleteDownload = (id: string) => {
    if (confirm("De-register this file from downloadable lists?")) {
      setDownloadsList(prev => prev.filter(d => d.id !== id));
      showToast(`Dismounted downloadable manual.`);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0057B8]" />
            Blog & Resources Publication CMS
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Author technical memos, publish regional grid advisories, and manage central download catalogues like sizing workbooks and specs sheets.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddDownload(true)}
            className="px-3.5 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" /> Add File Resource
          </button>
          <button
            onClick={() => setShowAddPost(true)}
            className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Write Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left lists */}
        <div className="lg:col-span-1 space-y-6">
          {/* Blogs */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Articles list ({blogsList.length})</span>
            {blogsList.map(post => (
              <div 
                key={post.id}
                className={`p-4 border rounded-2xl flex flex-col gap-2 cursor-pointer transition hover:shadow-md ${
                  selectedPostId === post.id ? "border-[#0057B8] bg-[#0057B8]/5" : "border-slate-100 bg-white"
                }`}
                onClick={() => handleSelectPost(post)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase text-[#00A651] tracking-wider bg-[#00A651]/5 px-2 py-0.5 border border-[#00A651]/10 rounded">
                    {post.category}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                    className="p-1 text-slate-400 hover:text-red-500 border border-slate-100 rounded bg-slate-50/50"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </div>
                <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">{post.title}</h4>
                <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t pt-2 mt-1">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Downloads */}
          <div className="border-t pt-5 space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Download Resources ({downloadsList.length})</span>
            <div className="space-y-2">
              {downloadsList.map(dl => (
                <div key={dl.id} className="border border-slate-100 p-3 rounded-xl bg-slate-50/40 flex justify-between items-center text-xs font-semibold text-slate-700">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-[#0057B8] uppercase tracking-wider block">{dl.category}</span>
                    <span className="font-bold leading-none">{dl.name}</span>
                  </div>
                  <button onClick={() => handleDeleteDownload(dl.id)} className="p-1 hover:bg-slate-100 rounded text-red-500">
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 border border-slate-100 p-6 rounded-[20px] bg-slate-50/20">
          {selectedPostId ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-black text-[#0057B8] uppercase tracking-wider">Modifying Publication</span>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedPostId(null)} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-white cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSavePost} className="px-3.5 py-1.5 bg-[#0057B8] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#0057B8]/90">
                    Publish Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Article Title</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingPost.title || ""}
                    onChange={e => setEditingPost(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Banner Image URL</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingPost.image || ""}
                    onChange={e => setEditingPost(p => ({ ...p, image: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Category Group</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingPost.category || ""}
                    onChange={e => setEditingPost(p => ({ ...p, category: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label>Author Node</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    value={editingPost.author || ""}
                    onChange={e => setEditingPost(p => ({ ...p, author: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label>Summary Excerpt (Short callout)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-500"
                    value={editingPost.excerpt || ""}
                    onChange={e => setEditingPost(p => ({ ...p, excerpt: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label>Full Memo Body Content (Supports standard formatting)</label>
                  <textarea 
                    rows={12}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 leading-relaxed font-mono text-[11px]"
                    value={editingPost.content || ""}
                    onChange={e => setEditingPost(p => ({ ...p, content: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col justify-center items-center text-slate-400 font-medium">
              <FileText className="h-10 w-10 text-slate-200 mb-2" />
              <span>Select any published article node on the left list to open the rich copywriting panel.</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Blog Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Author New Corporate Memo</h3>
              <button onClick={() => setShowAddPost(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Article Title</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={newPostState.title}
                  onChange={e => setNewPostState(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Category Group</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newPostState.category}
                    onChange={e => setNewPostState(p => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Banner Image URL</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newPostState.image}
                    onChange={e => setNewPostState(p => ({ ...p, image: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label>Callout Excerpt</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                  value={newPostState.excerpt}
                  onChange={e => setNewPostState(p => ({ ...p, excerpt: e.target.value }))}
                />
              </div>
              <div>
                <label>Main Body Copy</label>
                <textarea 
                  rows={5}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500"
                  value={newPostState.content}
                  onChange={e => setNewPostState(p => ({ ...p, content: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddPost(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddPost} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Download Modal */}
      {showAddDownload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Add Downloadable File Asset</h3>
              <button onClick={() => setShowAddDownload(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Asset Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Solar sizing workbook 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newDownloadState.name}
                  onChange={e => setNewDownloadState(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div>
                <label>Category Group</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl mt-1"
                  value={newDownloadState.category}
                  onChange={e => setNewDownloadState(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="manuals">Technical Manuals</option>
                  <option value="catalogs">Corporate Catalogs</option>
                  <option value="guides">Sizing Guides</option>
                </select>
              </div>

              <div>
                <label>File Reference URL</label>
                <input 
                  type="text" 
                  placeholder="#"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newDownloadState.url}
                  onChange={e => setNewDownloadState(p => ({ ...p, url: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddDownload(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddDownload} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Upload & Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
