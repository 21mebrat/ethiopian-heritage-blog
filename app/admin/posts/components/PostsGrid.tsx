"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Edit, Calendar, Clock, User, Layers, MessageSquare } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ActionMenu } from "./ActionMenu";
import { ConfirmModal } from "./ConfirmModal";
import { formatDate, formatNumber } from "@/lib/utils";
import { IPostPopulated } from "@/app/types";
import { useState } from "react";

interface PostsGridProps {
  posts: IPostPopulated[];
  isLoading?: boolean;
  onDelete?: (postId: string) => void;
  onDuplicate?: (postId: string) => void;
}

export function PostsGrid({ posts, isLoading, onDelete, onDuplicate }: PostsGridProps) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null }>({
    isOpen: false,
    postId: null,
  });

  const handleDeleteClick = (postId: string) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.postId && onDelete) {
      onDelete(deleteModal.postId);
    }
    setDeleteModal({ isOpen: false, postId: null });
  };

  const handleDuplicate = (postId: string) => {
    if (onDuplicate) {
      onDuplicate(postId);
    }
  };

  if (isLoading) {
    return <PostsGridSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl py-20 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 group transition-transform hover:scale-110">
          <Edit className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
        <p className="text-white/40 max-w-xs mb-8">
          Get started by creating your first amazing heritage story.
        </p>
        <Link
          href="/admin/posts/create"
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Create New Post
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id.toString()}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md transition-all hover:bg-white/6 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20"
          >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
              <Link href={`/admin/posts/edit/${post._id}`} className="block h-full w-full">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5">
                    <Edit className="h-10 w-10 text-white/20" />
                  </div>
                )}
                {/* Overlay for actions on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                   <div className="flex gap-2">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                         <Edit className="w-5 h-5 text-white" />
                      </div>
                   </div>
                </div>
              </Link>

              {/* Status Badge - Floating */}
              <div className="absolute top-4 left-4">
                <StatusBadge status={post.status} />
              </div>

               {/* Action Menu - Floating */}
               <div className="absolute top-4 right-4">
                <div className="bg-black/20 backdrop-blur-md rounded-lg p-0.5">
                  <ActionMenu
                    postId={post._id.toString()}
                    onDuplicate={() => handleDuplicate(post._id.toString())}
                    onDelete={() => handleDeleteClick(post._id.toString())}
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Layers className="h-3 w-3" />
                  {post.category?.name || "Uncategorized"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                  <Clock className="h-3 w-3" />
                  {formatDate(post.updatedAt)}
                </span>
              </div>

              <Link
                href={`/admin/posts/edit/${post._id}`}
                className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors hover:text-primary leading-tight"
              >
                {post.title}
              </Link>

              <p className="mb-4 line-clamp-2 text-sm text-white/40 leading-relaxed">
                {post.excerpt || "No excerpt provided for this post."}
              </p>

              {/* Stats & Footer */}
              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Eye className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">{formatNumber(post.views || 0)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <MessageSquare className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">24</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 group/author">
                   <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/10">
                      {post.author?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "NA"}
                   </div>
                   <span className="text-xs text-white/60 group-hover/author:text-white transition-colors">{post.author?.name?.split(" ")[0] || "Author"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}

function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/2">
          <div className="h-48 w-full animate-pulse bg-white/5" />
          <div className="p-5 space-y-4">
             <div className="flex gap-2">
                <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
             </div>
             <div className="h-6 w-full animate-pulse rounded bg-white/5" />
             <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
             </div>
             <div className="pt-4 flex justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-white/5" />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
