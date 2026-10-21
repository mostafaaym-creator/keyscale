import React, { useState, useRef } from 'react';
import { Compass, RotateCw, Trash2, Plus, Move, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KeyboardSpec, MeasurementUnit } from '@/types/keyboard';
import { formatDimension, deskFootprint } from '@/lib/geometry';
import { letterFor, getSlotColor } from '@/lib/palette';
import { KeyboardPicker } from '@/components/compare/KeyboardPicker';
import { useCatalog } from '@/context/CatalogContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface PlacedKeyboard {
  instanceId: string;
  keyboard: KeyboardSpec;
  x: number; // mm from desk left
  y: number; // mm from desk top
  rotation: number; // degrees (0, 90, 180, 270)
}

export const DeskVisualizer: React.FC = () => {
  const { catalog } = useCatalog();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [deskW, setDeskW] = useState(1400); // mm
  const [deskD, setDeskD] = useState(700);  // mm
  const [unit, setUnit] = useState<MeasurementUnit>('mm');
  const [placed, setPlaced] = useState<PlacedKeyboard[]>(() => {
    const k1 = catalog.find(k => k.id === 'apex-pro-tkl-2023') || catalog[0];
    const k2 = catalog.find(k => k.id === 'wooting-60he-plus') || catalog[1];
    return [
      { instanceId: 'k-1', keyboard: k1, x: 400, y: 350, rotation: 0 },
      ...(k2 ? [{ instanceId: 'k-2', keyboard: k2, x: 800, y: 350, rotation: 0 }] : [])
    ];
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  // Desk area calculations
  const totalDeskAreaM2 = (deskW * deskD) / 1_000_000;
  const keyboardsFootprintMm2 = placed.reduce((sum, item) => {
    return sum + (deskFootprint(item.keyboard) || 350 * 130);
  }, 0);
  const keyboardsAreaM2 = keyboardsFootprintMm2 / 1_000_000;
  const remainingAreaPercent = Math.max(0, 100 - (keyboardsAreaM2 / totalDeskAreaM2) * 100);

  // Check simple AABB collisions between placed keyboards
  const collisions = new Set<string>();
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i];
      const b = placed[j];
      const aW = a.rotation % 180 === 0 ? (a.keyboard.width || 320) : (a.keyboard.depth || 130);
      const aD = a.rotation % 180 === 0 ? (a.keyboard.depth || 130) : (a.keyboard.width || 320);
      const bW = b.rotation % 180 === 0 ? (b.keyboard.width || 320) : (b.keyboard.depth || 130);
      const bD = b.rotation % 180 === 0 ? (b.keyboard.depth || 130) : (b.keyboard.width || 320);

      const intersects = (
        a.x < b.x + bW &&
        a.x + aW > b.x &&
        a.y < b.y + bD &&
        a.y + aD > b.y
      );

      if (intersects) {
        collisions.add(a.instanceId);
        collisions.add(b.instanceId);
      }
    }
  }

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent, instanceId: string) => {
    e.preventDefault();
    const item = placed.find(p => p.instanceId === instanceId);
    if (!item) return;

    setActiveDragId(instanceId);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: item.x,
      initialY: item.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = (moveEvent.clientX - dragStartRef.current.mouseX) * 1.5;
      const dy = (moveEvent.clientY - dragStartRef.current.mouseY) * 1.5;

      setPlaced(prev =>
        prev.map(p => {
          if (p.instanceId !== instanceId) return p;
          const newX = Math.max(0, Math.min(deskW - (p.keyboard.width || 300), dragStartRef.current!.initialX + dx));
          const newY = Math.max(0, Math.min(deskD - (p.keyboard.depth || 120), dragStartRef.current!.initialY + dy));
          return { ...p, x: Math.round(newX), y: Math.round(newY) };
        })
      );
    };

    const handleMouseUp = () => {
      setActiveDragId(null);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotate = (instanceId: string) => {
    setPlaced(prev =>
      prev.map(p =>
        p.instanceId === instanceId
          ? { ...p, rotation: (p.rotation + 90) % 360 }
          : p
      )
    );
  };

  const handleRemove = (instanceId: string) => {
    setPlaced(prev => prev.filter(p => p.instanceId !== instanceId));
  };

  const handleAdd = (keyboard: KeyboardSpec) => {
    const newId = `k-${Date.now()}`;
    setPlaced(prev => [
      ...prev,
      {
        instanceId: newId,
        keyboard,
        x: Math.max(20, Math.min(deskW - 350, 200 + prev.length * 50)),
        y: Math.max(20, Math.min(deskD - 150, 200)),
        rotation: 0
      }
    ]);
  };

  const deskPresets = [
    { label: 'Compact (120 × 60 cm)', w: 1200, d: 600 },
    { label: 'Standard (140 × 70 cm)', w: 1400, d: 700 },
    { label: 'Spacious (160 × 80 cm)', w: 1600, d: 800 },
    { label: 'Executive (180 × 80 cm)', w: 1800, d: 800 }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Visualizer Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Desk Space Architecture</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {t('desk.title')}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {t('desk.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Keyboard to Desk</span>
          </button>
        </div>

        {/* Desk Controls & Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Desk Width (mm)
            </label>
            <input
              type="number"
              step="50"
              min="800"
              max="3000"
              value={deskW}
              onChange={e => setDeskW(Math.max(600, Number(e.target.value)))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Desk Depth (mm)
            </label>
            <input
              type="number"
              step="50"
              min="500"
              max="1500"
              value={deskD}
              onChange={e => setDeskD(Math.max(400, Number(e.target.value)))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Preset Desk Sizes
            </label>
            <select
              onChange={e => {
                const [w, d] = e.target.value.split(',').map(Number);
                if (w && d) {
                  setDeskW(w);
                  setDeskD(d);
                }
              }}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {deskPresets.map(p => (
                <option key={p.label} value={`${p.w},${p.d}`}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desk Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 block">Total Desk Surface</span>
          <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {totalDeskAreaM2.toFixed(2)} m²
          </span>
          <span className="text-[11px] text-zinc-400 block mt-0.5">
            {deskW} mm × {deskD} mm
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 block">{t('desk.footprintSummary')}</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {(keyboardsAreaM2 * 10_000).toFixed(0)} cm²
          </span>
          <span className="text-[11px] text-zinc-400 block mt-0.5">
            {placed.length} keyboard{placed.length === 1 ? '' : 's'} on desk
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 block">{t('desk.availableSpace')}</span>
          <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {remainingAreaPercent.toFixed(1)}%
          </span>
          <span className="text-[11px] text-zinc-400 block mt-0.5 flex items-center gap-1">
            {collisions.size > 0 ? (
              <span className="text-amber-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Overlapping keyboards
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Clear placement
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Interactive Desk Canvas */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto flex flex-col items-center select-none">
        <div className="text-xs text-zinc-400 mb-2 flex items-center gap-2">
          <Move className="w-3.5 h-3.5" />
          <span>Click & drag keyboard bodies to reposition on desk</span>
        </div>

        {/* Scaled Desk Surface (SVG) */}
        <div
          className="relative rounded-xl border-4 border-amber-900/30 dark:border-zinc-700 shadow-xl overflow-hidden"
          style={{
            width: '100%',
            maxWidth: `${deskW}px`,
            aspectRatio: `${deskW} / ${deskD}`,
            background: isDark
              ? 'linear-gradient(145deg, #182029 0%, #11161c 100%)'
              : 'linear-gradient(145deg, #f0ede6 0%, #e8e3d8 100%)'
          }}
        >
          {/* Subtle wood or desktop grid lines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Desk Dimension Watermark */}
          <div className="absolute start-4 bottom-4 text-xs font-mono font-semibold text-zinc-400/60 pointer-events-none">
            {deskW} mm × {deskD} mm Desk Surface
          </div>

          {/* Placed Keyboards */}
          {placed.map((item, idx) => {
            const color = getSlotColor(idx, isDark);
            const isColliding = collisions.has(item.instanceId);
            const w = item.keyboard.width || 320;
            const d = item.keyboard.depth || 130;

            // Compute percentage positions for responsive container
            const leftPct = (item.x / deskW) * 100;
            const topPct = (item.y / deskD) * 100;
            const widthPct = (w / deskW) * 100;
            const depthPct = (d / deskD) * 100;

            return (
              <div
                key={item.instanceId}
                onMouseDown={e => handleMouseDown(e, item.instanceId)}
                className={`absolute rounded-lg border-2 shadow-lg cursor-grab active:cursor-grabbing transition-shadow flex flex-col justify-between p-2 select-none group ${
                  isColliding ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-zinc-700/80 dark:border-zinc-200/80'
                }`}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${depthPct}%`,
                  backgroundColor: color,
                  transform: `rotate(${item.rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Keyboard Header */}
                <div className="flex items-center justify-between text-white text-[11px] font-bold">
                  <div className="flex items-center gap-1 truncate">
                    <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center text-[10px]">
                      {letterFor(idx)}
                    </span>
                    <span className="truncate">{item.keyboard.model}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotate(item.instanceId);
                      }}
                      className="p-1 rounded bg-black/40 hover:bg-black/60 text-white"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.instanceId);
                      }}
                      className="p-1 rounded bg-rose-600/80 hover:bg-rose-700 text-white"
                      title="Remove from desk"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Keyboard Body outline */}
                <div className="text-[10px] text-white/80 font-mono text-center">
                  {w} × {d} mm
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <KeyboardPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAdd}
        selectedIds={placed.map(p => p.keyboard.id)}
      />
    </div>
  );
};
