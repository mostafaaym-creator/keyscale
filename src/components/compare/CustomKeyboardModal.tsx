import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { KeyboardSpec } from '@/types/keyboard';
import { validDimension } from '@/lib/geometry';
import { useLanguage } from '@/i18n/LanguageContext';

interface CustomKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keyboard: KeyboardSpec) => void;
}

export const CustomKeyboardModal: React.FC<CustomKeyboardModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('My Custom Keyboard');
  const [width, setWidth] = useState('320');
  const [depth, setDepth] = useState('130');
  const [height, setHeight] = useState('38');
  const [weight, setWeight] = useState('850');
  const [layout, setLayout] = useState('Custom');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const w = parseFloat(width);
    const d = parseFloat(depth);
    const h = parseFloat(height);
    const wt = weight ? parseFloat(weight) : null;

    if (!name.trim()) {
      setError('Please provide a name for your custom keyboard.');
      return;
    }
    if (!validDimension(w)) {
      setError('Width must be a valid positive number between 50 and 1000 mm.');
      return;
    }
    if (!validDimension(d)) {
      setError('Depth must be a valid positive number between 30 and 500 mm.');
      return;
    }
    if (!validDimension(h)) {
      setError('Height must be a valid positive number between 10 and 150 mm.');
      return;
    }

    const customKeyboard: KeyboardSpec = {
      id: `custom-${Date.now()}`,
      brand: 'Custom',
      model: name.trim().slice(0, 60),
      width: w,
      depth: d,
      height: h,
      weight: wt,
      layout: layout || 'Custom',
      keys: null,
      technology: 'Custom user entry',
      note: 'User-entered custom physical dimensions',
      verified: 'User Entry',
      review: false
    };

    onSave(customKeyboard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-keeb-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="custom-keeb-title" className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Custom Keyboard
              </h3>
              <p className="text-xs text-zinc-500">
                Compare your own physical measurements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Keyboard Name / Description
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Neo75, Zoom65 V3, My DIY Keeb"
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Width (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="1000"
                required
                value={width}
                onChange={e => setWidth(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Depth (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="500"
                required
                value={depth}
                onChange={e => setDepth(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Overall Height (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="150"
                required
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Weight (grams, optional)
              </label>
              <input
                type="number"
                step="1"
                min="100"
                max="5000"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Form-factor / Layout
            </label>
            <select
              value={layout}
              onChange={e => setLayout(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Custom">Custom Layout</option>
              <option value="100%">100% Full-size</option>
              <option value="96%">96% Compact</option>
              <option value="TKL">TKL / 80%</option>
              <option value="75%">75%</option>
              <option value="65%">65%</option>
              <option value="60%">60%</option>
              <option value="40%">40%</option>
            </select>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              Add to Comparison
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
