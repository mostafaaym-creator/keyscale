import React from 'react';
import { Sliders, Layers, Columns2, Box, Eye, Ruler, Compass, RefreshCw, Share2, Check } from 'lucide-react';
import { ComparisonViewState, ComparisonViewMode, AlignmentMode, MeasurementUnit, ComparisonSlot } from '@/types/keyboard';
import { letterFor } from '@/lib/palette';
import { scaleReferences } from '@/lib/geometry';
import { useLanguage } from '@/i18n/LanguageContext';

interface ViewSettingsMenuProps {
  view: ComparisonViewState;
  onChangeView: (updater: (prev: ComparisonViewState) => ComparisonViewState) => void;
  slots: ComparisonSlot[];
  onReset: () => void;
  onShare: () => void;
  shareCopied: boolean;
}

export const ViewSettingsMenu: React.FC<ViewSettingsMenuProps> = ({
  view,
  onChangeView,
  slots,
  onReset,
  onShare,
  shareCopied
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => onChangeView(v => ({ ...v, mode: 'overlay' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              view.mode === 'overlay'
                ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('compare.overlay')}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeView(v => ({ ...v, mode: 'side' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              view.mode === 'side'
                ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{t('compare.sideBySide')}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeView(v => ({ ...v, mode: '3d' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              view.mode === '3d'
                ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t('compare.threeD')}</span>
          </button>
        </div>

        {/* Share & Reset actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{shareCopied ? t('actions.copied') : t('actions.share')}</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Reset to default view settings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control sliders & Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 text-xs">
        {/* Alignment (Overlay mode) */}
        {view.mode === 'overlay' && (
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              {t('compare.alignment')}
            </label>
            <select
              value={view.align}
              onChange={e => onChangeView(v => ({ ...v, align: e.target.value as AlignmentMode }))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="center">{t('compare.center')}</option>
              <option value="left">{t('compare.left')}</option>
              <option value="right">{t('compare.right')}</option>
              <option value="top">{t('compare.top')}</option>
              <option value="bottom">{t('compare.bottom')}</option>
              <option value="front">{t('compare.front')}</option>
            </select>
          </div>
        )}

        {/* On Top Layer selector */}
        {view.mode === 'overlay' && (
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              {t('compare.onTop')}
            </label>
            <select
              value={view.topIndex}
              onChange={e => onChangeView(v => ({ ...v, topIndex: Number(e.target.value) }))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {slots.map((s, idx) => (
                <option key={s.key} value={idx}>
                  Slot {letterFor(idx)}: {s.keyboard.model}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Opacity Slider */}
        <div>
          <div className="flex items-center justify-between font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            <span>{t('compare.opacity')}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{view.opacity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={view.opacity}
            onChange={e => onChangeView(v => ({ ...v, opacity: Number(e.target.value) }))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Unit Selector */}
        <div>
          <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            {t('compare.unit')}
          </label>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
            {(['mm', 'cm', 'in'] as MeasurementUnit[]).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => onChangeView(v => ({ ...v, unit: u }))}
                className={`flex-1 py-1 rounded text-center font-mono font-medium transition-colors ${
                  view.unit === u
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-2xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Reference Item */}
        <div>
          <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            {t('compare.referenceScale')}
          </label>
          <select
            value={view.referenceId}
            onChange={e => onChangeView(v => ({ ...v, referenceId: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {scaleReferences.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Checkbox Toggles: Grid & Labels */}
        <div className="flex items-center gap-4 pt-4 sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={view.grid}
              onChange={e => onChangeView(v => ({ ...v, grid: e.target.checked }))}
              className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t('compare.grid')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={view.labels}
              onChange={e => onChangeView(v => ({ ...v, labels: e.target.checked }))}
              className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t('compare.labels')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
