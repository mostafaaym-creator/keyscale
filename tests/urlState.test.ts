import { describe, it, expect } from 'vitest';
import { serializeComparisonToUrl, parseComparisonFromUrl, DEFAULT_VIEW_STATE } from '../src/lib/urlState';
import { KeyboardSpec, ComparisonSlot } from '../src/types/keyboard';

describe('URL State Serialization & Deserialization', () => {
  const catalog: KeyboardSpec[] = [
    {
      id: 'apex-pro-tkl-2023',
      brand: 'SteelSeries',
      model: 'Apex Pro TKL (2023)',
      width: 355,
      depth: 128,
      height: 42,
      weight: 960,
      layout: 'TKL',
      keys: null
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
      keys: 61
    }
  ];

  it('serializes comparison slots and view state into a clean query string', () => {
    const slots: ComparisonSlot[] = [
      { key: 'apex-pro-tkl-2023', keyboard: catalog[0], visible: true },
      { key: 'wooting-60he-plus', keyboard: catalog[1], visible: false }
    ];

    const view = { ...DEFAULT_VIEW_STATE, mode: 'side' as const, align: 'left' as const, opacity: 75 };
    const query = serializeComparisonToUrl(slots, view);

    expect(query).toContain('k=apex-pro-tkl-2023%2Cwooting-60he-plus%3Ahidden');
    expect(query).toContain('view=side');
    expect(query).toContain('align=left');
    expect(query).toContain('opacity=75');
  });

  it('restores slots and view settings accurately from a query string', () => {
    const search = '?k=apex-pro-tkl-2023,wooting-60he-plus:hidden&view=side&align=left&opacity=75';
    const parsed = parseComparisonFromUrl(search, catalog);

    expect(parsed.slots.length).toBe(2);
    expect(parsed.slots[0].keyboard.id).toBe('apex-pro-tkl-2023');
    expect(parsed.slots[0].visible).toBe(true);
    expect(parsed.slots[1].keyboard.id).toBe('wooting-60he-plus');
    expect(parsed.slots[1].visible).toBe(false);

    expect(parsed.view.mode).toBe('side');
    expect(parsed.view.align).toBe('left');
    expect(parsed.view.opacity).toBe(75);
  });

  it('handles custom keyboard specifications serialized in URL', () => {
    const search = '?k=custom:Neo75:318:134:36';
    const parsed = parseComparisonFromUrl(search, catalog);

    expect(parsed.slots.length).toBe(1);
    expect(parsed.slots[0].keyboard.model).toBe('Neo75');
    expect(parsed.slots[0].keyboard.width).toBe(318);
    expect(parsed.slots[0].keyboard.depth).toBe(134);
    expect(parsed.slots[0].keyboard.height).toBe(36);
  });
});
