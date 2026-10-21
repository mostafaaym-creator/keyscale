import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Search, ChevronRight } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';

export const FamiliesPage: React.FC = () => {
  const { families, catalog } = useCatalog();
  const [query, setQuery] = useState('');

  const familyStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const k of catalog) {
      if (k.familyId) {
        map.set(k.familyId, (map.get(k.familyId) || 0) + 1);
      }
    }
    return map;
  }, [catalog]);

  const filtered = useMemo(() => {
    return families.filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.brand.toLowerCase().includes(query.toLowerCase())
    );
  }, [families, query]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Product Families & Series</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Explore keyboard lineups, layout variations, and generation evolutions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search families or brands..."
            className="w-full ps-9 pe-4 py-2 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(f => {
          const count = familyStats.get(f.id) || 0;
          return (
            <Link
              key={f.id}
              to={`/families/${f.id}`}
              className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60 transition-all shadow-xs hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {f.brand}
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors mt-0.5">
                  {f.name}
                </h3>
                <span className="text-xs text-zinc-400 mt-1 block">
                  {count} chassis variant{count === 1 ? '' : 's'}
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
