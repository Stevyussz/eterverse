// User text must never reach $regex / new RegExp raw: "(a+)+$" pins Mongo CPU (ReDoS)
// and an unbalanced "(" throws and 500s the page.
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Short plain-text teaser from an owner's markdown description. Drops headings that just
 * repeat the server name, divider lines ("━━━", "---") and markdown syntax, so cards and
 * the hero read as one sentence instead of a raw post.
 */
export function plainExcerpt(markdown: string | undefined, maxLength = 160, skipLine?: string): string {
  const skip = skipLine?.trim().toLowerCase();
  const text = (markdown || "")
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~|]/g, "")
        .trim()
    )
    .filter((line) => line && !/^[\s\-=_━─═•·.]+$/.test(line) && line.toLowerCase() !== skip)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : maxLength).trimEnd()}...`;
}

export function safeSearchTerm(input: string | undefined, maxLength = 60): string {
  return (input || "").trim().slice(0, maxLength);
}
