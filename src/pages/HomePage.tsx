import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Search, Sparkles, Compass, ShieldCheck, ArrowRight, Database, CheckCircle2, ChevronRight } from 'lucide-react';
import { KeyboardOverlay } from '@/components/compare/KeyboardOverlay';
import { KeyboardCard } from '@/components/database/KeyboardCard';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const HomePage: React.FC = () => {
  const { catalog, stats, brands, families } = useCatalog();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Interactive live preview comparison on homepage
  const [previewIdA, setPreviewIdA] = useState('apex-pro-tkl-2023');
  const [previewIdB, setPreviewIdB] = useState('wooting-60he-plus');

  const keyboardA = catalog.find(k => k.id === previewIdA) || catalog[0];
  const keyboardB = catalog.find(k => k.id === previewIdB) || catalog[1];

  const featuredBrands = ['SteelSeries', 'Razer', 'Wooting', 'Logitech', 'Keychron', 'Corsair', 'Akko', 'ASUS ROG'];

  const recentKeyboards = catalog.slice(0, 6);

  return (
    <div className="w-full space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Evidence-First Keyboard Scale Comparison</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              {t('tagline')}
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('subTagline')}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/compare"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Launch Keyboard Compare</span>
              </Link>
              <Link
                to="/keyboards"
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold text-sm transition-all shadow-2xs"
              >
                <Database className="w-4 h-4" />
                <span>Browse {stats.total} Keyboards</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Interactive Preview
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Switch Models to Preview Scale Differences Instantly
                </h3>
              </div>

              {/* Model Selectors */}
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={previewIdA}
                  onChange={e => setPreviewIdA(e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium cursor-pointer"
                >
                  {catalog.slice(0, 40).map(k => (
                    <option key={k.id} value={k.id}>{k.brand} {k.model}</option>
                  ))}
                </select>
                <span className="text-zinc-400 font-bold">vs</span>
                <select
                  value={previewIdB}
                  onChange={e => setPreviewIdB(e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium cursor-pointer"
                >
                  {catalog.slice(0, 40).map(k => (
                    <option key={k.id} value={k.id}>{k.brand} {k.model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live SVG Overlay */}
            <KeyboardOverlay
              slots={[
                { key: keyboardA.id, keyboard: keyboardA, visible: true },
                { key: keyboardB.id, keyboard: keyboardB, visible: true }
              ]}
              mode="overlay"
              align="center"
              topIndex={0}
              opacity={80}
              grid={true}
              labels={true}
              unit="mm"
              referenceId="none"
            />

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-zinc-500">
                Comparing <strong className="text-emerald-600">{keyboardA.model}</strong> ({keyboardA.width} × {keyboardA.depth} mm) against <strong className="text-purple-600">{keyboardB.model}</strong> ({keyboardB.width} × {keyboardB.depth} mm)
              </span>
              <button
                type="button"
                onClick={() => navigate(`/compare?k=${keyboardA.id},${keyboardB.id}`)}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Comparison Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Database Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
              Total Keyboard Models
            </span>
            <span className="text-3xl font-black font-mono text-zinc-900 dark:text-white mt-1 block">
              {stats.total}
            </span>
            <span className="text-[11px] text-zinc-400 mt-1 block">
              622 imported & deduplicated
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Verified 3-Axis Dimensions
            </span>
            <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
              {stats.completeDimensions}
            </span>
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Width, Depth & Height verified
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
              Manufacturers Covered
            </span>
            <span className="text-3xl font-black font-mono text-zinc-900 dark:text-white mt-1 block">
              {stats.brandsCount}
            </span>
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Leading gaming & custom brands
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Live Retail Observations
            </span>
            <span className="text-3xl font-black font-mono text-purple-700 dark:text-purple-400 mt-1 block">
              {stats.withPricesCount}
            </span>
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Dated prices in USD and regional
            </span>
          </div>
        </div>
      </section>

      {/* Popular Manufacturers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Browse by Manufacturer
            </h2>
            <p className="text-xs text-zinc-500">
              Explore keyboards from established gaming gear and mechanical keyboard makers.
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All {brands.length} Brands</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {featuredBrands.map(b => (
            <Link
              key={b}
              to={`/brands/${encodeURIComponent(b)}`}
              className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-center transition-all shadow-2xs group"
            >
              <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 block truncate">
                {b}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added Keyboards Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Verified Keyboard Catalog
            </h2>
            <p className="text-xs text-zinc-500">
              Recently checked and confirmed models with complete physical dimensions.
            </p>
          </div>
          <Link
            to="/keyboards"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Entire Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentKeyboards.map(k => (
            <KeyboardCard key={k.id} keyboard={k} />
          ))}
        </div>
      </section>

      {/* Trust & Methodology Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Scientific Measurement Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Why Physical Scale Accuracy Matters
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              When choosing a keyboard for desk ergonomics or competitive gaming, marketing terms like "60%" or "TKL" conceal centimeters of bezel and chassis difference. Keyscale validates physical chassis dimensions from primary manufacturer spec sheets and teardowns, never estimating.
            </p>
          </div>

          <Link
            to="/sources"
            className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
          >
            Inspect Evidence Standards
          </Link>
        </div>
      </section>
    </div>
  );
};
