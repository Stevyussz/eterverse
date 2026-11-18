import { TILE, gridToRects } from "@/components/pixel/PixelArt";

/**
 * Home hero illustration: a block world with a prismarine portal in the middle, the
 * EterVerse brand mark built as a structure. Original artwork, drawn from character grids.
 * 16-unit blocks; the SVG is sliced from the bottom so phones keep the portal in view.
 */

type Palette = Record<string, string>;
const LOCAL: Record<string, { grid: string[]; palette: Palette }> = {
  prismarine: {
    grid: ["PPpPPPPp", "PqPPqPPP", "PPPPPpPq", "pPPqPPPP", "PPPPPPqP", "PqPpPPPP", "PPPPqPpP", "qPPPPPPP"],
    palette: { P: "#2E8077", p: "#77C9BC", q: "#1D5E57" },
  },
  portal: {
    grid: ["vVvvvVvv", "vvVvvvVv", "VvvVvvvV", "vVvvVvvv", "vvVvvVvv", "VvvVvvVv", "vVvvVvvV", "vvVvvVvv"],
    palette: { v: "#7A44B5", V: "#B98BE8" },
  },
  water: {
    grid: ["wwWwwwww", "wwwwwWww", "Wwwwwwww", "wwwwWwww", "wwWwwwwW", "wwwwwwww", "wWwwwwWw", "wwwwwwww"],
    palette: { w: "#3F76C9", W: "#6E9BE0" },
  },
  // Nether set
  nylium: {
    grid: ["rRRrRRRr", "RrRRrRrR", "rRrRRrRr", "NrNNrNNr", "NNnNNNmN", "NmNNnNNN", "NNNmNNnN", "nNNNNNNN"],
    palette: { r: "#D9475A", R: "#B1303E", N: "#6B2626", n: "#4A1818", m: "#8A3434" },
  },
  netherrack: {
    grid: ["NNnNNNmN", "NmNNnNNN", "NNNmNNnN", "nNNNNNNN", "NNmNNnNN", "NNNNmNNN", "mNnNNNNm", "NNNNNnNN"],
    palette: { N: "#6B2626", n: "#4A1818", m: "#8A3434" },
  },
  blackstone: {
    grid: ["bBbbbBbb", "bbbBbbbb", "Bbbbbbgb", "bbBbbbbb", "bbbbbBbb", "bgbbbbbB", "bbbBbbbb", "Bbbbbbbb"],
    palette: { b: "#2A2226", B: "#3A3036", g: "#8A6A1E" },
  },
  soulsand: {
    grid: ["sSssSsss", "ssssssSs", "SsfsSsss", "ssssssss", "sSsssfsS", "ssssSsss", "sfsSssss", "ssssssSs"],
    palette: { s: "#4E3A2E", S: "#5E483A", f: "#3A2A22" },
  },
  lava: {
    grid: ["lLllLlll", "llloLlll", "LllllLlo", "lloLllll", "lLlllLll", "llllolLl", "oLlllllL", "llLlllll"],
    palette: { l: "#E8761E", L: "#F5A93A", o: "#C9441A" },
  },
  stem: {
    grid: ["cCccCccC", "ccCcccCc", "cCccCccc", "cccCccCc", "cCcccCcc", "ccCcCccc", "cccCccCc", "cCccccCc"],
    palette: { c: "#5A2235", C: "#7A2E4A" },
  },
  wart: {
    grid: ["wWwwWwww", "wwwWwwWw", "Wwwwwwww", "wwWwwWww", "wwwwWwww", "wWwwwwWw", "wwwWwwww", "Wwwwwwww"],
    palette: { w: "#8E1F2B", W: "#B1303E" },
  },
};

// Overworld block -> Nether block, so one terrain layout serves both themes.
const NETHER: Record<string, string> = {
  grass: "nylium",
  dirt: "netherrack",
  stone: "blackstone",
  sand: "soulsand",
  water: "lava",
  log: "stem",
  leaves: "wart",
};

