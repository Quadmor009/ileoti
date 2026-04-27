import type { Category } from "../types";

/** URL slugs for “Explore our world” tiles → product listing. */
export const exploreSlugs = {
  craftedSpirits: "crafted-spirits",
  iceSlushy: "ice-slushy-hangover-kits",
  mixersSoftDrinks: "mixers-soft-drinks",
  gifting: "gifting-celebration",
} as const;

export type ExploreSlug = (typeof exploreSlugs)[keyof typeof exploreSlugs];

type ExploreConfig = {
  pageTitle: string;
  pageSubtitle: string;
  /** Try these category names (exact, case-insensitive) in order. */
  preferExactNames: readonly string[];
  /** Then try substring match on category name. */
  nameIncludes: readonly string[];
};

const EXPLORE_BY_SLUG: Record<string, ExploreConfig> = {
  [exploreSlugs.craftedSpirits]: {
    pageTitle: "Crafted spirits & classic sips",
    pageSubtitle: "Cognac, gin, whiskey, pineau — bottles worth the pour.",
    preferExactNames: ["Whiskey", "Cognac", "Gin", "Pineau"],
    nameIncludes: ["spirit", "whisk", "cognac"],
  },
  [exploreSlugs.iceSlushy]: {
    pageTitle: "Ice, slushy & hangover kits",
    pageSubtitle: "Cool-down essentials and recovery-friendly picks.",
    preferExactNames: [],
    nameIncludes: ["ice", "slushy", "hangover", "cooler", "kit"],
  },
  [exploreSlugs.mixersSoftDrinks]: {
    pageTitle: "Mixers & soft drinks",
    pageSubtitle: "Tonics, sodas, and everything that lifts a pour.",
    preferExactNames: [],
    nameIncludes: ["mixer", "soft", "soda", "tonic", "drink", "juice"],
  },
  [exploreSlugs.gifting]: {
    pageTitle: "Gifting & celebration",
    pageSubtitle: "Boxes and bottles made for unwrapping.",
    preferExactNames: [],
    nameIncludes: ["gift", "box", "celebration", "curat"],
  },
};

export function isExploreSlug(slug: string): boolean {
  return Boolean(EXPLORE_BY_SLUG[slug]);
}

export function getExploreConfig(slug: string): ExploreConfig | undefined {
  return EXPLORE_BY_SLUG[slug];
}

/** Pick the best-matching category id for this explore slug, or undefined (show all). */
export function resolveExploreCategoryId(slug: string, categories: Category[]): string | undefined {
  const cfg = EXPLORE_BY_SLUG[slug];
  if (!cfg) return undefined;
  for (const name of cfg.preferExactNames) {
    const hit = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (hit) return hit.id;
  }
  for (const sub of cfg.nameIncludes) {
    const hit = categories.find((c) => c.name.toLowerCase().includes(sub));
    if (hit) return hit.id;
  }
  return undefined;
}
