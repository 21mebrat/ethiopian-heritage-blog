"use client";

import FeaturedPost from "../../components/FeaturedPost";
import { useBlog } from "@/app/context/blog-context";

export default function FeaturedSlot() {
    const { posts, isLoading } = useBlog();

    if (isLoading || posts.length === 0) {
        return <div className="h-[300px] bg-muted animate-pulse rounded-3xl" />;
    }

    // Use the first post as featured
    return <FeaturedPost post={posts[0]} />;
}
