// components/markdown/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import type { MediaConfig } from "@/types/markdown";

import { MarkdownImage } from "./MediaComponents/MarkdownImage";
import { YouTubeEmbed } from "./MediaComponents/YoutubeEmbed";
import { SocialEmbed } from "./MediaComponents/SocialEmbed";
import { FileDownload } from "./MediaComponents/FileDownload";
import { ExternalLink } from "./MediaComponents/ExternalLink";

import { remarkMediaEmbedder } from "@/lib/remark/remark-media-embedder";
import { markdownSchema } from "@/lib/markdown/sanitize";
import { MediaProcessor } from "@/lib/processors/media-processor";

interface MarkdownRendererProps {
  content: string;
  mediaConfig?: MediaConfig;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  mediaConfig = {},
  className = "prose prose-lg max-w-none",
}) => {
  const components = {
    media: ({ node }: any) => {
      // console.log(
      //   "MEDIA props keys:",
      //   Object.keys((node as any)?.properties || {})
      // );
      const props = (node as any)?.properties || {};
      const urlProp = props["dataUrl"] ?? props["data-url"];

      let url: string | null = null;
      if (typeof urlProp === "string") url = urlProp;
      else if (Array.isArray(urlProp) && typeof urlProp[0] === "string")
        url = urlProp[0];
      else if (urlProp != null) url = String(urlProp);

      if (!url) return null;

      try {
        const decodedUrl = decodeURIComponent(url);
        if (!MediaProcessor.isURLAllowed(decodedUrl))
          return <span>[Blocked]</span>;
        const type = MediaProcessor.detectMediaType(decodedUrl);

        switch (type) {
          case "youtube": {
            const id = MediaProcessor.extractYouTubeId(decodedUrl);
            // console.log("The video id, ", id);
            return id ? (
              <YouTubeEmbed videoId={id} config={mediaConfig} />
            ) : null;
          }

          case "vimeo":
          case "spotify":
          case "twitter":
            return (
              <SocialEmbed url={decodedUrl} type={type} config={mediaConfig} />
            );

          case "file": {
            const info = MediaProcessor.getFileInfo(decodedUrl);
            return (
              <FileDownload
                url={decodedUrl}
                fileName={info.name}
                fileType={info.type}
                config={mediaConfig}
              />
            );
          }

          default:
            return <ExternalLink href={decodedUrl}>{decodedUrl}</ExternalLink>;
        }
      } catch {
        return null;
      }
    },

    img: ({ src, alt, title }: any) => {
      if (
        !src ||
        typeof src !== "string" ||
        !MediaProcessor.isURLAllowed(src)
      ) {
        return <span className="text-red-500">[Unsafe Image Blocked]</span>;
      }
      return (
        <MarkdownImage
          src={src}
          alt={alt || ""}
          title={title}
          config={mediaConfig}
          className="my-4"
        />
      );
    },

    a: ({ href, children }: any) => {
      // if (!href) return <a>{children}</a>;
      if (!href) {
        // return <span className="text-red-500">[Blocked]</span>;
        return <span>{children}</span>; // if you prefer silent downgrade
      }
      if (!MediaProcessor.isURLAllowed(href)) return <span>[Blocked]</span>;
      return <ExternalLink href={href}>{children}</ExternalLink>;
    },
  } satisfies Components & Record<string, any>;

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMediaEmbedder]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        rehypePlugins={[
          rehypeRaw, // parses the raw html into HAST nodes
          [rehypeSanitize, markdownSchema],
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
