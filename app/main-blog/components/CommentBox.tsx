"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Loader2, CheckCircle2, User, Clock } from "lucide-react";

interface CommentBoxProps {
    postId: string;
}

interface IComment {
    _id: string;
    content: string;
    user_info: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function CommentBox({ postId }: CommentBoxProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        content: "",
    });
    const [comments, setComments] = useState<IComment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const fetchComments = useCallback(async () => {
        if (!postId) return;
        try {
            const res = await fetch(`/api/comments?post=${postId}`);
            const data = await res.json();
            if (res.ok) {
                setComments(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoadingComments(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (status !== "idle") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postId) {
            setStatus("error");
            setMessage("Post ID is missing. Please refresh the page.");
            return;
        }

        if (!formData.name || !formData.content) {
            setStatus("error");
            setMessage("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        setStatus("idle");

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post: postId,
                    content: formData.content,
                    user_info: {
                        name: formData.name,
                        email: formData.email,
                    },
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage("Comment submitted successfully!");
                setFormData({ name: "", email: "", content: "" });
                fetchComments(); // Refresh comments list
            } else {
                throw new Error(data.message || "Failed to submit comment");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-8 pt-10 border-t border-border">
            {/* 1. Comments List */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    Comments
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {comments.length}
                    </span>
                </h3>

                {isLoadingComments ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading comments...
                    </div>
                ) : comments.length > 0 ? (
                    <div className="grid gap-6">
                        {comments.map((cmt) => (
                            <div key={cmt._id} className="flex gap-4 group">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                                    {(cmt.user_info.name || "A")[0].toUpperCase()}
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-foreground truncate">
                                            {cmt.user_info.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-tight">
                                            <Clock className="h-3 w-3" />
                                            {new Date(cmt.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {cmt.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>

            {/* 2. Form Section */}
            <div className="pt-8 border-t border-dashed border-border space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Leave a Comment</h3>
                    {status === "success" && (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 className="h-4 w-4" />
                            {message}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            disabled={isSubmitting}
                            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 disabled:opacity-50 transition-all shadow-sm"
                        />

                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email (optional)"
                            disabled={isSubmitting}
                            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 disabled:opacity-50 transition-all shadow-sm"
                        />
                    </div>

                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your thoughts…"
                        rows={4}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm outline-none resize-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 disabled:opacity-50 transition-all shadow-sm"
                    />

                    {status === "error" && (
                        <p className="text-xs text-destructive font-medium">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-amber-600 disabled:active:scale-100 transition-all shadow-md shadow-amber-600/10"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Comment"}
                    </button>
                </form>
            </div>
        </section>
    );
}
