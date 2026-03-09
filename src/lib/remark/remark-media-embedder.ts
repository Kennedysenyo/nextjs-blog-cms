// lib/remark-media-embedder.ts
import { visit } from "unist-util-visit";
import { MediaProcessor } from "@/processors/media-processor";

/**
 * Conservative URL matcher:
 * - Finds http/https URLs
 * - Avoids capturing trailing punctuation like ),.,,]
 */
const URL_RE = /https?:\/\/[^\s<]+/g;

function trimTrailingPunctuation(url: string) {
  // common punctuation that often trails URLs in prose
  const TRAIL = /[)\].,!?;:]+$/;
  let clean = url;
  while (TRAIL.test(clean)) clean = clean.replace(TRAIL, "");
  return clean;
}

function isEmbeddable(url: string) {
  const type = MediaProcessor.detectMediaType(url);
  return ["youtube", "vimeo", "spotify", "twitter", "file"].includes(type);
}

function makeMediaHtml(url: string) {
  return {
    type: "html",
    value: `<media data-url="${encodeURIComponent(url)}"></media>`,
  };
}

function makeLinkNode(url: string) {
  return {
    type: "link",
    url,
    title: null,
    children: [{ type: "text", value: url }],
  };
}

function splitTextIntoNodes(text: string) {
  const out: any[] = [];
  let lastIndex = 0;

  URL_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_RE.exec(text))) {
    const rawUrl = match[0];
    const start = match.index;
    const end = start + rawUrl.length;

    const before = text.slice(lastIndex, start);
    if (before) out.push({ type: "text", value: before });

    // clean URL + return any trimmed punctuation back as text
    const cleanedUrl = trimTrailingPunctuation(rawUrl);
    const trimmedPart = rawUrl.slice(cleanedUrl.length); // punctuation removed

    if (cleanedUrl) {
      // Inline usage: always a link node, never block embed here
      out.push(makeLinkNode(cleanedUrl));
    }

    if (trimmedPart) out.push({ type: "text", value: trimmedPart });

    lastIndex = end;
  }

  const after = text.slice(lastIndex);
  if (after) out.push({ type: "text", value: after });

  return out;
}

export function remarkMediaEmbedder() {
  return (tree: any) => {
    // 1) Lift images out of paragraphs (your existing behavior)
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index == null) return;
      if (!node.children || node.children.length !== 1) return;

      const child = node.children[0];

      if (child.type === "image") {
        parent.children.splice(index, 1, {
          type: "image",
          url: child.url,
          alt: child.alt || "",
          title: child.title || null,
        });
        return;
      }

      // If the paragraph is a single link, convert to block embed when embeddable
      if (child.type === "link" && typeof child.url === "string") {
        const url = child.url;
        if (isEmbeddable(url)) {
          parent.children.splice(index, 1, makeMediaHtml(url));
        }
      }
    });

    // 2) Split text nodes containing URLs into: text + link + text (+ multiple)
    // This preserves surrounding text.
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index == null) return;

      const text: string = node.value;
      if (!text || !URL_RE.test(text)) return;

      // Reset regex state and split into nodes
      const parts = splitTextIntoNodes(text);

      // Replace this one text node with the new sequence
      parent.children.splice(index, 1, ...parts);

      // Important: we replaced current index with multiple nodes, and `visit`
      // will keep walking — typically fine, but to avoid re-processing newly
      // created text nodes, keep it conservative:
      return index + parts.length;
    });

    // 3) Convert "paragraph that is only a URL in text form" into a block embed.
    // This catches cases like:
    //   https://youtu.be/xxxx
    // without markdown link syntax.
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index == null) return;
      if (!node.children || node.children.length === 0) return;

      // Paragraph is exactly one link node and nothing else -> already handled above
      if (node.children.length === 1 && node.children[0]?.type === "link")
        return;

      // Paragraph that is only one text node
      if (node.children.length !== 1) return;
      const only = node.children[0];
      if (only.type !== "text") return;

      const raw = (only.value || "").trim();
      if (!raw) return;

      // If the entire paragraph is exactly one URL (optionally with trailing punctuation)
      const m = raw.match(/^https?:\/\/\S+$/);
      if (!m) return;

      const cleaned = trimTrailingPunctuation(raw);
      if (cleaned && isEmbeddable(cleaned)) {
        parent.children.splice(index, 1, makeMediaHtml(cleaned));
      }
    });
  };
}
