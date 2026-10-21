import { KeyboardSpec, MeasurementUnit, AlignmentMode } from '@/types/keyboard';

export const MM_PER_INCH = 25.4;
export const MM_PER_CM = 10;
export const GRAMS_PER_OZ = 28.349523125;

export function hasDimensions(k?: KeyboardSpec | null): boolean {
  if (!k) return false;
  return (
    typeof k.width === 'number' &&
    k.width > 0 &&
    typeof k.depth === 'number' &&
    k.depth > 0
  );
}

export function validDimension(v: unknown): boolean {
  return typeof v === 'number' && !Number.isNaN(v) && v > 0 && v < 5000;
}

export function fromMillimeters(mm: number, unit: MeasurementUnit): number {
  if (unit === 'cm') return mm / MM_PER_CM;
  if (unit === 'in') return mm / MM_PER_INCH;
  return mm;
}

export function toMillimeters(value: number, unit: MeasurementUnit): number {
  if (unit === 'cm') return value * MM_PER_CM;
  if (unit === 'in') return value * MM_PER_INCH;
  return value;
}

export function formatDimension(mm: number | null | undefined, unit: MeasurementUnit, precision = 1): string {
  if (mm === null || mm === undefined || Number.isNaN(mm)) return '—';
  const val = fromMillimeters(mm, unit);
  const formatted = val.toFixed(unit === 'in' ? 2 : precision);
  return `${formatted.replace(/\.0+$/, '')} ${unit}`;
}

export function formatWeight(grams: number | null | undefined, unit: 'g' | 'oz' = 'g'): string {
  if (grams === null || grams === undefined || Number.isNaN(grams)) return '—';
  if (unit === 'oz') {
    return `${(grams / GRAMS_PER_OZ).toFixed(1)} oz`;
  }
  return `${Math.round(grams)} g`;
}

export function deskFootprint(k: { width: number | null; depth: number | null }): number | null {
  if (!k.width || !k.depth || k.width <= 0 || k.depth <= 0) return null;
  return k.width * k.depth; // mm^2
}

export function footprintCm2(k: { width: number | null; depth: number | null }): number | null {
  const fp = deskFootprint(k);
  if (fp === null) return null;
  return Math.round(fp / 100); // cm^2
}

export function percentChange(base: number, next: number): number {
  if (base === 0) return 0;
  return ((next - base) / base) * 100;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  depth: number;
}

export function getAlignmentOffsets(
  itemW: number,
  itemD: number,
  maxW: number,
  maxD: number,
  align: AlignmentMode
): { x: number; y: number } {
  switch (align) {
    case 'left':
      return { x: 0, y: (maxD - itemD) / 2 };
    case 'right':
      return { x: maxW - itemW, y: (maxD - itemD) / 2 };
    case 'top':
      return { x: (maxW - itemW) / 2, y: 0 };
    case 'bottom':
    case 'front':
      return { x: (maxW - itemW) / 2, y: maxD - itemD };
    case 'center':
    default:
      return { x: (maxW - itemW) / 2, y: (maxD - itemD) / 2 };
  }
}

export const scaleReferences = [
  { id: 'none', label: 'No reference item', width: 0, depth: 0 },
  { id: 'credit-card', label: 'Credit card (85.6 × 53.98 mm)', width: 85.6, depth: 53.98 },
  { id: 'mousepad-m', label: 'Medium mousepad (360 × 300 mm)', width: 360, depth: 300 },
  { id: 'mousepad-l', label: 'Large mousepad (450 × 400 mm)', width: 450, depth: 400 },
  { id: 'desk-mat-xl', label: 'Desk mat XL (900 × 400 mm)', width: 900, depth: 400 }
];
