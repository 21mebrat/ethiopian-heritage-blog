"use client";

import PopularSidebar from "../../../components/PopularSidebar";
import { useBlog } from "@/app/context/blog-context";

export default function PopularSlot() {
    const { posts, currentPost, isLoading } = useBlog();

    if (isLoading || posts.length === 0 || !currentPost) {
        return (
            <aside className="w-full h-[300px] bg-muted animate-pulse rounded-xl" />
        );
    }

    // Sort by views descending, exclude current post, and take top 5
    const popularPosts = [...posts]
        .filter((p) => p._id !== currentPost?._id)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    return <PopularSidebar posts={popularPosts} />;
}

