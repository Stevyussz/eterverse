#!/usr/bin/env node
// EterVerse brand generator. One source of truth for the logo pixels:
//   node scripts/brand.mjs
// writes
//   src/components/pixel/brand-art.ts   (rects used by <Logo/> on the site)
//   src/app/icon.svg                    (favicon)
//   public/brand/*.svg                  (mark, horizontal and stacked logos, light/dark)
// The mark is "Gerbang Eter": a prismarine gate with gold corner blocks; ether light swirls
// in the top half and a block world shows through the bottom half ("step through, arrive
// in a server's world").

import { writeFileSync, mkdirSync } from "node:fs";

const INK = "#2E2216";

// ── Mark (16x16) ───────────────────────────────────────────────────────────────
const MARK_PALETTE = {
  k: INK,
  p: "#77C9BC", // prismarine light (bevel)
  P: "#2E8077", // prismarine
  q: "#246B63", // prismarine texture
  D: "#1D5E57", // prismarine dark (bevel)
  y: "#FFE58A", // gold highlight
  Y: "#F2B318", // gold
  o: "#B07A0A", // gold shade
  a: "#2A9D95", // ether deep
  b: "#5FD6CC", // ether mid
  c: "#B8FFF6", // ether light
  w: "#FFFFFF", // spark
  s: "#9FDDEB", // sky
  n: "#FFFFFF", // cloud
  G: "#5FA832", // grass
  g: "#3F8A1F", // grass shade
  d: "#79553A", // dirt
  e: "#593D28", // dirt shade
};

const WINDOW = [
  "abbbbbba", // ether vortex: one arm spirals in to a white core
  "bccccccb",
  "bcbbbbcb",
  "bcbwcbcb",
  "bcbbcbcb",
  "sssssGGs", // the world on the other side
  "GGGGgGGG",
  "dedddedd",
];

function buildMark() {
  const N = 16;
  const g = Array.from({ length: N }, () => Array(N).fill("."));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const corner = (x === 0 || x === N - 1) && (y === 0 || y === N - 1);
      if (corner) continue; // notched corners
      if (x === 0 || y === 0 || x === N - 1 || y === N - 1) { g[y][x] = "k"; continue; }
      const inX = x >= 4 && x <= 11, inY = y >= 4 && y <= 11;
      if (inX && inY) { g[y][x] = WINDOW[y - 4][x - 4]; continue; }
      const cx = x <= 3 ? 0 : x >= 12 ? 2 : 1;
      const cy = y <= 3 ? 0 : y >= 12 ? 2 : 1;
      if (cx !== 1 && cy !== 1) {
        // gold corner block 3x3: lit top-left, shaded bottom-right
        const lx = x - (cx === 0 ? 1 : 12), ly = y - (cy === 0 ? 1 : 12);
        g[y][x] = lx + ly === 0 ? "y" : lx + ly === 4 ? "o" : lx === 2 || ly === 2 ? "o" : "Y";
        if (lx === 0 && ly === 0) g[y][x] = "y";
        continue;
      }
      // prismarine bands with a bevel: light outer-top/left, dark inner/bottom-right
      let c = "P";
      if (cy === 0) c = y === 1 ? "p" : y === 3 ? "D" : "P";
      else if (cy === 2) c = y === 14 ? "D" : "P";
      else if (cx === 0) c = x === 1 ? "p" : x === 3 ? "D" : "P";
      else c = x === 14 ? "D" : "P";
      g[y][x] = c;
    }
  }
  // prismarine mottling
  for (const [x, y] of [[6, 2], [10, 2], [2, 6], [2, 9], [13, 7], [13, 10], [5, 13], [9, 13]]) g[y][x] = "q";
  return g.map((r) => r.join(""));
}

// ── Wordmark: block letters drawn on a 5x7 grid, each glyph pixel = 2 units ─────
const GLYPHS = {
  E: ["XXXXX", "X....", "X....", "XXXX.", "X....", "X....", "XXXXX"],
  T: ["XXXXX", "..X..", "..X..", "..X..", "..X..", "..X..", "..X.."],
  R: ["XXXX.", "X...X", "X...X", "XXXX.", "X.X..", "X..X.", "X...X"],
  V: ["X...X", "X...X", "X...X", "X...X", ".X.X.", ".X.X.", "..X.."],
  S: [".XXXX", "X....", "X....", ".XXX.", "....X", "....X", "XXXX."],
};

// Two-tone like the site wordmark: "Eter" in bone, "Verse" in prismarine light.
const TONES = {
  eter: { face: "#F7EFDC", hi: "#FFFFFF", depth: "#9C8A6C" },
  verse: { face: "#77C9BC", hi: "#C4F2EA", depth: "#1D5E57" },
};

