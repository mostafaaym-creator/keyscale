import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check, ShieldCheck, Ruler, Plus } from 'lucide-react';
import { KeyboardSpec } from '@/types/keyboard';
import { formatDimension } from '@/lib/geometry';
import { matchesQuery } from '@/lib/search';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface KeyboardPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (keyboard: KeyboardSpec) => void;
  selectedIds: string[];
}

export const KeyboardPicker: React.FC<KeyboardPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedIds
}) => {
  const { catalog, brands, layouts } = useCatalog();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedLayout, setSelectedLayout] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    return catalog.filter(k => {
      if (selectedBrand !== 'all' && k.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      if (selectedLayout !== 'all' && !(k.layout || '').toLowerCase().includes(selectedLayout.toLowerCase())) return false;
      if (query && !matchesQuery(k, query)) return false;
      return true;
    });
  }, [catalog, query, selectedBrand, selectedLayout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Select a keyboard to compare"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Select Keyboard
            </h3>
            <p className="text-xs text-zinc-500">
              Browse 620+ verified computer keyboards across 40+ brands
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close keyboard picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by brand, model, family, or layout (e.g. Apex Pro, Ornata, TKL)..."
              className="w-full ps-9 pe-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            {/* Brand Dropdown */}
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Layout Dropdown */}
            <select
              value={selectedLayout}
              onChange={e => setSelectedLayout(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Layouts</option>
              <option value="100%">100% Full-size</option>
              <option value="TKL">TKL / Tenkeyless</option>
              <option value="75%">75% Compact</option>
              <option value="65%">65%</option>
              <option value="60%">60%</option>
            </select>

            <span className="ms-auto text-[11px] text-zinc-400 shrink-0">
              {filtered.length} models found
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No matching keyboards found for "{query}". Try adjusting your filters.
            </div>
          ) : (
            filtered.slice(0, 50).map(k => {
              const isSelected = selectedIds.includes(k.id);

              return (
                <div
                  key={k.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <div className="flex flex-col min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        {k.brand}
                      </span>
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono font-medium">
                        {k.layout || 'Custom'}
                      </span>
                      {k.technology && (
                        <span className="text-[10px] text-zinc-400 hidden sm:inline">
                          · {k.technology}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {k.model}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {k.width ? `${k.width} × ${k.depth} × ${k.height || '—'} mm` : 'Measurements pending research'}
                      {k.weight ? ` · ${k.weight} g` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isSelected}
                    onClick={() => {
                      onSelect(k);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
