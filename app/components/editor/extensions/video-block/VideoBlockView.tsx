"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import UploadProgress from "../../components/UploadProgress";
import MediaDisplay from "../../render/MediaDisplay";
import { runBlockUpload } from "../../lib/upload-media";
import type { UploadStatus } from "../../types/blocks";

export default function VideoBlockView({
  node,
  selected,
  editor,
  getPos,
  updateAttributes,
}: NodeViewProps) {
  const attrs = node.attrs as Record<string, unknown>;
  const fileRef = useRef<HTMLInputElement>(null);
  const getBlockPos = useCallback(() => getPos(), [getPos]);

  const uploadStatus = (attrs.uploadStatus as UploadStatus) ?? "idle";
  const src = attrs.src as string | null;
  const embedUrl = attrs.embedUrl as string | null;
  const hasMedia = Boolean(src || embedUrl);

  const selectBlock = useCallback(() => {
    const p = getPos();
    if (typeof p !== "number") return;
    const { state, view } = editor;
    view.dispatch(state.tr.setSelection(NodeSelection.create(state.doc, p)));
  }, [editor, getPos]);

  return (
    <NodeViewWrapper
      className="cms-node-root cms-media-node"
      data-type="video-block"
      data-drag-handle={false}
    >
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void runBlockUpload(editor, getBlockPos, file, "videoBlock");
          e.target.value = "";
        }}
      />

      {(uploadStatus === "uploading" || uploadStatus === "error") && (
        <UploadProgress
          status={uploadStatus}
          progress={(attrs.uploadProgress as number) ?? 0}
          error={attrs.uploadError as string | null}
          onRetry={() => fileRef.current?.click()}
          label="Uploading video"
        />
      )}

      {!hasMedia && uploadStatus !== "uploading" && (
        <button
          type="button"
          className="cms-media-placeholder"
          onClick={() => fileRef.current?.click()}
        >
          Upload video
        </button>
      )}

      {hasMedia && (
        <MediaDisplay
          attrs={attrs}
          mediaType="video"
          selected={selected}
          showDragHandle
          onSelect={selectBlock}
          onResize={(dims) => updateAttributes(dims)}
        />
      )}
    </NodeViewWrapper>
  );
}
