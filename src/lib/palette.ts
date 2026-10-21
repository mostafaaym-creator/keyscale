export const MAX_KEYBOARDS = 6;

export const SLOT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function letterFor(index: number): string {
  return SLOT_LETTERS[index % SLOT_LETTERS.length] || String(index + 1);
}

export interface SlotPalette {
  name: string;
  light: string;
  dark: string;
  bgLight: string;
  bgDark: string;
}

export const PALETTES: SlotPalette[] = [
  {
    name: 'Teal Green',
    light: '#127c68',
    dark: '#56d9b8',
    bgLight: 'rgba(18, 124, 104, 0.12)',
    bgDark: 'rgba(86, 217, 184, 0.15)'
  },
  {
    name: 'Purple Indigo',
    light: '#6a66c9',
    dark: '#b0a3ff',
    bgLight: 'rgba(106, 102, 201, 0.12)',
    bgDark: 'rgba(176, 163, 255, 0.15)'
  },
  {
    name: 'Amber Orange',
    light: '#d97706',
    dark: '#fbbf24',
    bgLight: 'rgba(217, 119, 6, 0.12)',
    bgDark: 'rgba(251, 191, 36, 0.15)'
  },
  {
    name: 'Cobalt Blue',
    light: '#2563eb',
    dark: '#60a5fa',
    bgLight: 'rgba(37, 99, 235, 0.12)',
    bgDark: 'rgba(96, 165, 250, 0.15)'
  },
  {
    name: 'Rose Pink',
    light: '#e11d48',
    dark: '#fb7185',
    bgLight: 'rgba(225, 29, 72, 0.12)',
    bgDark: 'rgba(251, 113, 133, 0.15)'
  },
  {
    name: 'Cyan Teal',
    light: '#0d9488',
    dark: '#2dd4bf',
    bgLight: 'rgba(13, 148, 136, 0.12)',
    bgDark: 'rgba(45, 212, 191, 0.15)'
  }
];

export function getSlotColor(index: number, isDark = false): string {
  const p = PALETTES[index % PALETTES.length];
  return isDark ? p.dark : p.light;
}

export function getSlotBg(index: number, isDark = false): string {
  const p = PALETTES[index % PALETTES.length];
  return isDark ? p.bgDark : p.bgLight;
}
