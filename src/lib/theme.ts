// Overworld (light, default) and Nether (dark) themes. The choice lives in localStorage and
// is applied to <html data-theme> by an inline script before first paint (see layout.tsx),
// so a Nether visitor never sees a flash of the light theme.

export type Theme = "overworld" | "nether";
export const THEME_KEY = "eterverse:theme";
const EVENT = "eterverse:theme";

/** Inline, runs before hydration. Kept tiny and dependency-free. */
export const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="nether")document.documentElement.dataset.theme="nether"}catch(e){}`;

export function readTheme(): Theme {
  if (typeof document === "undefined") return "overworld";
  return document.documentElement.dataset.theme === "nether" ? "nether" : "overworld";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "nether") root.dataset.theme = "nether";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // private mode: the theme still applies for this visit
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeTheme(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
