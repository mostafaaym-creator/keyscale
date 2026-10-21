import { describe, it, expect } from 'vitest';
import { matchesQuery, filterKeyboards, sortKeyboards, INITIAL_FILTERS } from '../src/lib/search';
import { KeyboardSpec } from '../src/types/keyboard';

describe('Search & Filtering Engine', () => {
  const sampleKeyboards: KeyboardSpec[] = [
    {
      id: 'apex-pro-tkl-2023',
      brand: 'SteelSeries',
      model: 'Apex Pro TKL (2023)',
      width: 355,
      depth: 128,
      height: 42,
      weight: 960,
      layout: 'TKL',
      keys: null,
      technology: 'Magnetic / Hall effect',
      wired: true,
      wireless24: false,
      review: false,
      aliases: ['Apex Pro Tenkeyless', 'Steel Series Apex Pro TKL (2023)']
    },
    {
      id: 'wooting-60he-plus',
      brand: 'Wooting',
      model: '60HE+',
      width: 302,
      depth: 115,
      height: 38,
      weight: 605,
      layout: '60%',
      keys: 61,
      technology: 'Magnetic / Hall effect',
      wired: true,
      wireless24: false,
      review: false,
      aliases: ['Wooting 60HE Plus']
    },
    {
      id: 'razer-blackwidow-v4-pro',
      brand: 'Razer',
      model: 'BlackWidow V4 Pro',
      width: 466,
      depth: 153,
      height: 44,
      weight: 1130,
      layout: '100%',
      keys: 104,
      technology: 'Mechanical',
      wired: true,
      wireless24: false,
      review: false,
      aliases: []
    }
  ];

  it('matches fuzzy and normalized search terms', () => {
    expect(matchesQuery(sampleKeyboards[0], 'apex pro')).toBe(true);
    expect(matchesQuery(sampleKeyboards[0], 'steelseries tenkeyless')).toBe(true);
    expect(matchesQuery(sampleKeyboards[1], '60he')).toBe(true);
    expect(matchesQuery(sampleKeyboards[2], 'wooting')).toBe(false);
  });

  it('filters by brand accurately', () => {
    const res = filterKeyboards(sampleKeyboards, { ...INITIAL_FILTERS, brand: 'SteelSeries' });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('apex-pro-tkl-2023');
  });

  it('filters by layout correctly', () => {
    const res = filterKeyboards(sampleKeyboards, { ...INITIAL_FILTERS, layout: '60%' });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('wooting-60he-plus');
  });

  it('sorts by width and weight properly', () => {
    const sortedWidthAsc = sortKeyboards(sampleKeyboards, 'width', 'asc');
    expect(sortedWidthAsc[0].width).toBe(302); // 60HE
    expect(sortedWidthAsc[2].width).toBe(466); // BlackWidow V4 Pro

    const sortedWeightDesc = sortKeyboards(sampleKeyboards, 'weight', 'desc');
    expect(sortedWeightDesc[0].weight).toBe(1130);
  });
});
