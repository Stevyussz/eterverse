// One passive scroll listener for the whole page. Every ServerCard used to attach its own,
// so a page with 16 cards ran 16 handlers (each calling setState) on every scroll frame.

type Listener = () => void;

const startListeners = new Set<Listener>();
const endListeners = new Set<Listener>();
let scrolling = false;
let endTimer: ReturnType<typeof setTimeout> | null = null;
let attached = false;

const SCROLL_END_DELAY = 250;

function handleScroll() {
  if (!scrolling) {
    scrolling = true;
    startListeners.forEach((fn) => fn());
  }
  if (endTimer) clearTimeout(endTimer);
  endTimer = setTimeout(() => {
    scrolling = false;
    endListeners.forEach((fn) => fn());
  }, SCROLL_END_DELAY);
}

function attach() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("scroll", handleScroll, { passive: true });
}

export function isPageScrolling() {
  return scrolling;
}

export function subscribeScroll(onStart: Listener, onEnd: Listener) {
  attach();
  startListeners.add(onStart);
  endListeners.add(onEnd);
  return () => {
    startListeners.delete(onStart);
    endListeners.delete(onEnd);
  };
}

let lowEndCache: boolean | null = null;

// Low-RAM phones, data saver, slow networks and reduced-motion users get posters
// instead of autoplaying video previews. Only call this client-side (inside effects).
export function isLowEndDevice(): boolean {
  if (lowEndCache !== null) return lowEndCache;
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency;
  const conn = nav.connection;

  lowEndCache = Boolean(
    (memory !== undefined && memory <= 4) ||
      (cores !== undefined && cores <= 4) ||
      conn?.saveData ||
      (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  return lowEndCache;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
