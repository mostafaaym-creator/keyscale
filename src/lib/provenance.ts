import { KeyboardSpec } from '@/types/keyboard';

export type EvidenceTier = 1 | 2 | 3 | 4 | 5;

export interface TierInfo {
  tier: EvidenceTier;
  label: string;
  badgeClass: string;
  description: string;
}

export const EVIDENCE_TIERS: Record<EvidenceTier, TierInfo> = {
  1: {
    tier: 1,
    label: 'Tier 1 — Manufacturer',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    description: 'Official manufacturer specification sheet, product page, PDF manual, or direct manufacturer confirmation.'
  },
  2: {
    tier: 2,
    label: 'Tier 2 — Independent Lab',
    badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    description: 'Independent hardware testing laboratory or publication that physically measured the product with calipers.'
  },
  3: {
    tier: 3,
    label: 'Tier 3 — Authorized Retailer',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    description: 'Authorized retailer or distributor listing (Amazon, Best Buy, Newegg, Micro Center) with verified SKU.'
  },
  4: {
    tier: 4,
    label: 'Tier 4 — Secondary Technical',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    description: 'Detailed video review with caliper measurements, specialist teardown, or community measurement.'
  },
  5: {
    tier: 5,
    label: 'Tier 5 — Unverified Claim',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    description: 'Community comment, forum post, or unverified secondary reseller description. Never treated as verified fact.'
  }
};

export interface VerificationStatus {
  status: 'verified' | 'supported' | 'provisional' | 'conflict' | 'partial' | 'missing';
  label: string;
  tier: EvidenceTier;
  badgeClass: string;
  description: string;
}

export function computeVerificationStatus(k: KeyboardSpec): VerificationStatus {
  if (k.review) {
    return {
      status: 'conflict',
      label: 'Conflicting Sources',
      tier: 3,
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      description: 'Multiple reputable sources disagree on measurements; values are under active review.'
    };
  }

  const hasW = typeof k.width === 'number' && k.width > 0;
  const hasD = typeof k.depth === 'number' && k.depth > 0;
  const hasH = typeof k.height === 'number' && k.height > 0;

  if (!hasW && !hasD && !hasH) {
    return {
      status: 'missing',
      label: 'Needs Research',
      tier: 5,
      badgeClass: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30',
      description: 'No verified physical measurements found yet; queued for research.'
    };
  }

  if (!hasW || !hasD || !hasH) {
    return {
      status: 'partial',
      label: 'Partially Verified',
      tier: 2,
      badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
      description: 'Some dimensional axes are verified; remaining axes are under investigation.'
    };
  }

  // Complete 3-axis dimensions
  const isManufacturer = (k.sourceType || '').toLowerCase().includes('manufacturer') || (k.source || '').includes('http');
  const tier: EvidenceTier = isManufacturer ? 1 : 2;

  return {
    status: 'verified',
    label: isManufacturer ? 'Manufacturer Verified' : 'Independently Verified',
    tier,
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    description: 'All 3 external dimensional axes are verified by primary or independent documentation.'
  };
}
