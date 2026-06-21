"use client";

import type { JSONContent } from "@tiptap/core";
import { migrateEditorContent } from "../lib/migrate-content";
import ContentNode from "./ContentNode";

interface ContentDocumentProps {
  content: JSONContent | Record<string, unknown> | null | undefined;
  className?: string;
}

/**
 * Canonical read-only renderer — preview & published pages.
 * Walks Tiptap JSON and renders presentation components (no ProseMirror, no editor UI).
 */
export default function ContentDocument({ content, className = "" }: ContentDocumentProps) {
  const doc = migrateEditorContent(content as JSONContent);
  const nodes = doc.content ?? [];

  return (
    <article className={`cms-document ${className}`.trim()}>
      {nodes.map((node, i) => (
        <ContentNode key={`${node.type}-${i}`} node={node} />
      ))}
    </article>
  );
}
