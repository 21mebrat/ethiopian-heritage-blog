"use client";

import RelatedPosts from "../../../components/RelatedPosts";
import { useBlog } from "@/app/context/blog-context";

export default function RelatedSlot() {
    const { posts, currentPost, isLoading } = useBlog();

    if (isLoading || !currentPost) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-16/10 bg-muted animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    // 1. Get posts in the same category (excluding current)
    const categoryId = currentPost.category?._id;
    const sameCategoryPosts = posts.filter(
        (p) => p.category?._id === categoryId && p._id !== currentPost._id
    );

    // 2. If we have fewer than 3, fill with other recent posts
    let finalRelated = [...sameCategoryPosts];
    if (finalRelated.length < 3) {
        const otherPosts = posts.filter(
            (p) => p._id !== currentPost._id && !finalRelated.find(r => r._id === p._id)
        );
        finalRelated = [...finalRelated, ...otherPosts].slice(0, 3);
    } else {
        finalRelated = finalRelated.slice(0, 3);
    }

    if (finalRelated.length === 0) return null;

    return <RelatedPosts posts={finalRelated} />;
}

