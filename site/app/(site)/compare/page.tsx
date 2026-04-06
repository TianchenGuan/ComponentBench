'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import comparisonMatrix from '@/generated/comparison-matrix.json';
import modelResults from '@/generated/model-results.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModeKey = 'browser_use' | 'ax_tree' | 'som' | 'pixel';

const MODE_COLS: { key: ModeKey; label: string; short: string; colorClass: string }[] = [
  { key: 'browser_use', label: 'Browser-Use', short: 'BU', colorClass: 'text-mode-browseruse' },
  { key: 'ax_tree', label: 'AX-tree', short: 'AX', colorClass: 'text-mode-axtree' },
  { key: 'som', label: 'SoM', short: 'SoM', colorClass: 'text-mode-som' },
  { key: 'pixel', label: 'Pixel', short: 'Px', colorClass: 'text-mode-pixel' },
];

const MODE_LABEL_MAP: Record<string, string> = {
  browser_use: 'Browser-Use',
  ax_tree: 'AX-tree',
  som: 'SoM',
  pixel: 'Pixel',
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

function barColor(v: number | null | undefined): string {
  if (v == null) return 'bg-gray-300';
  if (v >= 85) return 'bg-emerald-500';
  if (v >= 70) return 'bg-green-400';
  if (v >= 50) return 'bg-yellow-400';
  return 'bg-red-400';
}

function correlationColor(v: number | null | undefined): string {
  if (v == null) return 'bg-gray-50 text-gray-400';
  const abs = Math.abs(v);
  if (abs >= 0.4) return 'bg-red-100 text-red-800 font-semibold';
  if (abs >= 0.3) return 'bg-orange-50 text-orange-700';
  if (abs >= 0.2) return 'bg-yellow-50 text-yellow-700';
  if (abs >= 0.1) return 'bg-gray-50 text-gray-600';
  return 'bg-gray-50 text-gray-400';
}

function columnBest(rows: Record<string, unknown>[], key: string): number | null {
  let best: number | null = null;
  for (const row of rows) {
    const v = row[key] as number | null;
    if (v != null && (best === null || v > best)) best = v;
  }
  return best;
}

function fmtDelta(v: number): string {
  return (v >= 0 ? '+' : '') + v.toFixed(1);
}

function familyLabel(id: string): string {
  const f = (modelResults as any).families?.find((fam: any) => fam.id === id);
  return f?.name ?? id.replace(/_/g, ' ');
}

function modelNameFromId(id: string): string {
  const m = (modelResults as any).models?.find((mod: any) => mod.id === id);
  return m?.name ?? id;
}

// ---------------------------------------------------------------------------
// Section: Cell component
// ---------------------------------------------------------------------------

function PassCell({ v, isBest }: { v: number | null | undefined; isBest?: boolean }) {
  return (
    <span
      className={cn(
        'inline-block rounded px-2.5 py-0.5 text-xs tabular-nums',
        cellColor(v ?? null),
        isBest && 'ring-2 ring-emerald-400 font-bold',
      )}
    >
      {v != null ? v.toFixed(1) : '\u2014'}
      {isBest && <span className="ml-1 text-[9px] uppercase tracking-wider text-emerald-600">best</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComparePage() {
  const mr = modelResults as any;
  const matrix = comparisonMatrix.matrix;
  const familyRates = comparisonMatrix.family_pass_rates ?? null;
  const difficultyTiers = mr.difficulty_tiers ?? null;
  const coreResults = mr.core_results ?? null;
  const somPixelDelta = mr.som_pixel_delta ?? null;
  const buAdvantage = mr.browser_use_advantage ?? null;
  const buFamilyAdvantage = mr.browser_use_family_advantage ?? null;
  const perModelFamily = mr.per_model_family ?? null;
  const taskTemplateRates = mr.task_template_pass_rates ?? mr.task_template_rates ?? null;
  const difficultyAxisCorr = mr.difficulty_axis_correlations ?? null;
  const hardestTypes = mr.hardest_types ?? null;

  const [selectedModelTab, setSelectedModelTab] = useState<string | null>(
    perModelFamily ? Object.keys(perModelFamily)[0] : null,
  );
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  // Column bests for heatmap
  const colBests = Object.fromEntries(
    MODE_COLS.map(c => [c.key, columnBest(matrix as any, c.key)]),
  ) as Record<ModeKey, number | null>;

  // Average row for heatmap
  const avgRow: Record<ModeKey, number | null> = {} as any;
  for (const c of MODE_COLS) {
    const vals = matrix.map((r: any) => r[c.key] as number | null).filter((v: number | null): v is number => v != null);
    avgRow[c.key] = vals.length ? +(vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : null;
  }

  // Family rates sorted hardest first
  const sortedFamilies = familyRates
    ? [...familyRates].sort((a: any, b: any) => (a.avg ?? 0) - (b.avg ?? 0))
    : null;

  // Task templates sorted by average ascending
  const sortedTemplates = taskTemplateRates
    ? [...taskTemplateRates]
        .map((t: any) => {
          const vals = ['browser_use', 'ax_tree', 'som', 'pixel']
            .map(k => t[k] as number | null)
            .filter((v): v is number => v != null);
          return { ...t, avg: vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null };
        })
        .sort((a: any, b: any) => (a.avg ?? 0) - (b.avg ?? 0))
    : null;

  const visibleTemplates = sortedTemplates
    ? showAllTemplates
      ? sortedTemplates
      : [...sortedTemplates.slice(0, 12), ...sortedTemplates.slice(-4)]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-0">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}
      <div className="pb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Model Comparison</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Interactive analysis of 7 models across 4 observation spaces on 2,910 tasks
        </p>
      </div>

      {/* ================================================================== */}
      {/* SECTION 1 — Pass Rate Heatmap                                       */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pass Rate Heatmap</CardTitle>
            <CardDescription>
              Color-coded pass rates (%) per model and observation mode. Best value per column is highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Model</th>
                    {MODE_COLS.map(c => (
                      <th key={c.key} className={cn('py-2 px-3 font-semibold text-center', c.colorClass)}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row: any, i: number) => (
                    <tr
                      key={row.model}
                      className={cn(
                        'transition-colors hover:bg-slate-100/60',
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                      )}
                    >
                      <td className="py-2.5 pr-4 font-medium text-gray-900 whitespace-nowrap">{row.model}</td>
                      {MODE_COLS.map(c => {
                        const v = row[c.key] as number | null;
                        const isBest = v != null && v === colBests[c.key];
                        return (
                          <td key={c.key} className="py-2.5 px-3 text-center">
                            <PassCell v={v} isBest={isBest} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Average row */}
                  <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                    <td className="py-2.5 pr-4 text-gray-700">Average</td>
                    {MODE_COLS.map(c => (
                      <td key={c.key} className="py-2.5 px-3 text-center">
                        <span className={cn('inline-block rounded px-2.5 py-0.5 text-xs tabular-nums', cellColor(avgRow[c.key]))}>
                          {avgRow[c.key] != null ? avgRow[c.key]!.toFixed(1) : '\u2014'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================================================================== */}
      {/* SECTION 2 — Key Insights                                            */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Insights</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                Mode Sensitivity
                <Badge variant="destructive" className="text-[10px]">&gt;30pp</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                More than <span className="font-semibold">30 percentage points</span> of pass rate shift within a single model.
                GPT-5 mini swings from 87.0% (Browser-Use) down to 49.0% (Pixel).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                SoM Is Model-Dependent
                <Badge variant="som" className="text-[10px]">SoM</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                SoM helps GPT-5 mini by <span className="font-semibold text-amber-600">+29.5pp</span> over pixel but
                hurts GPT-5.4 by <span className="font-semibold text-rose-600">{'\u2212'}6.8pp</span>.
                The overlay can confuse models that already read coordinates well.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                Efficiency Gap
                <Badge variant="secondary" className="text-[10px]">3.7{'\u00d7'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                Even the <span className="font-semibold">fastest agent</span> (GPT-5.4 mini SoM) is 3.7{'\u00d7'} slower
                than human references. The slowest (GPT-5 mini Pixel) reaches 21.5{'\u00d7'}.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 3 — SoM vs Pixel Analysis                                   */}
      {/* ================================================================== */}
      {somPixelDelta && (
        <section className="py-12 border-t border-slate-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Set-of-Marks: Help or Hurt?</CardTitle>
              <CardDescription>
                SoM{'\u2212'}Pixel pass rate delta. Positive = SoM helps over pure pixel mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(somPixelDelta as any[]).map((row: any) => {
                  const maxAbs = Math.max(...(somPixelDelta as any[]).map((r: any) => Math.abs(r.delta)));
                  const pct = Math.abs(row.delta) / maxAbs * 100;
                  const isPositive = row.delta >= 0;
                  return (
                    <div key={row.model} className="flex items-center gap-3">
                      <span className="w-40 text-sm font-medium text-gray-700 shrink-0 text-right">{row.model}</span>
                      <div className="flex-1 flex items-center">
                        {/* Center line approach: positive goes right, negative goes left */}
                        <div className="w-full relative h-7 flex items-center">
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300" />
                          {isPositive ? (
                            <div className="absolute left-1/2 h-5 rounded-r bg-amber-400" style={{ width: `${pct / 2}%` }} />
                          ) : (
                            <div
                              className="absolute h-5 rounded-l bg-rose-400"
                              style={{ width: `${pct / 2}%`, right: '50%' }}
                            />
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        'w-20 text-sm font-semibold tabular-nums text-right',
                        isPositive ? 'text-amber-600' : 'text-rose-600',
                      )}>
                        {fmtDelta(row.delta)}pp
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-amber-400" /> SoM helps</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-rose-400" /> SoM hurts</span>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 4 — Browser-Use Advantage                                   */}
      {/* ================================================================== */}
      {(buAdvantage || buFamilyAdvantage) && (
        <section className="py-12 border-t border-slate-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browser-Use Advantage</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 4a: Per-model BU advantage */}
            {buAdvantage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Per-Model Advantage</CardTitle>
                  <CardDescription>Browser-Use pass rate vs mean of other modes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(buAdvantage as any[]).map((row: any) => (
                      <div key={row.model} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{row.model}</span>
                          <span className="text-teal-600 font-semibold tabular-nums">
                            {fmtDelta(row.delta)}pp
                          </span>
                        </div>
                        <div className="relative h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gray-300 rounded"
                            style={{ width: `${row.mean_other}%` }}
                          />
                          <div
                            className="absolute top-0 left-0 h-full bg-teal-500 rounded"
                            style={{ width: `${row.browser_use}%` }}
                          />
                          <span className="absolute right-2 top-0 h-full flex items-center text-[11px] font-medium tabular-nums text-gray-800">
                            {row.browser_use.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex gap-4 text-[10px] text-gray-400">
                          <span>BU: {row.browser_use.toFixed(1)}%</span>
                          <span>Others avg: {row.mean_other.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 4b: Per-family BU advantage */}
            {buFamilyAdvantage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Advantage by Family</CardTitle>
                  <CardDescription>
                    BU vs mean(AX-tree, SoM, Pixel). Ranges from +31% (Editors) to {'\u2212'}26% (Drag/Drop)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(buFamilyAdvantage as any[])
                      .sort((a: any, b: any) => b.advantage - a.advantage)
                      .map((row: any) => {
                        const maxAbs = Math.max(...(buFamilyAdvantage as any[]).map((r: any) => Math.abs(r.advantage)));
                        const pct = Math.abs(row.advantage) / maxAbs * 100;
                        const isPos = row.advantage >= 0;
                        return (
                          <div key={row.family} className="flex items-center gap-2">
                            <span className="w-28 text-[11px] text-gray-600 text-right shrink-0 truncate" title={row.family}>
                              {row.family.length > 18 ? row.family.slice(0, 18) + '\u2026' : row.family}
                            </span>
                            <div className="flex-1 relative h-4 flex items-center">
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200" />
                              {isPos ? (
                                <div
                                  className="absolute left-1/2 h-3 rounded-r bg-teal-400"
                                  style={{ width: `${pct / 2}%` }}
                                />
                              ) : (
                                <div
                                  className="absolute h-3 rounded-l bg-rose-400"
                                  style={{ width: `${pct / 2}%`, right: '50%' }}
                                />
                              )}
                            </div>
                            <span className={cn(
                              'w-14 text-[11px] font-semibold tabular-nums text-right',
                              isPos ? 'text-teal-600' : 'text-rose-600',
                            )}>
                              {fmtDelta(row.advantage)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 5 — Family Pass Rates Heatmap                               */}
      {/* ================================================================== */}
      {sortedFamilies && (
        <section className="py-12 border-t border-slate-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Family Pass Rates</CardTitle>
              <CardDescription>
                Averaged across models, sorted by difficulty (hardest first). 14 component families across 4 observation modes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-700">Family</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-browseruse">BU</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-axtree">AX-tree</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-som">SoM</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-pixel">Pixel</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFamilies.map((f: any, i: number) => (
                      <tr
                        key={f.family_id}
                        className={cn(
                          'transition-colors hover:bg-slate-100/60',
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                        )}
                      >
                        <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">{f.family}</td>
                        {(['browser_use', 'ax_tree', 'som', 'pixel', 'avg'] as const).map(k => {
                          const v = f[k] as number | null;
                          return (
                            <td key={k} className="py-2 px-3 text-center">
                              <PassCell v={v} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 6 — Per-Model Family Heatmap (tabbed)                       */}
      {/* ================================================================== */}
      {perModelFamily && (
        <section className="py-12 border-t border-slate-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Per-Model Family Breakdown</CardTitle>
              <CardDescription>
                Drill into each model's pass rates across all 14 families and 4 observation modes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200 pb-3">
                {Object.keys(perModelFamily).map(modelId => (
                  <button
                    key={modelId}
                    onClick={() => setSelectedModelTab(modelId)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      selectedModelTab === modelId
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-gray-600 hover:bg-slate-200',
                    )}
                  >
                    {modelNameFromId(modelId)}
                  </button>
                ))}
              </div>

              {/* Selected model table */}
              {selectedModelTab && perModelFamily[selectedModelTab] && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-semibold text-gray-700">Family</th>
                        {MODE_COLS.map(c => (
                          <th key={c.key} className={cn('py-2 px-3 font-semibold text-center', c.colorClass)}>
                            {c.short}
                          </th>
                        ))}
                        <th className="py-2 px-3 font-semibold text-center text-gray-500">Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(perModelFamily[selectedModelTab] as Record<string, Record<string, number>>)
                        .map(([famId, rates]) => {
                          const vals = Object.values(rates).filter((v): v is number => v != null);
                          const avg = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
                          return { famId, rates, avg };
                        })
                        .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))
                        .map(({ famId, rates, avg }, i) => (
                          <tr
                            key={famId}
                            className={cn(
                              'transition-colors hover:bg-slate-100/60',
                              i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                            )}
                          >
                            <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap text-xs">
                              {familyLabel(famId)}
                            </td>
                            {MODE_COLS.map(c => {
                              const v = (rates as any)[c.key] as number | undefined;
                              return (
                                <td key={c.key} className="py-2 px-3 text-center">
                                  <PassCell v={v ?? null} />
                                </td>
                              );
                            })}
                            <td className="py-2 px-3 text-center">
                              <PassCell v={avg} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 7 — Task Template Performance                               */}
      {/* ================================================================== */}
      {sortedTemplates && (
        <section className="py-12 border-t border-slate-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance by Task Template</CardTitle>
              <CardDescription>
                Pass rates across 24 task templates. Sorted by average difficulty (hardest first).
                {!showAllTemplates && sortedTemplates.length > 16 && ' Showing top 12 hardest + bottom 4 easiest.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-700">#</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-700">Template</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-browseruse">BU</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-axtree">AX</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-som">SoM</th>
                      <th className="py-2 px-3 font-semibold text-center text-mode-pixel">Px</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(visibleTemplates ?? []).map((t: any, i: number) => {
                      // Insert separator row if we're showing truncated view
                      const isInEasySection = !showAllTemplates && sortedTemplates!.length > 16 && i >= 12;
                      return (
                        <React.Fragment key={t.template}>
                          {isInEasySection && i === 12 && (
                            <tr>
                              <td colSpan={7} className="py-2 text-center text-xs text-gray-400 border-y border-dashed border-slate-200">
                                {'\u2022\u2022\u2022'} {sortedTemplates!.length - 16} templates hidden {'\u2022\u2022\u2022'}
                              </td>
                            </tr>
                          )}
                          <tr className={cn(
                            'transition-colors hover:bg-slate-100/60',
                            i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                          )}>
                            <td className="py-2 pr-2 text-xs text-gray-400 tabular-nums">
                              {isInEasySection
                                ? sortedTemplates!.length - (visibleTemplates!.length - 1 - i)
                                : i + 1}
                            </td>
                            <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap text-xs">
                              {t.template?.replace(/_/g, ' ')}
                            </td>
                            {(['browser_use', 'ax_tree', 'som', 'pixel'] as const).map(k => (
                              <td key={k} className="py-2 px-3 text-center">
                                <PassCell v={t[k] ?? null} />
                              </td>
                            ))}
                            <td className="py-2 px-3 text-center">
                              <PassCell v={t.avg ?? null} />
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {sortedTemplates.length > 16 && (
                <button
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showAllTemplates ? 'Show fewer' : `Show all ${sortedTemplates.length} templates`}
                </button>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 8 — Difficulty Analysis                                     */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Difficulty Analysis</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 8a: Tier breakdown */}
          {difficultyTiers ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tier Breakdown</CardTitle>
                <CardDescription>Pass rates by task difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-semibold text-gray-700">Tier</th>
                        <th className="py-2 px-3 font-semibold text-center text-mode-browseruse">BU</th>
                        <th className="py-2 px-3 font-semibold text-center text-mode-axtree">AX</th>
                        <th className="py-2 px-3 font-semibold text-center text-mode-som">SoM</th>
                        <th className="py-2 px-3 font-semibold text-center text-mode-pixel">Px</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(difficultyTiers as any[]).map((tier: any, i: number) => (
                        <tr key={tier.tier ?? i} className={cn(
                          'transition-colors hover:bg-slate-100/60',
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                        )}>
                          <td className="py-2 pr-4 font-medium text-gray-900">{tier.tier ?? `L${i}`}</td>
                          {(['browser_use', 'ax_tree', 'som', 'pixel'] as const).map(k => (
                            <td key={k} className="py-2 px-3 text-center">
                              <PassCell v={tier[k] ?? null} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-base">Tier Breakdown</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-400">Coming soon</p></CardContent>
            </Card>
          )}

          {/* 8b: Difficulty axis correlations */}
          {difficultyAxisCorr ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Which Difficulty Axes Predict Failure?</CardTitle>
                <CardDescription>
                  Pearson correlation between intended difficulty rating and agent failure rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-semibold text-gray-700">Axis</th>
                        <th className="py-2 px-2 font-semibold text-center text-gray-700">Overall</th>
                        <th className="py-2 px-2 font-semibold text-center text-mode-axtree">AX</th>
                        <th className="py-2 px-2 font-semibold text-center text-mode-pixel">Px</th>
                        <th className="py-2 px-2 font-semibold text-center text-mode-browseruse">BU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(difficultyAxisCorr as any[]).map((row: any, i: number) => (
                        <tr key={row.axis} className={cn(
                          'transition-colors hover:bg-slate-100/60',
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                        )}>
                          <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap text-xs">{row.axis}</td>
                          {(['overall', 'ax_tree', 'pixel', 'browser_use'] as const).map(k => (
                            <td key={k} className="py-2 px-2 text-center">
                              <span className={cn(
                                'inline-block rounded px-2 py-0.5 text-xs tabular-nums',
                                correlationColor(row[k] ?? null),
                              )}>
                                {row[k] != null ? row[k].toFixed(2) : '\u2014'}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-base">Difficulty Axis Correlations</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-400">Coming soon</p></CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 9 — Hardest Component Types                                 */}
      {/* ================================================================== */}
      {hardestTypes && (
        <section className="py-12 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Difficulty Inversion: Trivial for Humans, Hard for Agents</h2>
            <p className="text-gray-500 text-sm mt-1">
              Components where human step count is low but agent pass rate is disproportionately poor.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(hardestTypes as any[]).map((item: any) => (
              <Card key={item.type} className="relative overflow-hidden">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.type?.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Human: {item.human_steps} steps avg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-bold tabular-nums',
                        item.agent_pass < 40 ? 'text-red-600' : item.agent_pass < 55 ? 'text-yellow-600' : 'text-gray-700',
                      )}>
                        {item.agent_pass}%
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">agent pass</p>
                    </div>
                  </div>
                  {/* Visual: difficulty bar — humans always 100% pass */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-12 shrink-0">Human</span>
                    <div className="flex-1 h-2 bg-emerald-100 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded w-full" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium w-10 text-right">100%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-12 shrink-0">Agent</span>
                    <div className="flex-1 h-2 bg-red-100 rounded overflow-hidden">
                      <div className={cn('h-full rounded', barColor(item.agent_pass))} style={{ width: `${item.agent_pass}%` }} />
                    </div>
                    <span className="text-[10px] text-red-600 font-medium w-8 text-right">Hard</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 10 — ComponentBench-Core Results                            */}
      {/* ================================================================== */}
      <section className="py-12 border-t border-slate-200">
        {coreResults ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ComponentBench-Core (912 hard tasks)</CardTitle>
              <CardDescription>
                Pass rates drop 10{'\u2013'}39% from Full, confirming Core concentrates on unresolved families.
                {'\u2264'}H = within human step count, {'\u2264'}2H = within double, {'\u2264'}3H = within triple.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-700">Model</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">Mode</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">Pass</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">{'\u2264'}H</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">{'\u2264'}2H</th>
                      <th className="py-2 px-3 font-semibold text-center text-gray-700">{'\u2264'}3H</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(coreResults as any[]).map((row: any, i: number) => (
                      <tr key={i} className={cn(
                        'transition-colors hover:bg-slate-100/60',
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                      )}>
                        <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">{row.model}</td>
                        <td className="py-2 px-3 text-center text-xs text-gray-700">{row.mode}</td>
                        <td className="py-2 px-3 text-center">
                          <PassCell v={row.pass ?? null} />
                        </td>
                        <td className="py-2 px-3 text-center text-xs tabular-nums text-gray-700">
                          {row.leq_h != null ? row.leq_h.toFixed(1) : '\u2014'}
                        </td>
                        <td className="py-2 px-3 text-center text-xs tabular-nums text-gray-700">
                          {row.leq_2h != null ? row.leq_2h.toFixed(1) : '\u2014'}
                        </td>
                        <td className="py-2 px-3 text-center text-xs tabular-nums text-gray-700">
                          {row.leq_3h != null ? row.leq_3h.toFixed(1) : '\u2014'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader><CardTitle className="text-lg">ComponentBench-Core (912 hard tasks)</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-gray-400">Coming soon</p></CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
