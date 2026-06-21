"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  FileText,
  TrendingUp,
  X,
  Sparkles,
  Search,
  Loader2,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  postCount?: number;
}

const PALETTE = [
  "#D4A056", "#C84630", "#3C5C3E", "#5C4033", 
  "#8B6F47", "#A39A91", "#6B635C", "#D89B4D"
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/categories");
      if (res.data.success) {
        // Here we could also fetch post counts if the backend supported it, 
        // for now we'll match the ID to a seeded color.
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete this category.")) return;
    try {
      const res = await axios.delete(`/api/categories/${id}`);
      if (res.data.success) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    try {
      setIsSaving(true);
      if (editingCategory) {
        const res = await axios.patch(`/api/categories/${editingCategory._id}`, formData);
        if (res.data.success) {
          setCategories(categories.map(c => c._id === editingCategory._id ? res.data.data : c));
        }
      } else {
        const res = await axios.post("/api/categories", formData);
        if (res.data.success) {
          setCategories([res.data.data, ...categories]);
        }
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error saving category", error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* ── HEADER SECTION ── */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-[0.3em] uppercase text-[10px]">
             <Sparkles size={14} className="animate-pulse" />
             <span>Taxonomy Engine</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">
            Heritage <span className="text-primary italic">Collections</span>
          </h1>
          <p className="text-white/40 font-medium max-w-md leading-relaxed">
            Curate and organize your platform's cultural narrative through high-level categorization.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "" });
            setIsDialogOpen(true);
          }}
          className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 overflow-hidden"
        >
          <Plus size={18} strokeWidth={3} />
          <span>New Collection</span>
        </button>
      </section>

      {/* ── STATS & SEARCH ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5" />
            <input 
              type="text"
              placeholder="Filter collections by name or identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white/3 border border-white/10 rounded-[2rem] pl-16 pr-8 text-white placeholder:text-white/20 focus:bg-white/5 focus:border-primary/40 transition-all outline-none backdrop-blur-md"
            />
         </div>
         <div className="flex gap-4 p-4 rounded-[2rem] border border-white/10 bg-white/3 backdrop-blur-md items-center px-8">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <FolderOpen size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Taxonomy</p>
               <p className="text-xl font-bold text-white">{categories.length} <span className="text-xs text-white/40 font-medium tracking-normal">Collections</span></p>
            </div>
         </div>
      </div>

      {/* ── CATEGORIES GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-white/3 animate-pulse border border-white/5" />
          ))
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((cat, i) => (
            <CategoryCard 
              key={cat._id} 
              category={cat} 
              index={i}
              onEdit={() => handleEdit(cat)}
              onDelete={() => handleDelete(cat._id)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="h-20 w-20 rounded-full bg-white/3 flex items-center justify-center mx-auto text-white/10">
                <FolderOpen size={40} />
             </div>
             <p className="text-white/40 font-medium">No collections found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* ── EDIT/CREATE DIALOG ── */}
      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => !isSaving && setIsDialogOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-3xl" 
            />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="space-y-2">
                     <div className="text-primary font-black uppercase text-[10px] tracking-[0.2em]">Collection Management</div>
                     <h2 className="text-3xl font-black text-white tracking-tighter">
                        {editingCategory ? "Edit Collection" : "New Collection"}
                     </h2>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Collection Name</label>
                        <input 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           placeholder="e.g. Archaeological Heritage"
                           className="w-full h-16 bg-white/3 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/10 focus:bg-white/5 focus:border-primary/40 transition-all outline-none"
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Description</label>
                        <textarea 
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                           placeholder="Describe the scope of this collection..."
                           className="w-full h-32 bg-white/3 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/10 focus:bg-white/5 focus:border-primary/40 transition-all outline-none resize-none"
                        />
                     </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Sparkles size={18} strokeWidth={3} />
                        <span>{editingCategory ? "Update Collection" : "Forging Collection"}</span>
                      </>
                    )}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryCard({ category, index, onEdit, onDelete }: { category: Category, index: number, onEdit: () => void, onDelete: () => void }) {
  const color = PALETTE[index % PALETTE.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div 
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 scale-95" 
        style={{ background: `${color}20` }} 
      />
      
      <div className="relative h-full flex flex-col p-8 rounded-[2.5rem] border border-white/5 bg-white/2 backdrop-blur-md transition-all hover:bg-white/4 hover:border-white/10 overflow-hidden">
         {/* ID Label */}
         <div className="flex items-center justify-between mb-8">
            <div 
              className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: `${color}15`, color: color }}
            >
              C-{category.slug.slice(0, 3).toUpperCase()}
            </div>
            
            <div className="flex gap-2">
               <button 
                  onClick={onEdit}
                  className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
               >
                  <Edit size={14} />
               </button>
               <button 
                  onClick={onDelete}
                  className="h-8 w-8 rounded-xl bg-red-500/5 flex items-center justify-center text-red-500/40 hover:bg-red-500/20 hover:text-red-500 transition-all"
               >
                  <Trash2 size={14} />
               </button>
            </div>
         </div>

         <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tighter truncate group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-[10px] font-medium text-white/20 font-mono tracking-widest uppercase">
                /{category.slug}
              </p>
            </div>

            <p className="text-sm text-white/40 leading-relaxed line-clamp-3">
              {category.description || "Unlocking the specific heritage narratives defined within this taxonomic boundary."}
            </p>
         </div>

         <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active System</span>
            </div>
            <button className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
               <ChevronRight size={18} />
            </button>
         </div>

         {/* Backdrop Glow */}
         <div 
           className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full opacity-5 blur-[60px]"
           style={{ backgroundColor: color }}
         />
      </div>
    </motion.div>
  );
}
