"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { IPostPopulated } from "@/app/types";
import { useAppContext } from "./ui-context";

interface BlogContextType {
    posts: IPostPopulated[];
    filteredPosts: IPostPopulated[];
    currentPost: any | null;
    isLoading: boolean;
    error: string | null;
    fetchPosts: () => Promise<void>;
    fetchPostBySlug: (slug: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<IPostPopulated[]>([]);
    const [currentPost, setCurrentPost] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Consume UI Context for search and category
    const { search, category } = useAppContext();

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/posts");
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            } else {
                setError(data.message || "Failed to fetch posts");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPostBySlug = useCallback(async (slug: string) => {
        const existing = posts.find(p => p.slug === slug);
        if (existing) {
            setCurrentPost(existing);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/posts/slug/${slug}`);
            const data = await response.json();
            if (data.success) {
                setCurrentPost(data.data);
            } else {
                setError(data.message || "Post not found");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [posts]);

    // Robust Global Filtering Logic
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // 1. Category Filter
            const matchesCategory = !category || category === "all" || 
                post.category?.name.toLowerCase() === category.toLowerCase() ||
                post.category?.slug.toLowerCase() === category.toLowerCase();

            // 2. Search Filter (Title + Tag + excerpt)
            const searchLower = search.toLowerCase().trim();
            const matchesSearch = !searchLower || 
                post.title.toLowerCase().includes(searchLower) ||
                post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchLower));

            return matchesCategory && matchesSearch;
        });
    }, [posts, search, category]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <BlogContext.Provider value={{ 
            posts, 
            filteredPosts, 
            currentPost, 
            isLoading, 
            error, 
            fetchPosts, 
            fetchPostBySlug 
        }}>
            {children}
        </BlogContext.Provider>
    );
}

export function useBlog() {
    const context = useContext(BlogContext);
    if (context === undefined) {
        throw new Error("useBlog must be used within a BlogProvider");
    }
    return context;
}

