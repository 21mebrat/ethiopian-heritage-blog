"use client";

import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import { useBlog } from "@/app/context/blog-context";
import { useAppContext } from "@/app/context/ui-context";

export default function BlogHomePage() {
    const { filteredPosts, isLoading, error } = useBlog();
    const { search, category } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-destructive font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm underline hover:text-primary transition-colors"
                >
                    Try again
                </button>
            </div>
        );
    }

    // Pagination calculations
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {paginatedPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>

            {/* Empty state */}
            {filteredPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                        {search 
                            ? `No results found for "${search}"` 
                            : "No posts found in this category."}
                    </p>
                </div>
            )}

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}