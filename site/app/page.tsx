'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { families, canonicalComponents, getFamilySections, TOTAL_CANONICAL_TYPES, TOTAL_FAMILIES } from '@/ontology/ontology';
import { V2_UNITS, TOTAL_V2_UNITS } from '@/ontology/v2Units';
import { isImplemented, getRecommendedTemplates, getImplementedCount } from '@/registry/componentRegistry';
import { filterTasksByFactors } from '@/registry/taskRegistry';
import type { Library, LibraryFilter, SceneContext, TaskSpec, CanonicalComponent, FilterFactors, ViewMode, BenchmarkVersion } from '@/types';
import { FACTOR_OPTIONS, DEFAULT_FILTER_FACTORS, DEFAULT_BENCHMARK_VERSION, BENCHMARK_VERSIONS } from '@/types';
import { getViewMode, setViewMode as saveViewMode, getTaskUrlWithMode } from '@/utils/viewMode';
import { parseBenchVersionFromUrl, setBenchmarkVersion, getBenchmarkVersion } from '@/lib/benchmarkVersion';
import dynamic from 'next/dynamic';

const LogModeDashboard = dynamic(() => import('@/components/LogModeDashboard'), { ssr: false });

import taskIndexV1 from '@/generated/task-index-v1.json';
import taskIndexV2 from '@/generated/task-index-v2.json';

interface SafeTaskEntry {
  id: string;
  name: string;
  canonical_type: string;
  implementation_source: 'antd' | 'mui' | 'mantine' | 'external';
  implementation_variant?: string | null;
  task_template: string;
  secondary_template: string | null;
  difficulty_bucket: string;
  tier: string;
  scene_context: {
    theme: string;
    spacing: string;
    layout: string;
    placement: string;
    scale: string;
    instances: number;
    guidance: string;
    clutter: string;
  };
}

const LIBRARY_COLORS: Record<LibraryFilter, string> = {
  all: '#1890ff',
  antd: '#1677ff',
  mui: '#1976d2',
  mantine: '#339af0',
};

