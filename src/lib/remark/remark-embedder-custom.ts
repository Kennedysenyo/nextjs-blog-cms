// lib/remark-embedder-custom.ts
import { Transformer } from "@remark-embedder/core";

export interface MediaEmbedData {
  url: string;
  type: string;
  // Add any other data you need
}

export const customTransformer: Transformer = {
  name: "custom-media-transformer",
  shouldTransform(url: string): boolean {
    // Use your existing MediaProcessor to detect media types
    const patterns = {
      youtube: [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      ],
      vimeo: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
      spotify:
        /(?:https?:\/\/)?open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
      twitter:
        /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/[^\/]+\/status\/(\d+)/,
    };

    return Object.values(patterns).some((pattern) => {
      if (Array.isArray(pattern)) {
        return pattern.some((p) => p.test(url));
      }
      return pattern.test(url);
    });
  },
  getHTML(url: string): string {
    // Instead of returning HTML, we'll create a custom node
    // Return a placeholder that our renderer will handle
    return `<media data-url="${encodeURIComponent(url)}"></media>`;
  },
};
