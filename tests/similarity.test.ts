import { describe, it, expect } from 'vitest';
import { calculateSimilarity, findSimilarKeyboards } from '../src/lib/similarity';
import { KeyboardSpec } from '../src/types/keyboard';

describe('Find Similar Algorithm', () => {
  const keyboardA: KeyboardSpec = {
    id: 'kb-a',
    brand: 'Wooting',
    model: '60HE+',
    width: 302,
    depth: 115,
    height: 38,
    weight: 605,
    layout: '60%',
    keys: 61,
    technology: 'Magnetic / Hall effect'
  };

  const keyboardSimilar: KeyboardSpec = {
    id: 'kb-sim',
    brand: 'Razer',
    model: 'Huntsman Mini',
    width: 293,
    depth: 103,
    height: 37,
    weight: 523,
    layout: '60%',
    keys: 61,
    technology: 'Optical'
  };

  const keyboardFullSize: KeyboardSpec = {
    id: 'kb-full',
    brand: 'Corsair',
    model: 'K100 RGB',
    width: 470,
    depth: 166,
    height: 43,
    weight: 1310,
    layout: '100%',
    keys: 110,
    technology: 'Mechanical'
  };

  it('calculates a high similarity score for dimensionally close keyboards in the same form factor', () => {
    const res = calculateSimilarity(keyboardA, keyboardSimilar);
    expect(res).not.toBeNull();
    expect(res!.score).toBeGreaterThanOrEqual(70);
    expect(res!.reasons.length).toBeGreaterThan(0);
  });

  it('severely penalizes unrelated full-size keyboards when compared to a 60% compact keyboard', () => {
    const res = calculateSimilarity(keyboardA, keyboardFullSize);
    expect(res).not.toBeNull();
    expect(res!.score).toBeLessThan(45);
  });

  it('ranks similar keyboards in descending order of physical match', () => {
    const list = [keyboardSimilar, keyboardFullSize];
    const results = findSimilarKeyboards(keyboardA, list, 5);
    expect(results.length).toBe(1); // keyboardFullSize is filtered out by >= 40 threshold
    expect(results[0].keyboard.id).toBe('kb-sim');
  });

  it('returns null when comparing a keyboard to itself', () => {
    expect(calculateSimilarity(keyboardA, keyboardA)).toBeNull();
  });
});
