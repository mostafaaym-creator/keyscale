import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Compass, ArrowRight } from 'lucide-react';
import { KeyboardSpec } from '@/types/keyboard';
import { validDimension } from '@/lib/geometry';

export const CustomKeyboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('My Custom Keyboard');
  const [width, setWidth] = useState('320');
  const [depth, setDepth] = useState('130');
  const [height, setHeight] = useState('38');
  const [weight, setWeight] = useState('850');
  const [layout, setLayout] = useState('Custom');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const h = parseFloat(height);

    if (!validDimension(w) || !validDimension(d) || !validDimension(h)) {
      setError('Please provide valid positive numbers for width, depth, and height.');
      return;
    }

    const encName = encodeURIComponent(name);
    navigate(`/compare?k=custom:${encName}:${w}:${d}:${h},apex-pro-tkl-2023`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>User Custom Dimensions</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
          Custom Keyboard Modeler
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Enter custom caliper measurements for custom builds, Alice layouts, group-buy prototypes, or vintage hardware to compare them against production models.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Custom Model Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Width (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={width}
                onChange={e => setWidth(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Depth (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={depth}
                onChange={e => setDepth(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Height (mm) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Weight (g, optional)
              </label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Form Factor
              </label>
              <select
                value={layout}
                onChange={e => setLayout(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              >
                <option value="Custom">Custom</option>
                <option value="100%">100% Full-size</option>
                <option value="TKL">TKL / 80%</option>
                <option value="75%">75%</option>
                <option value="65%">65%</option>
                <option value="60%">60%</option>
                <option value="Alice/Ergo">Alice / Ergonomic</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Launch Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
