import type { JSONContent } from "@tiptap/core";

export interface BlogPostView {
  _id: string;
  title: string;
  content: JSONContent | Record<string, unknown> | null;
  coverImage?: string | null;
  tags?: string[];
  publishedAt?: string | Date | null;
  readingTime?: number;
  author?: {
    name?: string;
    avatar?: string | null;
  };
  category?: {
    name?: string;
    slug?: string;
  };
}
