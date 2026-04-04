'use client';

import { useState } from 'react';
import Link from 'next/link';
// Framer Motion animations temporarily disabled for compatibility
// import { motion, type Variants } from 'framer-motion';
import {
  Layers,
  Target,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Code,
  Database,
  BookOpen,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import modelResults from '@/generated/model-results.json';
import comparisonMatrix from '@/generated/comparison-matrix.json';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionProps: any = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4, ease: 'easeOut' },
};

const staggerProps: any = {
  initial: { opacity: 1 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-60px' },
  variants: staggerContainer,
};

/* ------------------------------------------------------------------ */
/*  Mode metadata                                                      */
/* ------------------------------------------------------------------ */

const modes = [
  {
    key: 'ax_tree',
    label: 'AX-tree',
    color: 'bg-mode-axtree',
    border: 'border-mode-axtree',
    text: 'text-mode-axtree',
    description: 'Screenshot + accessibility tree text',
  },
  {
    key: 'som',
    label: 'SoM',
    color: 'bg-mode-som',
    border: 'border-mode-som',
    text: 'text-mode-som',
    description: 'Screenshot + numbered bounding boxes',
  },
  {
    key: 'pixel',
    label: 'Pixel',
    color: 'bg-mode-pixel',
    border: 'border-mode-pixel',
    text: 'text-mode-pixel',
    description: 'Raw screenshot only, coordinate actions',
  },
  {
    key: 'browser_use',
    label: 'Browser-Use',
    color: 'bg-mode-browseruse',
    border: 'border-mode-browseruse',
    text: 'text-mode-browseruse',
    description: 'Screenshot + serialized DOM + tools',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function passRateColor(rate: number | null): string {
  if (rate === null) return 'bg-gray-100 text-gray-400';
  if (rate >= 85) return 'bg-emerald-100 text-emerald-800';
  if (rate >= 70) return 'bg-green-50 text-green-700';
  if (rate >= 50) return 'bg-yellow-50 text-yellow-700';
  return 'bg-red-50 text-red-700';
}

function barColor(rate: number): string {
  if (rate >= 85) return 'bg-emerald-500';
  if (rate >= 70) return 'bg-green-400';
  if (rate >= 55) return 'bg-yellow-400';
  return 'bg-red-400';
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [activeMode, setActiveMode] = useState(0);

  const { families, highlights } = modelResults;

  // Sort families by avg_pass_rate ascending (hardest first)
  const sortedFamilies = [...families].sort(
    (a, b) => a.avg_pass_rate - b.avg_pass_rate
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================================ */}
      {/*  Section 1: Hero                                              */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
            {/* Left column */}
            <div
              className="lg:col-span-3"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                The UI interactions that{' '}
                <span className="bg-gradient-to-r from-mode-axtree to-mode-browseruse bg-clip-text text-transparent">
                  still break
                </span>{' '}
                computer-use agents
              </h1>

              <p className="mt-6 max-w-xl text-lg text-gray-600">
                97 canonical component types. 2,910 verified tasks. Four
                observation spaces. One benchmark to diagnose where
                computer-use agents fail on modern web UIs.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500">
                <span>97 types</span>
                <span className="text-gray-300">&middot;</span>
                <span>14 families</span>
                <span className="text-gray-300">&middot;</span>
                <span>2,910 tasks</span>
                <span className="text-gray-300">&middot;</span>
                <span>912 Core</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/benchmark">Explore the Benchmark</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/compare">Compare Models</Link>
                </Button>
              </div>
            </div>

            {/* Right column — Mode comparison card */}
            <div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <Card className="overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {modes.map((mode, i) => (
                    <button
                      key={mode.key}
                      onClick={() => setActiveMode(i)}
                      className={`flex-1 px-3 py-3 text-xs font-semibold transition-colors sm:text-sm ${
                        activeMode === i
                          ? `${mode.text} bg-gray-50`
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Active panel */}
                <div
                  className={`border-t-2 ${modes[activeMode].border}`}
                >
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${modes[activeMode].color}`}
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {modes[activeMode].label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {modes[activeMode].description}
                    </p>

                    {/* Mini pass-rate bar */}
                    <div className="mt-5 space-y-2">
                      {modelResults.models.slice(0, 3).map((model) => {
                        const modeKey = modes[activeMode].key;
                        const modeData =
                          model.modes[modeKey as keyof typeof model.modes];
                        const rate = modeData?.pass_rate ?? null;
                        return (
                          <div key={model.id} className="flex items-center gap-3">
                            <span className="w-28 truncate text-xs text-gray-500">
                              {model.name}
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                              {rate !== null && (
                                <div
                                  className={`h-full rounded-full ${modes[activeMode].color}`}
                                  style={{ width: `${rate}%` }}
                                />
                              )}
                            </div>
                            <span className="w-12 text-right text-xs font-medium text-gray-700">
                              {rate !== null ? `${rate}%` : '--'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </div>

                <p className="border-t border-gray-100 px-6 py-3 text-center text-xs text-gray-400">
                  Same task. Different interface. Different result.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-gray-50/80 to-white" />
      </section>

      {/* ============================================================ */}
      {/*  Section 2: Why this benchmark                                */}
      {/* ============================================================ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div {...sectionProps} className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why this benchmark
            </h2>
          </div>

          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
                     >
            {[
              {
                icon: Layers,
                iconBg: 'bg-indigo-100 text-mode-axtree',
                title: 'Long-horizon benchmarks hide root causes',
                body: 'When an agent fails a multi-step workflow, which step broke? ComponentBench isolates the answer at the component level.',
              },
              {
                icon: Target,
                iconBg: 'bg-amber-100 text-mode-som',
                title: 'Grounding benchmarks stop too early',
                body: "Static localization tests don't capture dynamic interactions \u2014 dropdowns, drag operations, nested overlays \u2014 that define real UI use.",
              },
              {
                icon: AlertTriangle,
                iconBg: 'bg-rose-100 text-mode-pixel',
                title: 'One brittle interaction sinks a workflow',
                body: 'Five steps at 80% reliability = 33% end-to-end success. ComponentBench measures the interactions that actually matter.',
              },
            ].map((card) => (
              <div key={card.title}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {card.body}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3: Evidence strip                                    */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
                     >
            {[
              {
                number: '>30',
                suffix: 'pp',
                label: 'pass rate shift within one model',
                explanation:
                  'Changing observation space shifts GPT-5 mini from 87% to 49%',
              },
              {
                number: '3.7',
                suffix: '\u00d7',
                label: 'slower than humans',
                explanation:
                  'Even the fastest agent configuration vs. human reference traces',
              },
              {
                number: '<60',
                suffix: '%',
                label: 'on spatial manipulation',
                explanation:
                  'Sliders, splitters, and drag-and-drop remain unsolved',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-900">
                  {stat.number}
                  <span className="text-2xl text-gray-500">{stat.suffix}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-500">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {stat.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4: Family Gallery                                    */}
      {/* ============================================================ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div {...sectionProps} className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              14 Interaction Families
            </h2>
            <p className="mt-3 text-gray-600">
              From buttons to rich text editors &mdash; every component type a
              computer-use agent might encounter
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
                     >
            {sortedFamilies.map((family) => (
              <div
                key={family.id}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Link href={`/benchmark#${family.id}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight text-gray-900">
                          {family.name}
                        </h3>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {family.component_count} types
                        </Badge>
                      </div>

                      {/* Pass rate bar */}
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full transition-all ${barColor(family.avg_pass_rate)}`}
                            style={{ width: `${family.avg_pass_rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {family.avg_pass_rate}%
                        </span>
                      </div>

                      {/* Component list */}
                      <p className="truncate text-xs text-gray-400">
                        {family.components
                          .slice(0, 4)
                          .map((c: string) => c.replace(/_/g, ' '))
                          .join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5: Model Comparison Teaser                           */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div {...sectionProps} className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How Models Compare
            </h2>
            <p className="mt-3 text-gray-600">
              Pass rates across observation spaces on ComponentBench-Full
            </p>
          </div>

          <div
                       className="overflow-x-auto"
          >
            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th className="px-3 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-mode-browseruse">
                    Browser-Use
                  </th>
                  <th className="px-3 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-mode-axtree">
                    AX-tree
                  </th>
                  <th className="px-3 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-mode-som">
                    SoM
                  </th>
                  <th className="px-3 pb-3 text-center text-xs font-semibold uppercase tracking-wider text-mode-pixel">
                    Pixel
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.matrix.map((row, i) => (
                  <tr
                    key={row.model}
                    className={`border-b border-gray-100 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                      {row.model}
                    </td>
                    {(
                      ['browser_use', 'ax_tree', 'som', 'pixel'] as const
                    ).map((modeKey) => {
                      const val = row[modeKey];
                      return (
                        <td key={modeKey} className="px-3 py-3 text-center">
                          <span
                            className={`inline-block rounded-md px-2.5 py-1 text-sm font-semibold ${passRateColor(val)}`}
                          >
                            {val !== null ? `${val}%` : '\u2014'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
                       className="mt-8 text-center"
          >
            <Button variant="outline" asChild>
              <Link href="/compare">
                View full comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 6: How ComponentBench Works                          */}
      {/* ============================================================ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div {...sectionProps} className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
          </div>

          <div
            className="relative grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
                     >
            {/* Connecting line (desktop only) */}
            <div className="absolute left-0 right-0 top-6 z-0 hidden h-0.5 bg-gray-200 md:block" />

            {[
              {
                step: 1,
                title: 'Ontology',
                desc: '97 canonical types organized into 14 interaction families from WAI-ARIA patterns',
              },
              {
                step: 2,
                title: 'Implementation',
                desc: 'Each type implemented across Ant Design, MUI, and Mantine as live Next.js pages',
              },
              {
                step: 3,
                title: 'Verification',
                desc: 'Every task executed twice by a human annotator, cleaned into reference traces',
              },
              {
                step: 4,
                title: 'Evaluation',
                desc: 'Agents tested under AX-tree, SoM, Pixel, and Browser-Use observation spaces',
              },
              {
                step: 5,
                title: 'Diagnosis',
                desc: 'Three-layer diagnostic pipeline: task packets \u2192 component reports \u2192 family analysis',
              },
            ].map((item) => (
              <div
                key={item.step}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex flex-col items-center text-center md:px-3"
              >
                <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-sm font-bold text-gray-900">
                  {item.step}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 7: Artifacts & Links                                 */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
                     >
            {[
              {
                icon: ExternalLink,
                title: 'Read the Paper',
                desc: 'ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents',
                tag: 'Paper',
                href: '#',
              },
              {
                icon: Code,
                title: 'View Source',
                desc: 'Benchmark code, task specs, evaluation harness',
                tag: 'GitHub',
                href: '#',
              },
              {
                icon: Database,
                title: 'Download Data',
                desc: '2,910 task YAMLs, human traces, model results',
                tag: 'Dataset',
                href: '#',
              },
              {
                icon: BookOpen,
                title: 'Documentation',
                desc: 'Observation modes, task structure, running evaluations',
                tag: 'Docs',
                href: '#',
              },
            ].map((artifact) => (
              <div
                key={artifact.title}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <a href={artifact.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <artifact.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-1 text-base font-semibold text-gray-900">
                        {artifact.title}
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-gray-500">
                        {artifact.desc}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {artifact.tag}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
