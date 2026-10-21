import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Database, Search, ChevronRight, Layers } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const BrandsPage: React.FC = () => {
  const { catalog, brands } = useCatalog();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  // Count models per brand
  const brandStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const k of catalog) {
      map.set(k.brand, (map.get(k.brand) || 0) + 1);
    }
    return map;
  }, [catalog]);

  const filteredBrands = useMemo(() => {
    return brands.filter(b => b.toLowerCase().includes(query.toLowerCase()));
  }, [brands, query]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Database className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Keyboard Manufacturers ({brands.length})</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse verified mechanical and gaming keyboard makers represented in the Keyscale catalog.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter brands..."
            className="w-full ps-9 pe-4 py-2 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBrands.map(b => {
          const count = brandStats.get(b) || 0;
          return (
            <Link
              key={b}
              to={`/brands/${encodeURIComponent(b)}`}
              className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60 transition-all shadow-xs hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                  {b}
                </h3>
                <span className="text-xs text-zinc-400 mt-0.5 block">
                  {count} verified model{count === 1 ? '' : 's'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
