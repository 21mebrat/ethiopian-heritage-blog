import type { VideoProvider } from "../types/blocks";

export function parseEmbedUrl(url: string): {
  provider: VideoProvider;
  embedUrl: string;
} | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (yt) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }

  return null;
}
