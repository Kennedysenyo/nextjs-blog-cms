// components/markdown/MediaComponents/YouTubeEmbed.tsx
import React from "react";
import { WithoutUrlBaseMediaProps } from "@/types/markdown";
import { cn } from "@/lib/utils/utils";

interface YouTubeEmbedProps extends WithoutUrlBaseMediaProps {
  videoId: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title = "YouTube Video",
  aspectRatio = "16:9",
  config = {},
  className,
  style,
}) => {
  const { sandboxIframes = true, autoPlay = false } = config;

  const aspectRatios = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "1:1": "aspect-square",
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams(
    {
      modestbranding: "1",
      rel: "0",
      autoplay: autoPlay ? "1" : "0",
      playsinline: "1",
      // enablejsapi: "1",
    },
  ).toString()}`;
  // console.log("The embeded url", embedUrl);

  return (
    <div className={cn("relative w-full my-6", className)} style={style}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-gray-900",
          aspectRatios[aspectRatio],
        )}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          // either remove sandbox for YouTube, or make it permissive enough:
          // sandbox={
          //   sandboxIframes
          //     ? "allow-scripts allow-same-origin allow-popups allow-presentation"
          //     : undefined
          // }
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
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
