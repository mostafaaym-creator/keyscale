import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Database } from 'lucide-react';
import { KeyboardCard } from '@/components/database/KeyboardCard';
import { useCatalog } from '@/context/CatalogContext';

export const BrandDetailPage: React.FC = () => {
  const { brand } = useParams<{ brand: string }>();
  const { catalog } = useCatalog();

  const brandName = decodeURIComponent(brand || '');

  const keyboards = useMemo(() => {
    return catalog.filter(k => k.brand.toLowerCase() === brandName.toLowerCase());
  }, [catalog, brandName]);

  const families = useMemo(() => {
    const set = new Set<string>();
    for (const k of keyboards) {
      if (k.family) set.add(k.family);
    }
    return Array.from(set);
  }, [keyboards]);

  if (!keyboards.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Brand Not Found</h2>
        <Link to="/brands" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
          Return to Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/brands" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-600 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>All Manufacturers</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Manufacturer Showcase
          </span>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
            {brandName}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {keyboards.length} physical keyboard model{keyboards.length === 1 ? '' : 's'} cataloged with verified measurements.
          </p>
        </div>

        {families.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 me-1">Families:</span>
            {families.map(f => (
              <span key={f} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyboards.map(k => (
          <KeyboardCard key={k.id} keyboard={k} />
        ))}
      </div>
    </div>
  );
};
