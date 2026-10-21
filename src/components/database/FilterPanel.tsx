import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FilterOptions, SortField, SortOrder, INITIAL_FILTERS } from '@/lib/search';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface FilterPanelProps {
  filters: FilterOptions;
  onChangeFilters: (updater: (prev: FilterOptions) => FilterOptions) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangeFilters,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  resultCount
}) => {
  const { brands, layouts } = useCatalog();
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filters.query}
            onChange={e => onChangeFilters(f => ({ ...f, query: e.target.value }))}
            placeholder="Search 620+ keyboards by brand, model, family, or SKU (e.g. Apex Pro, Ornata, Wooting, TKL)..."
            className="w-full ps-10 pe-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-500 shrink-0">Sort By:</span>
          <select
            value={sortField}
            onChange={e => onSortFieldChange(e.target.value as SortField)}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="name">Model Name</option>
            <option value="brand">Brand</option>
            <option value="width">Width (mm)</option>
            <option value="depth">Depth (mm)</option>
            <option value="weight">Weight (g)</option>
            <option value="verified">Recently Verified</option>
          </select>

          <button
            type="button"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
        {/* Brand */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1">Brand</label>
          <select
            value={filters.brand}
            onChange={e => onChangeFilters(f => ({ ...f, brand: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-800 dark:text-zinc-200"
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Layout */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1">Layout</label>
          <select
            value={filters.layout}
            onChange={e => onChangeFilters(f => ({ ...f, layout: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-800 dark:text-zinc-200"
          >
            <option value="all">All Layouts</option>
            <option value="100%">100% Full-size</option>
            <option value="TKL">TKL / Tenkeyless</option>
            <option value="75%">75% Compact</option>
            <option value="65%">65%</option>
            <option value="60%">60%</option>
          </select>
        </div>

        {/* Technology */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1">Switch Tech</label>
          <select
            value={filters.technology}
            onChange={e => onChangeFilters(f => ({ ...f, technology: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-800 dark:text-zinc-200"
          >
            <option value="all">All Technologies</option>
            <option value="magnetic">Magnetic / Hall effect</option>
            <option value="mechanical">Mechanical</option>
            <option value="optical">Optical</option>
            <option value="membrane">Membrane</option>
          </select>
        </div>

        {/* Connectivity */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1">Connectivity</label>
          <select
            value={filters.connectivity}
            onChange={e => onChangeFilters(f => ({ ...f, connectivity: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-800 dark:text-zinc-200"
          >
            <option value="all">Any Connection</option>
            <option value="wired">Wired Only</option>
            <option value="wireless">Wireless (2.4G/BT)</option>
            <option value="2.4ghz">2.4 GHz Wireless</option>
            <option value="bluetooth">Bluetooth</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-zinc-500 font-medium mb-1">Evidence Status</label>
          <select
            value={filters.verification}
            onChange={e => onChangeFilters(f => ({ ...f, verification: e.target.value }))}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-800 dark:text-zinc-200"
          >
            <option value="all">All States</option>
            <option value="verified">Verified Dimensions</option>
            <option value="review">Conflicting / Review</option>
            <option value="partial">Partially Verified</option>
          </select>
        </div>

        {/* Has Price Toggle */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer py-1.5 select-none">
            <input
              type="checkbox"
              checked={filters.hasPriceOnly}
              onChange={e => onChangeFilters(f => ({ ...f, hasPriceOnly: e.target.checked }))}
              className="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs">
              Has Price Offer
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <span>Displaying {resultCount} matching keyboard models</span>
      </div>
    </div>
  );
};
