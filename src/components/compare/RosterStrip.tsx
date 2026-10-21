import React from 'react';
import { Eye, EyeOff, X, ArrowLeft, ArrowRight, Plus, Layers, Sparkles } from 'lucide-react';
import { ComparisonSlot, MeasurementUnit } from '@/types/keyboard';
import { letterFor, getSlotColor, MAX_KEYBOARDS } from '@/lib/palette';
import { formatDimension } from '@/lib/geometry';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface RosterStripProps {
  slots: ComparisonSlot[];
  topIndex: number;
  onSetTop: (index: number) => void;
  onToggleVisible: (index: number) => void;
  onRemoveSlot: (index: number) => void;
  onMoveSlot: (index: number, direction: -1 | 1) => void;
  onOpenPicker: () => void;
  onOpenCustom: () => void;
  unit: MeasurementUnit;
}

export const RosterStrip: React.FC<RosterStripProps> = ({
  slots,
  topIndex,
  onSetTop,
  onToggleVisible,
  onRemoveSlot,
  onMoveSlot,
  onOpenPicker,
  onOpenCustom,
  unit
}) => {
  const { isDark } = useTheme();
  const { t, dir } = useLanguage();

  return (
    <div className="w-full flex flex-wrap gap-2.5 items-stretch py-2">
      {slots.map((slot, idx) => {
        const color = getSlotColor(idx, isDark);
        const k = slot.keyboard;
        const isTop = topIndex === idx;

        return (
          <div
            key={slot.key}
            className={`flex-1 min-w-[210px] max-w-[280px] p-3 rounded-xl border transition-all duration-200 relative flex flex-col justify-between ${
              slot.visible
                ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
                : 'bg-zinc-100/70 dark:bg-zinc-900/40 border-dashed border-zinc-300 dark:border-zinc-800 opacity-60'
            }`}
            style={{ borderInlineStartWidth: '4px', borderInlineStartColor: color }}
          >
            {/* Top row: Badge, Name, Close */}
            <div className="flex items-start justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                  style={{ backgroundColor: color }}
                >
                  {letterFor(idx)}
                </span>
                <div className="truncate">
                  <span className="text-[11px] font-semibold text-zinc-400 block uppercase tracking-wider">
                    {k.brand}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate" title={k.model}>
                    {k.model}
                  </h4>
                </div>
              </div>

              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSlot(idx)}
                  className="p-1 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                  title="Remove from comparison"
                  aria-label={`Remove ${k.model}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dimensions Pill */}
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 px-2 py-1 rounded-md mb-3 flex items-center justify-between">
              <span>
                {k.width ? formatDimension(k.width, unit) : '—'} × {k.depth ? formatDimension(k.depth, unit) : '—'}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-sans font-semibold">
                {k.layout || 'Custom'}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
              {/* Visibility Toggle */}
              <button
                type="button"
                onClick={() => onToggleVisible(idx)}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${
                  slot.visible
                    ? 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                title={slot.visible ? 'Hide from canvas' : 'Show on canvas'}
              >
                {slot.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-400" />}
                <span className="text-[11px]">{slot.visible ? 'Visible' : 'Hidden'}</span>
              </button>

              {/* Set On Top */}
              <button
                type="button"
                onClick={() => onSetTop(idx)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  isTop
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Bring this keyboard to top layer"
              >
                {isTop ? 'On Top' : 'Layer'}
              </button>

              {/* Move slot position */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => onMoveSlot(idx, -1)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 transition-opacity"
                  title="Move left"
                >
                  <ArrowLeft className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
                <button
                  type="button"
                  disabled={idx === slots.length - 1}
                  onClick={() => onMoveSlot(idx, 1)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 transition-opacity"
                  title="Move right"
                >
                  <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Keyboard Slot Button */}
      {slots.length < MAX_KEYBOARDS && (
        <div className="flex-1 min-w-[180px] max-w-[240px] flex flex-col gap-2 justify-center p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-zinc-50/50 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={onOpenPicker}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Keyboard ({slots.length}/{MAX_KEYBOARDS})</span>
          </button>
          <button
            type="button"
            onClick={onOpenCustom}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Custom Dimensions</span>
          </button>
        </div>
      )}
    </div>
  );
};
