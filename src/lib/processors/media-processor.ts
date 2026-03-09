// processors/media-processor.ts

import { MediaType } from "@/types/markdown";

export class MediaProcessor {
  private static patterns = {
    youtube: [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ],
    vimeo: [
      /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
      /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/channels\/[^\/]+\/(\d+)/,
    ],
    spotify: [
      /(?:https?:\/\/)?open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
      /(?:https?:\/\/)?spotify\.app\.link\/([a-zA-Z0-9]+)/,
    ],
    twitter: [
      /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/[^\/]+\/status\/(\d+)/,
    ],
    file: /\.(pdf|zip|docx|pptx|xlsx|txt|mp3|mp4)$/i,
    image: /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp)$/i,
  };

  // Remove query strings before extension checks
  private static stripQuery(url: string) {
    return url.split("?")[0].toLowerCase();
  }

  // processors/media-processor.ts
  static detectMediaType(url: string): MediaType {
    const clean = this.stripQuery(url);

    // Images FIRST
    if (this.patterns.image.test(clean)) return "image";

    // YouTube and other media platforms BEFORE generic file check
    if (this.patterns.youtube.some((p) => p.test(url))) return "youtube";
    if (this.patterns.vimeo.some((p) => p.test(url))) return "vimeo";
    if (this.patterns.spotify.some((p) => p.test(url))) return "spotify";
    if (this.patterns.twitter.some((p) => p.test(url))) return "twitter";

    // Files LAST
    if (this.patterns.file.test(clean)) return "file";

    return "link";
  }
  // ----------------------------
  // ID Extractors
  // ----------------------------

  static extractYouTubeId(url: string): string | null {
    for (const pattern of this.patterns.youtube) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  static extractVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match?.[1] || null;
  }

  static extractSpotifyInfo(url: string): { type: string; id: string } | null {
    const match = url.match(
      /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)(\?|$)/
    );
    if (!match) return null;
    return { type: match[1], id: match[2] };
  }

  // ----------------------------
  // File Info
  // ----------------------------

  static getFileInfo(url: string): { type: string; name: string } {
    const clean = this.stripQuery(url);
    const fileName = clean.split("/").pop() || "file";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    const typeMap: Record<string, string> = {
      pdf: "PDF Document",
      zip: "ZIP Archive",
      docx: "Word Document",
      pptx: "PowerPoint",
      xlsx: "Excel Spreadsheet",
      txt: "Text File",
      mp3: "Audio File",
      mp4: "Video File",
    };

    return {
      type: typeMap[ext] || "File",
      name: fileName,
    };
  }

  // ----------------------------
  // Security Model
  // ----------------------------

  /**
   * Images are safe if they are HTTPS.
   * They do NOT need domain allowlists.
   */
  static isSafeImageURL(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  /**
   * Embeds must be domain allow-listed.
   * This controls iframe security.
   */
  static isSafeEmbedURL(url: string): boolean {
    try {
      const parsed = new URL(url);

      const allowedDomains = [
        "youtube.com",
        "youtu.be",
        "vimeo.com",
        "spotify.com",
        "open.spotify.com",
        "twitter.com",
        "x.com",
        "twitframe.com",
      ];

      return allowedDomains.some(
        (allowed) =>
          parsed.hostname === allowed || parsed.hostname.endsWith(`.${allowed}`)
      );
    } catch {
      return false;
    }
  }

  /**
   * Master gatekeeper used by renderer
   */
  // processors/media-processor.ts
  static isURLAllowed(url: string): boolean {
    const type = this.detectMediaType(url);

    if (type === "image") {
      return this.isSafeImageURL(url);
    }

    if (type === "file") {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    }

    // For embeds (YouTube, Spotify, etc.), allow if they pass safe embed check
    if (["youtube", "vimeo", "spotify", "twitter"].includes(type)) {
      return this.isSafeEmbedURL(url);
    }

    // normal links
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }
}
