"use client";

import {
  Eye,
  MoveLeft,
  Upload,
  X,
  Save,
  Send,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AdvancedEditor from "@/app/components/editor/AdvancedEditor";
import { uploadToCloudinary } from "@/app/components/editor/core/upload-api";
import { useBlogPreview } from "@/app/hooks/useBlogPreview";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface PostData {
  _id: string;
  title: string;
  content: any;
  coverImage: string | null;
  category: any;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // ── Form State ──
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(null);
  const [initialEditorContent, setInitialEditorContent] = useState<any>(null);

  // ── Server State ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [publishing, setPublishing] = useState(false);
  const { openPreview, previewing } = useBlogPreview();

  // ── Mobile settings panel toggle ──
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ── Fetch data on mount ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get(`/api/posts/${id}`)
        ]);

        if (catRes.data?.data) setCategories(catRes.data.data);
        
        if (postRes.data?.success) {
          const post = postRes.data.post as PostData;
          setTitle(post.title);
          setCategoryId(typeof post.category === 'object' ? post.category?._id : post.category);
          setTags(post.tags.join(", "));
          setFeatured(post.featured || false);
          setCoverImage(post.coverImage);
          setInitialEditorContent(post.content);
          setEditorContent(post.content);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Cover Image Upload ──
  const handleCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result?.url) setCoverImage(result.url);
    } catch (err) {
      console.error("Cover upload failed", err);
    } finally {
      setCoverUploading(false);
    }
    e.target.value = "";
  };

  // ── Update Post ──
  const handleUpdate = async (status: "draft" | "published") => {
    if (!title.trim()) return alert("Please enter a title");
    if (!categoryId) return alert("Please select a category");
    if (!editorContent) return alert("Please write some content");

    if (status === "published") setPublishing(true);
    else setSavedStatus("saving");

    try {
      await axios.put(`/api/posts/${id}`, {
        title: title.trim(),
        content: editorContent,
        category: categoryId,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        coverImage: coverImage || null,
        status,
        featured,
      });

      if (status === "published") {
        router.push("/admin/posts");
      } else {
        setSavedStatus("saved");
        setTimeout(() => setSavedStatus("idle"), 3000);
      }
    } catch (err: any) {
      console.error("Update failed", err);
      if (status === "published") {
        alert(err.response?.data?.message || "Publish failed");
      } else {
        setSavedStatus("error");
        setTimeout(() => setSavedStatus("idle"), 3000);
      }
    } finally {
      setPublishing(false);
    }
  };

  const handlePreview = () => {
    openPreview({
      title,
      content: editorContent,
      coverImage,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      categoryId: categoryId || undefined,
    });
  };

  const statusLabel = {
    idle: "Draft",
    saving: "Saving…",
    saved: "Saved ✓",
    error: "Failed!",
  }[savedStatus];

  const statusColor = {
    idle: "bg-gray-400",
    saving: "bg-amber-500 animate-pulse",
    saved: "bg-green-500",
    error: "bg-red-500",
  }[savedStatus];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ── Settings Panel Content ──
  const SettingsContent = () => (
    <div className="space-y-0">
      {/* Cover Image */}
      <div className="p-4 border-b border-white/5">
        <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">
          Cover Image
        </label>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-dashed border-white/10 group">
          {coverImage ? (
            <>
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <button
                  onClick={() => setCoverImage(null)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-full shadow-md hover:bg-white/20"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 transition-colors"
            >
              {coverUploading ? (
                <div className="w-5 h-5 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-medium">Upload Cover</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
      </div>

      {/* Category */}
      <div className="p-4 border-b border-white/5">
        <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full h-10 rounded-xl border border-white/10 px-3 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none"
        >
          <option value="" className="bg-[#0a0a0a]">Select category…</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id} className="bg-[#0a0a0a]">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-white/5">
        <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">
          Tags
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="history, culture, art"
          className="w-full h-10 rounded-xl border border-white/10 px-3 bg-white/5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
        />
        <p className="text-[10px] text-white/20 mt-1.5">
          Separate tags with commas
        </p>
      </div>

      {/* Featured Toggle */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">
              Featured
            </label>
            <p className="text-[10px] text-white/20 mt-0.5">
              Show on homepage
            </p>
          </div>
          <button
            onClick={() => setFeatured(!featured)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              featured ? "bg-primary" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                featured ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 sm:pb-28">
      {/* ══════════ TOP BAR ══════════ */}
      <div className="sticky top-0 z-40 h-12 sm:h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <MoveLeft className="w-4 h-4 text-white/60" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusColor}`} />
            <span className="text-xs sm:text-sm font-medium text-white/40">
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="lg:hidden p-2 rounded-xl text-white/60 hover:bg-white/10 transition"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleUpdate("draft")}
            disabled={savedStatus === "saving"}
            className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white/60 hover:bg-white/10 border border-white/10 items-center gap-1.5 sm:gap-2 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Update Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePreview}
            disabled={previewing}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white/60 hover:bg-white/10 items-center gap-1.5 sm:gap-2 transition disabled:opacity-50 flex"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => handleUpdate("published")}
            disabled={publishing}
            className="px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-primary text-black hover:bg-primary/90 flex items-center gap-1.5 sm:gap-2 transition disabled:opacity-50 shadow-[0_4px_10px_rgba(212,165,116,0.3)]"
          >
            <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">
              {publishing ? "Publishing…" : "Update & Publish"}
            </span>
          </button>
        </div>
      </div>

      {/* ══════════ MOBILE SETTINGS PANEL ══════════ */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0a0a0a] rounded-t-3xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-white/10 rounded-full" />
              </div>
              <div className="px-1 pb-8">
                <div className="flex items-center justify-between px-6 mb-4">
                  <h3 className="text-base font-bold text-white">Post Settings</h3>
                  <button onClick={() => setSettingsOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>
                <SettingsContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex max-w-[1440px] mx-auto min-h-[calc(100vh-3.5rem)]">
        <div className="flex-1 min-w-0 px-3 sm:px-6 py-4 sm:py-8 lg:px-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full text-2xl sm:text-3xl md:text-5xl font-black bg-transparent outline-none placeholder:text-white/5 text-white mb-2 leading-tight"
          />

          <div className="h-px w-24 bg-primary/30 mb-8" />

          <div className="prose prose-invert max-w-none">
            <AdvancedEditor initialContent={initialEditorContent} onChange={setEditorContent} />
          </div>
        </div>

        <div className="hidden lg:block w-[320px] xl:w-[360px] shrink-0">
          <div className="sticky top-20 mr-4 xl:mr-10 space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <SettingsContent />
            </div>
            <div className="bg-white/2 backdrop-blur-md rounded-2xl border border-white/5 px-5 py-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Status</span>
                <span className="text-xs text-white/60 font-medium">Draft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
