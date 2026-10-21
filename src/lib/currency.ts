export type SupportedCurrency = 'USD' | 'SAR' | 'EGP' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToUsd: number; // 1 USD = X Currency
  symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUsd: 1.0, symbolPosition: 'before' },
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rateToUsd: 3.751, symbolPosition: 'after' },
  EGP: { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound', rateToUsd: 48.65, symbolPosition: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUsd: 0.782, symbolPosition: 'before' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUsd: 0.924, symbolPosition: 'before' }
};

export const EXCHANGE_RATE_DATE = '2026-10-20';

export function convertToUsd(amount: number, fromCurrency: string): number {
  const norm = fromCurrency.toUpperCase() as SupportedCurrency;
  const cfg = CURRENCIES[norm];
  if (!cfg || cfg.rateToUsd === 0) return amount;
  return amount / cfg.rateToUsd;
}

export function convertFromUsd(amountUsd: number, targetCurrency: SupportedCurrency): number {
  const cfg = CURRENCIES[targetCurrency];
  if (!cfg) return amountUsd;
  return amountUsd * cfg.rateToUsd;
}

export function formatPrice(amount: number, currency = 'USD'): string {
  const norm = currency.toUpperCase() as SupportedCurrency;
  const cfg = CURRENCIES[norm] || CURRENCIES.USD;
  const formattedVal = amount.toLocaleString(undefined, {
    minimumFractionDigits: norm === 'EGP' || norm === 'SAR' ? 0 : 2,
    maximumFractionDigits: 2
  });

  return cfg.symbolPosition === 'before'
    ? `${cfg.symbol}${formattedVal}`
    : `${formattedVal} ${cfg.symbol}`;
}

export function isPriceStale(checkedDate: string, maxDays = 45): boolean {
  if (!checkedDate) return true;
  const checkTime = new Date(checkedDate).getTime();
  if (Number.isNaN(checkTime)) return true;
  const now = new Date().getTime();
  const diffDays = (now - checkTime) / (1000 * 60 * 60 * 24);
  return diffDays > maxDays;
}
