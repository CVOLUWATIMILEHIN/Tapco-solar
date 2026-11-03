import React, { useState } from "react";
import { useCMS, MediaItem } from "../../context/CMSContext";
import { Plus, Trash, Search, Image as ImageIcon, FileText, Video, X, Tag, Folder } from "lucide-react";

export default function MediaLibrary() {
  const { mediaFiles, setMediaFiles, addAuditLog } = useCMS();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("all");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFileState, setNewFileState] = useState({
    name: "Estate_Pre_Inspection_A.jpg",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    type: "image" as "image" | "video" | "document",
    folder: "Home Gallery",
    size: "1.4 MB",
    tagsString: "residential, panels, estate"
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleAddFile = () => {
    const tags = newFileState.tagsString.split(",").map(t => t.trim()).filter(Boolean);
    const fresh: MediaItem = {
      id: `med-${Date.now()}`,
      name: newFileState.name,
      url: newFileState.url,
      type: newFileState.type,
      folder: newFileState.folder,
      size: newFileState.size,
      tags,
      uploadedAt: new Date().toISOString().split("T")[0]
    };
    setMediaFiles(prev => [fresh, ...prev]);
    setShowAddModal(false);
    showToast(`Uploaded file: ${fresh.name}`);
  };

  const handleDeleteFile = (id: string) => {
    if (confirm("Are you sure you want to delete this asset from TAPCO Media Library? This action is irreversible.")) {
      setMediaFiles(prev => prev.filter(f => f.id !== id));
      showToast(`Removed file asset ID: ${id}`);
    }
  };

  const filtered = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          file.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = activeFolder === "all" || file.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const foldersList = ["all", ...Array.from(new Set(mediaFiles.map(f => f.folder)))];

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Folder className="h-5 w-5 text-[#0057B8]" />
            TAPCO Corporate Media Library & Storage
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Simulate secure AWS S3 / Cloud CDN file uploads. Index blueprints, brochure specs sheets, client photos, and logos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Upload Asset
        </button>
      </div>

      {/* Controls: Search & Folders */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search assets by tag or name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Folders */}
        <div className="flex gap-1.5 flex-wrap self-start md:self-auto">
          {foldersList.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer border ${
                activeFolder === folder 
                  ? "bg-[#0057B8] text-white border-transparent" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200"
              }`}
            >
              {folder === "all" ? "All directories" : folder}
            </button>
          ))}
        </div>
      </div>

      {/* File Catalog grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(file => (
          <div key={file.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20 flex flex-col group relative hover:shadow-md transition">
            <button 
              onClick={() => handleDeleteFile(file.id)}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/80 rounded-lg text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition z-10"
              title="Delete asset file"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>

            {/* Thumbnail */}
            <div className="h-36 bg-slate-100 flex items-center justify-center relative overflow-hidden border-b">
              {file.type === "image" ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : file.type === "video" ? (
                <div className="flex flex-col items-center text-slate-400">
                  <Video className="h-8 w-8 text-slate-300" />
                  <span className="text-[10px] font-bold mt-1">Video File</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <FileText className="h-8 w-8 text-slate-300" />
                  <span className="text-[10px] font-bold mt-1">Document Workbook</span>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <span className="text-[11px] font-black text-slate-700 leading-tight block truncate" title={file.name}>
                {file.name}
              </span>

              <div className="flex justify-between items-center text-[9px] font-mono font-black text-slate-400">
                <span>{file.size}</span>
                <span>{file.uploadedAt}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {file.tags.map((tag, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-white border rounded text-[8px] font-extrabold text-slate-400 uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Upload Asset Node</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>File Display Name</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newFileState.name}
                  onChange={e => setNewFileState(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label>Asset URL</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newFileState.url}
                  onChange={e => setNewFileState(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Media Type</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl mt-1"
                    value={newFileState.type}
                    onChange={e => setNewFileState(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Workbook/PDF</option>
                  </select>
                </div>

                <div>
                  <label>Folder Directory</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl mt-1"
                    value={newFileState.folder}
                    onChange={e => setNewFileState(prev => ({ ...prev, folder: e.target.value }))}
                  >
                    <option value="Home Gallery">Home Gallery</option>
                    <option value="Academy Documents">Academy Documents</option>
                    <option value="Technical Drawings">Technical Drawings</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Asset Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 font-mono"
                  value={newFileState.tagsString}
                  onChange={e => setNewFileState(prev => ({ ...prev, tagsString: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddFile} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Upload & Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
