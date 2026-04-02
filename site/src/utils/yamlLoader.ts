/**
 * YAML Loader for task specifications
 * 
 * Since we're in a browser environment, we pre-load YAML content at build time
 * and convert it to JSON for runtime use.
 */

import type { TaskSpec } from '../types';

// For client-side, we'll load tasks from a pre-built JSON endpoint
// The YAML files are processed at build time

/**
 * Parse YAML content to TaskSpec array
 * This is used at build time to convert YAML to JSON
 */
export function parseTasksYaml(yamlContent: string): TaskSpec[] {
  // Dynamic import for server-side only
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const yaml = require('js-yaml');
  return yaml.load(yamlContent) as TaskSpec[];
}

/**
 * Load tasks from the API endpoint
 * Tasks are pre-processed from YAML files
 */
export async function loadTasksFromApi(canonicalType: string): Promise<TaskSpec[]> {
  try {
    const response = await fetch(`/api/tasks/${canonicalType}`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}
