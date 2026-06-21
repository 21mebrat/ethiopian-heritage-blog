"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useCallback, useRef } from "react";
import BlockChrome from "../../components/BlockChrome";
import UploadProgress from "../../components/UploadProgress";
import { deleteBlockAt, duplicateBlockAt, moveBlockAt } from "../../lib/block-commands";
import { runBlockUpload } from "../../lib/upload-media";
import type { HeroBlockAttrs } from "../../types/blocks";

export default function HeroBlockView({
  node,
  selected,
  editor,
  getPos,
  updateAttributes,
}: NodeViewProps) {
  const attrs = node.attrs as HeroBlockAttrs;
  const fileRef = useRef<HTMLInputElement>(null);
  const getBlockPos = useCallback(() => getPos(), [getPos]);

  return (
    <NodeViewWrapper
      as="section"
      className={`cms-hero cms-hero-${attrs.height ?? "lg"}`}
      data-type="hero-block"
    >
      <BlockChrome
        label="Hero"
        selected={selected}
        onMoveUp={() => moveBlockAt(editor, getBlockPos, "up")}
        onMoveDown={() => moveBlockAt(editor, getBlockPos, "down")}
        onDuplicate={() => duplicateBlockAt(editor, getBlockPos)}
        onDelete={() => deleteBlockAt(editor, getBlockPos)}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void runBlockUpload(editor, getBlockPos, file, "heroBlock");
            e.target.value = "";
          }}
        />

        <div className="cms-hero-media">
          {attrs.uploadStatus === "uploading" && (
            <UploadProgress status="uploading" progress={attrs.uploadProgress} />
          )}
          {attrs.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attrs.src} alt="" className="cms-hero-img" />
          ) : (
            <button type="button" className="cms-media-placeholder" onClick={() => fileRef.current?.click()}>
              Set hero image
            </button>
          )}
          {attrs.overlay && <div className="cms-hero-overlay" />}
          <div className="cms-hero-text">
            {selected ? (
              <>
                <input
                  className="cms-hero-title-input"
                  value={attrs.title}
                  onChange={(e) => updateAttributes({ title: e.target.value })}
                  placeholder="Hero title"
                />
                <input
                  className="cms-hero-subtitle-input"
                  value={attrs.subtitle}
                  onChange={(e) => updateAttributes({ subtitle: e.target.value })}
                  placeholder="Subtitle"
                />
              </>
            ) : (
              <>
                {attrs.title && <h2 className="cms-hero-title">{attrs.title}</h2>}
                {attrs.subtitle && <p className="cms-hero-subtitle">{attrs.subtitle}</p>}
              </>
            )}
          </div>
        </div>
      </BlockChrome>
    </NodeViewWrapper>
  );
}
