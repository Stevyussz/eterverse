/**
 * Robust helper to extract YouTube video ID from various URL patterns
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID&feature=...
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.trim().match(
    /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}
