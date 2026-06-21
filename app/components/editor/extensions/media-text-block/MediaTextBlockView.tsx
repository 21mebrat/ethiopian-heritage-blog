"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useCallback, useRef } from "react";
import MediaBlockShell from "../../components/media/MediaBlockShell";
import MediaFigure from "../../render/MediaFigure";
import UploadProgress from "../../components/UploadProgress";
import { buildCompositeClasses } from "../../lib/presentation";
import { presentationFromAttrs } from "../../lib/media-attrs";
import { runBlockUpload } from "../../lib/upload-media";
import type { CompositeLayout } from "../../types/media-schema";
import type { UploadStatus } from "../../types/blocks";

export default function MediaTextBlockView({
  node,
  selected,
  editor,
  getPos,
  updateAttributes,
}: NodeViewProps) {
  const attrs = node.attrs as Record<string, unknown>;
  const fileRef = useRef<HTMLInputElement>(null);
  const getBlockPos = useCallback(() => getPos(), [getPos]);
  const layout = (attrs.layout as CompositeLayout) ?? "side-left";
  const imageSrc = attrs.imageSrc as string | null;
  const uploadStatus = (attrs.uploadStatus as UploadStatus) ?? "idle";
  const mediaId = (attrs.id as string) ?? "";
  const { presentation } = presentationFromAttrs(attrs);

  return (
    <NodeViewWrapper className="cms-node-root" data-type="media-text-block">
      <MediaBlockShell selected={selected} mediaId={mediaId} mediaType="image">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void runBlockUpload(editor, getBlockPos, file, "mediaText");
            e.target.value = "";
          }}
        />
        <div className={buildCompositeClasses(layout)} data-layout={layout}>
          <div className="cms-composite-media">
            {uploadStatus === "uploading" ? (
              <UploadProgress status="uploading" progress={(attrs.uploadProgress as number) ?? 0} />
            ) : imageSrc ? (
              <MediaFigure src={imageSrc} presentation={presentation} layout="default" />
            ) : (
              <button type="button" className="cms-media-placeholder" onClick={() => fileRef.current?.click()}>
                Add image
              </button>
            )}
          </div>
          <div className="cms-composite-body cms-prose">
            <NodeViewContent />
          </div>
        </div>
      </MediaBlockShell>
    </NodeViewWrapper>
  );
}
