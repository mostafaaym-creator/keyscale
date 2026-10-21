import { ComparisonViewState, ComparisonViewMode, AlignmentMode, MeasurementUnit, ComparisonSlot, KeyboardSpec } from '@/types/keyboard';

export const DEFAULT_VIEW_STATE: ComparisonViewState = {
  mode: 'overlay',
  align: 'center',
  topIndex: 0,
  opacity: 85,
  grid: true,
  labels: true,
  names: true,
  unit: 'mm',
  referenceId: 'none',
  referenceIndex: 0,
  desk: false,
  deskWidth: 1200,
  deskDepth: 600
};

export interface SerializedSlot {
  id: string;
  visible: boolean;
  customName?: string;
  customWidth?: number;
  customDepth?: number;
  customHeight?: number;
}

export function serializeComparisonToUrl(
  slots: ComparisonSlot[],
  view: ComparisonViewState
): string {
  const params = new URLSearchParams();

  // 1. Keyboards string
  const kParam = slots
    .map(s => {
      let str = s.keyboard.id;
      if (s.keyboard.id.startsWith('custom')) {
        const name = encodeURIComponent(s.keyboard.model);
        const w = s.keyboard.width || 0;
        const d = s.keyboard.depth || 0;
        const h = s.keyboard.height || 0;
        str = `custom:${name}:${w}:${d}:${h}`;
      }
      if (!s.visible) {
        str += ':hidden';
      }
      return str;
    })
    .join(',');

  if (kParam) params.set('k', kParam);

  if (view.mode !== DEFAULT_VIEW_STATE.mode) params.set('view', view.mode);
  if (view.align !== DEFAULT_VIEW_STATE.align) params.set('align', view.align);
  if (view.opacity !== DEFAULT_VIEW_STATE.opacity) params.set('opacity', String(view.opacity));
  if (view.unit !== DEFAULT_VIEW_STATE.unit) params.set('unit', view.unit);
  if (view.topIndex !== 0) params.set('top', String(view.topIndex));
  if (view.referenceIndex !== 0) params.set('ref', String(view.referenceIndex));
  if (!view.grid) params.set('grid', '0');
  if (!view.labels) params.set('labels', '0');
  if (view.desk) {
    params.set('desk', '1');
    params.set('deskW', String(view.deskWidth));
    params.set('deskD', String(view.deskDepth));
  }

  return params.toString();
}

export function parseComparisonFromUrl(
  search: string,
  catalog: KeyboardSpec[]
): { slots: ComparisonSlot[]; view: ComparisonViewState } {
  const params = new URLSearchParams(search);
  const view: ComparisonViewState = { ...DEFAULT_VIEW_STATE };

  // Parse view settings
  const mode = params.get('view') as ComparisonViewMode;
  if (mode === 'overlay' || mode === 'side' || mode === '3d') view.mode = mode;

  const align = params.get('align') as AlignmentMode;
  if (['center', 'left', 'right', 'top', 'bottom', 'front'].includes(align)) view.align = align;

  const opacity = parseInt(params.get('opacity') || '', 10);
  if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 100) view.opacity = opacity;

  const unit = params.get('unit') as MeasurementUnit;
  if (unit === 'mm' || unit === 'cm' || unit === 'in') view.unit = unit;

  const top = parseInt(params.get('top') || '', 10);
  if (!Number.isNaN(top) && top >= 0) view.topIndex = top;

  const ref = parseInt(params.get('ref') || '', 10);
  if (!Number.isNaN(ref) && ref >= 0) view.referenceIndex = ref;

  if (params.get('grid') === '0') view.grid = false;
  if (params.get('labels') === '0') view.labels = false;
  if (params.get('desk') === '1') {
    view.desk = true;
    const dw = parseInt(params.get('deskW') || '', 10);
    const dd = parseInt(params.get('deskD') || '', 10);
    if (!Number.isNaN(dw) && dw > 0) view.deskWidth = dw;
    if (!Number.isNaN(dd) && dd > 0) view.deskDepth = dd;
  }

  // Parse keyboards
  const kParam = params.get('k');
  const slots: ComparisonSlot[] = [];

  if (kParam) {
    const tokens = kParam.split(',').filter(Boolean);
    for (const token of tokens) {
      const parts = token.split(':');
      const isHidden = parts.includes('hidden');

      if (parts[0] === 'custom' && parts.length >= 5) {
        const name = decodeURIComponent(parts[1]);
        const w = parseFloat(parts[2]);
        const d = parseFloat(parts[3]);
        const h = parseFloat(parts[4]);
        slots.push({
          key: `custom-${slots.length}`,
          keyboard: {
            id: `custom-${slots.length}`,
            brand: 'Custom',
            model: name || 'Custom Keyboard',
            width: w || 300,
            depth: d || 120,
            height: h || 35,
            weight: null,
            layout: 'Custom',
            keys: null,
            note: 'User-provided custom dimensions'
          },
          visible: !isHidden
        });
      } else {
        const id = parts[0];
        const match = catalog.find(k => k.id === id);
        if (match) {
          slots.push({
            key: match.id,
            keyboard: match,
            visible: !isHidden
          });
        }
      }
    }
  }

  // If no keyboards found, default to first two available models
  if (slots.length === 0) {
    const defaultIds = ['apex-pro-tkl-2023', 'wooting-60he-plus'];
    for (const id of defaultIds) {
      const match = catalog.find(k => k.id === id);
      if (match) {
        slots.push({ key: match.id, keyboard: match, visible: true });
      }
    }
    // Fallback if specific IDs don't exist
    if (slots.length === 0 && catalog.length >= 2) {
      slots.push({ key: catalog[0].id, keyboard: catalog[0], visible: true });
      slots.push({ key: catalog[1].id, keyboard: catalog[1], visible: true });
    }
  }

  return { slots, view };
}
