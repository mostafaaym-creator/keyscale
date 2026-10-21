import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Layers } from 'lucide-react';
import { KeyboardCard } from '@/components/database/KeyboardCard';
import { useCatalog } from '@/context/CatalogContext';

export const FamilyDetailPage: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const { catalog, families } = useCatalog();

  const family = families.find(f => f.id === familyId);

  const keyboards = useMemo(() => {
    return catalog.filter(k => k.familyId === familyId);
  }, [catalog, familyId]);

  if (!family && !keyboards.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Family Not Found</h2>
        <Link to="/families" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
          Return to Families
        </Link>
      </div>
    );
  }

  const title = family?.name || keyboards[0]?.family || 'Keyboard Family';
  const brand = family?.brand || keyboards[0]?.brand || '';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/families" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-600 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>All Product Families</span>
      </Link>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {brand} Product Lineup
          </span>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
            {title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Comparing {keyboards.length} physical variants across sizes and generations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyboards.map(k => (
          <KeyboardCard key={k.id} keyboard={k} />
        ))}
      </div>
    </div>
  );
};
