import { describe, it, expect } from 'vitest';
import {
  fromMillimeters,
  toMillimeters,
  formatDimension,
  formatWeight,
  deskFootprint,
  footprintCm2,
  percentChange,
  getAlignmentOffsets,
  validDimension,
  hasDimensions
} from '../src/lib/geometry';

describe('Geometry & Conversion Calculations', () => {
  it('correctly converts millimeters to centimeters and inches', () => {
    expect(fromMillimeters(100, 'mm')).toBe(100);
    expect(fromMillimeters(100, 'cm')).toBe(10);
    expect(fromMillimeters(254, 'in')).toBeCloseTo(10, 4);

    expect(toMillimeters(10, 'cm')).toBe(100);
    expect(toMillimeters(10, 'in')).toBe(254);
  });

  it('formats dimensions with units properly', () => {
    expect(formatDimension(355, 'mm')).toBe('355 mm');
    expect(formatDimension(355, 'cm')).toBe('35.5 cm');
    expect(formatDimension(null, 'mm')).toBe('—');
  });

  it('formats weights correctly', () => {
    expect(formatWeight(960, 'g')).toBe('960 g');
    expect(formatWeight(null)).toBe('—');
  });

  it('computes desk footprint area accurately', () => {
    const k = { width: 355, depth: 128 };
    expect(deskFootprint(k)).toBe(355 * 128);
    expect(footprintCm2(k)).toBe(Math.round((355 * 128) / 100));

    expect(deskFootprint({ width: null, depth: 128 })).toBeNull();
  });

  it('calculates percent changes correctly', () => {
    expect(percentChange(100, 125)).toBe(25);
    expect(percentChange(100, 80)).toBe(-20);
    expect(percentChange(0, 50)).toBe(0);
  });

  it('calculates alignment offsets accurately', () => {
    // maxW = 400, maxD = 200, itemW = 300, itemD = 100
    const center = getAlignmentOffsets(300, 100, 400, 200, 'center');
    expect(center).toEqual({ x: 50, y: 50 });

    const left = getAlignmentOffsets(300, 100, 400, 200, 'left');
    expect(left).toEqual({ x: 0, y: 50 });

    const right = getAlignmentOffsets(300, 100, 400, 200, 'right');
    expect(right).toEqual({ x: 100, y: 50 });

    const top = getAlignmentOffsets(300, 100, 400, 200, 'top');
    expect(top).toEqual({ x: 50, y: 0 });

    const bottom = getAlignmentOffsets(300, 100, 400, 200, 'bottom');
    expect(bottom).toEqual({ x: 50, y: 100 });
  });

  it('validates physical dimensions correctly', () => {
    expect(validDimension(355)).toBe(true);
    expect(validDimension(0)).toBe(false);
    expect(validDimension(-5)).toBe(false);
    expect(validDimension(NaN)).toBe(false);
    expect(validDimension(10000)).toBe(false);
  });

  it('identifies if a keyboard has physical dimensions', () => {
    expect(hasDimensions({ id: '1', brand: 'B', model: 'M', width: 300, depth: 120, height: 35, weight: 800, layout: 'TKL', keys: null })).toBe(true);
    expect(hasDimensions({ id: '2', brand: 'B', model: 'M', width: null, depth: 120, height: 35, weight: 800, layout: 'TKL', keys: null })).toBe(false);
  });
});
