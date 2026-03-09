//lib/sanitize.ts
import DOMPurify from "dompurify";

export const sanitizeConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "a",
    "img",
    "span",
    "div",
    // For embeds
    "iframe",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "title",
    "class",
    "style",
    "width",
    "height",
    "loading",
    "sizes",
    // For iframes
    "allow",
    "allowfullscreen",
    "frameborder",
    "sandbox",
    "referrerpolicy",
    "scrolling",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: [
    "script",
    "style",
    "form",
    "input",
    "button",
    "select",
    "textarea",
  ],
  FORBID_ATTR: ["onclick", "onload", "onerror", "onmouseover", "onmouseout"],
};

export function sanitizeHTML(html: string): string {
  if (typeof window === "undefined") {
    // For server-side rendering
    const { JSDOM } = require("jsdom");
    const { window } = new JSDOM("");
    const DOMPurify = require("dompurify")(window);
    return DOMPurify.sanitize(html, sanitizeConfig);
  }

  return DOMPurify.sanitize(html, sanitizeConfig);
}
