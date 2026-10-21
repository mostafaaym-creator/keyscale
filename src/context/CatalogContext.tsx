import React, { createContext, useContext, useMemo } from 'react';
import catalogData from '@/data/catalog.json';
import pricesData from '@/data/prices.json';
import { KeyboardSpec, PriceObservation, PriceMap } from '@/types/keyboard';

interface CatalogStats {
  total: number;
  completeDimensions: number;
  partialDimensions: number;
  brandsCount: number;
  withPricesCount: number;
}

interface CatalogContextType {
  catalog: KeyboardSpec[];
  prices: PriceMap;
  stats: CatalogStats;
  brands: string[];
  families: { id: string; name: string; brand: string }[];
  layouts: string[];
  getKeyboardById: (id: string) => KeyboardSpec | undefined;
  getPricesForKeyboard: (id: string) => PriceObservation[];
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const catalog = catalogData as unknown as KeyboardSpec[];
  const prices = pricesData as unknown as PriceMap;

  const { stats, brands, families, layouts } = useMemo(() => {
    let complete = 0;
    let partial = 0;
    const bSet = new Set<string>();
    const famMap = new Map<string, { id: string; name: string; brand: string }>();
    const lSet = new Set<string>();
    let withPrices = 0;

    for (const k of catalog) {
      if (k.brand) bSet.add(k.brand);
      if (k.layout) lSet.add(k.layout);

      if (k.family && k.familyId) {
        if (!famMap.has(k.familyId)) {
          famMap.set(k.familyId, { id: k.familyId, name: k.family, brand: k.brand });
        }
      }

      const hasW = typeof k.width === 'number' && k.width > 0;
      const hasD = typeof k.depth === 'number' && k.depth > 0;
      const hasH = typeof k.height === 'number' && k.height > 0;

      if (hasW && hasD && hasH) complete++;
      else if (hasW || hasD || hasH) partial++;

      if (prices[k.id] && prices[k.id].length > 0) {
        withPrices++;
      }
    }

    return {
      stats: {
        total: catalog.length,
        completeDimensions: complete,
        partialDimensions: partial,
        brandsCount: bSet.size,
        withPricesCount: withPrices
      },
      brands: Array.from(bSet).sort(),
      families: Array.from(famMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      layouts: Array.from(lSet).sort()
    };
  }, [catalog, prices]);

  const getKeyboardById = (id: string): KeyboardSpec | undefined => {
    return catalog.find(k => k.id === id);
  };

  const getPricesForKeyboard = (id: string): PriceObservation[] => {
    return prices[id] || [];
  };

  return (
    <CatalogContext.Provider
      value={{
        catalog,
        prices,
        stats,
        brands,
        families,
        layouts,
        getKeyboardById,
        getPricesForKeyboard
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