// Wide scene (96 blocks): with "slice" the height decides the scale on every screen, so
// phones and wide monitors crop the sides (the portal stays centred) instead of the sky.
const COLS = 96;
const ROWS = 12;
const B = 16;
const PORTAL_COL = 46; // left frame column
const FLAT_FROM = 40;
const FLAT_TO = 55;
const WATER_FROM = 82;
// Rolling hills from two sine waves, rounded to whole blocks; flat pad under the portal.
const HEIGHTS = Array.from({ length: COLS }, (_, c) => {
  if (c >= FLAT_FROM && c <= FLAT_TO) return 4;
  if (c >= WATER_FROM) return 3;
  return Math.max(3, Math.min(6, Math.round(4.4 + 1.3 * Math.sin(c / 5) + 0.7 * Math.sin(c / 2.3))));
});
const TREES = [9, 23, 33, 62, 72];
const CLOUDS: [number, number, number][] = [[6, 1.2, 4], [24, 0.6, 3], [36, 1.6, 5], [58, 0.7, 4], [70, 1.4, 3], [86, 0.6, 5]];

export function VerseScene({ className, variant = "overworld" }: { className?: string; variant?: "overworld" | "nether" }) {
  const isNether = variant === "nether";
  const id = isNether ? "vn" : "vs";
  const tiles: React.ReactElement[] = [];
  const place = (base: string, col: number, row: number) => {
    const kind = isNether ? NETHER[base] ?? base : base;
    tiles.push(<rect key={`${kind}-${col}-${row}`} x={col * B} y={row * B} width={B} height={B} fill={`url(#${id}-${kind})`} />);
  };

  HEIGHTS.forEach((h, col) => {
    const top = ROWS - h;
    const isWater = col >= WATER_FROM;
    if (isWater) {
      // Sea level one block above the sea floor, sand below
      for (let r = ROWS - 4; r < ROWS - h + 1; r++) place("water", col, r);
    }
    for (let r = top; r < ROWS; r++) {
      const depth = r - top;
      let kind = "stone";
      if (isWater) kind = depth <= 1 ? "sand" : "stone";
      else if (depth === 0) kind = col >= WATER_FROM - 2 ? "sand" : "grass";
      else if (depth <= 2) kind = "dirt";
      place(kind, col, r);
    }
  });

  TREES.forEach((col) => {
    const surface = ROWS - HEIGHTS[col];
    for (let i = 1; i <= 3; i++) place("log", col, surface - i);
    for (let dx = -2; dx <= 2; dx++) for (let dy = 4; dy <= 5; dy++) place("leaves", col + dx, surface - dy);
    for (let dx = -1; dx <= 1; dx++) place("leaves", col + dx, surface - 6);
  });

  // Portal: 4 wide x 5 tall prismarine frame, 2x3 portal fill, standing on the flat pad.
  const base = ROWS - HEIGHTS[PORTAL_COL] - 1;
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      const edge = dy === 0 || dy === 4 || dx === 0 || dx === 3;
      place(edge ? "prismarine" : "portal", PORTAL_COL + dx, base - dy);
    }
  }

  const defs = { ...TILE, ...LOCAL };

  return (
    <svg
      viewBox={`0 0 ${COLS * B} ${ROWS * B}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {Object.entries(defs).map(([k, t]) => (
          <pattern key={k} id={`${id}-${k}`} width={B} height={B} patternUnits="userSpaceOnUse">
            {gridToRects(t.grid, t.palette, 2)}
          </pattern>
        ))}
      </defs>
      {/* Overworld clouds; in the Nether, glowstone clusters hang from the haze instead. */}
      {isNether
        ? CLOUDS.map(([x, y], i) => (
            <g key={i}>
              <rect x={x * B} y={y * B - 4} width={B * 1.5} height={B} fill="#F5D46A" />
              <rect x={x * B + 6} y={y * B + 2} width={10} height={8} fill="#FFF1A8" />
              <rect x={x * B + B} y={y * B + B - 4} width={B * 0.6} height={B * 0.6} fill="#D9A93A" />
            </g>
          ))
        : CLOUDS.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x * B} y={y * B} width={w * B} height={B * 0.6} fill="#FFFFFF" />
          <rect x={x * B + B * 0.5} y={y * B - B * 0.4} width={(w - 1) * B} height={B * 0.5} fill="#FFFFFF" />
          <rect x={x * B} y={y * B + B * 0.6} width={w * B} height={4} fill="#E3EEF2" />
        </g>
          ))}
      {tiles}
    </svg>
  );
}
