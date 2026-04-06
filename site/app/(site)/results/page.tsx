'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import modelResults from '@/generated/model-results.json';

const LogModeDashboard = dynamic(() => import('@/components/LogModeDashboard'), { ssr: false });

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type ModeKey = 'browser_use' | 'ax_tree' | 'som' | 'pixel';

const MODE_META: { key: ModeKey; label: string; short: string; color: string; textColor: string; badgeVariant: 'browseruse' | 'axtree' | 'som' | 'pixel' }[] = [
  { key: 'browser_use', label: 'Browser-Use', short: 'BU', color: 'bg-mode-browseruse', textColor: 'text-mode-browseruse', badgeVariant: 'browseruse' },
  { key: 'ax_tree', label: 'AX-tree', short: 'AX', color: 'bg-mode-axtree', textColor: 'text-mode-axtree', badgeVariant: 'axtree' },
  { key: 'som', label: 'SoM', short: 'SoM', color: 'bg-mode-som', textColor: 'text-mode-som', badgeVariant: 'som' },
  { key: 'pixel', label: 'Pixel', short: 'Px', color: 'bg-mode-pixel', textColor: 'text-mode-pixel', badgeVariant: 'pixel' },
];

const MODE_LABEL_MAP: Record<ModeKey, string> = {
  browser_use: 'Browser-Use',
  ax_tree: 'AX-tree',
  som: 'SoM',
  pixel: 'Pixel',
};

