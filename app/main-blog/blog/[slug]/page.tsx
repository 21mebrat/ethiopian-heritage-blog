"use client";

import React, { useEffect } from "react";
import PostBody from "../../components/PostBody";
import CommentBox from "../../components/CommentBox";
import { useBlog } from "@/app/context/blog-context";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
    const { slug } = useParams() as { slug: string };
    const { currentPost, fetchPostBySlug, isLoading, error } = useBlog();

    useEffect(() => {
        if (slug) {
            fetchPostBySlug(slug);
        }
    }, [slug, fetchPostBySlug]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !currentPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-destructive font-medium">{error || "Post not found"}</p>
            </div>
        );
    }



    const mappedPost = {
        title: currentPost.title,
        category: currentPost.category?.name || "Uncategorized",
        date: new Date(currentPost.publishedAt || currentPost.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }),
        readTime: currentPost.readingTime ? `${currentPost.readingTime} min read` : "5 min read",
        image: currentPost.coverImage || currentPost.image || "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=1200",
        content: currentPost.content,
        author: currentPost.author?.name || "Author"
    };
    console.log({ currentPost: currentPost?._id })
    return (
        <div className="">
            <PostBody {...mappedPost} />
            <CommentBox postId={currentPost._id} />
        </div>
    );
}
