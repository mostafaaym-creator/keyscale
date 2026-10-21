import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layers, ShieldCheck, ArrowRight, ExternalLink, Sparkles, Check, Share2, AlertCircle, ShoppingBag, Info, ChevronLeft } from 'lucide-react';
import { PriceDisplay } from '@/components/pricing/PriceDisplay';
import { KeyboardOverlay } from '@/components/compare/KeyboardOverlay';
import { formatDimension, formatWeight, footprintCm2 } from '@/lib/geometry';
import { computeVerificationStatus, EVIDENCE_TIERS, EvidenceTier } from '@/lib/provenance';
import { findSimilarKeyboards } from '@/lib/similarity';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const KeyboardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { catalog, getKeyboardById, getPricesForKeyboard } = useCatalog();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [shareCopied, setShareCopied] = useState(false);

  const keyboard = getKeyboardById(id || '');

  if (!keyboard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Keyboard Not Found</h2>
        <p className="text-sm text-zinc-500 mt-2">
          The requested keyboard ID does not exist in the verified catalog.
        </p>
        <Link
          to="/keyboards"
          className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Database
        </Link>
      </div>
    );
  }

  const status = computeVerificationStatus(keyboard);
  const offers = getPricesForKeyboard(keyboard.id);
  const similar = findSimilarKeyboards(keyboard, catalog, 4);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/keyboards" className="hover:text-emerald-600 transition-colors">Keyboards</Link>
        <span>/</span>
        <Link to={`/brands/${encodeURIComponent(keyboard.brand)}`} className="hover:text-emerald-600 transition-colors">
          {keyboard.brand}
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{keyboard.model}</span>
      </nav>

      {/* Product Hero Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {keyboard.brand}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {keyboard.layout || 'Custom Layout'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeClass}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{status.label}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {keyboard.model}
            </h1>

            {keyboard.family && (
              <p className="text-xs text-zinc-500">
                Product Family: <Link to={`/families/${keyboard.familyId}`} className="text-emerald-600 font-semibold hover:underline">{keyboard.family}</Link>
                {keyboard.generation ? ` · ${keyboard.generation}` : ''}
              </p>
            )}

            {keyboard.note && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2">
                {keyboard.note}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap md:flex-col items-stretch gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/compare?k=${keyboard.id}`)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Add to Comparison</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{shareCopied ? 'Link Copied!' : 'Share Specs'}</span>
            </button>
            <Link
              to={`/find-similar?id=${keyboard.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Find Similar Sizes</span>
            </Link>
          </div>
        </div>

        {/* Physical Measurements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Width</span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {keyboard.width ? `${keyboard.width} mm` : '—'}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">
              {keyboard.width ? `${(keyboard.width / 25.4).toFixed(2)} in` : 'Pending check'}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Depth</span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {keyboard.depth ? `${keyboard.depth} mm` : '—'}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">
              {keyboard.depth ? `${(keyboard.depth / 25.4).toFixed(2)} in` : 'Pending check'}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Height</span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {keyboard.height ? `${keyboard.height} mm` : '—'}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">
              {keyboard.height ? `${(keyboard.height / 25.4).toFixed(2)} in` : 'Pending check'}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Weight</span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {formatWeight(keyboard.weight)}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">
              {keyboard.weight ? `${(keyboard.weight / 28.35).toFixed(1)} oz` : 'Pending check'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Technical Specifications & Live Scale Silhouette */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Specs Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Technical Specifications
          </h3>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <dt className="text-zinc-400 font-medium">Switch Technology</dt>
              <dd className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {keyboard.technology || 'Mechanical'}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-400 font-medium">Desk Surface Area</dt>
              <dd className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {footprintCm2(keyboard) ? `${footprintCm2(keyboard)} cm²` : '—'}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-400 font-medium">Connectivity</dt>
              <dd className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {keyboard.connectivity || (keyboard.wired ? 'Wired' : 'Wireless')}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-400 font-medium">Wireless Protocols</dt>
              <dd className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {keyboard.wireless24 ? '2.4 GHz' : ''} {keyboard.bluetooth ? '· Bluetooth' : ''} {!keyboard.wireless24 && !keyboard.bluetooth ? 'Wired only' : ''}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-400 font-medium">Lifecycle Status</dt>
              <dd className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {keyboard.status || 'Current production'}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-400 font-medium">Last Verified Date</dt>
              <dd className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {keyboard.lastVerified || keyboard.verified || '2026-10-20'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Proportional Scale Visual */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Proportional Scale Silhouette
            </h3>
            <p className="text-xs text-zinc-500 mt-2 mb-4">
              Measured 2D top view scaled to true millimeter bounds.
            </p>

            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800">
              <KeyboardOverlay
                slots={[{ key: keyboard.id, keyboard, visible: true }]}
                mode="overlay"
                align="center"
                topIndex={0}
                opacity={90}
                grid={true}
                labels={true}
                unit="mm"
                referenceId="credit-card"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Retail Price Observations Subsystem */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Real Retailer Offers & Pricing
            </h3>
            <p className="text-xs text-zinc-500">
              Direct source links with confirmed stock and condition observations.
            </p>
          </div>
        </div>

        <PriceDisplay offers={offers} keyboardName={keyboard.model} />
      </div>

      {/* Traceable Evidence & Provenance Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Source Provenance & Measurement Evidence
            </h3>
            <p className="text-xs text-zinc-500">
              Verifiable primary documentation behind this keyboard's measurements.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                Primary Specification Source
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status.badgeClass}`}>
                {status.label}
              </span>
            </div>

            {keyboard.source ? (
              <a
                href={keyboard.source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline break-all"
              >
                <span>{keyboard.source}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : (
              <span className="text-zinc-400 italic">User-entered custom entry</span>
            )}

            <div className="text-zinc-500 pt-1">
              {keyboard.sourceType && <span>Type: {keyboard.sourceType} · </span>}
              <span>Last confirmed: {keyboard.lastVerified || keyboard.verified || '2026-10-20'}</span>
            </div>
          </div>

          {keyboard.additionalSources && keyboard.additionalSources.length > 0 && (
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Secondary Confirmatory Sources
              </span>
              {keyboard.additionalSources.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline block truncate"
                >
                  <span>{url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar Keyboards Recommendations */}
      {similar.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Similar Physical Form Factors
              </h3>
              <p className="text-xs text-zinc-500">
                Keyboards with matching physical width, depth, and desk space footprint.
              </p>
            </div>
            <Link
              to={`/find-similar?id=${keyboard.id}`}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              See all similar models →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(res => (
              <div
                key={res.keyboard.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      {res.keyboard.brand}
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded font-mono">
                      {res.score}% Match
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {res.keyboard.model}
                  </h4>
                  <span className="text-xs font-mono text-zinc-500 block mt-1">
                    {res.keyboard.width} × {res.keyboard.depth} mm
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(`/compare?k=${keyboard.id},${res.keyboard.id}`)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    Compare vs {res.keyboard.model} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
