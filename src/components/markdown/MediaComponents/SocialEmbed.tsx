// components/markdown/MediaComponents/SocialEmbed.tsx
import React from "react";
import { MediaType } from "@/types/markdown";
import { BaseMediaProps } from "@/types/markdown";
import { cn } from "@/lib/utils/utils";
import { TwitterEmbed } from "./TwitterEmbed";

interface SocialEmbedProps extends BaseMediaProps {
  type: MediaType;
}

export const SocialEmbed: React.FC<SocialEmbedProps> = ({
  url,
  type,
  title = "Embedded Content",
  config = {},
  className,
  style,
}) => {
  const { sandboxIframes = true } = config;

  const getEmbedUrl = () => {
    switch (type) {
      case "vimeo":
        const vimeoId = url.match(/\/(\d+)/)?.[1];
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;

      case "spotify":
        const spotifyMatch = url.match(
          /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)(\?|$)/,
        );
        if (spotifyMatch) {
          return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
        }
        return url;

      case "twitter":
        return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;

      default:
        return url;
    }
  };

  const getAspectRatio = () => {
    switch (type) {
      case "vimeo":
        return "aspect-video";
      case "spotify":
        return "aspect-[4/1]";
      case "twitter":
        return "aspect-[2/1]";
      default:
        return "aspect-video";
    }
  };

  const embedUrl = getEmbedUrl();

  if (type === "twitter") {
    return <TwitterEmbed url={url} className={className} style={style} />;
  }

  return (
    <div className={cn("relative w-full my-6", className)} style={style}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900",
          getAspectRatio(),
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0"
          sandbox={
            sandboxIframes
              ? "allow-scripts allow-same-origin allow-popups"
              : undefined
          }
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      {title && config.showCaptions && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {title}
        </p>
      )}
    </div>
  );
};
