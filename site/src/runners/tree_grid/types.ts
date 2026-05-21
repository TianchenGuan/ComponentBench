import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific tree_grid components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Tree grid row structure - combines tree hierarchy with table columns
 */
export interface TreeGridRow {
  key: string;
  service: string;
  owner: string;
  status: 'Active' | 'Paused' | 'Blocked';
  lastUpdated: string;
  children?: TreeGridRow[];
}

/**
 * Budget row for editable cell tasks
 */
export interface BudgetRow {
  key: string;
  name: string;
  budget: number;
  displayBudget: string;
  children?: BudgetRow[];
}

/**
 * Permission row for permission grid tasks
 */
export interface PermissionRow {
  key: string;
  name: string;
  description?: string;
  children?: PermissionRow[];
}

/**
 * Sort model for table sorting
 */
export interface SortModel {
  column: string;
  direction: 'asc' | 'desc' | null;
}

/**
 * Filter model for table filtering
 */
export interface FilterModel {
  column: string;
  operator: 'equals' | 'in' | 'contains';
  value: string | string[];
}

/**
 * Helper to compare sets for equality
 */
export function setsEqual<T>(a: T[] | Set<T>, b: T[] | Set<T>): boolean {
  const setA = a instanceof Set ? a : new Set(a);
  const setB = b instanceof Set ? b : new Set(b);
  if (setA.size !== setB.size) return false;
  const arrA = Array.from(setA);
  for (const item of arrA) {
    if (!setB.has(item)) return false;
  }
  return true;
}

/**
 * Helper to compare arrays for exact order equality
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Helper to get the path from root to a node by key
 */
export function getRowPath(rows: TreeGridRow[], key: string): string[] {
  for (const row of rows) {
    if (row.key === key) {
      return [row.service];
    }
    if (row.children) {
      const childPath = getRowPath(row.children, key);
      if (childPath.length > 0) {
        return [row.service, ...childPath];
      }
    }
  }
  return [];
}

/**
 * Helper to find a row by key
 */