const MODE_BADGE_MAP: Record<ModeKey, 'browseruse' | 'axtree' | 'som' | 'pixel'> = {
  browser_use: 'browseruse',
  ax_tree: 'axtree',
  som: 'som',
  pixel: 'pixel',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cellColor(v: number | null | undefined): string {
  if (v == null) return 'bg-gray-100 text-gray-400';
  if (v >= 85) return 'bg-emerald-100 text-emerald-800';
  if (v >= 70) return 'bg-green-50 text-green-700';
  if (v >= 50) return 'bg-yellow-50 text-yellow-700';
  return 'bg-red-50 text-red-700';
}

function barColor(v: number): string {
  if (v >= 85) return 'bg-emerald-500';
  if (v >= 70) return 'bg-green-400';
  if (v >= 50) return 'bg-yellow-400';
  return 'bg-red-400';
}

function PassCell({ v }: { v: number | null | undefined }) {
  return (
    <span className={cn('inline-block rounded px-2.5 py-0.5 text-xs tabular-nums', cellColor(v))}>
      {v != null ? v.toFixed(1) : '\u2014'}
    </span>
  );
}

interface ModelSummary {
  name: string;
  id: string;
  bestMode: ModeKey;
  bestModeLabel: string;
  bestPass: number;
  worstMode: ModeKey;
  worstModeLabel: string;
  worstPass: number;
  gap: number;
  avg: number;
  modes: { key: ModeKey; label: string; pass: number }[];
  efficiency: Record<string, any> | null;
  timeEfficiency: Record<string, any> | null;
}

function buildModelSummaries(): ModelSummary[] {
  return (modelResults as any).models.map((m: any) => {
    const entries = (Object.entries(m.modes ?? {}) as [ModeKey, { pass_rate: number }][])
      .filter(([, v]) => v != null)
      .map(([k, v]) => ({ key: k, label: MODE_LABEL_MAP[k], pass: v.pass_rate }));

    const sorted = [...entries].sort((a, b) => b.pass - a.pass);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const avg = entries.length ? +(entries.reduce((s, e) => s + e.pass, 0) / entries.length).toFixed(1) : 0;

    return {
      name: m.name,
      id: m.id,
      bestMode: best?.key ?? 'browser_use',
      bestModeLabel: best?.label ?? '-',
      bestPass: best?.pass ?? 0,
      worstMode: worst?.key ?? 'pixel',
      worstModeLabel: worst?.label ?? '-',
      worstPass: worst?.pass ?? 0,
      gap: best && worst ? +(best.pass - worst.pass).toFixed(1) : 0,
      avg,
      modes: entries,
      efficiency: m.efficiency ?? null,
      timeEfficiency: m.time_efficiency ?? null,
    };
  }).sort((a: ModelSummary, b: ModelSummary) => b.bestPass - a.bestPass);
}

// ---------------------------------------------------------------------------
// Overview content
// ---------------------------------------------------------------------------

function OverviewContent() {
  const mr = modelResults as any;
  const summaries = buildModelSummaries();
  const highlights = mr.highlights;
  const hardestTypes = mr.hardest_types ?? null;
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<string>('best');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Sort the leaderboard
  const sortedSummaries = [...summaries].sort((a, b) => {
    let va: number, vb: number;
    switch (sortCol) {
      case 'bu': va = a.modes.find(m => m.key === 'browser_use')?.pass ?? -1; vb = b.modes.find(m => m.key === 'browser_use')?.pass ?? -1; break;
      case 'ax': va = a.modes.find(m => m.key === 'ax_tree')?.pass ?? -1; vb = b.modes.find(m => m.key === 'ax_tree')?.pass ?? -1; break;
      case 'som': va = a.modes.find(m => m.key === 'som')?.pass ?? -1; vb = b.modes.find(m => m.key === 'som')?.pass ?? -1; break;
      case 'pixel': va = a.modes.find(m => m.key === 'pixel')?.pass ?? -1; vb = b.modes.find(m => m.key === 'pixel')?.pass ?? -1; break;
      case 'best': va = a.bestPass; vb = b.bestPass; break;
      case 'worst': va = a.worstPass; vb = b.worstPass; break;
      case 'gap': va = a.gap; vb = b.gap; break;
      case 'avg': va = a.avg; vb = b.avg; break;
      default: va = a.bestPass; vb = b.bestPass;
    }
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  }

  function SortHeader({ col, label, className }: { col: string; label: string; className?: string }) {
    const active = sortCol === col;
    return (
      <th
        onClick={() => handleSort(col)}
        className={cn(
          'py-2 px-3 font-semibold text-center cursor-pointer select-none hover:bg-slate-50 transition-colors',
          className,
        )}
      >
        {label}
        {active && <span className="ml-1 text-[10px]">{sortDir === 'desc' ? '\u25BC' : '\u25B2'}</span>}
      </th>
    );
  }

  // Efficiency: find fastest, slowest, build pareto data
  const efficiencyPairs: { model: string; mode: string; pass: number; time: number; ratio: number }[] = [];
  for (const s of summaries) {
    if (!s.efficiency || !s.timeEfficiency) continue;
    for (const modeKey of Object.keys(s.timeEfficiency)) {
      const te = s.timeEfficiency[modeKey];
      const eff = s.efficiency[modeKey];
      if (te && eff) {
        efficiencyPairs.push({
          model: s.name,
          mode: MODE_LABEL_MAP[modeKey as ModeKey] ?? modeKey,
          pass: eff.pass,
          time: te.agent_s,
          ratio: te.ratio,
        });
      }
    }
  }
  efficiencyPairs.sort((a, b) => a.time - b.time);
  const fastest = efficiencyPairs[0] ?? null;
  const slowest = efficiencyPairs[efficiencyPairs.length - 1] ?? null;

  // Pareto frontier: no other point has both higher pass and lower time
  const paretoSet = new Set<number>();
  for (let i = 0; i < efficiencyPairs.length; i++) {
    const p = efficiencyPairs[i];
    const dominated = efficiencyPairs.some(
      (q, j) => j !== i && q.pass >= p.pass && q.time <= p.time && (q.pass > p.pass || q.time < p.time),
    );
    if (!dominated) paretoSet.add(i);
  }

  return (
    <div className="space-y-0">
      {/* ================================================================== */}
      {/* SUMMARY DASHBOARD                                                   */}
      {/* ================================================================== */}
      <section className="pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Models Evaluated', value: '7', sub: 'Including open-source' },
            { label: 'Observation Spaces', value: '4', sub: 'BU / AX-tree / SoM / Pixel' },
            { label: 'Total Tasks', value: '2,910 Full / 912 Core', sub: '97 component types, 14 families' },
            {
              label: 'Best Result',
              value: highlights?.best_model
                ? `${highlights.best_model.pass_rate}%`
                : '95.2%',
              sub: highlights?.best_model
                ? `${highlights.best_model.name} (${highlights.best_model.mode})`
                : 'Gemini 3 Flash (Browser-Use)',
            },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* LEADERBOARD TABLE                                                   */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <CardDescription>
              Click column headers to sort. Pass rates on ComponentBench-Full (2,910 tasks).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Model</th>
                    <SortHeader col="bu" label="BU" className="text-mode-browseruse" />
                    <SortHeader col="ax" label="AX-tree" className="text-mode-axtree" />
                    <SortHeader col="som" label="SoM" className="text-mode-som" />
                    <SortHeader col="pixel" label="Pixel" className="text-mode-pixel" />
                    <SortHeader col="best" label="Best" className="text-gray-700" />
                    <SortHeader col="worst" label="Worst" className="text-gray-700" />
                    <SortHeader col="gap" label="Gap" className="text-gray-700" />
                    <SortHeader col="avg" label="Avg" className="text-gray-700" />
                  </tr>
                </thead>
                <tbody>
                  {sortedSummaries.map((s, i) => {
                    const buVal = s.modes.find(m => m.key === 'browser_use')?.pass ?? null;
                    const axVal = s.modes.find(m => m.key === 'ax_tree')?.pass ?? null;
                    const somVal = s.modes.find(m => m.key === 'som')?.pass ?? null;
                    const pxVal = s.modes.find(m => m.key === 'pixel')?.pass ?? null;
                    return (
                      <tr
                        key={s.name}
                        className={cn(
                          'transition-colors hover:bg-slate-100/60',
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                        )}
                      >
                        <td className="py-2.5 pr-4 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={buVal} /></td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={axVal} /></td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={somVal} /></td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={pxVal} /></td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={cn('inline-block rounded px-2.5 py-0.5 text-xs tabular-nums font-semibold', cellColor(s.bestPass))}>
                            {s.bestPass.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={s.worstPass} /></td>
                        <td className="py-2.5 px-3 text-center text-xs font-semibold tabular-nums text-gray-900">
                          {s.gap.toFixed(1)}pp
                        </td>
                        <td className="py-2.5 px-3 text-center"><PassCell v={s.avg} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================================================================== */}
      {/* PER-MODEL CARDS                                                     */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Per-Model Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map(s => {
            const isExpanded = expandedModel === s.id;
            return (
              <Card key={s.name} className="relative">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <Badge variant={MODE_BADGE_MAP[s.bestMode]} className="text-[10px]">
                      Best: {s.bestModeLabel}
                    </Badge>
                  </div>

                  {/* Bar chart */}
                  <div className="space-y-2">
                    {MODE_META.map(meta => {
                      const entry = s.modes.find(m => m.key === meta.key);
                      if (!entry) return null;
                      return (
                        <div key={meta.key} className="flex items-center gap-2">
                          <span className={cn('w-8 text-xs text-right shrink-0', meta.textColor)}>{meta.short}</span>
                          <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden relative">
                            <div
                              className={cn('h-full rounded', meta.color)}
                              style={{ width: `${entry.pass}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-end pr-2 text-[11px] font-medium tabular-nums text-gray-700">
                              {entry.pass.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedModel(isExpanded ? null : s.id)}
                    className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    {isExpanded ? 'Show less' : 'Show details'}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      {/* Step efficiency */}
                      {s.efficiency && (
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Step Efficiency</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(s.efficiency).map(([mode, eff]: [string, any]) => (
                              <div key={mode} className="text-xs">
                                <span className="text-gray-500">{MODE_LABEL_MAP[mode as ModeKey] ?? mode}:</span>{' '}
                                <span className="font-medium">{eff.leq_h?.toFixed(1) ?? '-'}%</span>
                                <span className="text-gray-400"> {'\u2264'}H</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Time efficiency */}
                      {s.timeEfficiency && (
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Time</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(s.timeEfficiency).map(([mode, te]: [string, any]) => (
                              <div key={mode} className="text-xs">
                                <span className="text-gray-500">{MODE_LABEL_MAP[mode as ModeKey] ?? mode}:</span>{' '}
                                <span className="font-medium">{te.agent_s?.toFixed(1) ?? '-'}s</span>
                                <span className="text-gray-400"> ({te.ratio?.toFixed(1) ?? '-'}{'\u00d7'})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* EFFICIENCY ANALYSIS                                                 */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Efficiency Analysis</h2>
        <p className="text-gray-500 text-sm mb-6">
          Pass rate vs time per task for each model-mode combination. Pareto-optimal configs are highlighted.
        </p>

        {efficiencyPairs.length > 0 ? (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {fastest && (
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fastest Agent</p>
                    <p className="mt-1 font-semibold text-gray-900">{fastest.model} {fastest.mode}</p>
                    <p className="text-xs text-gray-500">{fastest.time.toFixed(1)}s mean ({fastest.ratio.toFixed(1)}{'\u00d7'} human)</p>
                  </CardContent>
                </Card>
              )}
              {slowest && (
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slowest Agent</p>
                    <p className="mt-1 font-semibold text-gray-900">{slowest.model} {slowest.mode}</p>
                    <p className="text-xs text-gray-500">{slowest.time.toFixed(1)}s mean ({slowest.ratio.toFixed(1)}{'\u00d7'} human)</p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Human Reference</p>
                  <p className="mt-1 font-semibold text-gray-900">{highlights?.human_mean_time_s ?? 4.8}s mean</p>
                  <p className="text-xs text-gray-500">{highlights?.human_mean_steps ?? 2.7} steps mean, {highlights?.human_median_steps ?? 2} median</p>
                </CardContent>
              </Card>
            </div>

            {/* Scatter-like card grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Configurations</CardTitle>
                <CardDescription>Sorted by time (fastest first). Gold border = Pareto-optimal.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {efficiencyPairs.map((p, i) => {
                    const isPareto = paretoSet.has(i);
                    return (
                      <div
                        key={`${p.model}-${p.mode}`}
                        className={cn(
                          'rounded-lg border p-3 text-sm',
                          isPareto
                            ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-200'
                            : 'border-slate-200 bg-white',
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{p.model}</p>
                            <p className="text-[10px] text-gray-500">{p.mode}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn('inline-block rounded px-2 py-0.5 text-xs tabular-nums font-semibold', cellColor(p.pass))}>
                              {p.pass.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                          <span>{p.time.toFixed(1)}s / task</span>
                          <span>{p.ratio.toFixed(1)}{'\u00d7'} human</span>
                        </div>
                        {isPareto && (
                          <div className="mt-1">
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600">Pareto</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fastest</p>
                  <p className="mt-1 font-semibold text-gray-900">GPT-5.4 mini SoM</p>
                  <p className="text-xs text-gray-500">14.2s mean (3.7{'\u00d7'} human)</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slowest</p>
                  <p className="mt-1 font-semibold text-gray-900">GPT-5 mini Pixel</p>
                  <p className="text-xs text-gray-500">71.8s mean (21.5{'\u00d7'} human)</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Human Reference</p>
                  <p className="mt-1 font-semibold text-gray-900">{highlights?.human_mean_time_s ?? 4.8}s mean</p>
                  <p className="text-xs text-gray-500">{highlights?.human_mean_steps ?? 2.7} steps mean</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ================================================================== */}
      {/* HARDEST COMPONENTS                                                  */}
      {/* ================================================================== */}
      {hardestTypes && (
        <section className="py-12 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hardest Components</h2>
            <p className="text-gray-500 text-sm mt-1">
              Difficulty inversions: trivial for humans (few steps) but extremely challenging for agents.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(hardestTypes as any[]).map((item: any, i: number) => (
              <Card key={item.type}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-gray-500">
                        {i + 1}
                      </span>
                      <p className="font-semibold text-gray-900 text-sm">{item.type?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Human: {item.human_steps} steps</p>
                      <p className="text-xs text-emerald-600 font-medium">Trivially easy</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-2xl font-bold tabular-nums',
                        item.agent_pass < 40 ? 'text-red-600' : item.agent_pass < 55 ? 'text-yellow-600' : 'text-gray-700',
                      )}>
                        {item.agent_pass}%
                      </p>
                      <p className="text-[10px] text-gray-400">agent pass</p>
                    </div>
                  </div>
                  {/* Human: always 100% */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-10 shrink-0">Human</span>
                    <div className="flex-1 h-2 bg-emerald-100 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded w-full" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium w-10 text-right">100%</span>
                  </div>
                  {/* Agent pass rate bar */}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-10 shrink-0">Agent</span>
                    <div className="flex-1 h-2 bg-red-100 rounded overflow-hidden">
                      <div className={cn('h-full rounded', barColor(item.agent_pass))} style={{ width: `${item.agent_pass}%` }} />
                    </div>
                    <span className="text-[10px] text-red-600 font-medium w-10 text-right">{item.agent_pass}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* RECENT RUNS                                                         */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-500 text-sm">
              Connect Supabase to see evaluation runs.{' '}
              <a href="/results?tab=logs" className="text-indigo-600 hover:text-indigo-800 font-medium no-underline">
                View Logs tab
              </a>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab Shell
// ---------------------------------------------------------------------------

function ResultsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  return (
    <div className="min-h-[80vh]">
      {/* Tab bar */}
      <div className="border-b border-slate-200 px-6 py-3 flex gap-2 bg-white sticky top-0 z-10">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'logs', label: 'Logs' },
        ].map(t => (
          <a
            key={t.key}
            href={`/results${t.key === 'overview' ? '' : `?tab=${t.key}`}`}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold no-underline border transition-colors',
              tab === t.key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-slate-50',
            )}
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto p-6">
        {tab === 'logs' ? (
          <LogModeDashboard selectedLib="all" benchVersion="v1" />
        ) : (
          <OverviewContent />
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ResultsContent />
    </Suspense>
  );
}
