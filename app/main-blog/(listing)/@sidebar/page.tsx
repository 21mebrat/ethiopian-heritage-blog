"use client";

import PopularSidebar from "../../components/PopularSidebar";
import { useBlog } from "@/app/context/blog-context";

export default function SidebarSlot() {
    const { posts, isLoading } = useBlog();

    if (isLoading || posts.length === 0) {
        return (
            <aside className="w-full h-[400px] bg-muted animate-pulse rounded-xl" />
        );
    }

    // Pass the top 3 or first 3 posts
    return <PopularSidebar posts={posts.slice(0, 3)} />;
}
