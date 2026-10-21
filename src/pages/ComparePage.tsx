import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layers, Share2, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';
import { KeyboardSpec, ComparisonSlot, ComparisonViewState } from '@/types/keyboard';
import { DEFAULT_VIEW_STATE } from '@/lib/urlState';
import { KeyboardOverlay } from '@/components/compare/KeyboardOverlay';
import { ThreeDViewer } from '@/components/compare/ThreeDViewer';
import { RosterStrip } from '@/components/compare/RosterStrip';
import { SpecMatrix } from '@/components/compare/SpecMatrix';
import { ViewSettingsMenu } from '@/components/compare/ViewSettingsMenu';
import { KeyboardPicker } from '@/components/compare/KeyboardPicker';
import { CustomKeyboardModal } from '@/components/compare/CustomKeyboardModal';
import { serializeComparisonToUrl, parseComparisonFromUrl } from '@/lib/urlState';
import { MAX_KEYBOARDS } from '@/lib/palette';
import { useCatalog } from '@/context/CatalogContext';
import { useLanguage } from '@/i18n/LanguageContext';

export const ComparePage: React.FC = () => {
  const { catalog } = useCatalog();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial state from URL search string
  const initialData = useMemo(() => {
    return parseComparisonFromUrl(location.search, catalog);
  }, [catalog]);

  const [slots, setSlots] = useState<ComparisonSlot[]>(initialData.slots);
  const [view, setView] = useState<ComparisonViewState>(initialData.view);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const isInitialMount = useRef(true);

  // Sync state to URL search parameters without page reload
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const searchStr = serializeComparisonToUrl(slots, view);
    const newUrl = `${location.pathname}?${searchStr}`;
    window.history.replaceState(null, '', newUrl);
  }, [slots, view, location.pathname]);

  // Handle Share Link Copy
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // Fallback
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  // Reset to default configuration
  const handleReset = () => {
    setView({ ...DEFAULT_VIEW_STATE });
  };

  // Add Keyboard to Slots
  const handleAddKeyboard = (keyboard: KeyboardSpec) => {
    if (slots.length >= MAX_KEYBOARDS) return;
    if (slots.some(s => s.keyboard.id === keyboard.id)) return;

    setSlots(prev => [
      ...prev,
      {
        key: `${keyboard.id}-${Date.now()}`,
        keyboard,
        visible: true
      }
    ]);
  };

  // Slot management handlers
  const handleRemoveSlot = (index: number) => {
    if (slots.length <= 1) return;
    setSlots(prev => prev.filter((_, i) => i !== index));
    setView(v => ({
      ...v,
      topIndex: v.topIndex >= index && v.topIndex > 0 ? v.topIndex - 1 : v.topIndex,
      referenceIndex: v.referenceIndex >= index && v.referenceIndex > 0 ? v.referenceIndex - 1 : v.referenceIndex
    }));
  };

  const handleToggleVisible = (index: number) => {
    setSlots(prev =>
      prev.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleMoveSlot = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= slots.length) return;

    setSlots(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Share Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Keyboard Comparison</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Compare external silhouettes, millimeter measurements, and desk footprint in true relative scale.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{shareCopied ? 'Link Copied to Clipboard!' : 'Share Comparison'}</span>
        </button>
      </div>

      {/* Roster Strip of Selected Keyboards */}
      <RosterStrip
        slots={slots}
        topIndex={view.topIndex}
        onSetTop={idx => setView(v => ({ ...v, topIndex: idx }))}
        onToggleVisible={handleToggleVisible}
        onRemoveSlot={handleRemoveSlot}
        onMoveSlot={handleMoveSlot}
        onOpenPicker={() => setPickerOpen(true)}
        onOpenCustom={() => setCustomOpen(true)}
        unit={view.unit}
      />

      {/* Main Viewport & Visualization Area */}
      <div className="space-y-4">
        {view.mode === '3d' ? (
          <ThreeDViewer slots={slots} opacity={view.opacity} />
        ) : (
          <KeyboardOverlay
            slots={slots}
            mode={view.mode}
            align={view.align}
            topIndex={view.topIndex}
            opacity={view.opacity}
            grid={view.grid}
            labels={view.labels}
            unit={view.unit}
            referenceId={view.referenceId}
          />
        )}

        {/* View Settings Control Menu */}
        <ViewSettingsMenu
          view={view}
          onChangeView={setView}
          slots={slots}
          onReset={handleReset}
          onShare={handleShare}
          shareCopied={shareCopied}
        />
      </div>

      {/* Specification Difference Matrix */}
      <SpecMatrix
        slots={slots}
        unit={view.unit}
        referenceIndex={view.referenceIndex}
        onSetReference={idx => setView(v => ({ ...v, referenceIndex: idx }))}
      />

      {/* Keyboard Picker Modal */}
      <KeyboardPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddKeyboard}
        selectedIds={slots.map(s => s.keyboard.id)}
      />

      {/* Custom Keyboard Modal */}
      <CustomKeyboardModal
        isOpen={customOpen}
        onClose={() => setCustomOpen(false)}
        onSave={handleAddKeyboard}
      />
    </div>
  );
};
