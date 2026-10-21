import { KeyboardSpec } from '@/types/keyboard';

export interface FilterOptions {
  query: string;
  brand: string;
  layout: string;
  technology: string;
  connectivity: string;
  verification: string;
  minWidth?: number;
  maxWidth?: number;
  minDepth?: number;
  maxDepth?: number;
  minWeight?: number;
  maxWeight?: number;
  hasPriceOnly?: boolean;
}

export type SortField = 'name' | 'brand' | 'width' | 'depth' | 'height' | 'weight' | 'releaseYear' | 'verified';
export type SortOrder = 'asc' | 'desc';

export const INITIAL_FILTERS: FilterOptions = {
  query: '',
  brand: 'all',
  layout: 'all',
  technology: 'all',
  connectivity: 'all',
  verification: 'all',
  hasPriceOnly: false
};

export function normalizeSearchString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesQuery(k: KeyboardSpec, query: string): boolean {
  if (!query) return true;
  const terms = normalizeSearchString(query).split(' ').filter(Boolean);
  if (!terms.length) return true;

  const searchable = normalizeSearchString(
    `${k.brand} ${k.model} ${k.family || ''} ${k.layout || ''} ${(k.aliases || []).join(' ')}`
  );

  return terms.every(term => {
    if (term === 'tkl') return searchable.includes('tkl') || searchable.includes('tenkeyless');
    if (term === 'tenkeyless') return searchable.includes('tenkeyless') || searchable.includes('tkl');
    return searchable.includes(term);
  });
}

export function filterKeyboards(
  keyboards: KeyboardSpec[],
  filters: FilterOptions,
  pricesMap?: Record<string, any[]>
): KeyboardSpec[] {
  return keyboards.filter(k => {
    // 1. Text Query
    if (filters.query && !matchesQuery(k, filters.query)) {
      return false;
    }

    // 2. Brand
    if (filters.brand !== 'all' && k.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // 3. Layout
    if (filters.layout !== 'all') {
      const kl = (k.layout || '').toLowerCase();
      const fl = filters.layout.toLowerCase();
      if (fl === 'tkl' && !kl.includes('tkl') && !kl.includes('tenkeyless')) return false;
      if (fl !== 'tkl' && !kl.includes(fl)) return false;
    }

    // 4. Technology
    if (filters.technology !== 'all') {
      const kt = (k.technology || '').toLowerCase();
      const ft = filters.technology.toLowerCase();
      if (!kt.includes(ft)) return false;
    }

    // 5. Connectivity
    if (filters.connectivity !== 'all') {
      const fc = filters.connectivity.toLowerCase();
      if (fc === 'wired' && !k.wired) return false;
      if (fc === 'wireless' && !k.wireless && !k.wireless24 && !k.bluetooth) return false;
      if (fc === 'bluetooth' && !k.bluetooth) return false;
      if (fc === '2.4ghz' && !k.wireless24) return false;
    }

    // 6. Verification
    if (filters.verification !== 'all') {
      const fv = filters.verification.toLowerCase();
      const isComplete = typeof k.width === 'number' && typeof k.depth === 'number' && typeof k.height === 'number';
      if (fv === 'verified' && (!isComplete || k.review)) return false;
      if (fv === 'review' && !k.review) return false;
      if (fv === 'partial' && isComplete) return false;
    }

    // 7. Dimension ranges
    if (filters.minWidth !== undefined && k.width !== null && k.width < filters.minWidth) return false;
    if (filters.maxWidth !== undefined && k.width !== null && k.width > filters.maxWidth) return false;
    if (filters.minDepth !== undefined && k.depth !== null && k.depth < filters.minDepth) return false;
    if (filters.maxDepth !== undefined && k.depth !== null && k.depth > filters.maxDepth) return false;
    if (filters.minWeight !== undefined && k.weight !== null && k.weight < filters.minWeight) return false;
    if (filters.maxWeight !== undefined && k.weight !== null && k.weight > filters.maxWeight) return false;

    // 8. Has Price
    if (filters.hasPriceOnly && pricesMap) {
      const offers = pricesMap[k.id];
      if (!offers || !offers.length) return false;
    }

    return true;
  });
}

export function sortKeyboards(
  keyboards: KeyboardSpec[],
  field: SortField,
  order: SortOrder = 'asc'
): KeyboardSpec[] {
  const dir = order === 'asc' ? 1 : -1;
  return [...keyboards].sort((a, b) => {
    switch (field) {
      case 'brand': {
        const cmp = a.brand.localeCompare(b.brand);
        return cmp !== 0 ? cmp * dir : a.model.localeCompare(b.model);
      }
      case 'width': {
        const valA = a.width ?? (dir === 1 ? 99999 : -1);
        const valB = b.width ?? (dir === 1 ? 99999 : -1);
        return (valA - valB) * dir;
      }
      case 'depth': {
        const valA = a.depth ?? (dir === 1 ? 99999 : -1);
        const valB = b.depth ?? (dir === 1 ? 99999 : -1);
        return (valA - valB) * dir;
      }
      case 'height': {
        const valA = a.height ?? (dir === 1 ? 99999 : -1);
        const valB = b.height ?? (dir === 1 ? 99999 : -1);
        return (valA - valB) * dir;
      }
      case 'weight': {
        const valA = a.weight ?? (dir === 1 ? 99999 : -1);
        const valB = b.weight ?? (dir === 1 ? 99999 : -1);
        return (valA - valB) * dir;
      }
      case 'releaseYear': {
        const valA = a.releaseYear ?? (dir === 1 ? 9999 : -1);
        const valB = b.releaseYear ?? (dir === 1 ? 9999 : -1);
        return (valA - valB) * dir;
      }
      case 'verified': {
        const valA = a.lastVerified || a.verified || '';
        const valB = b.lastVerified || b.verified || '';
        return valA.localeCompare(valB) * dir;
      }
      case 'name':
      default:
        return a.model.localeCompare(b.model) * dir;
    }
  });
}
