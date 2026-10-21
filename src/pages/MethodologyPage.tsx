import React from 'react';
import { ShieldCheck, Ruler, CheckCircle2, AlertTriangle, Layers, FileText } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Standards & Scientific Protocol
        </span>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
          Keyscale Measurement Methodology
        </h1>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
          How physical keyboard dimensions, weights, and specifications are gathered, verified, and audited across primary and independent sources.
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <Ruler className="w-5 h-5" />
            <h2 className="text-base">1. Coordinate System & Unit Conventions</h2>
          </div>
          <p>
            All physical measurements in Keyscale are normalized into standard millimetres (mm) for dimensions and grams (g) for weight:
          </p>
          <ul className="list-disc ps-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <li><strong>Width:</strong> Left-to-right outermost chassis boundary rectangle.</li>
            <li><strong>Depth:</strong> Front-to-back chassis bounding rectangle (excluding detachable wrist-rests unless explicitly modeled).</li>
            <li><strong>Height:</strong> Measured from bottom chassis feet to the highest point of standard keycaps.</li>
            <li><strong>Imperial Conversion:</strong> Exactly <code>25.4 mm per inch</code>. No rounding approximations.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base">2. Five-Tier Evidence Standard</h2>
          </div>
          <p>
            We classify every specification claim into a strict 5-tier evidence hierarchy:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <strong className="text-emerald-600 block mb-1">Tier 1: Primary Manufacturer</strong>
              Official PDF user manuals, specification sheets, and manufacturer product pages.
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <strong className="text-teal-600 block mb-1">Tier 2: Independent Testing</strong>
              Hardware laboratories and professional teardowns using precision digital calipers.
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <strong className="text-blue-600 block mb-1">Tier 3: Authorized Retailers</strong>
              Verified distributor listings (Amazon, Newegg, Best Buy, Micro Center).
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <strong className="text-amber-600 block mb-1">Tier 4: Secondary Technical</strong>
              Video reviews with caliper measurements shown on camera.
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base">3. Conflict Resolution & Missing Data Policy</h2>
          </div>
          <p>
            When two reputable sources disagree on a dimension, we:
          </p>
          <ul className="list-disc ps-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <li>Verify that both sources refer to the exact same revision and regional SKU (e.g. US ANSI vs ISO).</li>
            <li>Confirm whether one source accidentally reported retail packaging or box dimensions.</li>
            <li>Flag the record as <code>Conflicting Evidence</code> rather than guessing or silently selecting an arbitrary number.</li>
            <li>Unknown values remain <code>null</code>. We never generate fallback values from generic keyboards.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
