"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import BlogArticle from "@/app/components/blog/BlogArticle";
import BlogArticleSkeleton from "@/app/components/blog/BlogArticleSkeleton";
import type { BlogPostView } from "@/app/components/blog/types";

export default function PreviewClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const previewId = params.id as string;
  const token = searchParams.get("t");

  const [post, setPost] = useState<BlogPostView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!previewId || !token) {
      setError("Invalid preview link. Generate a new preview from the editor.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get(`/api/posts/draft/${previewId}`, {
          params: { t: token },
        });
        if (cancelled) return;
        if (res.data?.success && res.data.data) {
          const d = res.data.data;
          setPost({
            title: d.title,
            content: d.content,
            coverImage: d.coverImage,
            tags: d.tags,
            category: d.category,
            author: d.author,
            readingTime: d.readingTime,
            publishedAt: d.publishedAt,
          });
        } else {
          setError("Preview not found");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load preview";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [previewId, token]);

  if (loading) {
    return <BlogArticleSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-lg font-semibold text-foreground">Preview unavailable</h1>
          <p className="text-sm text-muted-foreground">{error ?? "Unknown error"}</p>
          <p className="text-xs text-muted-foreground">
            Preview links expire after 1 hour. Return to the editor and click Preview again.
          </p>
        </div>
      </div>
    );
  }

  return <BlogArticle post={post} isPreview />;
}
