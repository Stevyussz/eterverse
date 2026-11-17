/**
 * Original pixel-art sprites and the block-world hero scene, drawn from character grids.
 * Every sprite is our own artwork in the EterVerse family palette (see /DESIGN.md).
 */

type Palette = Record<string, string>;

const K = "#2E2216"; // outline ink

// `satisfies` (not a Record annotation) keeps the key list literal, so a typo in a sprite
// name is a compile error instead of a crash at render time.
export const SPRITES = {
  grassBlock: {
    grid: [
      "lGGlGGGlGGlG",
      "GgGGlGGgGGGl",
      "gGGgGGgGGgGG",
      "DgDGDgDGgDgD",
      "DDdDDDdDDbDD",
      "DbDDDDDDDDdD",
      "DDDdDbDDdDDD",
      "dDDDDDDDDDbD",
      "DDbDDdDDDDDD",
      "DDDDDDDbDdDD",
      "DdDDbDDDDDDD",
      "DDDDDDdDDDbD",
    ],
    palette: { l: "#7CC447", G: "#5FA832", g: "#3F8A1F", D: "#79553A", d: "#593D28", b: "#8E6747" },
  },
  diamond: {
    grid: [
      "....kkkk....",
      "...kcccCk...",
      "..kcCwccCk..",
      ".kcwcccccCk.",
      "kCcccccccCCk",
      "kccccccccCCk",
      ".kCcccccCCk.",
      "..kCcccCCk..",
      "...kCcCCk...",
      "....kCCk....",
      ".....kk.....",
      "............",
    ],
    palette: { k: K, c: "#4DD8DF", C: "#1E8C99", w: "#E9FFFF" },
  },
  gold: {
    grid: [
      "............",
      "............",
      "...kkkkkkk..",
      "..kyyywyyyk.",
      ".kyywyyyyYk.",
      "kYYYYYYYYYk.",
      "kYyyyyyyyYk.",
      "kYYYYYYYYYk.",
      ".kkkkkkkkk..",
      "............",
      "............",
      "............",
    ],
    palette: { k: K, y: "#F7CF4F", Y: "#C98F0E", w: "#FFF4C2" },
  },
  chest: {
    grid: [
      ".kkkkkkkkkk.",
      "kBbbbbbbbbBk",
      "kbBBBBBBBBbk",
      "kbbbbbbbbbbk",
      "kkkkkkkkkkkk",
      "kBbbbkkbbbBk",
      "kbbbbkykbbbk",
      "kbBBBkkBBBbk",
      "kbbbbbbbbbbk",
      "kbBBBBBBBBbk",
      "kbbbbbbbbbbk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, b: "#B07A3E", B: "#8A5A2B", y: "#F2B318" },
  },
  chestOpen: {
    grid: [
      ".kkkkkkkkkk.",
      "kBbbbbbbbbBk",
      "kbbbbbbbbbbk",
      "kkkkkkkkkkkk",
      "kiiiiiiiiiik",
      "kiiiiiiiiiik",
      "kkkkkkkkkkkk",
      "kbbbbkykbbbk",
      "kbBBBkkBBBbk",
      "kbbbbbbbbbbk",
      "kbBBBBBBBBbk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, b: "#B07A3E", B: "#8A5A2B", y: "#F2B318", i: "#3B2412" },
  },
  chestGold: {
    grid: [
      ".kkkkkkkkkk.",
      "kBbbbbbbbbBk",
      "kbbbbbbbbbbk",
      "kkkkkkkkkkkk",
      "kiyYiyyiYyik",
      "kyyYyyYyyYyk",
      "kkkkkkkkkkkk",
      "kbbbbkykbbbk",
      "kbBBBkkBBBbk",
      "kbbbbbbbbbbk",
      "kbBBBBBBBBbk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, b: "#B07A3E", B: "#8A5A2B", y: "#F7CF4F", Y: "#C98F0E", i: "#3B2412" },
  },
  torch: {
    grid: [
      ".....yy.....",
      "....yYYy....",
      "....YrrY....",
      ".....rr.....",
      ".....kk.....",
      ".....ww.....",
      ".....ww.....",
      ".....WW.....",
      ".....ww.....",
      ".....WW.....",
      ".....ww.....",
      ".....WW.....",
    ],
    palette: { k: K, y: "#FFE27A", Y: "#F2B318", r: "#E2572B", w: "#A87A45", W: "#7A5530" },
  },
  monitor: {
    grid: [
      "kkkkkkkkkkkk",
      "kSSSSSSSSSSk",
      "kSggggSSSSSk",
      "kSSSSSSSSSSk",
      "kSyyySSSSSSk",
      "kSSSSSSggSSk",
      "kSSSSSSSSSSk",
      "kkkkkkkkkkkk",
      "....kkkk....",
      "...kTTTTk...",
      "..kkkkkkkk..",
      "............",
    ],
    palette: { k: K, S: "#BFE3F0", g: "#3F8A1F", y: "#F2B318", T: "#9C9C9C" },
  },
  server: {
    grid: [
      "kkkkkkkkkkkk",
      "kTTTTTTTTTTk",
      "kTkkkkkkgTTk",
      "kTTTTTTTTTTk",
      "kkkkkkkkkkkk",
      "kTTTTTTTTTTk",
      "kTkkkkkkgTTk",
      "kTTTTTTTTTTk",
      "kkkkkkkkkkkk",
      "kTTTTTTTTTTk",
      "kTkkkkkkyTTk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, T: "#A8A8A8", g: "#6DBA3A", y: "#F2B318" },
  },
  brush: {
    grid: [
      ".........kkk",
      "........kyyk",
      ".......kyyk.",
      "......kYyk..",
      ".....kwwk...",
      "....kwwk....",
      "...kWwk.....",
      "..kccck.....",
      ".kccck......",
      "kcCcck......",
      "kccck.......",
      "kkkk........",
    ],
    palette: { k: K, y: "#F7CF4F", Y: "#C98F0E", w: "#A87A45", W: "#7A5530", c: "#D2463A", C: "#F07A6E" },
  },
  shirt: {
    grid: [
      "..kkk..kkk..",
      ".kGGGkkGGGk.",
      "kGGGGGGGGGGk",
      "kGGkGGGGkGGk",
      "kkkkGGGGkkkk",
      "...kGGGGk...",
      "...kGgGGk...",
      "...kGGGGk...",
      "...kGGgGk...",
      "...kGGGGk...",
      "...kGGGGk...",
      "...kkkkkk...",
    ],
    palette: { k: K, G: "#5FA832", g: "#3F8A1F" },
  },
  potion: {
    grid: [
      "....kkkk....",
      "....kwwk....",
      ".....kk.....",
      "....kWWk....",
      "...kWppWk...",
      "..kppppppk..",
      ".kpPppppppk.",
      ".kppppPpppk.",
      ".kpppppppPk.",
      ".kPppppppPk.",
      "..kPPPPPPk..",
      "...kkkkkk...",
    ],
    palette: { k: K, w: "#A87A45", W: "#DDEFF5", p: "#4DD8DF", P: "#1E8C99" },
  },
  film: {
    grid: [
      "kkkkkkkkkkkk",
      "kwwkkwwkkwwk",
      "kkkkkkkkkkkk",
      "kDDDDDDDDDDk",
      "kDDDwDDDDDDk",
      "kDDDwwDDDDDk",
      "kDDDwwwDDDDk",
      "kDDDwwDDDDDk",
      "kDDDwDDDDDDk",
      "kDDDDDDDDDDk",
      "kkkkkkkkkkkk",
      "............",
    ],
    palette: { k: K, w: "#F2EAD3", D: "#4A4A5C" },
  },
  phone: {
    grid: [
      "..kkkkkkkk..",
      "..kTTTTTTk..",
      "..kSSSSSSk..",
      "..kSggSSSk..",
      "..kSSSSSSk..",
      "..kSyySSSk..",
      "..kSSSSSSk..",
      "..kSSSggSk..",
      "..kSSSSSSk..",
      "..kTTkkTTk..",
      "..kTTTTTTk..",
      "..kkkkkkkk..",
    ],
    palette: { k: K, T: "#7A7A7A", S: "#BFE3F0", g: "#3F8A1F", y: "#F2B318" },
  },
  pickaxe: {
    grid: [
      "..kkkkkkkk..",
      ".kcccccccck.",
      "kcCk....kcCk",
      "kCk.kk...kCk",
      ".k..kwk...k.",
      "....kwk.....",
      "....kwk.....",
      "....kWk.....",
      "....kwk.....",
      "....kWk.....",
      "....kwk.....",
      "....kkk.....",
    ],
    palette: { k: K, c: "#4DD8DF", C: "#1E8C99", w: "#A87A45", W: "#7A5530" },
  },
  // EterVerse brand mark: a prismarine-framed portal, "a door into other worlds".
  portal: {
    grid: [
      "kkkkkkkkkkkk",
      "kPPpPPPPpPPk",
      "kPkkkkkkkkPk",
      "kpkVvvvVvkpk",
      "kPkvVvvvVkPk",
      "kPkvvVvVvkPk",
      "kPkVvvVvvkPk",
      "kpkvVvvVvkpk",
      "kPkvvVvvVkPk",
      "kPkkkkkkkkPk",
      "kPPpPPPPpPPk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, P: "#2E8077", p: "#77C9BC", v: "#7A44B5", V: "#B98BE8" },
  },
  // Vote = emerald: the currency players hand to the server they like.
  emerald: {
    grid: [
      "....kkkk....",
      "...kgGGgk...",
      "..kgwGGGgk..",
      "..kwGGGGgk..",
      ".kgGGGGGGgk.",
      ".kgGGGGGGgk.",
      ".kgGGGGGGdk.",
      ".kgGGGGGddk.",
      "..kgGGGGdk..",
      "..kgGGGddk..",
      "...kgddk....",
      "....kkk.....",
    ],
    palette: { k: K, g: "#4FD07A", G: "#17A14B", d: "#0B6B2E", w: "#D6FFE2" },
  },
  book: {
    grid: [
      "............",
      ".kkkkkkkkkk.",
      ".kRRRRRRRRk.",
      ".kRrrrrrrRk.",
      ".kRrYYYYrRk.",
      ".kRrrrrrrRk.",
      ".kRRRRRRRRk.",
      ".kRRRRRRRRk.",
      ".kRRRRRRRRk.",
      ".kWWWWWWWWk.",
      ".kkkkkkkkkk.",
      "............",
    ],
    palette: { k: K, R: "#8A3F1C", r: "#B5592A", Y: "#F2B318", W: "#F7EFDC" },
  },
  bell: {
    grid: [
      ".....kk.....",
      "....kYYk....",
      "...kYYYyk...",
      "..kYwYYYyk..",
      "..kYwYYYyk..",
      "..kYYYYYyk..",
      ".kYYYYYYYyk.",
      ".kYYYYYYYyk.",
      "kkkkkkkkkkkk",
      "kyyyyyyyyyyk",
      "kkkkkkkkkkkk",
      ".....kk.....",
    ],
    palette: { k: K, Y: "#F2B318", y: "#C98A0B", w: "#FFF1C2" },
  },
  goldBlock: {
    grid: [
      "kkkkkkkkkkkk",
      "kwwYYYYYYYyk",
      "kwYYYYYYYyyk",
      "kYYyYYYYYYyk",
      "kYYYYYYyYYyk",
      "kYYYYYYYYYyk",
      "kYyYYYYYYYyk",
      "kYYYYYyYYYyk",
      "kYYYYYYYYyyk",
      "kYYYyYYYYyyk",
      "kyyyyyyyyyyk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, Y: "#F2B318", y: "#C98A0B", w: "#FFF1C2" },
  },
  map: {
    grid: [
      "............",
      "kkkkkkkkkkkk",
      "kPPPPPPPPPPk",
      "kPgggPPwwPPk",
      "kPgGgggwwwPk",
      "kPggGgPwwwPk",
      "kPPgggPPwwPk",
      "kPPPPrPPPPPk",
      "kPPPrrrPgPPk",
      "kPPPPrPPggPk",
      "kPPPPPPPPPPk",
      "kkkkkkkkkkkk",
    ],
    palette: { k: K, P: "#E6DABD", g: "#6DBA3A", G: "#3F8A1F", w: "#6E9BE0", r: "#B8322A" },
  },
} satisfies Record<string, { grid: string[]; palette: Palette }>;

export type SpriteName = keyof typeof SPRITES;

export function gridToRects(grid: string[], palette: Palette, px: number, ox = 0, oy = 0, keyPrefix = "") {
  const rects: React.ReactElement[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const color = palette[ch];
      if (!color) {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === ch) w++;
      rects.push(
        <rect key={`${keyPrefix}${x}-${y}`} x={ox + x * px} y={oy + y * px} width={w * px} height={px} fill={color} />
      );
      x += w;
    }
  });
  return rects;
}

export function Sprite({
  name,
  size = 48,
  className,
  label,
}: {
  name: SpriteName;
  size?: number;
  className?: string;
  label?: string;
}) {
  const s = SPRITES[name];
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {gridToRects(s.grid, s.palette, 1)}
    </svg>
  );
}

/** Pick a sprite that represents a shop category or product by keywords in its name. */
export function spriteForCategory(name: string): SpriteName {
  const n = name.toLowerCase();
  if (/(host|server|vps|panel)/.test(n)) return "server";
  if (/(skin|remake|cape)/.test(n)) return "shirt";
  if (/(addon|add-on|mod|plugin|datapack|script)/.test(n)) return "potion";
  if (/(realm|world|map)/.test(n)) return "grassBlock";
  if (/(web|site|toko online|landing)/.test(n)) return "monitor";
  if (/(intro|animasi|animation|video|render|3d)/.test(n)) return "film";
  if (/(desain|design|logo|banner|art|thumbnail|poster)/.test(n)) return "brush";
  if (/(pulsa|data|kuota|paket internet)/.test(n)) return "phone";
  if (/(jasa|setup|install|config)/.test(n)) return "pickaxe";
  if (/(diamond|gem|premium)/.test(n)) return "diamond";
  return "chest";
}

// ─────────────────────────────────────────────
// BLOCK WORLD SCENE (hero illustration)
// 8x8 tiles at 2 user units per pixel = 16-unit blocks.
// ─────────────────────────────────────────────

export const TILE: Record<string, { grid: string[]; palette: Palette }> = {
  grass: {
    grid: ["lGGlGGGl", "GgGGlGgG", "gGgGGgGg", "DgDDgDDg", "DDdDDDbD", "DbDDdDDD", "DDDbDDdD", "dDDDDDDD"],
    palette: { l: "#7CC447", G: "#5FA832", g: "#3F8A1F", D: "#79553A", d: "#593D28", b: "#8E6747" },
  },
  dirt: {
    grid: ["DDdDDDbD", "DbDDdDDD", "DDDbDDdD", "dDDDDDDD", "DDbDDdDD", "DDDDDDbD", "DdDDbDDD", "DDDDDdDD"],
    palette: { D: "#79553A", d: "#593D28", b: "#8E6747" },
  },
  stone: {
    grid: ["SStSSsSS", "SsSSSSSt", "SSSsStSS", "tSSSSSsS", "SSsStSSS", "SSSSSSSs", "StSsSSSS", "SSSSSSts"],
    palette: { S: "#8F8F8F", s: "#757575", t: "#A6A6A6" },
  },
  diamondOre: {
    grid: ["SStSSsSS", "ScCSSSSt", "SCcStSSS", "tSSSScCS", "SSsSSCcS", "SScCSSSs", "StCcSSSS", "SSSSSSts"],
    palette: { S: "#8F8F8F", s: "#757575", t: "#A6A6A6", c: "#4DD8DF", C: "#1E8C99" },
  },
  goldOre: {
    grid: ["SStSSsSS", "SyYSSSSt", "SYyStSSS", "tSSSSyYS", "SSsSSYyS", "SSyYSSSs", "StYySSSS", "SSSSSSts"],
    palette: { S: "#8F8F8F", s: "#757575", t: "#A6A6A6", y: "#F7CF4F", Y: "#C98F0E" },
  },
  sand: {
    grid: ["aaAaaaaa", "aaaaaAaa", "aAaaaaaa", "aaaaAaaa", "aaaaaaaA", "aAaaaaaa", "aaaaaAaa", "aaAaaaaa"],
    palette: { a: "#E8D49A", A: "#D6BE7E" },
  },
  log: {
    grid: ["oOooOooO", "oOooOooO", "oOoOOooO", "oOooOoOO", "oOooOooO", "OOooOooO", "oOooOOoO", "oOooOooO"],
    palette: { o: "#8A6238", O: "#5C3E22" },
  },
  planks: {
    grid: ["pppPpppp", "pppPpppp", "PPPPPPPP", "pppppppP", "pppppppP", "PPPPPPPP", "ppPppppp", "ppPppppp"],
    palette: { p: "#B8894F", P: "#8A6238" },
  },
  darkPlanks: {
    grid: ["pppPpppp", "pppPpppp", "PPPPPPPP", "pppppppP", "pppppppP", "PPPPPPPP", "ppPppppp", "ppPppppp"],
    palette: { p: "#6B4A2B", P: "#4E3420" },
  },
  cobble: {
    grid: ["SSsKSStS", "tSsKSSsK", "KKKSsSSK", "SStSKKKS", "SsSSKtSS", "KKSSKSsS", "tSKKSSSK", "SSSSsKKS"],
    palette: { S: "#8F8F8F", s: "#757575", t: "#A6A6A6", K: "#5E5E5E" },
  },
  sandstone: {
    grid: ["aaaaaaaa", "AAAAAAAA", "aaAaaaaa", "aaaaaAaa", "aaaaaaaa", "AAAAAAAA", "aaaaAaaa", "aAaaaaaa"],
    palette: { a: "#E8D49A", A: "#D6BE7E" },
  },
  goldBlock: {
    grid: ["yyyyyyyw", "yYyyyyyy", "yyyyyYyy", "yyyyyyyy", "yyYyyyyy", "yyyyyyYy", "yyyyyyyy", "wyyyYyyy"],
    palette: { y: "#F7CF4F", Y: "#E0A92A", w: "#FFF4C2" },
  },
  leaves: {
    grid: ["LMLLNLML", "LLNMLLLM", "MLLLMLNL", "LNMLLMLL", "LLLNLLML", "MLMLLNLL", "LNLLMLLM", "LLMLNLML"],
    palette: { L: "#4E9A2A", M: "#3B7D1E", N: "#6DBA3A" },
  },
};

const COLS = 40;
const ROWS = 14;
const B = 16;
// Surface height (in blocks) per column. Left side stays low so text sits on open sky.
const HEIGHTS = [4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 6, 7, 7, 7, 8, 8, 8, 7, 7, 6, 6, 6, 7, 7, 8, 9, 9, 9, 8, 7, 6, 5, 4, 4, 4];
const SAND_FROM = 36;
const ORES: Record<string, "diamondOre" | "goldOre"> = { "14-1": "diamondOre", "21-2": "goldOre", "30-3": "diamondOre", "6-1": "goldOre", "26-1": "goldOre", "33-2": "diamondOre" };
const TREES = [22, 31];
const CLOUDS: [number, number, number][] = [
  [3, 1, 4], [13, 2, 3], [24, 1, 5], [34, 2, 3],
];

export function PixelWorld({ className }: { className?: string }) {
  const tiles: React.ReactElement[] = [];
  const place = (kind: keyof typeof TILE, col: number, rowFromTop: number) => {
    tiles.push(<rect key={`${kind}-${col}-${rowFromTop}`} x={col * B} y={rowFromTop * B} width={B} height={B} fill={`url(#pw-${kind})`} />);
  };

  HEIGHTS.forEach((h, col) => {
    const top = ROWS - h;
    for (let r = top; r < ROWS; r++) {
      const depth = r - top; // 0 = surface
      const isSand = col >= SAND_FROM;
      let kind: keyof typeof TILE;
      if (depth === 0) kind = isSand ? "sand" : "grass";
      else if (depth <= 2) kind = isSand ? "sand" : "dirt";
      else kind = ORES[`${col}-${ROWS - 1 - r}`] ?? "stone";
      place(kind, col, r);
    }
  });

  TREES.forEach((col) => {
    const surface = ROWS - HEIGHTS[col];
    for (let i = 1; i <= 3; i++) place("log", col, surface - i);
    for (let dx = -2; dx <= 2; dx++) for (let dy = 4; dy <= 5; dy++) place("leaves", col + dx, surface - dy);
    for (let dx = -1; dx <= 1; dx++) place("leaves", col + dx, surface - 6);
  });

  const chestCol = 26;
  const chestY = (ROWS - HEIGHTS[chestCol]) * B - 12;
  const chest = SPRITES.chestGold;
  const torchCol = 17;
  const torchY = (ROWS - HEIGHTS[torchCol]) * B - 12;

  return (
    <svg
      viewBox={`0 0 ${COLS * B} ${ROWS * B}`}
      preserveAspectRatio="xMinYMax slice"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {Object.entries(TILE).map(([k, t]) => (
          <pattern key={k} id={`pw-${k}`} width={B} height={B} patternUnits="userSpaceOnUse">
            {gridToRects(t.grid, t.palette, 2)}
          </pattern>
        ))}
      </defs>
      {/* Sky in two flat bands */}
      <rect width={COLS * B} height={ROWS * B} fill="#CDE8F4" />
      <rect y={ROWS * B * 0.55} width={COLS * B} height={ROWS * B * 0.45} fill="#DDF0F7" />
      {/* Square sun */}
      <rect x={30 * B} y={B * 0.6} width={B * 1.5} height={B * 1.5} fill="#FFE27A" />
      <rect x={30 * B + 4} y={B * 0.6 + 4} width={B * 1.5 - 8} height={B * 1.5 - 8} fill="#FFF4C2" />
      {/* Clouds */}
      {CLOUDS.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x * B} y={y * B} width={w * B} height={B * 0.6} fill="#FFFFFF" />
          <rect x={x * B + B * 0.5} y={y * B - B * 0.4} width={(w - 1) * B} height={B * 0.5} fill="#FFFFFF" />
          <rect x={x * B} y={y * B + B * 0.6} width={w * B} height={4} fill="#E3EEF2" />
        </g>
      ))}
      {tiles}
      {/* Torch next to the trail */}
      <g transform={`translate(${torchCol * B + 2} ${torchY})`}>{gridToRects(SPRITES.torch.grid, SPRITES.torch.palette, 1)}</g>
      {/* Treasure chest on the hill */}
      <g transform={`translate(${chestCol * B + 2} ${chestY})`}>{gridToRects(chest.grid, chest.palette, 1)}</g>
    </svg>
  );
}