function buildWordmark() {
  const CELL = 2, GAP = 1; // gap in glyph pixels
  const word = "ETERVERSE";
  const glyphW = 5, glyphH = 7;
  const W = (word.length * (glyphW + GAP) - GAP) * CELL + 4; // +outline +depth
  const H = glyphH * CELL + 4;
  const face = new Map(); // "x,y" -> tone
  word.split("").forEach((ch, i) => {
    const tone = i < 4 ? "eter" : "verse";
    const ox = 1 + i * (glyphW + GAP) * CELL, oy = 1;
    GLYPHS[ch].forEach((row, gy) =>
      [...row].forEach((v, gx) => {
        if (v !== "X") return;
        for (let dy = 0; dy < CELL; dy++) for (let dx = 0; dx < CELL; dx++) face.set(`${ox + gx * CELL + dx},${oy + gy * CELL + dy}`, tone);
      })
    );
  });
  const cells = new Map();
  // depth: face shifted one unit down-right
  for (const [k, tone] of face) {
    const [x, y] = k.split(",").map(Number);
    const dk = `${x + 1},${y + 1}`;
    if (!face.has(dk)) cells.set(dk, TONES[tone].depth);
  }
  for (const [k, tone] of face) {
    const [x, y] = k.split(",").map(Number);
    cells.set(k, face.has(`${x},${y - 1}`) ? TONES[tone].face : TONES[tone].hi);
  }
  // ink outline around everything
  const filled = new Set(cells.keys());
  for (const k of filled) {
    const [x, y] = k.split(",").map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      const nk = `${x + dx},${y + dy}`;
      if (!filled.has(nk) && !cells.has(nk)) cells.set(nk, INK);
    }
  }
  return { cells, W: W + 1, H: H + 1 };
}

// ── Rect helpers ──────────────────────────────────────────────────────────────
function gridRects(grid, palette, ox = 0, oy = 0) {
  const out = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (!palette[ch]) { x++; continue; }
      let w = 1;
      while (row[x + w] === ch) w++;
      out.push([ox + x, oy + y, w, 1, palette[ch]]);
      x += w;
    }
  });
  return out;
}
function cellRects(cells, ox = 0, oy = 0) {
  const byRow = new Map();
  for (const [k, c] of cells) {
    const [x, y] = k.split(",").map(Number);
    if (!byRow.has(y)) byRow.set(y, []);
    byRow.get(y).push([x, c]);
  }
  const out = [];
  for (const [y, list] of byRow) {
    list.sort((a, b) => a[0] - b[0]);
    let i = 0;
    while (i < list.length) {
      let w = 1;
      while (i + w < list.length && list[i + w][0] === list[i][0] + w && list[i + w][1] === list[i][1]) w++;
      out.push([ox + list[i][0], oy + y, w, 1, list[i][1]]);
      i += w;
    }
  }
  return out;
}
const svg = (w, h, rects, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : "") +
  rects.map(([x, y, rw, rh, c]) => `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${c}"/>`).join("") +
  `</svg>\n`;

// ── Build ─────────────────────────────────────────────────────────────────────
const mark = buildMark();
const markRects = gridRects(mark, MARK_PALETTE);
const wm = buildWordmark();
const wmRects = cellRects(wm.cells);

// Horizontal lockup: mark scaled 1x next to the wordmark, vertically centred.
const GAP = 4;
const hW = 16 + GAP + wm.W, hH = Math.max(16, wm.H);
const hRects = [...gridRects(mark, MARK_PALETTE, 0, Math.round((hH - 16) / 2)), ...cellRects(wm.cells, 16 + GAP, Math.round((hH - wm.H) / 2))];
// Stacked lockup: mark 2x above the wordmark.
const sW = Math.max(32, wm.W), sMarkX = Math.round((sW - 32) / 2);
const markRects2x = markRects.map(([x, y, w, h, c]) => [sMarkX + x * 2, y * 2, w * 2, h * 2, c]);
const sH = 32 + 4 + wm.H;
const sRects = [...markRects2x, ...cellRects(wm.cells, Math.round((sW - wm.W) / 2), 36)];

mkdirSync("public/brand", { recursive: true });
writeFileSync("public/brand/eterverse-mark.svg", svg(16, 16, markRects));
writeFileSync("public/brand/eterverse-logo.svg", svg(hW, hH, hRects));
writeFileSync("public/brand/eterverse-logo-stacked.svg", svg(sW, sH, sRects));
writeFileSync("public/brand/eterverse-wordmark.svg", svg(wm.W, wm.H, wmRects));
writeFileSync("src/app/icon.svg", svg(16, 16, markRects));

const ts = `// GENERATED by scripts/brand.mjs. Do not edit by hand; change the generator and rerun it.
// [x, y, width, height, fill] in pixel units.
export type BrandRect = readonly [number, number, number, number, string];
export const MARK_SIZE = 16;
export const MARK_RECTS: readonly BrandRect[] = ${JSON.stringify(markRects)};
export const WORDMARK_SIZE = { w: ${wm.W}, h: ${wm.H} } as const;
export const WORDMARK_RECTS: readonly BrandRect[] = ${JSON.stringify(wmRects)};
`;
writeFileSync("src/components/pixel/brand-art.ts", ts);
console.log("mark rects", markRects.length, "wordmark", wm.W, "x", wm.H, "rects", wmRects.length);
console.log(mark.join("\n"));
