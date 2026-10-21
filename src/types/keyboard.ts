export interface KeyboardSpec {
  id: string;
  brand: string;
  model: string;
  family?: string | null;
  familyId?: string | null;
  width: number | null;
  depth: number | null;
  height: number | null;
  frontHeight?: number | null;
  rearHeight?: number | null;
  feetExtendedHeight?: number | null;
  weight: number | null;
  layout: string | null;
  keys: number | null;
  technology?: string | null;
  connectivity?: string | null;
  wired?: boolean | null;
  wireless?: boolean | null;
  bluetooth?: boolean | null;
  wireless24?: boolean | null;
  status?: string | null;
  generation?: string | null;
  releaseYear?: number | null;
  verified?: string | null;
  lastVerified?: string | null;
  dimensionSource?: string | null;
  source?: string | null;
  sourceType?: string | null;
  verificationState?: string | null;
  review?: boolean | null;
  note?: string | null;
  image?: string | null;
  aliases?: string[];
  additionalSources?: string[];
  relatedModels?: string[];
  previousGeneration?: string | null;
  nextGeneration?: string | null;
  provenance?: {
    record?: any;
    fields?: Record<string, {
      state: string;
      claims?: Array<{
        value: any;
        source: string;
        grade?: number;
        kind?: string;
        checked?: string;
        variant?: string;
        condition?: string;
        uncertainty?: any;
        note?: string | null;
      }>;
      note?: string | null;
    }>;
  };
}

export interface PriceObservation {
  id?: string;
  amount: number;
  currency: string;
  market: string;
  seller: string;
  url: string;
  checked: string;
  variant?: string;
  availability?: string;
  condition?: string;
  amountUsd?: number;
  note?: string;
}

export type PriceMap = Record<string, PriceObservation[]>;

export interface ComparisonSlot {
  key: string;
  keyboard: KeyboardSpec;
  visible: boolean;
  color?: string;
}

export type ComparisonViewMode = 'overlay' | 'side' | '3d';
export type AlignmentMode = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'front';
export type MeasurementUnit = 'mm' | 'cm' | 'in';

export interface ComparisonViewState {
  mode: ComparisonViewMode;
  align: AlignmentMode;
  topIndex: number;
  opacity: number; // 0 to 100
  grid: boolean;
  labels: boolean;
  names: boolean;
  unit: MeasurementUnit;
  referenceId: string;
  referenceIndex: number;
  desk: boolean;
  deskWidth: number;
  deskDepth: number;
}
