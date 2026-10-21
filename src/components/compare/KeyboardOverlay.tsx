import React, { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Eye, EyeOff } from 'lucide-react';
import { ComparisonSlot, AlignmentMode, MeasurementUnit } from '@/types/keyboard';
import { getAlignmentOffsets, formatDimension, fromMillimeters, scaleReferences } from '@/lib/geometry';
import { getSlotColor, letterFor } from '@/lib/palette';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface KeyboardOverlayProps {
  slots: ComparisonSlot[];
  mode: 'overlay' | 'side';
  align: AlignmentMode;
  topIndex: number;
  opacity: number;
  grid: boolean;
  labels: boolean;
  unit: MeasurementUnit;
  referenceId: string;
}

export const KeyboardOverlay: React.FC<KeyboardOverlayProps> = ({
  slots,
  mode,
  align,
  topIndex,
  opacity,
  grid,
  labels,
  unit,
  referenceId
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleSlots = useMemo(() => slots.filter(s => s.visible), [slots]);

  // Selected scale reference item (e.g. credit card or desk mat)
  const refItem = useMemo(
    () => scaleReferences.find(r => r.id === referenceId) || scaleReferences[0],
    [referenceId]
  );

  // Compute bounding box dimensions (in mm)
  const { maxW, maxD } = useMemo(() => {
    let mw = refItem.width || 0;
    let md = refItem.depth || 0;
    for (const s of visibleSlots) {
      if (s.keyboard.width && s.keyboard.width > mw) mw = s.keyboard.width;
      if (s.keyboard.depth && s.keyboard.depth > md) md = s.keyboard.depth;
    }
    return {
      maxW: Math.max(mw, 300),
      maxD: Math.max(md, 120)
    };
  }, [visibleSlots, refItem]);

  const padding = 45; // mm

  // Side-by-side total width computation
  const sideTotalWidth = useMemo(() => {
    if (mode !== 'side') return maxW;
    const gap = 20; // mm gap between keyboards
    const totalSlotsW = visibleSlots.reduce((acc, s) => acc + (s.keyboard.width || 300) + gap, 0);
    return Math.max(totalSlotsW, maxW);
  }, [visibleSlots, mode, maxW]);

  const viewBoxW = (mode === 'side' ? sideTotalWidth : maxW) + padding * 2;
  const viewBoxD = maxD + padding * 2;

  // Reorder items so the "topIndex" item is rendered last (on top in SVG z-order)
  const orderedSlots = useMemo(() => {
    const list = [...visibleSlots];
    if (topIndex >= 0 && topIndex < list.length) {
      const topItem = list.splice(topIndex, 1)[0];
      list.push(topItem);
    }
    return list;
  }, [visibleSlots, topIndex]);

  let currentSideX = padding;

  return (
    <div className="relative w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 overflow-hidden select-none">
      {/* Visual Canvas Toolbar */}
      <div className="flex items-center justify-between mb-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {mode === 'overlay' ? 'OVERLAY COMPARISON' : 'SIDE BY SIDE COMPARISON'}
          </span>
          <span>·</span>
          <span>One millimeter coordinate system</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/80 shadow-2xs">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono min-w-10 text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300"
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center min-h-[380px] max-h-[560px] overflow-auto cursor-grab active:cursor-grabbing p-4"
      >
        <svg
          viewBox={`0 0 ${viewBoxW} ${viewBoxD}`}
          className="max-h-[500px] w-auto transition-transform duration-150"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* 10mm small grid & 50mm major grid */}
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="0.5"
              />
            </pattern>
            <pattern id="majorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="url(#smallGrid)" />
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* Grid Background */}
          {grid && (
            <rect
              x={0}
              y={0}
              width={viewBoxW}
              height={viewBoxD}
              fill="url(#majorGrid)"
              className="rounded-lg"
            />
          )}

          {/* Scale Reference Item (e.g. Credit Card) */}
          {refItem.width > 0 && (
            <g opacity="0.6">
              <rect
                x={padding}
                y={padding}
                width={refItem.width}
                height={refItem.depth}
                rx="3"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={padding + 5}
                y={padding + 14}
                fontSize="9"
                fill="#94a3b8"
                fontWeight="500"
              >
                {refItem.label}
              </text>
            </g>
          )}

          {/* Render Keyboard Outlines */}
          {orderedSlots.map((slot) => {
            const originalIndex = slots.findIndex(s => s.key === slot.key);
            const color = getSlotColor(originalIndex, isDark);
            const k = slot.keyboard;
            const w = k.width || 300;
            const d = k.depth || 120;

            let x = padding;
            let y = padding;

            if (mode === 'side') {
              x = currentSideX;
              y = padding + (maxD - d) / 2;
              currentSideX += w + 20;
            } else {
              const offsets = getAlignmentOffsets(w, d, maxW, maxD, align);
              x = padding + offsets.x;
              y = padding + offsets.y;
            }

            return (
              <g key={slot.key} className="transition-all duration-300">
                {/* Keyboard Body Rectangle (Accurate physical bounding box) */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={d}
                  rx="6"
                  ry="6"
                  fill={color}
                  fillOpacity={opacity / 100}
                  stroke={color}
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Inner stylized bezel & typing area line */}
                <rect
                  x={x + 6}
                  y={y + 6}
                  width={Math.max(10, w - 12)}
                  height={Math.max(10, d - 12)}
                  rx="3"
                  ry="3"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.75"
                  strokeOpacity="0.4"
                />

                {/* Slot Identifier Badge */}
                <circle cx={x + 14} cy={y + 14} r="8" fill={color} />
                <text
                  x={x + 14}
                  y={y + 17.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {letterFor(originalIndex)}
                </text>

                {/* Keyboard Model Name on Canvas */}
                <text
                  x={x + 28}
                  y={y + 17}
                  fill={isDark ? '#e2e8f0' : '#1e293b'}
                  fontSize="11"
                  fontWeight="600"
                >
                  {k.brand} {k.model}
                </text>

                {/* Dimension Rulers & Labels */}
                {labels && (
                  <g>
                    {/* Top Width Ruler */}
                    <line
                      x1={x}
                      y1={y - 8}
                      x2={x + w}
                      y2={y - 8}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <line x1={x} y1={y - 12} x2={x} y2={y - 4} stroke={color} strokeWidth="1.2" />
                    <line
                      x1={x + w}
                      y1={y - 12}
                      x2={x + w}
                      y2={y - 4}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <text
                      x={x + w / 2}
                      y={y - 12}
                      textAnchor="middle"
                      fill={color}
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {formatDimension(w, unit)}
                    </text>

                    {/* Right Depth Ruler */}
                    <line
                      x1={x + w + 8}
                      y1={y}
                      x2={x + w + 8}
                      y2={y + d}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <line
                      x1={x + w + 4}
                      y1={y}
                      x2={x + w + 12}
                      y2={y}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <line
                      x1={x + w + 4}
                      y1={y + d}
                      x2={x + w + 12}
                      y2={y + d}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <text
                      x={x + w + 14}
                      y={y + d / 2 + 3}
                      textAnchor="start"
                      fill={color}
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {formatDimension(d, unit)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Visual Canvas Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {slots.map((s, idx) => (
            <div
              key={s.key}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-opacity ${
                s.visible ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSlotColor(idx, isDark) }}
              />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Slot {letterFor(idx)}: {s.keyboard.brand} {s.keyboard.model}
              </span>
            </div>
          ))}
        </div>
        <div className="text-zinc-400 text-[11px]">
          {t('compare.sharedScaleNote')}
        </div>
      </div>
    </div>
  );
};
