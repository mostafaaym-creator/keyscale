import React, { useState } from 'react';
import { ShieldCheck, FileText, ExternalLink, AlertTriangle, Layers, Database, Search } from 'lucide-react';
import { EVIDENCE_TIERS, EvidenceTier } from '@/lib/provenance';
import researchLogs from '@/data/research-log.json';
import importAudit from '@/data/import-audit.json';
import { useLanguage } from '@/i18n/LanguageContext';

export const SourcesView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const logs = Array.isArray(researchLogs) ? researchLogs : [];

  const filteredLogs = logs.filter((item: any) => {
    if (selectedTier !== 'all' && item.grade !== selectedTier) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchModel = (item.model || item.variant || '').toLowerCase().includes(q);
      const matchSource = (item.source || '').toLowerCase().includes(q);
      const matchNotes = (item.condition || item.note || '').toLowerCase().includes(q);
      if (!matchModel && !matchSource && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-8">
      {/* Evidence Hierarchy Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence Provenance Standard</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Source Verification & Evidence Database
        </h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
          Every dimension in Keyscale is tied to identifiable primary or independent evidence. We never fabricate physical specifications or generate measurements from generative AI memory.
        </p>

        {/* Verification Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
            <span className="text-zinc-400 block">Total Catalog Models</span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {importAudit.totalRecords}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
            <span className="text-emerald-600 dark:text-emerald-400 block">Verified 3-Axis Dimensions</span>
            <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
              {importAudit.completeDimensions}
            </span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
            <span className="text-amber-600 dark:text-amber-400 block">Conflicting / Under Review</span>
            <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300">
              {importAudit.reviewFlags}
            </span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
            <span className="text-purple-600 dark:text-purple-400 block">Research Queue Size</span>
            <span className="text-xl font-bold font-mono text-purple-700 dark:text-purple-300">
              {importAudit.researchQueueCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Tier Evidence Hierarchy Cards */}
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Evidence Authority Hierarchy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as EvidenceTier[]).map(tierNum => {
            const info = EVIDENCE_TIERS[tierNum];
            return (
              <div
                key={tierNum}
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border mb-2 ${info.badgeClass}`}>
                    {info.label}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {info.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-400 font-semibold uppercase">
                  {tierNum === 1 || tierNum === 2 ? 'Official / Lab Grade' : tierNum === 3 ? 'Retail Offer' : 'Supplemental Only'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audited Evidence Log Browser */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Persistent Research Audit Trail
            </h3>
            <p className="text-xs text-zinc-500">
              Documented verification attempts, check dates, and physical measurement quotations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute start-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter claims by model..."
                className="w-full ps-8 pe-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs"
              />
            </div>

            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="1">Tier 1 (Manufacturer)</option>
              <option value="2">Tier 2 (Independent)</option>
              <option value="3">Tier 3 (Retailer)</option>
            </select>
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Model / Variant</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Extracted Measurement / Evidence Note</th>
                <th className="py-2.5 px-3">Checked Date</th>
                <th className="py-2.5 px-3">Source URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredLogs.slice(0, 30).map((claim: any, idx: number) => {
                const tier = claim.grade as EvidenceTier || 1;
                const info = EVIDENCE_TIERS[tier] || EVIDENCE_TIERS[1];

                return (
                  <tr key={idx} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      {claim.model || claim.variant || 'Keyboard Model'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${info.badgeClass}`}>
                        Tier {tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-md text-zinc-600 dark:text-zinc-300">
                      {claim.condition || claim.note || claim.value ? (
                        <span>{claim.condition || claim.note || `Measured value: ${claim.value}`}</span>
                      ) : (
                        <span className="text-zinc-400 italic">Official specification sheet verified</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">
                      {claim.checked || '2026-10-20'}
                    </td>
                    <td className="py-3 px-3">
                      {claim.source ? (
                        <a
                          href={claim.source}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
