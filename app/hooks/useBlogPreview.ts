"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import type { JSONContent } from "@tiptap/core";

export interface PreviewDraftInput {
  title: string;
  content: JSONContent | Record<string, unknown> | null;
  coverImage?: string | null;
  tags?: string[];
  categoryId?: string;
  authorName?: string;
}

/**
 * Opens preview in a new tab via temporary server-side draft (Option A).
 * Tab opens immediately; navigates once the draft is saved.
 */
export function useBlogPreview() {
  const [previewing, setPreviewing] = useState(false);

  const openPreview = useCallback(async (input: PreviewDraftInput) => {
    if (!input.content) {
      alert("Add some content before previewing.");
      return;
    }

    const previewWindow = window.open("about:blank", "_blank");
    if (!previewWindow) {
      alert("Pop-up blocked. Allow pop-ups for this site to use Preview.");
      return;
    }

    previewWindow.document.write(
      `<!DOCTYPE html><html><head><title>Loading preview…</title></head><body style="margin:0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fafaf9;color:#444"><p>Preparing preview…</p></body></html>`
    );

    setPreviewing(true);

    try {
      const res = await axios.post("/api/posts/draft", {
        title: input.title.trim() || "Untitled",
        content: input.content,
        coverImage: input.coverImage ?? null,
        tags: input.tags ?? [],
        categoryId: input.categoryId || undefined,
        authorName: input.authorName,
      });

      const { previewId, previewSecret } = res.data?.data ?? {};
      if (!previewId || !previewSecret) {
        throw new Error("Invalid preview response");
      }

      const url = `/preview/${previewId}?t=${encodeURIComponent(previewSecret)}`;
      previewWindow.location.href = url;
    } catch (err: unknown) {
      previewWindow.close();
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not create preview. Try again.";
      alert(message);
      console.error("Preview failed", err);
    } finally {
      setPreviewing(false);
    }
  }, []);

  return { openPreview, previewing };
}
