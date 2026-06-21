"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Eye,
  Image as ImageIcon,
  Video,
  Loader2,
  CheckCircle2,
  X,
  FileImage,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  type: string;
  format: string;
  size: number;
  width: number;
  height: number;
  altText?: string;
  createdAt: string;
  uploadedBy: { name: string };
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        type,
        search
      });
      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, type, search]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("file", file);

      setUploadProgress(30);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData
      });
      setUploadProgress(80);
      const data = await res.json();

      if (data.success) {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setShowUploadModal(false);
          fetchMedia();
        }, 500);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this media?")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
            <Sparkles size={14} className="animate-pulse" />
            <span>Asset Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Media <span className="text-primary italic">Forge</span>
          </h1>
          <p className="text-white/40 font-medium max-w-md leading-relaxed">
            Centralized storage for your vibrant heritage assets and cinematic videos.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-black text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="h-5 w-5" strokeWidth={3} />
          <span>UPLOAD ASSET</span>
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <section className="flex flex-col md:flex-row gap-4 p-4 rounded-3xl border border-white/10 bg-white/3 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or format..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:bg-white/10 focus:border-primary/40 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "image", "video"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${type === t ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* ── MEDIA GRID ── */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <MediaCard
                key={item._id}
                item={item}
                onDelete={() => handleDelete(item._id)}
                onCopy={() => copyUrl(item.url)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/20">
              <FileImage size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Mirror is empty</h3>
            <p className="text-white/40 text-sm">No assets found in your library yet.</p>
          </div>
        )}
      </section>

      {/* ── UPLOAD MODAL ── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUploading && setShowUploadModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-3xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="flex flex-col items-center text-center">
                {isUploading ? (
                  <>
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Forging Asset...</h3>
                    <p className="text-white/40 text-sm mb-8">Preparing your high-resolution heritage media.</p>
                    <div className="w-full h-2 rounded-full bg-white/5 mb-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{uploadProgress}% Complete</span>
                  </>
                ) : (
                  <>
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-8 text-white/40">
                      <Upload size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Upload Asset</h3>
                    <p className="text-white/40 text-sm mb-10 leading-relaxed">
                      Select a file to sync with Cloudinary storage. <br />
                      Supports JPEG, PNG, MP4, and WebM.
                    </p>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all active:scale-95"
                    >
                      SELECT FILE
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleUpload}
                      accept="image/*,video/*"
                    />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MediaCard({ item, onDelete, onCopy }: { item: MediaItem, onDelete: () => void, onCopy: () => void }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["BYTES", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="group relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/3 transition-all hover:bg-white/10 hover:border-white/20"
    >
      {item.type === "video" ? (
        <div className="h-full w-full flex items-center justify-center bg-black/40">
          <Video className="text-white/10" size={48} />
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-[10px] font-black text-white/60">VIDEO</div>
        </div>
      ) : (
        <img
          src={item.url}
          alt={item.altText || "Heritage Media"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 backdrop-blur-sm">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
            title="Copy URL"
          >
            {isCopied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-90"
            title="Delete Forever"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div>
          <p className="text-[10px] font-black text-white truncate mb-1">{item.publicId.split("/").pop()}</p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">{item.format} • {formatSize(item.size)}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all"
            >
              <Eye size={12} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