export function findRowByKey(rows: TreeGridRow[], key: string): TreeGridRow | null {
  for (const row of rows) {
    if (row.key === key) {
      return row;
    }
    if (row.children) {
      const found = findRowByKey(row.children, key);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Helper to compare row path arrays
 */
export function pathEquals(actual: string[], expected: string[]): boolean {
  if (actual.length !== expected.length) return false;
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) return false;
  }
  return true;
}

/**
 * Helper to compare sets of paths
 */
export function pathSetsEqual(actual: string[][], expected: string[][]): boolean {
  if (actual.length !== expected.length) return false;
  const actualSorted = actual.map(p => p.join('/')).sort();
  const expectedSorted = expected.map(p => p.join('/')).sort();
  return arraysEqual(actualSorted, expectedSorted);
}

/**
 * Standard Service Catalog data used across multiple tasks
 */
export const SERVICE_CATALOG_DATA: TreeGridRow[] = [
  {
    key: 'platform',
    service: 'Platform',
    owner: 'Alice Chen',
    status: 'Active',
    lastUpdated: 'Jan 28, 2026',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', owner: 'Bob Smith', status: 'Active', lastUpdated: 'Jan 25, 2026' },
      { key: 'platform/auth-service', service: 'Auth Service', owner: 'Carol Davis', status: 'Active', lastUpdated: 'Jan 20, 2026' },
      { key: 'platform/web-frontend', service: 'Web Frontend', owner: 'Dan Lee', status: 'Paused', lastUpdated: 'Jan 15, 2026' },
    ],
  },
  {
    key: 'finance',
    service: 'Finance',
    owner: 'Eve Wilson',
    status: 'Active',
    lastUpdated: 'Jan 26, 2026',
    children: [
      { key: 'finance/billing', service: 'Billing', owner: 'Frank Brown', status: 'Active', lastUpdated: 'Jan 24, 2026' },
      { key: 'finance/invoicing', service: 'Invoicing', owner: 'Grace Taylor', status: 'Active', lastUpdated: 'Jan 22, 2026' },
      { key: 'finance/payments', service: 'Payments', owner: 'Henry Martinez', status: 'Blocked', lastUpdated: 'Jan 18, 2026' },
    ],
  },
  {
    key: 'marketing',
    service: 'Marketing',
    owner: 'Ivy Johnson',
    status: 'Active',
    lastUpdated: 'Jan 27, 2026',
    children: [
      { key: 'marketing/campaigns', service: 'Campaigns', owner: 'Jack White', status: 'Active', lastUpdated: 'Jan 23, 2026', children: [
        { key: 'marketing/campaigns/q1-launch', service: 'Q1 Launch', owner: 'Kate Black', status: 'Active', lastUpdated: 'Jan 21, 2026' },
        { key: 'marketing/campaigns/q2-launch', service: 'Q2 Launch', owner: 'Leo Green', status: 'Paused', lastUpdated: 'Jan 19, 2026' },
      ]},
      { key: 'marketing/analytics', service: 'Analytics', owner: 'Mike Blue', status: 'Active', lastUpdated: 'Jan 17, 2026' },
    ],
  },
  {
    key: 'operations',
    service: 'Operations',
    owner: 'Nancy Red',
    status: 'Active',
    lastUpdated: 'Jan 29, 2026',
    children: [
      { key: 'operations/data-centers', service: 'Data Centers', owner: 'Oscar Yellow', status: 'Active', lastUpdated: 'Jan 28, 2026', children: [
        { key: 'operations/data-centers/us-east', service: 'US-East', owner: 'Pat Orange', status: 'Active', lastUpdated: 'Jan 27, 2026', children: generateRacks('us-east', 15) },
        { key: 'operations/data-centers/us-west', service: 'US-West', owner: 'Quinn Purple', status: 'Active', lastUpdated: 'Jan 26, 2026', children: generateRacks('us-west', 40) },
        { key: 'operations/data-centers/eu-west', service: 'EU-West', owner: 'Rose Pink', status: 'Active', lastUpdated: 'Jan 25, 2026', children: generateRacks('eu-west', 20) },
      ]},
      { key: 'operations/security', service: 'Security', owner: 'Sam Cyan', status: 'Active', lastUpdated: 'Jan 24, 2026', children: [
        { key: 'operations/security/deploy', service: 'Deploy', owner: 'Tom Indigo', status: 'Active', lastUpdated: 'Jan 23, 2026' },
        { key: 'operations/security/rotate-keys', service: 'Rotate keys', owner: 'Uma Violet', status: 'Active', lastUpdated: 'Jan 22, 2026' },
        { key: 'operations/security/view-audit-log', service: 'View audit log', owner: 'Vic Magenta', status: 'Active', lastUpdated: 'Jan 21, 2026' },
      ]},
    ],
  },
  {
    key: 'people',
    service: 'People',
    owner: 'Wendy Gold',
    status: 'Active',
    lastUpdated: 'Jan 30, 2026',
    children: [
      { key: 'people/hr', service: 'HR', owner: 'Xander Silver', status: 'Active', lastUpdated: 'Jan 29, 2026', children: [
        { key: 'people/hr/onboarding', service: 'Onboarding', owner: 'Yara Bronze', status: 'Active', lastUpdated: 'Jan 28, 2026' },
        { key: 'people/hr/offboarding', service: 'Offboarding', owner: 'Zack Copper', status: 'Paused', lastUpdated: 'Jan 27, 2026' },
      ]},
      { key: 'people/it', service: 'IT', owner: 'Amy Stone', status: 'Active', lastUpdated: 'Jan 26, 2026', children: [
        { key: 'people/it/laptop-requests', service: 'Laptop Requests', owner: 'Ben Slate', status: 'Active', lastUpdated: 'Jan 25, 2026' },
        { key: 'people/it/vpn-access', service: 'VPN Access', owner: 'Cora Marble', status: 'Active', lastUpdated: 'Jan 24, 2026' },
      ]},
    ],
  },
];

/**
 * Generate rack data for data centers with assets
 */
function generateRacks(region: string, count: number): TreeGridRow[] {
  const assets = ['UPS Battery', 'Cooling Unit', 'Network Switch', 'Server Rack'];
  return Array.from({ length: count }, (_, i) => ({
    key: `operations/data-centers/${region}/rack-${i + 1}`,
    service: `Rack ${i + 1}`,
    owner: `Tech ${i + 1}`,
    status: 'Active' as const,
    lastUpdated: `Jan ${Math.max(1, 30 - i)}, 2026`,
    children: assets.map(asset => ({
      key: `operations/data-centers/${region}/rack-${i + 1}/${asset.toLowerCase().replace(/\s+/g, '-')}`,
      service: asset,
      owner: `Engineer ${i + 1}`,
      status: 'Active' as const,
      lastUpdated: `Jan ${Math.max(1, 28 - i)}, 2026`,
    })),
  }));
}

/**
 * Get all keys in the tree (for flatten operations)
 */
export function getAllKeys(rows: TreeGridRow[]): string[] {
  const keys: string[] = [];
  for (const row of rows) {
    keys.push(row.key);
    if (row.children) {
      keys.push(...getAllKeys(row.children));
    }
  }
  return keys;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[$,]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

/**
 * Format number with comma grouping
 */
export function formatGroupedNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
