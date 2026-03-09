"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/utils";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

interface TwitterEmbedProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

function ensureTwitterScript() {
  if (typeof document === "undefined") return;

  const id = "twitter-widgets-js";
  if (document.getElementById(id)) return;

  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = "https://platform.twitter.com/widgets.js";
  s.charset = "utf-8";
  document.head.appendChild(s);
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({
  url,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureTwitterScript();

    const container = containerRef.current;
    if (!container) return;

    // Clear previous render (important when url changes or React re-renders)
    container.innerHTML = `
      <blockquote class="twitter-tweet">
        <a href="${url}"></a>
      </blockquote>
    `;

    // Give the script a moment to load, then ask it to render
    const tick = () => window.twttr?.widgets?.load(container);
    const t = window.setTimeout(tick, 0);

    return () => window.clearTimeout(t);
  }, [url]);

  return (
    <div
      ref={containerRef}
      className={cn("my-6 overflow-hidden rounded-lg", className)}
      style={style}
    />
  );
};
