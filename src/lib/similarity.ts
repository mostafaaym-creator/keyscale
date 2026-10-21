import { KeyboardSpec } from '@/types/keyboard';
import { deskFootprint, percentChange } from './geometry';

export interface SimilarityWeights {
  dimensions: number; // default 0.60
  layout: number;     // default 0.20
  weight: number;     // default 0.10
  technology: number; // default 0.10
}

export const DEFAULT_WEIGHTS: SimilarityWeights = {
  dimensions: 0.60,
  layout: 0.20,
  weight: 0.10,
  technology: 0.10
};

export interface SimilarityResult {
  keyboard: KeyboardSpec;
  score: number; // 0 to 100
  widthDiff: number | null; // mm
  depthDiff: number | null; // mm
  heightDiff: number | null; // mm
  footprintDiffPercent: number | null; // %
  weightDiff: number | null; // g
  reasons: string[];
}

export function calculateSimilarity(
  target: KeyboardSpec,
  candidate: KeyboardSpec,
  weights: SimilarityWeights = DEFAULT_WEIGHTS
): SimilarityResult | null {
  if (target.id === candidate.id) return null;
  if (!target.width || !target.depth || !candidate.width || !candidate.depth) return null;

  const reasons: string[] = [];

  // 1. Dimensions (primary signal)
  const wDiff = Math.abs(candidate.width - target.width);
  const dDiff = Math.abs(candidate.depth - target.depth);
  const hDiff = target.height && candidate.height ? Math.abs(candidate.height - target.height) : null;

  // Normalized dimensional difference: 150mm max width diff, 80mm max depth diff
  const wScore = Math.max(0, 1 - wDiff / 150);
  const dScore = Math.max(0, 1 - dDiff / 80);
  const hScore = hDiff !== null ? Math.max(0, 1 - hDiff / 30) : 0.8; // neutral if unknown

  const dimScore = (wScore * 0.5 + dScore * 0.35 + hScore * 0.15) * 100;

  if (wDiff <= 3) {
    reasons.push(`Width nearly identical (±${wDiff.toFixed(1)} mm)`);
  } else if (wDiff <= 15) {
    reasons.push(`Width very close (±${wDiff.toFixed(1)} mm)`);
  }

  if (dDiff <= 3) {
    reasons.push(`Depth nearly identical (±${dDiff.toFixed(1)} mm)`);
  }

  // Desk footprint comparison
  const targetFp = deskFootprint(target);
  const candFp = deskFootprint(candidate);
  let fpDiffPercent: number | null = null;
  if (targetFp && candFp) {
    fpDiffPercent = percentChange(targetFp, candFp);
    if (Math.abs(fpDiffPercent) <= 5) {
      reasons.push(`Virtually same desk footprint (±${Math.abs(fpDiffPercent).toFixed(1)}%)`);
    } else if (Math.abs(fpDiffPercent) <= 15) {
      reasons.push(`Similar desk space (${fpDiffPercent > 0 ? '+' : ''}${fpDiffPercent.toFixed(1)}%)`);
    }
  }

  // 2. Layout
  let layoutScore = 0;
  if (target.layout && candidate.layout) {
    if (target.layout.toLowerCase() === candidate.layout.toLowerCase()) {
      layoutScore = 100;
      reasons.push(`Matching ${candidate.layout} layout`);
    } else if (
      (target.layout.includes('60') && candidate.layout.includes('65')) ||
      (target.layout.includes('65') && candidate.layout.includes('75')) ||
      (target.layout.includes('75') && candidate.layout.includes('TKL'))
    ) {
      layoutScore = 65;
      reasons.push(`Adjacent form factor (${candidate.layout} vs ${target.layout})`);
    } else {
      layoutScore = 15;
    }
  } else {
    layoutScore = 50; // Neutral if missing
  }

  // 3. Weight
  let weightScore = 50;
  let wtDiff: number | null = null;
  if (target.weight && candidate.weight) {
    wtDiff = candidate.weight - target.weight;
    const absWt = Math.abs(wtDiff);
    weightScore = Math.max(0, 100 - (absWt / 400) * 100);
    if (absWt <= 50) {
      reasons.push(`Almost identical weight (${candidate.weight}g vs ${target.weight}g)`);
    }
  }

  // 4. Technology
  let techScore = 50;
  if (target.technology && candidate.technology) {
    if (target.technology === candidate.technology) {
      techScore = 100;
      reasons.push(`Same switch technology (${candidate.technology})`);
    } else {
      techScore = 30;
    }
  }

  // Total weighted score
  const totalWeight = weights.dimensions + weights.layout + weights.weight + weights.technology;
  const compositeScore = Math.round(
    (dimScore * weights.dimensions +
      layoutScore * weights.layout +
      weightScore * weights.weight +
      techScore * weights.technology) /
      totalWeight
  );

  return {
    keyboard: candidate,
    score: Math.min(100, Math.max(0, compositeScore)),
    widthDiff: candidate.width - target.width,
    depthDiff: candidate.depth - target.depth,
    heightDiff: target.height && candidate.height ? candidate.height - target.height : null,
    footprintDiffPercent: fpDiffPercent,
    weightDiff: wtDiff,
    reasons: reasons.slice(0, 3)
  };
}

export function findSimilarKeyboards(
  target: KeyboardSpec,
  allKeyboards: KeyboardSpec[],
  limit = 8,
  weights = DEFAULT_WEIGHTS
): SimilarityResult[] {
  const results: SimilarityResult[] = [];
  for (const k of allKeyboards) {
    const res = calculateSimilarity(target, k, weights);
    if (res && res.score >= 40) {
      results.push(res);
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
