import React from 'react';
import { Check, X, ShieldCheck, AlertCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ComparisonSlot, MeasurementUnit, KeyboardSpec } from '@/types/keyboard';
import { formatDimension, formatWeight, deskFootprint, footprintCm2, percentChange, fromMillimeters } from '@/lib/geometry';
import { letterFor, getSlotColor } from '@/lib/palette';
import { computeVerificationStatus } from '@/lib/provenance';
import { formatPrice } from '@/lib/currency';
import { useCatalog } from '@/context/CatalogContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface SpecMatrixProps {
  slots: ComparisonSlot[];
  unit: MeasurementUnit;
  referenceIndex: number;
  onSetReference: (index: number) => void;
}

export const SpecMatrix: React.FC<SpecMatrixProps> = ({
  slots,
  unit,
  referenceIndex,
  onSetReference
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { getPricesForKeyboard } = useCatalog();

  const refSlot = slots[referenceIndex] || slots[0];
  const refK = refSlot?.keyboard;

  const refFp = refK ? deskFootprint(refK) : null;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs overflow-hidden">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Specification & Difference Matrix
          </h3>
          <p className="text-xs text-zinc-500">
            Calculated physical dimensional deltas relative to your selected reference keyboard.
          </p>
        </div>

        {/* Reference Keyboard Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-zinc-500">Reference:</span>
          <select
            value={referenceIndex}
            onChange={e => onSetReference(Number(e.target.value))}
            className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {slots.map((s, idx) => (
              <option key={s.key} value={idx}>
                Slot {letterFor(idx)}: {s.keyboard.brand} {s.keyboard.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difference Highlights Banner */}
      {slots.length >= 2 && refK && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60">
          {slots.map((s, idx) => {
            if (idx === referenceIndex) return null;
            const k = s.keyboard;
            const kFp = deskFootprint(k);
            const fpChange = refFp && kFp ? percentChange(refFp, kFp) : null;
            const wDiff = refK.width && k.width ? k.width - refK.width : null;
            const dDiff = refK.depth && k.depth ? k.depth - refK.depth : null;

            return (
              <div key={s.key} className="flex flex-col gap-1 p-2">
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: getSlotColor(idx, isDark) }}>
                  <span>{letterFor(idx)} vs {letterFor(referenceIndex)} ({refK.model})</span>
                </div>
                <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {fpChange === null ? '—' : `${fpChange > 0 ? '+' : ''}${fpChange.toFixed(1)}%`}
                  <span className="text-xs font-sans font-normal text-zinc-500 ms-1.5">
                    {fpChange === null
                      ? 'needs dimensions'
                      : fpChange === 0
                      ? t('compare.sameDeskSpace')
                      : fpChange > 0
                      ? t('compare.moreDeskSpace')
                      : t('compare.lessDeskSpace')}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  Width: {wDiff !== null ? `${wDiff > 0 ? '+' : ''}${fromMillimeters(wDiff, unit).toFixed(1)} ${unit}` : '—'} · Depth: {dDiff !== null ? `${dDiff > 0 ? '+' : ''}${fromMillimeters(dDiff, unit).toFixed(1)} ${unit}` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold min-w-[140px]">Specification</th>
              {slots.map((s, idx) => {
                const color = getSlotColor(idx, isDark);
                const isRef = idx === referenceIndex;
                return (
                  <th key={s.key} className="py-3 px-4 min-w-[190px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {letterFor(idx)}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {s.keyboard.model}
                      </span>
                      {isRef && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                          Ref
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70 text-xs">
            {/* Dimensions: Width */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.width')}</td>
              {slots.map((s, idx) => {
                const w = s.keyboard.width;
                const isRef = idx === referenceIndex;
                const delta = refK?.width && w ? w - refK.width : null;
                return (
                  <td key={s.key} className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    <div>{formatDimension(w, unit)}</div>
                    {!isRef && delta !== null && (
                      <div className={`text-[11px] font-sans ${delta === 0 ? 'text-zinc-400' : delta > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {delta > 0 ? '+' : ''}{fromMillimeters(delta, unit).toFixed(1)} {unit} ({delta > 0 ? t('compare.wider') : t('compare.narrower')})
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Dimensions: Depth */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.depth')}</td>
              {slots.map((s, idx) => {
                const d = s.keyboard.depth;
                const isRef = idx === referenceIndex;
                const delta = refK?.depth && d ? d - refK.depth : null;
                return (
                  <td key={s.key} className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    <div>{formatDimension(d, unit)}</div>
                    {!isRef && delta !== null && (
                      <div className={`text-[11px] font-sans ${delta === 0 ? 'text-zinc-400' : delta > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {delta > 0 ? '+' : ''}{fromMillimeters(delta, unit).toFixed(1)} {unit} ({delta > 0 ? t('compare.deeper') : t('compare.shallower')})
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Dimensions: Height */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.height')}</td>
              {slots.map((s, idx) => {
                const h = s.keyboard.height;
                const isRef = idx === referenceIndex;
                const delta = refK?.height && h ? h - refK.height : null;
                return (
                  <td key={s.key} className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    <div>{formatDimension(h, unit)}</div>
                    {!isRef && delta !== null && (
                      <div className="text-[11px] font-sans text-zinc-400">
                        {delta > 0 ? '+' : ''}{fromMillimeters(delta, unit).toFixed(1)} {unit}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Weight */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.weight')}</td>
              {slots.map((s, idx) => {
                const wt = s.keyboard.weight;
                const isRef = idx === referenceIndex;
                const delta = refK?.weight && wt ? wt - refK.weight : null;
                return (
                  <td key={s.key} className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    <div>{formatWeight(wt)}</div>
                    {!isRef && delta !== null && (
                      <div className={`text-[11px] font-sans ${delta > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {delta > 0 ? '+' : ''}{Math.round(delta)} g ({delta > 0 ? t('compare.heavier') : t('compare.lighter')})
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Desk Footprint Area */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.deskFootprint')}</td>
              {slots.map((s, idx) => {
                const cm2 = footprintCm2(s.keyboard);
                return (
                  <td key={s.key} className="py-3 px-4 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {cm2 ? `${cm2.toLocaleString()} cm²` : '—'}
                  </td>
                );
              })}
            </tr>

            {/* Layout Form Factor */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.layout')}</td>
              {slots.map(s => (
                <td key={s.key} className="py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-semibold">
                    {s.keyboard.layout || 'Unknown'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Switch Technology */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.technology')}</td>
              {slots.map(s => (
                <td key={s.key} className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                  {s.keyboard.technology || 'Mechanical'}
                </td>
              ))}
            </tr>

            {/* Connectivity */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.connectivity')}</td>
              {slots.map(s => (
                <td key={s.key} className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    {s.keyboard.wired && <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px]">Wired</span>}
                    {s.keyboard.wireless24 && <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded text-[10px]">2.4G</span>}
                    {s.keyboard.bluetooth && <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded text-[10px]">BT</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* Verified Evidence Tier */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.evidence')}</td>
              {slots.map(s => {
                const status = computeVerificationStatus(s.keyboard);
                return (
                  <td key={s.key} className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeClass}`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{status.label}</span>
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Retail Prices */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3 px-4 font-medium text-zinc-500">{t('specs.pricing')}</td>
              {slots.map(s => {
                const offers = getPricesForKeyboard(s.keyboard.id);
                const lowest = offers.length ? offers[0] : null;

                return (
                  <td key={s.key} className="py-3 px-4">
                    {lowest ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                          {formatPrice(lowest.amount, lowest.currency)}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {lowest.seller} · {lowest.market}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-400 text-xs italic">No current offer</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
