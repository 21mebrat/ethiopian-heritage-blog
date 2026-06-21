"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

interface IComment {
  _id: string;
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  user_info: {
    name: string;
    email: string;
    phone?: string;
  };
  content: string;
  isvisible: boolean;
  createdAt: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/admin/comments?${params}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalComments(data.pagination.total);
      } else {
        throw new Error(data.message || "Failed to fetch comments");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComments();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchComments]);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isvisible: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setComments(comments.map(c => c._id === id ? { ...c, isvisible: !currentStatus } : c));
      }
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchComments();
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
            <MessageSquare size={14} className="animate-pulse" />
            <span>Community Feedback</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ethereal <span className="text-primary italic font-normal">Voices</span>
          </h1>
          <p className="text-white/40 font-medium max-w-md leading-relaxed">
            Manage and moderate discussions across your ethereal stories.
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all hover:bg-white/10"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* User Info Avatar */}
                <div className="hidden md:flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-black font-bold text-lg">
                    {comment.user_info.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`h-full w-px bg-white/5 group-hover:bg-primary/20 transition-colors`} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-white">{comment.user_info.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${comment.isvisible ? "bg-green-500/10 text-green-500" : "bg-white/10 text-white/40"
                          }`}>
                          {comment.isvisible ? "Approved" : "Hidden"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-white/30">
                        <div className="flex items-center gap-2"><Mail size={12} /> {comment.user_info.email}</div>
                        <div className="flex items-center gap-2"><Calendar size={12} /> {new Date(comment.createdAt).toLocaleDateString()}</div>
                        <Link
                          href={`/posts/${comment.post.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 text-primary/60 hover:text-primary transition-all"
                        >
                          <ExternalLink size={12} /> {comment.post.title}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleVisibility(comment._id, comment.isvisible)}
                        className={`p-2 rounded-xl transition-all border ${comment.isvisible
                          ? "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                          : "bg-primary border-primary text-black hover:bg-primary/90"
                          }`}
                        title={comment.isvisible ? "Hide Comment" : "Approve Comment"}
                      >
                        {comment.isvisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="p-2 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-white/70 leading-relaxed text-sm font-medium">
                    {comment.content}
                  </div>
                </div>
              </div>
            </div>
          ))

        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <MessageCircle size={40} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Silent Landscape</h3>
            <p className="text-white/40 font-medium">No comments found matching your current filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${page === i + 1
                ? "bg-primary text-black scale-110 shadow-lg shadow-primary/10"
                : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
