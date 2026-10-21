import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Database, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterPanel } from '@/components/database/FilterPanel';
import { KeyboardCard } from '@/components/database/KeyboardCard';
import { filterKeyboards, sortKeyboards, FilterOptions, SortField, SortOrder, INITIAL_FILTERS } from '@/lib/search';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const DatabasePage: React.FC = () => {
  const { catalog, prices } = useCatalog();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterOptions>(() => {
    return {
      ...INITIAL_FILTERS,
      query: searchParams.get('q') || '',
      brand: searchParams.get('brand') || 'all',
      layout: searchParams.get('layout') || 'all'
    };
  });

  const [sortField, setSortField] = useState<SortField>(() => {
    const s = searchParams.get('sort');
    return (s === 'recent' ? 'verified' : 'brand') as SortField;
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  // Filter & sort
  const filteredKeyboards = useMemo(() => {
    const res = filterKeyboards(catalog, filters, prices);
    return sortKeyboards(res, sortField, sortOrder);
  }, [catalog, filters, prices, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredKeyboards.length / pageSize) || 1;
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredKeyboards.slice(start, start + pageSize);
  }, [filteredKeyboards, page, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filters, sortField, sortOrder]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <Database className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span>Keyboard Specification Database</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Explore {catalog.length} verified computer keyboards across 40+ brands with traceable physical measurements.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <FilterPanel
        filters={filters}
        onChangeFilters={setFilters}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={() => setFilters(INITIAL_FILTERS)}
        resultCount={filteredKeyboards.length}
      />

      {/* Keyboards Grid */}
      {pagedItems.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          <Database className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Keyboards Matched Your Filters</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Try adjusting your brand, layout, or search terms, or reset the filters to see all keyboards.
          </p>
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedItems.map(k => (
            <KeyboardCard key={k.id} keyboard={k} />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <span className="text-zinc-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredKeyboards.length)} of {filteredKeyboards.length} keyboards
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-zinc-800 dark:text-zinc-200">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
