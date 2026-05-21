import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific data_table_filterable components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Column filter representing a single filter condition
 */
export interface ColumnFilter {
  column: string;
  operator: 'equals' | 'in' | 'contains_ci' | 'contains_all' | 'between_inclusive' | 'date_between_inclusive' | 'gte' | 'isAnyOf';
  value: string | number | string[] | { min: number; max: number } | { start: string; end: string };
}

/**
 * Filter model representing the current filter state of a table
 */
export interface FilterModel {
  table_id: string;
  logic_operator: 'AND' | 'OR';
  global_filter: string | null;
  column_filters: ColumnFilter[];
}

/**
 * Helper to check if filter model matches target
 */
export function filterModelEquals(current: FilterModel, target: FilterModel): boolean {
  if (current.table_id !== target.table_id) return false;
  if (current.logic_operator !== target.logic_operator) return false;
  
  // Normalize global filter
  const currentGlobal = current.global_filter?.toLowerCase().trim() || null;
  const targetGlobal = target.global_filter?.toLowerCase().trim() || null;
  if (currentGlobal !== targetGlobal) return false;
  
  if (current.column_filters.length !== target.column_filters.length) return false;
  
  // Check each filter (order-independent)
  for (const targetFilter of target.column_filters) {
    const matchingFilter = current.column_filters.find(cf => cf.column === targetFilter.column);
    if (!matchingFilter) return false;
    if (matchingFilter.operator !== targetFilter.operator) return false;
    
    // Value comparison
    if (Array.isArray(targetFilter.value) && Array.isArray(matchingFilter.value)) {
      const targetSet = new Set(targetFilter.value.map(v => String(v).toLowerCase()));
      const currentSet = new Set(matchingFilter.value.map(v => String(v).toLowerCase()));
      if (targetSet.size !== currentSet.size) return false;
      const targetArray = Array.from(targetSet);
      for (let i = 0; i < targetArray.length; i++) {
        if (!currentSet.has(targetArray[i])) return false;
      }
    } else if (typeof targetFilter.value === 'object' && typeof matchingFilter.value === 'object') {
      if (JSON.stringify(targetFilter.value) !== JSON.stringify(matchingFilter.value)) return false;
    } else {
      const targetVal = typeof targetFilter.value === 'string' ? targetFilter.value.toLowerCase().trim() : targetFilter.value;
      const currentVal = typeof matchingFilter.value === 'string' ? matchingFilter.value.toLowerCase().trim() : matchingFilter.value;
      if (targetVal !== currentVal) return false;
    }
  }
  
  return true;
}

/**
 * Helper to create an empty filter model
 */
export function createEmptyFilterModel(tableId: string): FilterModel {
  return {
    table_id: tableId,
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [],
  };
}
