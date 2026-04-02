/**
 * Task Registry
 *
 * Manages task specifications loaded from YAML files.
 * Provides filtering by factors and library.
 * Version-aware: passes `bench` param to API calls.
 */

import type { TaskSpec, SceneContext, Library, FilterFactors, BenchmarkVersion } from '../types';

const taskCache: Map<string, TaskSpec[]> = new Map();

function cacheKey(canonicalType: string, bench: BenchmarkVersion = 'v1'): string {
  return `${bench}:${canonicalType}`;
}

export async function loadTasks(canonicalType: string, bench: BenchmarkVersion = 'v1'): Promise<TaskSpec[]> {
  const key = cacheKey(canonicalType, bench);
  if (taskCache.has(key)) {
    return taskCache.get(key)!;
  }

  try {
    const response = await fetch(`/api/tasks/${canonicalType}?bench=${bench}`);
    if (!response.ok) return [];
    const tasks = await response.json();
    taskCache.set(key, tasks);
    return tasks;
  } catch {
    return [];
  }
}

export async function getTasks(
  canonicalType: string,
  library: Library,
  bench: BenchmarkVersion = 'v1'
): Promise<TaskSpec[]> {
  const allTasks = await loadTasks(canonicalType, bench);
  return allTasks.filter(task => task.implementation_source === library);
}

export async function getTaskById(taskId: string, bench: BenchmarkVersion = 'v1'): Promise<TaskSpec | null> {
  // v1 IDs: <canonical_type>-<library>-T<number>
  // v2 IDs: <canonical_type>-external-v2-T<number> (or similar)
  const libraryMatch = taskId.match(/-(antd|mui|mantine|external)-(v2-)?T\d+$/);
  if (!libraryMatch) return null;

  const libraryIndex = taskId.lastIndexOf(libraryMatch[0]);
  const canonicalType = taskId.substring(0, libraryIndex);

  if (!canonicalType) return null;

  const tasks = await loadTasks(canonicalType, bench);
  return tasks.find(task => task.id === taskId) || null;
}

export function filterTasksByFactors(
  tasks: TaskSpec[],
  factors: FilterFactors
): TaskSpec[] {
  return tasks.filter(task => {
    for (const [key, value] of Object.entries(factors)) {
      if (value === 'all') continue;
      const factorKey = key as keyof SceneContext;
      if (task.scene_context[factorKey] !== value) {
        return false;
      }
    }
    return true;
  });
}

export function getFactorValuesFromTasks(
  tasks: TaskSpec[],
  factorKey: keyof SceneContext
): Set<SceneContext[typeof factorKey]> {
  const values = new Set<SceneContext[typeof factorKey]>();
  for (const task of tasks) {
    values.add(task.scene_context[factorKey]);
  }
  return values;
}

export async function hasTasksForType(canonicalType: string, bench: BenchmarkVersion = 'v1'): Promise<boolean> {
  const tasks = await loadTasks(canonicalType, bench);
  return tasks.length > 0;
}

export async function hasTasksForTypeAndLibrary(
  canonicalType: string,
  library: Library,
  bench: BenchmarkVersion = 'v1'
): Promise<boolean> {
  const tasks = await getTasks(canonicalType, library, bench);
  return tasks.length > 0;
}

export async function getTaskCount(
  canonicalType: string,
  library: Library,
  bench: BenchmarkVersion = 'v1'
): Promise<number> {
  const tasks = await getTasks(canonicalType, library, bench);
  return tasks.length;
}

export function clearTaskCache(): void {
  taskCache.clear();
}
