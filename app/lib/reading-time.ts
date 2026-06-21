import type { JSONContent } from "@tiptap/core";

function extractText(node: JSONContent | Record<string, unknown>): string {
  if (!node || typeof node !== "object") return "";

  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }

  const children = node.content;
  if (!Array.isArray(children)) return "";

  return children.map((child) => extractText(child as JSONContent)).join(" ");
}

/** Rough reading time in minutes (min 1). */
export function estimateReadingTime(content: unknown): number {
  const text = extractText((content as JSONContent) ?? { type: "doc", content: [] });
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
