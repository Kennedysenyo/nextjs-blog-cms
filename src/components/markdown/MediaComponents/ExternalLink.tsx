// components/markdown/MediaComponents/ExternalLink.tsx
import React from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  config?: any;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  config = {},
  className,
  ...props
}) => {
  const isExternal = href?.startsWith("http");

  return (
    <a
      href={href}
      className={cn(
        "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
        "underline underline-offset-2 hover:underline-offset-4",
        "transition-all duration-200",
        "inline-flex items-center gap-1",
        className,
      )}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
      {isExternal && <ExternalLinkIcon className="h-3 w-3 ml-0.5 opacity-60" />}
    </a>
  );
};
