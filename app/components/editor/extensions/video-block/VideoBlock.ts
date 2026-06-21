import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import VideoBlockView from "./VideoBlockView";
import { attr, editorOnlyAttr, objectAttr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";
import { buildMediaClasses, extractPresentation } from "../../lib/presentation";
import { DEFAULT_HERO } from "../../types/media-schema";

export const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      id: attr(""),
      src: attr(null),
      provider: attr("mp4"),
      embedUrl: attr(null),
      uploadStatus: editorOnlyAttr("idle"),
      uploadProgress: editorOnlyAttr(0),
      uploadError: editorOnlyAttr(null),
      poster: attr(null),
      thumbnail: attr(null),
      caption: attr(""),
      alignment: attr("center"),
      widthPercent: attr(100),
      heightPx: attr(null),
      style: attr("rounded-lg"),
      mediaLayout: attr("media-only"),
      layout: attr("default"),
      overlay: attr("none"),
      overlayOpacity: attr(40),
      hero: objectAttr("hero", { ...DEFAULT_HERO }),
      autoplay: attr(false),
      loop: attr(false),
      muted: attr(false),
      controls: attr(true),
      aspectRatio: attr("auto"),
      size: editorOnlyAttr("lg"),
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="video-block"]' }, { tag: "figure.cms-media--video" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs;
    const presentation = extractPresentation(a);
    const classes = buildMediaClasses(presentation, "default");

    let media: [string, ...unknown[]] | null = null;
    if (a.provider === "youtube" || a.provider === "vimeo") {
      const url = a.embedUrl ?? a.src;
      media = ["div", { class: "cms-video-embed" }, ["iframe", { src: url, class: "cms-video-iframe" }]];
    } else if (a.src) {
      media = ["video", { src: a.src, class: "cms-video-native", controls: a.controls }];
    }

    const ratio = a.aspectRatio || "auto";
    const styles = [
      presentation.widthPercent ? `width: ${presentation.widthPercent}%` : "",
      ratio !== "auto" ? `aspect-ratio: ${ratio}` : "",
    ].filter(Boolean).join("; ");

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": "video-block",
        class: `${classes.figure} cms-media--video`,
        style: styles,
        "data-aspect-ratio": ratio,
        "data-alignment": presentation.alignment,
        "data-width": presentation.widthPercent,
      }),
      media ? ["div", { class: "cms-media-frame" }, media] : "",
      presentation.caption
        ? ["figcaption", { class: "cms-media-caption" }, ["span", { class: "cms-media-caption-text" }, presentation.caption]]
        : "",
    ].filter(Boolean) as [string, ...unknown[]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoBlockView);
  },

  addCommands() {
    return {
      insertVideoBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId(), widthPercent: 100, style: "rounded-lg" },
          }),
    };
  },
});

export default VideoBlock;
