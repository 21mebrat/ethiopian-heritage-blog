import type { Editor } from "@tiptap/react";
import { uploadToCloudinary } from "../core/upload-api";
import { createBlockId } from "./block-id";
import { updateBlockAttrs } from "./block-commands";
import type { UploadStatus, VideoProvider } from "../types/blocks";
import { parseEmbedUrl } from "./parse-embed-url";

function detectVideoProvider(url: string): VideoProvider {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("cloudinary.com")) return "cloudinary";
  return "mp4";
}

type BlockType = "imageBlock" | "videoBlock" | "heroBlock" | "mediaText";

export async function runBlockUpload(
  editor: Editor,
  getPos: () => number | undefined,
  file: File,
  blockType: BlockType
): Promise<void> {
  const setAttrs = (attrs: Record<string, unknown>) =>
    updateBlockAttrs(editor, getPos, attrs);

  setAttrs({
    uploadStatus: "uploading" as UploadStatus,
    uploadProgress: 0,
    uploadError: null,
  });

  try {
    const result = await uploadToCloudinary(file, (progress) => {
      setAttrs({ uploadProgress: progress });
    });

    if (!result?.url) throw new Error("No URL returned");

    if (blockType === "imageBlock") {
      setAttrs({
        src: result.url,
        uploadStatus: "success",
        uploadProgress: 100,
        uploadError: null,
        alt: file.name.replace(/\.[^.]+$/, ""),
      });
    } else if (blockType === "heroBlock") {
      setAttrs({
        src: result.url,
        uploadStatus: "success",
        uploadProgress: 100,
      });
    } else if (blockType === "mediaText") {
      setAttrs({
        imageSrc: result.url,
        uploadStatus: "success",
        uploadProgress: 100,
      });
    } else {
      const provider = file.type.startsWith("video/")
        ? detectVideoProvider(result.url)
        : "mp4";
      setAttrs({
        src: result.url,
        provider,
        embedUrl: null,
        uploadStatus: "success",
        uploadProgress: 100,
        uploadError: null,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    setAttrs({
      uploadStatus: "error",
      uploadError: message,
    });
  }
}

export function insertImageBlock(editor: Editor, file?: File) {
  const id = createBlockId();
  editor
    .chain()
    .focus()
    .insertContent({
      type: "imageBlock",
      attrs: {
        id,
        uploadStatus: file ? "uploading" : "idle",
        uploadProgress: 0,
      },
    })
    .run();

  if (!file) return;

  const getPos = () => findBlockPosById(editor, id);
  void runBlockUpload(editor, getPos, file, "imageBlock");
}

export function insertVideoBlock(editor: Editor, file?: File, embedUrl?: string) {
  const id = createBlockId();
  let attrs: Record<string, unknown> = {
    id,
    uploadStatus: "idle",
    uploadProgress: 0,
  };

  if (embedUrl) {
    const parsed = parseEmbedUrl(embedUrl);
    attrs = {
      ...attrs,
      embedUrl: parsed?.embedUrl ?? embedUrl,
      provider: parsed?.provider ?? "mp4",
      uploadStatus: "success",
    };
  } else if (file) {
    attrs.uploadStatus = "uploading";
  }

  editor.chain().focus().insertContent({ type: "videoBlock", attrs }).run();

  if (!file) return;

  const getPos = () => findBlockPosById(editor, id);
  void runBlockUpload(editor, getPos, file, "videoBlock");
}

export function insertGalleryBlock(editor: Editor) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "galleryBlock",
      attrs: { id: createBlockId(), items: [], layout: "grid-2" },
    })
    .run();
}

function findBlockPosById(editor: Editor, id: string): number | undefined {
  let found: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node.attrs?.id === id) {
      found = pos;
      return false;
    }
  });
  return found;
}
