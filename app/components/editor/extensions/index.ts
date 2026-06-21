import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import type { Extensions } from "@tiptap/react";
import { ImageBlock } from "./image-block/ImageBlock";
import { VideoBlock } from "./video-block/VideoBlock";
import { MediaTextBlock } from "./media-text-block/MediaTextBlock";
import Section from "./section/Section";
import Column from "./section/Column";

export function getBlockExtensions(options?: { placeholder?: string }): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      blockquote: {},
      bulletList: {},
      orderedList: {},
      codeBlock: {},
      horizontalRule: {},
      strike: {},
    }),
    Placeholder.configure({
      placeholder: options?.placeholder ?? "Start writing your story...",
      includeChildren: true,
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: "cms-link" },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color,
    ImageBlock,
    VideoBlock,
    MediaTextBlock,
    Section,
    Column,
  ];
}

export { ImageBlock, VideoBlock, MediaTextBlock };
