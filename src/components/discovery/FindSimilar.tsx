import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Sliders, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { KeyboardSpec } from '@/types/keyboard';
import { findSimilarKeyboards, SimilarityWeights, DEFAULT_WEIGHTS } from '@/lib/similarity';
import { formatDimension, fromMillimeters } from '@/lib/geometry';
import { formatPrice } from '@/lib/currency';
import { computeVerificationStatus } from '@/lib/provenance';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const FindSimilar: React.FC<{ initialKeyboardId?: string }> = ({ initialKeyboardId }) => {
  const { catalog, getPricesForKeyboard } = useCatalog();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialKeyboardId || 'wooting-60he-plus';
  });

  const [weights, setWeights] = useState<SimilarityWeights>(DEFAULT_WEIGHTS);
  const [showConfig, setShowConfig] = useState(false);

  const targetKeyboard = useMemo(
    () => catalog.find(k => k.id === selectedId) || catalog[0],
    [catalog, selectedId]
  );

  const results = useMemo(() => {
    if (!targetKeyboard) return [];
    return findSimilarKeyboards(targetKeyboard, catalog, 10, weights);
  }, [targetKeyboard, catalog, weights]);

  return (
    <div className="w-full space-y-6">
      {/* Target Selector Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Dimensional Recommendation Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Find Similar Keyboards
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Discover alternatives with matching physical width, depth, desk footprint, and ergonomic layout.
            </p>
          </div>

          {/* Reference Selector */}
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Select Reference Model
            </label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full md:w-72 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              {catalog.slice(0, 150).map(k => (
                <option key={k.id} value={k.id}>
                  {k.brand} {k.model} ({k.layout || 'Custom'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Target Specs Preview */}
        {targetKeyboard && (
          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-zinc-900 dark:text-white">
              Target Baseline:
            </span>
            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300">
              {targetKeyboard.width} × {targetKeyboard.depth} × {targetKeyboard.height || '—'} mm
            </span>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-1 rounded-md">
              {targetKeyboard.layout}
            </span>
            {targetKeyboard.technology && (
              <span className="text-zinc-500">
                Switch: <strong className="text-zinc-700 dark:text-zinc-300">{targetKeyboard.technology}</strong>
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowConfig(c => !c)}
              className="ms-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showConfig ? 'Hide Weight Tuning' : 'Tune Weights'}</span>
            </button>
          </div>
        )}

        {/* Weight Adjuster Slider Drawer */}
        {showConfig && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Dimensions Weight</span>
                <span>{Math.round(weights.dimensions * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={weights.dimensions}
                onChange={e => setWeights(w => ({ ...w, dimensions: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Layout Match</span>
                <span>{Math.round(weights.layout * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={weights.layout}
                onChange={e => setWeights(w => ({ ...w, layout: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Weight (grams)</span>
                <span>{Math.round(weights.weight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.05"
                value={weights.weight}
                onChange={e => setWeights(w => ({ ...w, weight: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Switch Technology</span>
                <span>{Math.round(weights.technology * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.05"
                value={weights.technology}
                onChange={e => setWeights(w => ({ ...w, technology: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((res, rank) => {
          const k = res.keyboard;
          const status = computeVerificationStatus(k);
          const offers = getPricesForKeyboard(k.id);
          const lowest = offers.length ? offers[0] : null;

          return (
            <div
              key={k.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Brand, Model, Match Score */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {k.brand}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {k.model}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full font-mono">
                      {res.score}% Match
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Rank #{rank + 1}</span>
                  </div>
                </div>

                {/* Dimensions Comparison */}
                <div className="flex flex-wrap items-center gap-3 my-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl">
                  <div>
                    <span className="text-zinc-400 text-[10px] block">WIDTH</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{k.width} mm</span>
                    <span className={`text-[10px] ms-1 ${res.widthDiff !== null && res.widthDiff > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {res.widthDiff !== null ? `(${res.widthDiff > 0 ? '+' : ''}${res.widthDiff.toFixed(1)})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] block">DEPTH</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{k.depth} mm</span>
                    <span className={`text-[10px] ms-1 ${res.depthDiff !== null && res.depthDiff > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {res.depthDiff !== null ? `(${res.depthDiff > 0 ? '+' : ''}${res.depthDiff.toFixed(1)})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] block">LAYOUT</span>
                    <span className="font-sans font-semibold text-zinc-700 dark:text-zinc-300">
                      {k.layout || 'Custom'}
                    </span>
                  </div>
                </div>

                {/* Explainable similarity points */}
                <div className="space-y-1 mb-4">
                  {res.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                {lowest ? (
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatPrice(lowest.amount, lowest.currency)}
                    </span>
                    <span className="text-[10px] text-zinc-400">{lowest.seller}</span>
                  </div>
                ) : (
                  <span className="text-zinc-400 italic text-[11px]">Price unlisted</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/keyboards/${k.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/compare?k=${targetKeyboard.id},${k.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
