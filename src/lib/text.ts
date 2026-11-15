// User text must never reach $regex / new RegExp raw: "(a+)+$" pins Mongo CPU (ReDoS)
// and an unbalanced "(" throws and 500s the page.
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function safeSearchTerm(input: string | undefined, maxLength = 60): string {
  return (input || "").trim().slice(0, maxLength);
}
