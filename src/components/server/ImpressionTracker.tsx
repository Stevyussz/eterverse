"use client";

import { useEffect } from "react";

export function ImpressionTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire and forget — no await, non-blocking
    fetch(`/api/impression/${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
