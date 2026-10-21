import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { KeyboardSpec } from '@/types/keyboard';
import { formatDimension, formatWeight } from '@/lib/geometry';
import { computeVerificationStatus } from '@/lib/provenance';
import { formatPrice } from '@/lib/currency';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const KeyboardCard: React.FC<{ keyboard: KeyboardSpec }> = ({ keyboard: k }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getPricesForKeyboard } = useCatalog();

  const status = computeVerificationStatus(k);
  const offers = getPricesForKeyboard(k.id);
  const lowest = offers.length ? offers[0] : null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Top: Brand, Layout & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              {k.brand}
            </span>
            <Link
              to={`/keyboards/${k.id}`}
              className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
              title={k.model}
            >
              {k.model}
            </Link>
          </div>

          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
            {k.layout || 'Custom'}
          </span>
        </div>

        {/* Physical Dimensions Strip */}
        <div className="my-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs font-mono flex items-center justify-between">
          <div>
            <span className="text-zinc-400 text-[10px] block">W × D × H</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {k.width ? `${k.width} × ${k.depth} × ${k.height || '—'}` : 'Dimensions pending'}
              {k.width ? ' mm' : ''}
            </span>
          </div>

          <div className="text-end">
            <span className="text-zinc-400 text-[10px] block">WEIGHT</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {formatWeight(k.weight)}
            </span>
          </div>
        </div>

        {/* Technical features badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          {k.technology && (
            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {k.technology}
            </span>
          )}
          {k.wired && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              Wired
            </span>
          )}
          {k.wireless24 && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">
              2.4GHz
            </span>
          )}
          {k.bluetooth && (
            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium">
              BT
            </span>
          )}
        </div>

        {/* Evidence Status Pill */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.badgeClass}`}>
            <ShieldCheck className="w-3 h-3" />
            <span>{status.label}</span>
          </span>
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
        <div>
          {lowest ? (
            <div className="flex flex-col">
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {formatPrice(lowest.amount, lowest.currency)}
              </span>
              <span className="text-[10px] text-zinc-400">{lowest.seller}</span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400 italic">No offer listed</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/compare?k=${k.id}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Compare this keyboard"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
          <Link
            to={`/keyboards/${k.id}`}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="View specifications & evidence"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
