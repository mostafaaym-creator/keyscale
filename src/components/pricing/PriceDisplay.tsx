import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Clock, AlertCircle, ShieldCheck, Globe } from 'lucide-react';
import { PriceObservation } from '@/types/keyboard';
import { formatPrice, convertFromUsd, convertToUsd, isPriceStale, SupportedCurrency, CURRENCIES } from '@/lib/currency';
import { useLanguage } from '@/i18n/LanguageContext';

interface PriceDisplayProps {
  offers: PriceObservation[];
  keyboardName: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ offers, keyboardName }) => {
  const { t } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD');

  if (!offers || offers.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-zinc-400" />
          <span>No verified retail offers currently recorded for this model.</span>
        </div>
        <span className="text-[11px] text-zinc-400 italic">Queued for price check</span>
      </div>
    );
  }

  const lowestOffer = offers[0];

  return (
    <div className="w-full space-y-3">
      {/* Lowest Current Observed Price Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
            {t('pricing.lowestPrice')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
              {formatPrice(
                selectedCurrency === lowestOffer.currency
                  ? lowestOffer.amount
                  : convertFromUsd(convertToUsd(lowestOffer.amount, lowestOffer.currency), selectedCurrency),
                selectedCurrency
              )}
            </span>
            {selectedCurrency !== lowestOffer.currency && (
              <span className="text-xs text-zinc-400 font-mono">
                (Native: {formatPrice(lowestOffer.amount, lowestOffer.currency)})
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500 mt-0.5 block">
            Offered by <strong className="text-zinc-700 dark:text-zinc-300">{lowestOffer.seller}</strong> ({lowestOffer.market})
          </span>
        </div>

        {/* Currency Selector Pill */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value as SupportedCurrency)}
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {(Object.keys(CURRENCIES) as SupportedCurrency[]).map(c => (
              <option key={c} value={c}>{c} ({CURRENCIES[c].symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Multiple Retail Offers List */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
          {t('pricing.multipleOffers')} ({offers.length})
        </span>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden text-xs">
          {offers.map((offer, idx) => {
            const stale = isPriceStale(offer.checked);
            const displayAmt = selectedCurrency === offer.currency
              ? offer.amount
              : convertFromUsd(convertToUsd(offer.amount, offer.currency), selectedCurrency);

            return (
              <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {offer.seller}
                    </span>
                    <span className="text-[10px] text-zinc-400">· {offer.market}</span>
                    {offer.availability && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        offer.availability === 'in-stock'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {offer.availability}
                      </span>
                    )}
                  </div>
                  {offer.variant && (
                    <span className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {offer.variant}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Checked {offer.checked}</span>
                    {stale && <span className="text-amber-500 font-semibold">(Stale)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-end">
                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white block">
                      {formatPrice(displayAmt, selectedCurrency)}
                    </span>
                    {selectedCurrency !== offer.currency && (
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        {formatPrice(offer.amount, offer.currency)}
                      </span>
                    )}
                  </div>

                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                    title={`Visit ${offer.seller}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
