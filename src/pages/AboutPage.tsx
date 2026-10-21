import React from 'react';
import { Keyboard, ShieldCheck, Heart, Sparkles, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Independent Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          About Keyscale
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Keyscale is a dedicated physical keyboard comparison and specification research platform inspired by the interaction quality and usability of EloShapes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">True Relative Scale</h3>
          <p className="text-zinc-500 leading-relaxed">
            All keyboard silhouettes and chassis overlays are rendered using one shared millimeter coordinate system. Keyboards are never stretched or normalized to arbitrary boxes.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No Fabricated Data</h3>
          <p className="text-zinc-500 leading-relaxed">
            Every specification is linked to verifiable evidence: manufacturer spec sheets, PDF manuals, or lab caliper measurements. Missing values remain explicitly unknown.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Explainable Algorithms</h3>
          <p className="text-zinc-500 leading-relaxed">
            From our desk footprint calculations to the Find Similar recommendation engine, every percentage and ranking is deterministic and mathematically grounded.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
          Legal Notice & Brand Disclaimers
        </h3>
        <p>
          Keyscale is an independent research project. All product names, logos, trademarks, and registered trademarks (such as SteelSeries, Razer, Wooting, Logitech, Corsair, Keychron, etc.) are property of their respective owners. Their use on Keyscale is strictly for factual identification and comparative hardware review.
        </p>
        <p>
          Keyscale does not copy proprietary source code, protected graphics, or branding from other gear comparison platforms. We build an original application engineered for computer keyboards.
        </p>
      </div>
    </div>
  );
};
