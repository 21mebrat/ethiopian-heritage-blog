"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { StatisticsCards } from "./components/StatisticsCards";
import { FilterBar } from "./components/FilterBar";
import { PostsGrid } from "./components/PostsGrid";
import { Pagination } from "./components/Pagination";
import { IPostPopulated } from "@/app/types";

export default function Posts() {
  const [posts, setPosts] = useState<IPostPopulated[]>([]);
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        search,
        status,
        category,
        sort,
      });

      const response = await fetch(`/api/posts/admin?${params}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/posts/admin/statistics", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch statistics");

      const data = await response.json();
      setStatistics(data.data);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search, status, category, sort]);

  useEffect(() => {
    fetchStatistics();
    fetchCategories();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      await fetchPosts();
      await fetchStatistics();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleDuplicate = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/duplicate`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to duplicate post");

      await fetchPosts();
      await fetchStatistics();
    } catch (err) {
      console.error("Failed to duplicate post:", err);
    }
  };

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-12 text-center max-w-md shadow-2xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
                  <Plus className="h-10 w-10 text-destructive rotate-45" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Operation Interrupted</h3>
              <p className="text-white/40 mb-8">{error}</p>
              <button
                  onClick={fetchPosts}
                  className="w-full rounded-xl bg-white text-black py-4 font-bold transition-all hover:bg-white/90 active:scale-95"
              >
                  Reconnect Now
              </button>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
             <Sparkles size={14} className="animate-pulse" />
             <span>Heritage Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Ethereal <span className="text-primary italic">Stories</span>
          </h1>
          <p className="text-white/40 font-medium max-w-md leading-relaxed">
            Curate, edit and publish your breathtaking content from this centralized command center.
          </p>
        </div>
        
        <Link
          href="/admin/posts/create"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-primary px-8 py-4 text-sm font-black text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
          <Plus className="h-5 w-5" strokeWidth={3} />
          <span>CRAFT NEW STORY</span>
        </Link>
      </div>

      {/* Statistics Section */}
      <section>
        <StatisticsCards
            totalPosts={statistics.totalPosts}
            publishedPosts={statistics.publishedPosts}
            draftPosts={statistics.draftPosts}
            totalViews={statistics.totalViews}
            isLoading={isLoading}
        />
      </section>

      {/* Filter & Search Section */}
      <section className="rounded-3xl border border-white/10 bg-white/2 p-4 backdrop-blur-md">
        <FilterBar
            categories={categories}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            initialSearch={search}
            initialStatus={status}
            initialCategory={category}
            initialSort={sort}
        />
      </section>

      {/* Posts Grid Container */}
      <section className="min-h-[400px]">
         <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.2em]">Latest Content</h2>
            <div className="h-px flex-1 mx-6 bg-white/5" />
            <div className="text-[10px] font-bold text-white/40">{posts.length} results found</div>
         </div>
         
         <PostsGrid
            posts={posts}
            isLoading={isLoading}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
        />
      </section>

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <div className="flex justify-center pt-8 border-t border-white/5">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
      )}
    </div>
  );
}