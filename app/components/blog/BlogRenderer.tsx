"use client";

import type { JSONContent } from "@tiptap/core";
import ContentDocument from "@/app/components/editor/render/ContentDocument";

interface BlogRendererProps {
  content: JSONContent | Record<string, unknown> | null | undefined;
  className?: string;
}

/**
 * Published / preview content renderer.
 * Uses ContentDocument (JSON → React) — NOT Tiptap read-only mode.
 * Guarantees WYSIWYG: same components & CSS as editor content area.
 */
export default function BlogRenderer({ content, className }: BlogRendererProps) {
  return <ContentDocument content={content} className={className} />;
}
