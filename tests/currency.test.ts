import { describe, it, expect } from 'vitest';
import { formatPrice, convertToUsd, convertFromUsd, isPriceStale } from '../src/lib/currency';

describe('Pricing & Currency Engine', () => {
  it('formats USD prices properly', () => {
    expect(formatPrice(189.99, 'USD')).toBe('$189.99');
    expect(formatPrice(100, 'USD')).toBe('$100.00');
  });

  it('formats regional currencies properly', () => {
    expect(formatPrice(999, 'SAR')).toContain('ر.س');
    expect(formatPrice(11834, 'EGP')).toContain('EGP');
  });

  it('converts regional amounts to USD accurately', () => {
    const sarToUsd = convertToUsd(375.1, 'SAR');
    expect(sarToUsd).toBeCloseTo(100, 0);

    const usdToEur = convertFromUsd(100, 'EUR');
    expect(usdToEur).toBeCloseTo(92.4, 0);
  });

  it('detects stale prices correctly', () => {
    expect(isPriceStale('2026-01-01', 30)).toBe(true);
    // Recent date
    const today = new Date().toISOString().split('T')[0];
    expect(isPriceStale(today, 30)).toBe(false);
  });
});
