import { describe, it, expect } from 'vitest';
import { computeVerificationStatus } from '../src/lib/provenance';
import { KeyboardSpec } from '../src/types/keyboard';

describe('Evidence & Provenance Classification', () => {
  it('classifies complete 3-axis manufacturer specs as Verified', () => {
    const k: KeyboardSpec = {
      id: 'k1',
      brand: 'SteelSeries',
      model: 'Apex Pro',
      width: 355,
      depth: 128,
      height: 42,
      weight: 960,
      layout: 'TKL',
      keys: null,
      source: 'https://steelseries.com/product',
      sourceType: 'Manufacturer product page',
      review: false
    };

    const status = computeVerificationStatus(k);
    expect(status.status).toBe('verified');
    expect(status.tier).toBe(1);
  });

  it('flags keyboards with review=true as Conflicting Sources', () => {
    const k: KeyboardSpec = {
      id: 'k2',
      brand: 'BrandX',
      model: 'Conflict Model',
      width: 355,
      depth: 128,
      height: 42,
      weight: 960,
      layout: 'TKL',
      keys: null,
      review: true
    };

    const status = computeVerificationStatus(k);
    expect(status.status).toBe('conflict');
  });

  it('marks keyboards with missing dimensions as Needs Research', () => {
    const k: KeyboardSpec = {
      id: 'k3',
      brand: 'BrandY',
      model: 'Unknown Model',
      width: null,
      depth: null,
      height: null,
      weight: null,
      layout: 'TKL',
      keys: null
    };

    const status = computeVerificationStatus(k);
    expect(status.status).toBe('missing');
  });
});
