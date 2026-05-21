/**
 * ComponentBench Types
 */

// Benchmark version
export type BenchmarkVersion = 'v1' | 'v2';
export const BENCHMARK_VERSIONS: BenchmarkVersion[] = ['v1', 'v2'];
export const DEFAULT_BENCHMARK_VERSION: BenchmarkVersion = 'v1';

// Library types
export type Library = 'antd' | 'mui' | 'mantine';
export type LibraryFilter = 'all' | Library;

// View mode for task pages
// - presentation: Full UI with navigation, goal, details (for demos/Vercel)
// - benchmark: Clean UI with component only (for BrowserGym agent testing)
export type ViewMode = 'presentation' | 'benchmark';

// Scene context factors (E1-E8)
export interface SceneContext {
  theme: 'light' | 'dark' | 'high_contrast';
  spacing: 'comfortable' | 'compact' | 'condensed';
  layout: 'isolated_card' | 'form_section' | 'settings_panel' | 'dashboard' | 'table_cell' | 'modal_flow' | 'drawer_flow';
  placement: 'center' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  scale: 'default' | 'small' | 'large';
  instances: 1 | 2 | 3 | 4;
  guidance: 'text' | 'visual' | 'mixed';
  clutter: 'none' | 'low' | 'medium' | 'high';
}

// Default scene context
export const DEFAULT_SCENE_CONTEXT: SceneContext = {
  theme: 'light',
  spacing: 'comfortable',
  layout: 'isolated_card',
  placement: 'center',
  scale: 'default',
  instances: 1,
  guidance: 'text',
  clutter: 'none',
};

// Difficulty rating
export interface DifficultyAxesRatings {
  precision_requirement: number;
  target_acquisition: number;
  density_choice_interference: number;
  depth_layering: number;
  feedback_dynamics: number;
  semantic_observability: number;
  disambiguation_load: number;
}

export interface Difficulty {
  difficulty_bucket: 'easy' | 'medium' | 'hard';
  tier: 'L0' | 'L1' | 'L2' | 'L3';
  axes_ratings: DifficultyAxesRatings;
  justification: string;
}

// Success trigger
export interface CanonicalPredicate {
  predicate_type: string;
  target_state: Record<string, unknown>;
  tolerance: unknown;
  require_confirm: boolean;
  confirm_control: string | null;
  require_correct_instance: boolean;
  target_instance_label_or_id: string | null;
  terminal_condition: string;
}

export interface SuccessTrigger {
  human_readable: string[];
  canonical_predicate: CanonicalPredicate;
}

// Task specification (matches YAML schema)
export interface TaskSpec {
  id: string;
  name: string;
  canonical_type: string;
  implementation_source: Library;
  implementation_variant: string | null;
  implementation_component: string;
  task_template: string;
  secondary_template: string | null;
  browsergym_goal: string;
  ui_copy: string;
  setup_description: string;
  scene_context: SceneContext;
  difficulty: Difficulty;
  success_trigger: SuccessTrigger;
  negative_cases: string[];
  expected_interaction_path: string;
  notes: string;
}

// Sanitized TaskSpec for public API (removes answer-key fields)
// These fields are stripped to prevent DOM-based agents from cheating:
// - success_trigger: Contains success conditions
// - negative_cases: Contains failure scenarios
// - expected_interaction_path: Contains expected user actions
// - notes: May contain implementation hints
export type PublicTaskSpec = Omit<
  TaskSpec,
  'success_trigger' | 'negative_cases' | 'expected_interaction_path' | 'notes'
>;

// Family definition
export interface Family {
  id: string;
  name: string;
  order: number;
}

// Canonical component definition
export interface CanonicalComponent {
  type: string;
  displayName: string;
  familyId: string;
  antd: string;
  mui: string;
  mantine: string;
  notes: string;
}

// Component with tasks count for UI
export interface ComponentWithStatus extends CanonicalComponent {
  isImplemented: boolean;
  taskCount: number;
}

// Family section for display
export interface FamilySection {
  family: Family;
  components: CanonicalComponent[];
}

// Factor options for UI (including 'all' option for filtering)
export const FACTOR_OPTIONS = {
  theme: ['all', 'light', 'dark', 'high_contrast'] as const,
  spacing: ['all', 'comfortable', 'compact', 'condensed'] as const,
  layout: ['all', 'isolated_card', 'form_section', 'settings_panel', 'dashboard', 'table_cell', 'modal_flow', 'drawer_flow'] as const,
  placement: ['all', 'center', 'top_left', 'top_right', 'bottom_left', 'bottom_right'] as const,
  scale: ['all', 'default', 'small', 'large'] as const,
  instances: ['all', 1, 2, 3, 4] as const,
  guidance: ['all', 'text', 'visual', 'mixed'] as const,
  clutter: ['all', 'none', 'low', 'medium', 'high'] as const,
};

// Filter factors type (allows 'all' for any factor)
export interface FilterFactors {
  theme: 'all' | SceneContext['theme'];
  spacing: 'all' | SceneContext['spacing'];
  layout: 'all' | SceneContext['layout'];
  placement: 'all' | SceneContext['placement'];
  scale: 'all' | SceneContext['scale'];
  instances: 'all' | SceneContext['instances'];
  guidance: 'all' | SceneContext['guidance'];
  clutter: 'all' | SceneContext['clutter'];
}

// Default filter factors (all set to 'all' to show everything)
export const DEFAULT_FILTER_FACTORS: FilterFactors = {
  theme: 'all',
  spacing: 'all',
  layout: 'all',
  placement: 'all',
  scale: 'all',
  instances: 'all',
  guidance: 'all',
  clutter: 'all',
};
