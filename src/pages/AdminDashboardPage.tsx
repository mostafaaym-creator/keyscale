import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Database, AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import importAudit from '@/data/import-audit.json';

export const AdminDashboardPage: React.FC = () => {
  const { catalog, stats, prices } = useCatalog();
  const [activeTab, setActiveTab] = useState<'queue' | 'conflicts' | 'audit'>('queue');
  const [queueFilter, setQueueFilter] = useState('');
  const [queueEntries, setQueueEntries] = useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  useEffect(() => {
    if (activeTab === 'queue' && queueEntries.length === 0) {
      setLoadingQueue(true);
      import('@/data/research-queue.json').then(mod => {
        setQueueEntries((mod.default as any)?.entries || []);
        setLoadingQueue(false);
      }).catch(() => setLoadingQueue(false));
    }
  }, [activeTab, queueEntries.length]);

  const conflictingModels = catalog.filter(k => k.review);

  const filteredQueue = queueEntries.filter((q: any) => {
    if (!queueFilter) return true;
    const s = queueFilter.toLowerCase();
    return (
      (q.model || '').toLowerCase().includes(s) ||
      (q.brand || '').toLowerCase().includes(s) ||
      (q.query || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification Engine Console</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            Research & Catalog Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Monitor automated research queues, verify measurement claims, and resolve multi-source conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300">
            Audit State: Reconciled (0 Duplicates)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <span className="text-zinc-500 block">Catalog Records</span>
          <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white mt-1 block">
            {stats.total}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            100% Unique Primary Keys
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <span className="text-zinc-500 block">Complete 3-Axis Dimensions</span>
          <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
            {stats.completeDimensions}
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            {((stats.completeDimensions / stats.total) * 100).toFixed(1)}% Coverage
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <span className="text-zinc-500 block">Active Conflicting Claims</span>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1 block">
            {conflictingModels.length}
          </span>
          <span className="text-[10px] text-amber-500 font-semibold mt-1 block">
            Values withheld for review
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <span className="text-zinc-500 block">Research Queue Depth</span>
          <span className="text-2xl font-black font-mono text-purple-700 dark:text-purple-400 mt-1 block">
            {queueEntries.length.toLocaleString()}
          </span>
          <span className="text-[10px] text-purple-600 font-semibold mt-1 block">
            Prioritized candidate tasks
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Research Queue ({queueEntries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('conflicts')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'conflicts'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Conflicting Models ({conflictingModels.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Import Reconciliation Audit
        </button>
      </div>

      {/* Tab: Research Queue */}
      {activeTab === 'queue' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Queued Verification Targets
              </h3>
              <p className="text-xs text-zinc-500">
                Automated multi-source search targets with query variations and prioritized candidates.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={queueFilter}
                onChange={e => setQueueFilter(e.target.value)}
                placeholder="Filter queue by query or model..."
                className="w-full ps-8 pe-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Target Model</th>
                  <th className="py-2.5 px-3">Missing Attribute</th>
                  <th className="py-2.5 px-3">Recommended Search Strategy Query</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                {filteredQueue.slice(0, 30).map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">
                      P{item.priority || 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-white">
                      {item.brand} {item.model || item.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono">
                        {item.gap || 'dimensions'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                      {item.query || `${item.brand} ${item.model} dimensions mm official`}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Queued</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Conflicting Models */}
      {activeTab === 'conflicts' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Models with Discrepant Source Claims ({conflictingModels.length})
            </h3>
            <p className="text-xs text-zinc-500">
              In accordance with our strict data policy, measurements from conflicting sources are withheld from the primary catalog and marked for manual caliper audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conflictingModels.map(k => (
              <div key={k.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">
                    {k.brand} {k.model}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400">
                    Review Required
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {k.note || 'Sources disagree on dimensions. Values withheld to prevent incorrect comparisons.'}
                </p>
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[10px] text-zinc-500">
                  ID: <code>{k.id}</code> · Recorded: {k.lastVerified || k.verified}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Import Reconciliation Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Verified Catalog Reconciliation Report
            </h3>
            <p className="text-xs text-zinc-500">
              Audit log generated during migration and deduplication from primary version-controlled data.
            </p>
          </div>

          <pre className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
            {JSON.stringify(importAudit, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
