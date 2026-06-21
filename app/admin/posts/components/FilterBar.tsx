"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  categories: { _id: string; name: string }[];
  initialSearch?: string;
  initialStatus?: string;
  initialCategory?: string;
  initialSort?: string;
}

export function FilterBar({
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  categories,
  initialSearch = "",
  initialStatus = "all",
  initialCategory = "all",
  initialSort = "newest",
}: FilterBarProps) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setSort("newest");
    onSearchChange("");
    onStatusChange("all");
    onCategoryChange("all");
    onSortChange("newest");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary text-white/30">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search heritage stories..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm text-white placeholder:text-white/20 transition-all outline-none focus:border-primary/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center justify-center gap-2 h-12 rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/80 font-medium hover:bg-white/[0.06] transition-all"
        >
          <Filter size={16} className={showMobileFilters ? "text-primary" : ""} />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Desktop Filters */}
        <div className={`flex-wrap gap-3 ${showMobileFilters ? "flex" : "hidden"} lg:flex`}>
          {/* Status Filter */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-primary/60 transition-colors">
              <Filter className="h-4 w-4" />
            </div>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-12 w-full sm:w-auto min-w-[140px] appearance-none rounded-2xl border border-white/10 bg-white/[0.03] px-9 pr-10 text-sm text-white/80 transition-all outline-none hover:bg-white/[0.06] focus:border-primary/50 [&>option]:bg-[#1a1a2e] [&>option]:text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-primary/60 transition-colors">
              <Filter className="h-4 w-4" />
            </div>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-12 w-full sm:w-auto min-w-[160px] appearance-none rounded-2xl border border-white/10 bg-white/[0.03] px-9 pr-10 text-sm text-white/80 transition-all outline-none hover:bg-white/[0.06] focus:border-primary/50 [&>option]:bg-[#1a1a2e] [&>option]:text-white"
            >
              <option value="all">Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-primary/60 transition-colors">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-12 w-full sm:w-auto min-w-[160px] appearance-none rounded-2xl border border-white/10 bg-white/[0.03] px-9 pr-10 text-sm text-white/80 transition-all outline-none hover:bg-white/[0.06] focus:border-primary/50 [&>option]:bg-[#1a1a2e] [&>option]:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_viewed">Most Viewed</option>
              <option value="recently_updated">Latest Edit</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(status !== "all" || category !== "all" || sort !== "newest" || search !== "") && (
             <button 
               onClick={clearFilters}
               className="h-12 px-4 rounded-2xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/10 transition-all"
             >
               Reset
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
