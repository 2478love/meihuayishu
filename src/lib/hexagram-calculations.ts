import type { Hexagram } from "@/types";
import { getHexagramByTrigrams, getHexagramLines } from "./hexagrams";
import { trigrams } from "./trigrams";

function getTrigramFromLines(lines: boolean[]): number {
  for (const [key, trigram] of Object.entries(trigrams)) {
    if (trigram.lines.every((value, index) => value === lines[index])) {
      return Number(key);
    }
  }
  return 8;
}

export function deriveMainHexagram(upperTrigram: number, lowerTrigram: number): Hexagram | undefined {
  const normalizedUpper = normalizeTrigramSeed(upperTrigram);
  const normalizedLower = normalizeTrigramSeed(lowerTrigram);
  return getHexagramByTrigrams(normalizedUpper, normalizedLower);
}

export function deriveMutualHexagram(upperTrigram: number, lowerTrigram: number): Hexagram | undefined {
  const normalizedUpper = normalizeTrigramSeed(upperTrigram);
  const normalizedLower = normalizeTrigramSeed(lowerTrigram);
  const allLines = getHexagramLines(normalizedUpper, normalizedLower);

  if (allLines.length !== 6) {
    return undefined;
  }

  const mutualLowerLines = allLines.slice(1, 4);
  const mutualUpperLines = allLines.slice(2, 5);

  const mutualLowerTrigram = getTrigramFromLines(mutualLowerLines);
  const mutualUpperTrigram = getTrigramFromLines(mutualUpperLines);

  return getHexagramByTrigrams(mutualUpperTrigram, mutualLowerTrigram);
}



export function normalizeTrigramSeed(seed: number): number {
  const safeSeed = Math.abs(Math.floor(seed));
  const remainder = safeSeed % 8;
  return remainder === 0 ? 8 : remainder;
}

export function normalizeLineSeed(seed: number): number {
  const safeSeed = Math.abs(Math.floor(seed));
  const remainder = safeSeed % 6;
  return remainder === 0 ? 6 : remainder;
}
