// JSON.stringify does not escape "<", so an owner description containing "</script><script>"
// would execute on every visitor's browser. Unicode-escaping < > & keeps the JSON valid and inert.
export function toSafeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
