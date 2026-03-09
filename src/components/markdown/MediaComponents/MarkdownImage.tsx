// components/markdown/MediaComponents/MarkdownImage.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { WithoutUrlBaseMediaProps } from "@/types/markdown";
import { cn } from "@/lib/utils/utils";

interface MarkdownImageProps extends WithoutUrlBaseMediaProps {
  alt: string;
  src: string;
  width?: number;
  height?: number;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({
  src,
  alt,
  title,
  config = {},
  className,
  style,
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { enableLazyLoading = true } = config;

  // For external images, use regular img tag with Next.js optimization
  const isExternal = src.startsWith("http");

  return (
    <figure
      className={cn("relative my-6 overflow-hidden rounded-lg", className)}
      style={style}
    >
      <div className="relative w-full h-auto">
        {isExternal ? (
          // External image with lazy loading
          <img
            src={src}
            alt={alt}
            title={title}
            className={cn(
              "w-full h-auto object-contain transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              "max-h-[70vh]",
            )}
            loading={enableLazyLoading ? "lazy" : "eager"}
            onLoad={() => setIsLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{ maxWidth: "100%" }}
          />
        ) : (
          // Local image with Next.js Image optimization
          <div className="relative w-full h-auto">
            <Image
              src={src}
              alt={alt}
              title={title || alt}
              width={width || 1200}
              height={height || 675}
              className={cn("w-full h-auto object-contain", "max-h-[70vh]")}
              loading={enableLazyLoading ? "lazy" : "eager"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}
      </div>
      {alt && config.showCaptions && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};