const VERSION_COLORS: Record<BenchmarkVersion, string> = {
  v1: '#52c41a',
  v2: '#eb2f96',
};

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f5' }} />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const [selectedLib, setSelectedLib] = useState<LibraryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [factors, setFactors] = useState<FilterFactors>({ ...DEFAULT_FILTER_FACTORS });
  const [viewMode, setViewModeState] = useState<ViewMode>('presentation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLogMode = searchParams.get('mode') === 'log';

  // Benchmark version from URL param, falling back to localStorage
  const benchFromUrl = parseBenchVersionFromUrl(searchParams);
  const [benchVersion, setBenchVersionState] = useState<BenchmarkVersion>(benchFromUrl);

  useEffect(() => {
    const urlV = parseBenchVersionFromUrl(searchParams);
    if (urlV !== DEFAULT_BENCHMARK_VERSION) {
      setBenchVersionState(urlV);
      setBenchmarkVersion(urlV);
    } else {
      const stored = getBenchmarkVersion();
      setBenchVersionState(stored);
    }
  }, [searchParams]);

  useEffect(() => {
    setViewModeState(getViewMode());
  }, []);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    saveViewMode(mode);
    if (isLogMode) {
      router.push(`/?bench=${benchVersion}`);
    }
  };

  const handleSetBenchVersion = (v: BenchmarkVersion) => {
    setBenchVersionState(v);
    setBenchmarkVersion(v);
    const params = new URLSearchParams(searchParams.toString());
    params.set('bench', v);
    router.push(`/?${params.toString()}`);
  };

  const activeIndex = benchVersion === 'v2' ? taskIndexV2 : taskIndexV1;

  const tasksByType = useMemo(() => {
    const grouped: Record<string, SafeTaskEntry[]> = {};

    for (const task of activeIndex.tasks as SafeTaskEntry[]) {
      if (selectedLib !== 'all' && task.implementation_source !== selectedLib) {
        continue;
      }

      if (!grouped[task.canonical_type]) {
        grouped[task.canonical_type] = [];
      }
      grouped[task.canonical_type].push(task);
    }

    return grouped;
  }, [selectedLib, activeIndex]);

  const familySections = useMemo(() => getFamilySections(), []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return familySections;

    const query = searchQuery.toLowerCase();
    return familySections
      .map(section => ({
        ...section,
        components: section.components.filter(c =>
          c.displayName.toLowerCase().includes(query) ||
          c.type.toLowerCase().includes(query)
        ),
      }))
      .filter(section => section.components.length > 0);
  }, [familySections, searchQuery]);

  const implementedCount = getImplementedCount(selectedLib === 'all' ? 'antd' : selectedLib);

  const resetFactors = () => {
    setFactors({ ...DEFAULT_FILTER_FACTORS });
  };

  const updateFactor = <K extends keyof FilterFactors>(key: K, value: FilterFactors[K]) => {
    setFactors(prev => ({ ...prev, [key]: value }));
  };

  const versionLabel = benchVersion === 'v2' ? 'v2 (WIP)' : 'v0.5';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>ComponentBench</h1>
              <p style={{ margin: '8px 0 0', color: '#666' }}>{versionLabel} – Component-level Web Benchmark</p>
            </div>

            {/* Version switch */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#999', marginRight: 4 }}>Bench:</span>
              {BENCHMARK_VERSIONS.map(v => (
                <button
                  key={v}
                  onClick={() => handleSetBenchVersion(v)}
                  style={{
                    padding: '4px 12px',
                    border: `2px solid ${benchVersion === v ? VERSION_COLORS[v] : '#d9d9d9'}`,
                    borderRadius: 6,
                    background: benchVersion === v ? (v === 'v2' ? '#fff0f6' : '#f6ffed') : '#fff',
                    color: benchVersion === v ? VERSION_COLORS[v] : '#333',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 32 }}>
            {benchVersion === 'v1' ? (
              <>
                <div>
                  <span style={{ color: '#999', fontSize: 12 }}>Canonical Types</span>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{activeIndex.canonical_types.length}</div>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: 12 }}>Families</span>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{TOTAL_FAMILIES}</div>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: 12 }}>Implemented</span>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>{implementedCount}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span style={{ color: '#999', fontSize: 12 }}>Generation Units</span>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{TOTAL_V2_UNITS}</div>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: 12 }}>Components</span>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{activeIndex.canonical_types.length}</div>
                </div>
              </>
            )}
            <div>
              <span style={{ color: '#999', fontSize: 12 }}>Total Tasks</span>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{activeIndex.total_tasks}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Top row: Search, Library, Reset */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 6, width: 200 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#666' }}>Library:</span>
              {(['all', 'antd', 'mui', 'mantine'] as LibraryFilter[]).map(lib => (
                <button
                  key={lib}
                  onClick={() => setSelectedLib(lib)}
                  style={{
                    padding: '6px 12px',
                    border: `2px solid ${selectedLib === lib ? LIBRARY_COLORS[lib] : '#d9d9d9'}`,
                    borderRadius: 6,
                    background: selectedLib === lib ? LIBRARY_COLORS[lib] : '#fff',
                    color: selectedLib === lib ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {lib === 'all' ? 'ALL' : lib}
                </button>
              ))}
            </div>

            <button
              onClick={resetFactors}
              style={{
                padding: '6px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                background: '#fff',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              Reset Factors
            </button>

            {/* Mode toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <span style={{ fontSize: 14, color: '#666' }}>Mode:</span>
              <button
                onClick={() => handleSetViewMode('presentation')}
                style={{
                  padding: '6px 12px',
                  border: `2px solid ${!isLogMode && viewMode === 'presentation' ? '#52c41a' : '#d9d9d9'}`,
                  borderRadius: 6,
                  background: !isLogMode && viewMode === 'presentation' ? '#f6ffed' : '#fff',
                  color: !isLogMode && viewMode === 'presentation' ? '#52c41a' : '#333',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                Presentation
              </button>
              <button
                onClick={() => handleSetViewMode('benchmark')}
                style={{
                  padding: '6px 12px',
                  border: `2px solid ${!isLogMode && viewMode === 'benchmark' ? '#fa8c16' : '#d9d9d9'}`,
                  borderRadius: 6,
                  background: !isLogMode && viewMode === 'benchmark' ? '#fff7e6' : '#fff',
                  color: !isLogMode && viewMode === 'benchmark' ? '#fa8c16' : '#333',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                Benchmark
              </button>
              <Link
                href={`/?mode=log&bench=${benchVersion}`}
                prefetch={false}
                style={{
                  padding: '6px 12px',
                  border: `2px solid ${isLogMode ? '#722ed1' : '#d9d9d9'}`,
                  borderRadius: 6,
                  background: isLogMode ? '#f9f0ff' : '#fff',
                  color: isLogMode ? '#722ed1' : '#333',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 13,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Logs
              </Link>
            </div>
          </div>

          {/* Factor dropdowns - 2 rows of 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <FactorSelect
              label="E1: THEME"
              value={factors.theme}
              options={FACTOR_OPTIONS.theme}
              onChange={v => updateFactor('theme', v as FilterFactors['theme'])}
              isDefault={factors.theme === 'all'}
            />
            <FactorSelect
              label="E2: SPACING"
              value={factors.spacing}
              options={FACTOR_OPTIONS.spacing}
              onChange={v => updateFactor('spacing', v as FilterFactors['spacing'])}
              isDefault={factors.spacing === 'all'}
            />
            <FactorSelect
              label="E3: LAYOUT"
              value={factors.layout}
              options={FACTOR_OPTIONS.layout}
              onChange={v => updateFactor('layout', v as FilterFactors['layout'])}
              isDefault={factors.layout === 'all'}
            />
            <FactorSelect
              label="E4: PLACEMENT"
              value={factors.placement}
              options={FACTOR_OPTIONS.placement}
              onChange={v => updateFactor('placement', v as FilterFactors['placement'])}
              isDefault={factors.placement === 'all'}
            />
            <FactorSelect
              label="E5: SCALE"
              value={factors.scale}
              options={FACTOR_OPTIONS.scale}
              onChange={v => updateFactor('scale', v as FilterFactors['scale'])}
              isDefault={factors.scale === 'all'}
            />
            <FactorSelect
              label="E6: INSTANCES"
              value={String(factors.instances)}
              options={FACTOR_OPTIONS.instances.map(String)}
              onChange={v => updateFactor('instances', v === 'all' ? 'all' : Number(v) as FilterFactors['instances'])}
              isDefault={factors.instances === 'all'}
            />
            <FactorSelect
              label="E7: GUIDANCE"
              value={factors.guidance}
              options={FACTOR_OPTIONS.guidance}
              onChange={v => updateFactor('guidance', v as FilterFactors['guidance'])}
              isDefault={factors.guidance === 'all'}
            />
            <FactorSelect
              label="E8: CLUTTER"
              value={factors.clutter}
              options={FACTOR_OPTIONS.clutter}
              onChange={v => updateFactor('clutter', v as FilterFactors['clutter'])}
              isDefault={factors.clutter === 'all'}
            />
          </div>
        </div>
      </div>

      {/* Component Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {isLogMode ? (
          <LogModeDashboard selectedLib={selectedLib} benchVersion={benchVersion} />
        ) : benchVersion === 'v2' ? (
        <>
        {V2_UNITS.filter(unit => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return unit.title.toLowerCase().includes(q) ||
            unit.id.toLowerCase().includes(q) ||
            unit.members.some(m => m.toLowerCase().includes(q));
        }).map(unit => {
          const unitTasks = unit.members.flatMap(m => tasksByType[m] || []);
          const matchingTasks = filterSafeTasksByFactors(unitTasks, factors);
          return (
            <section key={unit.id} style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: '#333',
                borderBottom: '2px solid #e8e8e8',
                paddingBottom: 8,
              }}>
                {unit.title}
                <span style={{ color: '#999', fontWeight: 400, marginLeft: 8, fontSize: 14 }}>
                  {unit.members.length} component{unit.members.length > 1 ? 's' : ''} · {unitTasks.length} tasks
                </span>
              </h2>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                {unit.members.map(m => m.replace(/_/g, ' ')).join(', ')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {unit.members.map(member => {
                  const memberTasks = tasksByType[member] || [];
                  return (
                    <V2UnitMemberCard
                      key={member}
                      canonicalType={member}
                      tasks={memberTasks}
                      factors={factors}
                      viewMode={viewMode}
                      benchVersion={benchVersion}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
        </>
        ) : (
        <>
        {filteredSections.map(section => (
          <section key={section.family.id} style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 16,
              color: '#333',
              borderBottom: '2px solid #e8e8e8',
              paddingBottom: 8,
            }}>
              {section.family.name}
              <span style={{ color: '#999', fontWeight: 400, marginLeft: 8 }}>
                ({section.components.length})
              </span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {section.components.map(component => (
                <ComponentCard
                  key={component.type}
                  component={component}
                  library={selectedLib}
                  tasks={tasksByType[component.type] || []}
                  factors={factors}
                  viewMode={viewMode}
                  benchVersion={benchVersion}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredSections.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
            No components found matching &quot;{searchQuery}&quot;
          </div>
        )}
        </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '16px 24px', textAlign: 'center', color: '#999', fontSize: 14 }}>
        {benchVersion === 'v1'
          ? `ComponentBench ${versionLabel} | ${implementedCount}/${TOTAL_CANONICAL_TYPES} Implemented | ${activeIndex.total_tasks} Total Tasks`
          : `ComponentBench ${versionLabel} | ${TOTAL_V2_UNITS} Units | ${activeIndex.canonical_types.length} Components | ${activeIndex.total_tasks} Tasks`
        }
      </footer>
    </div>
  );
}

function FactorSelect({
  label,
  value,
  options,
  onChange,
  isDefault,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  isDefault: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '8px 10px',
          border: `1px solid ${isDefault ? '#d9d9d9' : '#1677ff'}`,
          borderRadius: 6,
          background: isDefault ? '#fff' : '#f0f7ff',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt === 'all' ? '(All)' : String(opt).replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}

function filterSafeTasksByFactors(tasks: SafeTaskEntry[], factors: FilterFactors): SafeTaskEntry[] {
  return tasks.filter(task => {
    const ctx = task.scene_context;
    if (factors.theme !== 'all' && ctx.theme !== factors.theme) return false;
    if (factors.spacing !== 'all' && ctx.spacing !== factors.spacing) return false;
    if (factors.layout !== 'all' && ctx.layout !== factors.layout) return false;
    if (factors.placement !== 'all' && ctx.placement !== factors.placement) return false;
    if (factors.scale !== 'all' && ctx.scale !== factors.scale) return false;
    if (factors.instances !== 'all' && ctx.instances !== factors.instances) return false;
    if (factors.guidance !== 'all' && ctx.guidance !== factors.guidance) return false;
    if (factors.clutter !== 'all' && ctx.clutter !== factors.clutter) return false;
    return true;
  });
}

function ComponentCard({
  component,
  library,
  tasks,
  factors,
  viewMode,
  benchVersion,
}: {
  component: CanonicalComponent;
  library: LibraryFilter;
  tasks: SafeTaskEntry[];
  factors: FilterFactors;
  viewMode: ViewMode;
  benchVersion: BenchmarkVersion;
}) {
  const implemented = library === 'all'
    ? isImplemented(component.type, 'antd') || isImplemented(component.type, 'mui') || isImplemented(component.type, 'mantine')
    : isImplemented(component.type, library);
  const recommendedTemplates = getRecommendedTemplates(component.type);

  const matchingTasks = useMemo(() => {
    return filterSafeTasksByFactors(tasks, factors);
  }, [tasks, factors]);

  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    if (matchingTasks.length > 0 && !matchingTasks.find(t => t.id === selectedTaskId)) {
      setSelectedTaskId(matchingTasks[0].id);
    }
  }, [matchingTasks, selectedTaskId]);

  const hasMatchingTasks = matchingTasks.length > 0;
  const hasTasks = tasks.length > 0;
  const isReady = benchVersion === 'v2' ? hasTasks : implemented;

  return (
    <div
      style={{
        padding: 16,
        background: isReady ? '#fff' : '#fafafa',
        border: `1px solid ${isReady ? '#e8e8e8' : '#f0f0f0'}`,
        borderRadius: 8,
        opacity: isReady ? 1 : 0.7,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: isReady ? '#333' : '#999' }}>
          {component.displayName}
        </h3>
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            background: isReady
              ? (viewMode === 'benchmark' ? '#fff7e6' : '#f6ffed')
              : '#fafafa',
            color: isReady
              ? (viewMode === 'benchmark' ? '#fa8c16' : '#52c41a')
              : '#999',
            borderRadius: 4,
            border: `1px solid ${isReady
              ? (viewMode === 'benchmark' ? '#ffd591' : '#b7eb8f')
              : '#d9d9d9'}`,
          }}
        >
          {isReady ? (benchVersion === 'v2' ? `${tasks.length} tasks` : 'Ready') : (benchVersion === 'v2' ? 'No v2 tasks' : 'TODO')}
        </span>
      </div>

      {!isReady && benchVersion === 'v1' && recommendedTemplates.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Recommended tasks:</div>
          {recommendedTemplates.slice(0, 3).map(template => (
            <div key={template} style={{ fontSize: 11, color: '#666', padding: '2px 0' }}>
              • {template}
            </div>
          ))}
        </div>
      )}

      {isReady && (
        <div style={{ marginBottom: 12 }}>
          {hasMatchingTasks ? (
            <select
              value={selectedTaskId}
              onChange={e => setSelectedTaskId(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {matchingTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.id}: {task.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 12,
                background: '#f5f5f5',
                color: '#999',
              }}
            >
              <option>No tasks match current factors</option>
            </select>
          )}
        </div>
      )}

      {isReady ? (
        hasMatchingTasks ? (
          <Link
            href={getTaskUrlWithMode(selectedTaskId, viewMode, benchVersion)}
            prefetch={false}
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '8px 16px',
              background: LIBRARY_COLORS[library],
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Open Task
          </Link>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '8px 16px',
              background: '#f5f5f5',
              color: '#999',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            No matching tasks
          </div>
        )
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '8px 16px',
            background: '#f5f5f5',
            color: '#999',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {benchVersion === 'v2' ? 'No v2 Tasks Yet' : 'Not Implemented'}
        </div>
      )}
    </div>
  );
}

function V2UnitMemberCard({
  canonicalType,
  tasks,
  factors,
  viewMode,
  benchVersion,
}: {
  canonicalType: string;
  tasks: SafeTaskEntry[];
  factors: FilterFactors;
  viewMode: ViewMode;
  benchVersion: BenchmarkVersion;
}) {
  const matchingTasks = useMemo(() => {
    return filterSafeTasksByFactors(tasks, factors);
  }, [tasks, factors]);

  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    if (matchingTasks.length > 0 && !matchingTasks.find(t => t.id === selectedTaskId)) {
      setSelectedTaskId(matchingTasks[0].id);
    }
  }, [matchingTasks, selectedTaskId]);

  const hasTasks = tasks.length > 0;
  const hasMatchingTasks = matchingTasks.length > 0;
  const displayName = canonicalType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div
      style={{
        padding: 16,
        background: hasTasks ? '#fff' : '#fafafa',
        border: `1px solid ${hasTasks ? '#e8e8e8' : '#f0f0f0'}`,
        borderRadius: 8,
        opacity: hasTasks ? 1 : 0.6,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: hasTasks ? '#333' : '#999' }}>
          {displayName}
        </h3>
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            background: hasTasks ? '#fff0f6' : '#fafafa',
            color: hasTasks ? '#eb2f96' : '#999',
            borderRadius: 4,
            border: `1px solid ${hasTasks ? '#ffadd2' : '#d9d9d9'}`,
          }}
        >
          {hasTasks ? `${tasks.length} tasks` : 'Pending'}
        </span>
      </div>

      {hasTasks && (
        <div style={{ marginBottom: 12 }}>
          {hasMatchingTasks ? (
            <select
              value={selectedTaskId}
              onChange={e => setSelectedTaskId(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {matchingTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.id}: {task.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                fontSize: 12,
                background: '#f5f5f5',
                color: '#999',
              }}
            >
              <option>No tasks match current factors</option>
            </select>
          )}
        </div>
      )}

      {hasTasks && hasMatchingTasks ? (
        <Link
          href={getTaskUrlWithMode(selectedTaskId, viewMode, benchVersion)}
          prefetch={false}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '8px 16px',
            background: '#eb2f96',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Open Task
        </Link>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '8px 16px',
            background: '#f5f5f5',
            color: '#999',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {hasTasks ? 'No matching tasks' : 'No v2 tasks yet'}
        </div>
      )}
    </div>
  );
}
