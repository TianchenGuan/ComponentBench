/**
 * Prebuild script: Generate model results and comparison matrix JSON for the homepage.
 *
 * Run with: node scripts/generate-results-index.mjs
 *
 * Generates:
 *   src/generated/model-results.json     (models, families, highlights)
 *   src/generated/comparison-matrix.json  (pass-rate matrix by model x mode, family x mode)
 *
 * Data source: Tables 1, 2, 3, 6, and Appendix H from the ComponentBench paper.
 * Ontology (families + component lists) parsed from src/ontology/ontology.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../src/generated');

// ---------------------------------------------------------------------------
// 1. Parse ontology from TypeScript file for family + component data
// ---------------------------------------------------------------------------

function parseOntology() {
  const ontologyPath = path.join(__dirname, '../src/ontology/ontology.ts');
  const src = fs.readFileSync(ontologyPath, 'utf-8');

  // Extract families array
  const familiesRegex = /export const families:\s*Family\[\]\s*=\s*\[([\s\S]*?)\];/;
  const familiesMatch = src.match(familiesRegex);
  const families = [];

  if (familiesMatch) {
    const familyEntries = familiesMatch[1].matchAll(
      /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*order:\s*(\d+)\s*\}/g
    );
    for (const m of familyEntries) {
      families.push({ id: m[1], name: m[2], order: parseInt(m[3], 10) });
    }
  }

  // Extract canonical components
  const componentsRegex = /export const canonicalComponents:\s*CanonicalComponent\[\]\s*=\s*\[([\s\S]*?)\];/;
  const componentsMatch = src.match(componentsRegex);
  const components = [];

  if (componentsMatch) {
    const compEntries = componentsMatch[1].matchAll(
      /\{\s*type:\s*'([^']+)',\s*displayName:\s*'([^']+)',\s*familyId:\s*'([^']+)'/g
    );
    for (const m of compEntries) {
      components.push({ type: m[1], displayName: m[2], familyId: m[3] });
    }
  }

  // Group components by family
  const familyComponents = {};
  for (const comp of components) {
    if (!familyComponents[comp.familyId]) {
      familyComponents[comp.familyId] = [];
    }
    familyComponents[comp.familyId].push(comp.type);
  }

  return { families, components, familyComponents };
}

// ---------------------------------------------------------------------------
// 2. Paper data (Tables 1, 3, Appendix H)
// ---------------------------------------------------------------------------

// Table 1: Pass rates on ComponentBench-Full (20-step budget)
// null = mode not available for that model
const MODEL_RESULTS = [
  {
    name: 'Gemini 3 Flash',
    id: 'gemini-3-flash',
    browser_use: 95.2,
    ax_tree: 89.6,
    som: 87.1,
    pixel: 85.4,
  },
  {
    name: 'GPT-5.4',
    id: 'gpt-5.4',
    browser_use: 90.4,
    ax_tree: 81.5,
    som: 77.0,
    pixel: 83.8,
  },
  {
    name: 'Gemini 3.1 Flash-Lite',
    id: 'gemini-3.1-flash-lite',
    browser_use: 87.4,
    ax_tree: 77.7,
    som: 73.5,
    pixel: 63.3,
  },
  {
    name: 'GPT-5 mini',
    id: 'gpt-5-mini',
    browser_use: 87.0,
    ax_tree: 83.1,
    som: 78.5,
    pixel: 49.0,
  },
  {
    name: 'GPT-5.4 mini',
    id: 'gpt-5.4-mini',
    browser_use: 85.8,
    ax_tree: 79.1,
    som: 74.7,
    pixel: 77.1,
  },
  {
    name: 'Qwen3-VL-235B',
    id: 'qwen3-vl-235b',
    browser_use: null,
    ax_tree: 77.0,
    som: 54.4,
    pixel: 50.5,
  },
  {
    name: 'UI-TARS-1.5-7B',
    id: 'ui-tars-1.5-7b',
    browser_use: null,
    ax_tree: null,
    som: null,
    pixel: 12.6,
  },
];

const TOTAL_TASKS = 2910;

// Table 2: Efficiency data (Pass, ≤H, ≤2H) per model per mode
// null entries mean mode not available for that model
const EFFICIENCY_DATA = {
  'gemini-3-flash': {
    browser_use: { pass: 95.2, leq_h: 56.1, leq_2h: 85.3 },
    ax_tree:     { pass: 89.6, leq_h: 74.7, leq_2h: 82.5 },
    som:         { pass: 87.1, leq_h: 73.2, leq_2h: 81.4 },
    pixel:       { pass: 85.4, leq_h: 65.0, leq_2h: 77.8 },
  },
  'gpt-5.4': {
    browser_use: { pass: 90.4, leq_h: 40.6, leq_2h: 75.3 },
    ax_tree:     { pass: 81.5, leq_h: 56.5, leq_2h: 72.4 },
    som:         { pass: 77.0, leq_h: 49.6, leq_2h: 68.2 },
    pixel:       { pass: 83.8, leq_h: 48.1, leq_2h: 69.5 },
  },
  'gemini-3.1-flash-lite': {
    browser_use: { pass: 87.4, leq_h: 50.2, leq_2h: 77.3 },
    ax_tree:     { pass: 77.7, leq_h: 68.6, leq_2h: 73.9 },
    som:         { pass: 73.5, leq_h: 64.8, leq_2h: 70.9 },
    pixel:       { pass: 63.3, leq_h: 47.3, leq_2h: 56.2 },
  },
  'gpt-5-mini': {
    browser_use: { pass: 87.0, leq_h: 51.7, leq_2h: 78.5 },
    ax_tree:     { pass: 83.1, leq_h: 66.6, leq_2h: 76.5 },
    som:         { pass: 78.5, leq_h: 63.2, leq_2h: 73.4 },
    pixel:       { pass: 49.0, leq_h: 19.0, leq_2h: 28.2 },
  },
  'gpt-5.4-mini': {
    browser_use: { pass: 85.8, leq_h: 51.0, leq_2h: 77.9 },
    ax_tree:     { pass: 79.1, leq_h: 69.0, leq_2h: 73.8 },
    som:         { pass: 74.7, leq_h: 64.0, leq_2h: 70.6 },
    pixel:       { pass: 77.1, leq_h: 60.2, leq_2h: 68.9 },
  },
  'qwen3-vl-235b': {
    ax_tree: { pass: 77.0, leq_h: 66.1, leq_2h: 73.2 },
    som:     { pass: 54.4, leq_h: 41.1, leq_2h: 48.4 },
    pixel:   { pass: 50.5, leq_h: 29.3, leq_2h: 38.1 },
  },
  'ui-tars-1.5-7b': {
    pixel: { pass: 12.6, leq_h: 9.0, leq_2h: 10.5 },
  },
};

// Table 6: Time efficiency data per model per mode
const TIME_EFFICIENCY_DATA = {
  'gemini-3-flash': {
    ax_tree:     { human_s: 4.5, agent_s: 21.5, ratio: 4.7, median_agent_s: 13.5 },
    som:         { human_s: 4.6, agent_s: 22.0, ratio: 4.8, median_agent_s: 14.4 },
    pixel:       { human_s: 4.3, agent_s: 27.6, ratio: 6.4, median_agent_s: 17.1 },
    browser_use: { human_s: 4.6, agent_s: 32.6, ratio: 7.1, median_agent_s: 21.2 },
  },
  'gpt-5.4': {
    ax_tree:     { human_s: 4.0, agent_s: 31.9, ratio: 7.9, median_agent_s: 19.2 },
    som:         { human_s: 3.7, agent_s: 35.0, ratio: 9.4, median_agent_s: 22.3 },
    pixel:       { human_s: 4.2, agent_s: 23.0, ratio: 5.5, median_agent_s: 14.2 },
    browser_use: { human_s: 4.6, agent_s: 36.2, ratio: 7.8, median_agent_s: 24.3 },
  },
  'gpt-5-mini': {
    ax_tree:     { human_s: 4.5, agent_s: 32.1, ratio: 7.2, median_agent_s: 18.9 },
    som:         { human_s: 4.3, agent_s: 32.7, ratio: 7.7, median_agent_s: 19.9 },
    pixel:       { human_s: 3.3, agent_s: 71.8, ratio: 21.5, median_agent_s: 41.9 },
    browser_use: { human_s: 4.6, agent_s: 36.3, ratio: 8.0, median_agent_s: 24.2 },
  },
  'gpt-5.4-mini': {
    ax_tree:     { human_s: 3.9, agent_s: 14.7, ratio: 3.8, median_agent_s: 11.4 },
    som:         { human_s: 3.9, agent_s: 14.2, ratio: 3.7, median_agent_s: 11.4 },
    pixel:       { human_s: 3.6, agent_s: 14.2, ratio: 3.9, median_agent_s: 10.7 },
    browser_use: { human_s: 4.2, agent_s: 17.6, ratio: 4.2, median_agent_s: 13.7 },
  },
};

// Table 4: Core benchmark results
const CORE_RESULTS = [
  { model: 'Gemini 3 Flash', mode: 'Browser-Use', pass: 84.5, leq_h: 51.5, leq_2h: 71.5, leq_3h: 78.5 },
  { model: 'Gemini 3 Flash', mode: 'Pixel', pass: 60.9, leq_h: 30.5, leq_2h: 51.0, leq_3h: 56.0 },
  { model: 'GPT-5.4 mini', mode: 'Browser-Use', pass: 57.8, leq_h: 36.8, leq_2h: 51.2, leq_3h: 55.3 },
  { model: 'GPT-5.4 mini', mode: 'Pixel', pass: 37.7, leq_h: 22.0, leq_2h: 32.1, leq_3h: 34.1 },
  { model: 'Opus 4.6', mode: 'Pixel', pass: 65.4, leq_h: 34.1, leq_2h: 53.8, leq_3h: 59.4 },
];

// Table 10: Difficulty tier pass rates
const DIFFICULTY_TIERS = [
  { tier: 'L0 (easy)', ax_tree: 87.4, som: 85.0, pixel: 80.5, browser_use: 93.7 },
  { tier: 'L1 (medium)', ax_tree: 82.0, som: 74.6, pixel: 66.7, browser_use: 89.3 },
  { tier: 'L2 (hard)', ax_tree: 77.4, som: 66.3, pixel: 54.1, browser_use: 85.8 },
  { tier: 'L3 (hard+)', ax_tree: 71.7, som: 58.4, pixel: 45.4, browser_use: 81.9 },
];

// Table 3 + Appendix H: Family pass rates (averaged across models, excluding UI-TARS)
// Keyed by family id — updated with Table 3 values from paper
const FAMILY_PASS_RATES = {
  command_navigation:       { bu: 98.0, ax: 96.1, som: 89.9, pixel: 83.1, avg: 91.5 },
  disclosure_progressive:   { bu: 83.2, ax: 76.0, som: 64.1, pixel: 68.3, avg: 72.5 },
  text_entry:               { bu: 93.2, ax: 84.8, som: 78.4, pixel: 72.1, avg: 78.0 },
  discrete_choice:          { bu: 97.9, ax: 85.7, som: 83.3, pixel: 79.0, avg: 86.0 },
  list_selection:           { bu: 91.4, ax: 79.3, som: 70.2, pixel: 64.8, avg: 74.0 },
  combobox_autocomplete:    { bu: 89.1, ax: 78.2, som: 68.5, pixel: 62.1, avg: 73.0 },
  hierarchical_navigation:  { bu: 82.3, ax: 75.4, som: 64.2, pixel: 61.8, avg: 70.0 },
  continuous_precision:     { bu: 77.4, ax: 53.8, som: 53.9, pixel: 56.2, avg: 59.6 },
  datetime:                 { bu: 84.9, ax: 76.2, som: 65.8, pixel: 59.4, avg: 71.0 },
  overlays_transient:       { bu: 97.2, ax: 91.0, som: 88.6, pixel: 80.7, avg: 89.0 },
  structured_data:          { bu: 92.1, ax: 80.3, som: 71.5, pixel: 65.4, avg: 75.0 },
  files_clipboard:          { bu: 88.4, ax: 76.1, som: 66.3, pixel: 63.2, avg: 72.0 },
  dragdrop_workspace:       { bu: 34.2, ax: 72.1, som: 31.8, pixel: 57.4, avg: 49.5 },
  advanced_editors:         { bu: 87.7, ax: 67.8, som: 49.7, pixel: 46.4, avg: 61.8 },
};

// ---------------------------------------------------------------------------
// Per-model per-family heatmap data (Figure 3)
// Keys: family_id -> { model_id -> { browser_use, ax_tree, som, pixel } }
// ---------------------------------------------------------------------------
const PER_MODEL_FAMILY = {
  'gemini-3-flash': {
    command_navigation:       { browser_use: 99, ax_tree: 98, som: 95, pixel: 90 },
    overlays_transient:       { browser_use: 99, ax_tree: 96, som: 93, pixel: 87 },
    discrete_choice:          { browser_use: 99, ax_tree: 91, som: 90, pixel: 86 },
    text_entry:               { browser_use: 97, ax_tree: 91, som: 85, pixel: 82 },
    structured_data:          { browser_use: 97, ax_tree: 87, som: 80, pixel: 78 },
    list_selection:           { browser_use: 96, ax_tree: 86, som: 78, pixel: 76 },
    combobox_autocomplete:    { browser_use: 95, ax_tree: 85, som: 77, pixel: 73 },
    disclosure_progressive:   { browser_use: 93, ax_tree: 83, som: 72, pixel: 78 },
    datetime:                 { browser_use: 93, ax_tree: 84, som: 76, pixel: 72 },
    files_clipboard:          { browser_use: 95, ax_tree: 82, som: 74, pixel: 72 },
    hierarchical_navigation:  { browser_use: 91, ax_tree: 82, som: 73, pixel: 70 },
    advanced_editors:         { browser_use: 96, ax_tree: 77, som: 60, pixel: 58 },
    continuous_precision:     { browser_use: 88, ax_tree: 65, som: 62, pixel: 66 },
    dragdrop_workspace:       { browser_use: 45, ax_tree: 80, som: 40, pixel: 65 },
  },
  'gpt-5.4': {
    command_navigation:       { browser_use: 98, ax_tree: 96, som: 88, pixel: 88 },
    overlays_transient:       { browser_use: 97, ax_tree: 91, som: 87, pixel: 82 },
    discrete_choice:          { browser_use: 98, ax_tree: 85, som: 80, pixel: 83 },
    text_entry:               { browser_use: 95, ax_tree: 85, som: 78, pixel: 82 },
    structured_data:          { browser_use: 93, ax_tree: 82, som: 72, pixel: 80 },
    list_selection:           { browser_use: 92, ax_tree: 80, som: 68, pixel: 78 },
    combobox_autocomplete:    { browser_use: 90, ax_tree: 78, som: 65, pixel: 75 },
    disclosure_progressive:   { browser_use: 85, ax_tree: 77, som: 62, pixel: 72 },
    datetime:                 { browser_use: 87, ax_tree: 76, som: 65, pixel: 68 },
    files_clipboard:          { browser_use: 88, ax_tree: 78, som: 65, pixel: 70 },
    hierarchical_navigation:  { browser_use: 83, ax_tree: 75, som: 63, pixel: 68 },
    advanced_editors:         { browser_use: 93, ax_tree: 72, som: 48, pixel: 50 },
    continuous_precision:     { browser_use: 80, ax_tree: 52, som: 50, pixel: 58 },
    dragdrop_workspace:       { browser_use: 30, ax_tree: 68, som: 28, pixel: 55 },
  },
  'gpt-5-mini': {
    command_navigation:       { browser_use: 98, ax_tree: 96, som: 90, pixel: 68 },
    overlays_transient:       { browser_use: 97, ax_tree: 90, som: 88, pixel: 60 },
    discrete_choice:          { browser_use: 98, ax_tree: 88, som: 85, pixel: 55 },
    text_entry:               { browser_use: 93, ax_tree: 87, som: 80, pixel: 48 },
    structured_data:          { browser_use: 90, ax_tree: 85, som: 78, pixel: 45 },
    list_selection:           { browser_use: 88, ax_tree: 80, som: 72, pixel: 40 },
    combobox_autocomplete:    { browser_use: 85, ax_tree: 78, som: 68, pixel: 38 },
    disclosure_progressive:   { browser_use: 82, ax_tree: 78, som: 65, pixel: 50 },
    datetime:                 { browser_use: 83, ax_tree: 78, som: 65, pixel: 40 },
    files_clipboard:          { browser_use: 82, ax_tree: 76, som: 66, pixel: 42 },
    hierarchical_navigation:  { browser_use: 80, ax_tree: 76, som: 63, pixel: 38 },
    advanced_editors:         { browser_use: 88, ax_tree: 68, som: 45, pixel: 28 },
    continuous_precision:     { browser_use: 72, ax_tree: 50, som: 48, pixel: 30 },
    dragdrop_workspace:       { browser_use: 28, ax_tree: 70, som: 25, pixel: 45 },
  },
  'gpt-5.4-mini': {
    command_navigation:       { browser_use: 97, ax_tree: 94, som: 88, pixel: 85 },
    overlays_transient:       { browser_use: 96, ax_tree: 88, som: 85, pixel: 80 },
    discrete_choice:          { browser_use: 97, ax_tree: 82, som: 78, pixel: 78 },
    text_entry:               { browser_use: 92, ax_tree: 82, som: 76, pixel: 76 },
    structured_data:          { browser_use: 90, ax_tree: 80, som: 72, pixel: 74 },
    list_selection:           { browser_use: 88, ax_tree: 78, som: 68, pixel: 72 },
    combobox_autocomplete:    { browser_use: 86, ax_tree: 76, som: 65, pixel: 70 },
    disclosure_progressive:   { browser_use: 82, ax_tree: 75, som: 60, pixel: 68 },
    datetime:                 { browser_use: 82, ax_tree: 74, som: 62, pixel: 65 },
    files_clipboard:          { browser_use: 83, ax_tree: 72, som: 62, pixel: 65 },
    hierarchical_navigation:  { browser_use: 78, ax_tree: 72, som: 60, pixel: 63 },
    advanced_editors:         { browser_use: 85, ax_tree: 65, som: 42, pixel: 42 },
    continuous_precision:     { browser_use: 70, ax_tree: 48, som: 45, pixel: 52 },
    dragdrop_workspace:       { browser_use: 25, ax_tree: 65, som: 22, pixel: 50 },
  },
  'gemini-3.1-flash-lite': {
    command_navigation:       { browser_use: 97, ax_tree: 94, som: 85, pixel: 78 },
    overlays_transient:       { browser_use: 96, ax_tree: 88, som: 82, pixel: 68 },
    discrete_choice:          { browser_use: 97, ax_tree: 82, som: 78, pixel: 68 },
    text_entry:               { browser_use: 93, ax_tree: 82, som: 75, pixel: 62 },
    structured_data:          { browser_use: 90, ax_tree: 78, som: 68, pixel: 58 },
    list_selection:           { browser_use: 88, ax_tree: 75, som: 65, pixel: 55 },
    combobox_autocomplete:    { browser_use: 85, ax_tree: 72, som: 62, pixel: 52 },
    disclosure_progressive:   { browser_use: 80, ax_tree: 72, som: 58, pixel: 60 },
    datetime:                 { browser_use: 82, ax_tree: 72, som: 60, pixel: 50 },
    files_clipboard:          { browser_use: 82, ax_tree: 70, som: 60, pixel: 52 },
    hierarchical_navigation:  { browser_use: 78, ax_tree: 68, som: 58, pixel: 48 },
    advanced_editors:         { browser_use: 82, ax_tree: 60, som: 40, pixel: 35 },
    continuous_precision:     { browser_use: 68, ax_tree: 42, som: 40, pixel: 42 },
    dragdrop_workspace:       { browser_use: 20, ax_tree: 62, som: 18, pixel: 45 },
  },
};

// ---------------------------------------------------------------------------
// Task template pass rates (Figure 8) — averaged across models
// ---------------------------------------------------------------------------
const TASK_TEMPLATE_PASS_RATES = [
  { template: 'set_range',                browser_use: 22, ax_tree: 28, som: 18, pixel: 25 },
  { template: 'drag_operation',           browser_use: 30, ax_tree: 65, som: 25, pixel: 50 },
  { template: 'editor_operation',         browser_use: 55, ax_tree: 50, som: 35, pixel: 32 },
  { template: 'scroll_find',              browser_use: 60, ax_tree: 62, som: 55, pixel: 40 },
  { template: 'set_scalar',               browser_use: 65, ax_tree: 45, som: 42, pixel: 48 },
  { template: 'transfer_move',            browser_use: 68, ax_tree: 72, som: 60, pixel: 55 },
  { template: 'file_upload',              browser_use: 72, ax_tree: 68, som: 58, pixel: 52 },
  { template: 'match_reference',          browser_use: 75, ax_tree: 72, som: 65, pixel: 55 },
  { template: 'confirm_accept',           browser_use: 78, ax_tree: 78, som: 72, pixel: 60 },
  { template: 'select_many',              browser_use: 80, ax_tree: 75, som: 68, pixel: 62 },
  { template: 'search_and_select',        browser_use: 82, ax_tree: 78, som: 72, pixel: 65 },
  { template: 'open_and_select',          browser_use: 85, ax_tree: 80, som: 75, pixel: 68 },
  { template: 'enter_freetext',           browser_use: 88, ax_tree: 82, som: 78, pixel: 70 },
  { template: 'replace_code',             browser_use: 85, ax_tree: 78, som: 68, pixel: 58 },
  { template: 'table_operation',          browser_use: 88, ax_tree: 82, som: 75, pixel: 68 },
  { template: 'hierarchical_path_select', browser_use: 82, ax_tree: 78, som: 65, pixel: 58 },
  { template: 'enter_text',               browser_use: 90, ax_tree: 85, som: 80, pixel: 72 },
  { template: 'select_one',               browser_use: 92, ax_tree: 88, som: 82, pixel: 75 },
  { template: 'toggle_state',             browser_use: 95, ax_tree: 90, som: 85, pixel: 78 },
  { template: 'clear_reset',              browser_use: 95, ax_tree: 92, som: 88, pixel: 80 },
  { template: 'open_overlay',             browser_use: 96, ax_tree: 93, som: 90, pixel: 82 },
  { template: 'file_manage',              browser_use: 92, ax_tree: 88, som: 82, pixel: 75 },
  { template: 'navigate_to',              browser_use: 97, ax_tree: 95, som: 92, pixel: 85 },
  { template: 'activate',                 browser_use: 98, ax_tree: 97, som: 95, pixel: 88 },
];

// ---------------------------------------------------------------------------
// SoM-Pixel delta (Table 7)
// ---------------------------------------------------------------------------
const SOM_PIXEL_DELTA = [
  { model: 'GPT-5 mini',            som: 78.5, pixel: 49.0, delta: 29.5 },
  { model: 'Gemini 3.1 Flash-Lite', som: 73.5, pixel: 63.3, delta: 10.2 },
  { model: 'Qwen3-VL-235B',         som: 54.4, pixel: 50.5, delta: 3.9 },
  { model: 'Gemini 3 Flash',        som: 87.1, pixel: 85.4, delta: 1.7 },
  { model: 'GPT-5.4 mini',          som: 74.7, pixel: 77.1, delta: -2.4 },
  { model: 'GPT-5.4',               som: 77.0, pixel: 83.8, delta: -6.8 },
];

// ---------------------------------------------------------------------------
// Browser-Use advantage (Table 8)
// ---------------------------------------------------------------------------
const BROWSER_USE_ADVANTAGE = [
  { model: 'GPT-5 mini',            browser_use: 87.0, mean_other: 70.2, delta: 16.8 },
  { model: 'Gemini 3.1 Flash-Lite', browser_use: 87.4, mean_other: 71.5, delta: 15.9 },
  { model: 'GPT-5.4',               browser_use: 90.4, mean_other: 80.8, delta: 9.6 },
  { model: 'GPT-5.4 mini',          browser_use: 85.8, mean_other: 77.0, delta: 8.8 },
  { model: 'Gemini 3 Flash',        browser_use: 95.2, mean_other: 87.4, delta: 7.8 },
];

// ---------------------------------------------------------------------------
// Difficulty axis correlations (Table 9)
// ---------------------------------------------------------------------------
const DIFFICULTY_AXIS_CORRELATIONS = [
  { axis: 'Precision requirement',    overall: 0.44, ax_tree: 0.29, pixel: 0.40, browser_use: 0.32 },
  { axis: 'Target acquisition',       overall: 0.32, ax_tree: 0.17, pixel: 0.36, browser_use: 0.19 },
  { axis: 'Density / choice interf.', overall: 0.23, ax_tree: 0.10, pixel: 0.31, browser_use: 0.12 },
  { axis: 'Feedback dynamics',        overall: 0.22, ax_tree: 0.11, pixel: 0.29, browser_use: 0.13 },
  { axis: 'Depth / layering',         overall: 0.20, ax_tree: 0.10, pixel: 0.30, browser_use: 0.04 },
  { axis: 'Semantic observability',   overall: 0.13, ax_tree: 0.08, pixel: 0.17, browser_use: 0.05 },
  { axis: 'Disambiguation load',      overall: 0.10, ax_tree: 0.04, pixel: 0.15, browser_use: 0.02 },
];

// ---------------------------------------------------------------------------
// Hardest canonical types (Section 4.2, Table 11 / Figure 4)
// Components trivial for humans (<=2 steps) but hard for agents (<60% pass)
// ---------------------------------------------------------------------------
const HARDEST_TYPES = [
  { type: 'resizable_columns',          human_steps: 1.5, agent_pass: 22.6 },
  { type: 'window_splitter',            human_steps: 1.3, agent_pass: 37.7 },
  { type: 'slider_range',               human_steps: 1.8, agent_pass: 38.8 },
  { type: 'color_picker_2d',            human_steps: 1.6, agent_pass: 42.3 },
  { type: 'alpha_slider',               human_steps: 1.4, agent_pass: 45.1 },
  { type: 'kanban_board_drag_drop',     human_steps: 2.0, agent_pass: 48.2 },
  { type: 'drag_drop_sortable_list',    human_steps: 1.9, agent_pass: 50.5 },
  { type: 'split_button',               human_steps: 1.8, agent_pass: 52.0 },
  { type: 'drag_drop_between_lists',    human_steps: 2.0, agent_pass: 55.3 },
];

// ---------------------------------------------------------------------------
// Browser-Use family advantage (Figure 7)
// ---------------------------------------------------------------------------
const BROWSER_USE_FAMILY_ADVANTAGE = [
  { family: 'Advanced Editors',                          advantage: 31.2 },
  { family: 'List-based Selection (Flat)',               advantage: 22.5 },
  { family: 'Continuous & High-Precision Input',         advantage: 18.8 },
  { family: 'Structured Data Display',                   advantage: 17.5 },
  { family: 'Date & Time',                               advantage: 15.2 },
  { family: 'Discrete Choice',                           advantage: 13.8 },
  { family: 'Combobox & Autocomplete',                   advantage: 12.5 },
  { family: 'Hierarchical Selection & Navigation',       advantage: 10.8 },
  { family: 'Text Entry & Structured Field Input',       advantage: 10.2 },
  { family: 'Disclosure & Progressive',                  advantage: 8.5 },
  { family: 'Overlays & Transient UI',                   advantage: 7.2 },
  { family: 'Command & Navigation',                      advantage: 5.5 },
  { family: 'Files, Clipboard, Downloads',               advantage: -3.2 },
  { family: 'Drag/Drop & Workspace Interactions',        advantage: -25.6 },
];

// Family descriptions (from paper + ontology)
const FAMILY_DESCRIPTIONS = {
  command_navigation:       'Buttons, links, tabs, menus, breadcrumbs, pagination, and toolbars',
  disclosure_progressive:   'Accordions, collapsibles, carousels, infinite scroll, and splitters',
  text_entry:               'Text inputs, textareas, passwords, search, number inputs, PIN/OTP, tags, mentions, inline editing',
  discrete_choice:          'Checkboxes, radio groups, switches, segmented controls, toggle buttons, and ratings',
  list_selection:           'Listboxes, native selects, custom selects (single/multi), search selects, transfer lists',
  combobox_autocomplete:    'Editable comboboxes (single/multi), restricted and freeform autocomplete',
  hierarchical_navigation:  'Menus, menubars, context menus, tree views, tree selects, tree grids, cascaders',
  continuous_precision:     'Sliders, meters, progress bars, color pickers (swatch, text, 2D), alpha sliders',
  datetime:                 'Date inputs, date/time/datetime pickers (single and range), embedded calendars',
  overlays_transient:       'Dialogs, alert confirms, drawers, popovers, tooltips, hover cards, toasts, notification centers, tours',
  structured_data:          'Static tables, sortable/filterable/paginated data tables, editable data grids, virtual lists',
  files_clipboard:          'File upload buttons, dropzones, file list managers, download triggers, clipboard copy',
  dragdrop_workspace:       'Drag-drop sortable lists, cross-list drag, kanban boards, resizable columns',
  advanced_editors:         'Rich text editors, code editors, markdown editors, JSON editors',
};

// ---------------------------------------------------------------------------
// 3. Build output objects
// ---------------------------------------------------------------------------

function buildModelResults(ontology) {
  const { families, familyComponents } = ontology;

  // Models array
  const models = MODEL_RESULTS.map(m => {
    const modes = {};
    if (m.browser_use !== null) modes.browser_use = { pass_rate: m.browser_use, tasks: TOTAL_TASKS };
    if (m.ax_tree !== null) modes.ax_tree = { pass_rate: m.ax_tree, tasks: TOTAL_TASKS };
    if (m.som !== null) modes.som = { pass_rate: m.som, tasks: TOTAL_TASKS };
    if (m.pixel !== null) modes.pixel = { pass_rate: m.pixel, tasks: TOTAL_TASKS };

    const entry = { name: m.name, id: m.id, modes };

    // Efficiency data (Table 2)
    if (EFFICIENCY_DATA[m.id]) {
      entry.efficiency = EFFICIENCY_DATA[m.id];
    }

    // Time efficiency data (Table 6)
    if (TIME_EFFICIENCY_DATA[m.id]) {
      entry.time_efficiency = TIME_EFFICIENCY_DATA[m.id];
    }

    return entry;
  });

  // Families array
  const familiesOut = families
    .sort((a, b) => a.order - b.order)
    .map(f => {
      const comps = familyComponents[f.id] || [];
      const rates = FAMILY_PASS_RATES[f.id] || {};
      return {
        id: f.id,
        name: f.name,
        component_count: comps.length,
        components: comps,
        avg_pass_rate: rates.avg ?? null,
        description: FAMILY_DESCRIPTIONS[f.id] || '',
      };
    });

  // Highlights
  const highlights = {
    total_tasks: TOTAL_TASKS,
    total_core_tasks: 912,
    total_types: 97,
    total_families: 14,
    best_model: {
      name: 'Gemini 3 Flash',
      mode: 'Browser-Use',
      pass_rate: 95.2,
    },
    biggest_mode_gap: {
      model: 'GPT-5 mini',
      high: 87.0,
      high_mode: 'Browser-Use',
      low: 49.0,
      low_mode: 'Pixel',
      gap: 38.0,
    },
    efficiency_ratio: 3.7,
    human_median_steps: 2,
    human_mean_steps: 2.7,
    human_mean_time_s: 4.8,
  };

  return {
    models,
    families: familiesOut,
    highlights,
    core_results: CORE_RESULTS,
    difficulty_tiers: DIFFICULTY_TIERS,
    per_model_family: PER_MODEL_FAMILY,
    task_template_pass_rates: TASK_TEMPLATE_PASS_RATES,
    som_pixel_delta: SOM_PIXEL_DELTA,
    browser_use_advantage: BROWSER_USE_ADVANTAGE,
    difficulty_axis_correlations: DIFFICULTY_AXIS_CORRELATIONS,
    hardest_types: HARDEST_TYPES,
    browser_use_family_advantage: BROWSER_USE_FAMILY_ADVANTAGE,
  };
}

function buildComparisonMatrix() {
  // Model x mode matrix
  const matrix = MODEL_RESULTS.map(m => ({
    model: m.name,
    browser_use: m.browser_use,
    ax_tree: m.ax_tree,
    som: m.som,
    pixel: m.pixel,
  }));

  // Family x mode matrix
  const familyPassRates = Object.entries(FAMILY_PASS_RATES).map(([familyId, rates]) => {
    // Look up display name from ontology ids
    const displayName = FAMILY_DESCRIPTIONS[familyId]
      ? familyId  // we'll fill display name below
      : familyId;

    return {
      family_id: familyId,
      browser_use: rates.bu,
      ax_tree: rates.ax,
      som: rates.som,
      pixel: rates.pixel,
      avg: rates.avg,
    };
  });

  return { matrix, family_pass_rates: familyPassRates };
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------

function main() {
  console.log('=== Generating model results index ===\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Parse ontology
  const ontology = parseOntology();
  console.log(`  Parsed ontology: ${ontology.families.length} families, ${ontology.components.length} components`);

  // Build model-results.json
  const modelResults = buildModelResults(ontology);
  const modelResultsPath = path.join(OUTPUT_DIR, 'model-results.json');
  fs.writeFileSync(modelResultsPath, JSON.stringify(modelResults, null, 2));
  console.log(`  Generated: ${modelResultsPath}`);
  console.log(`    ${modelResults.models.length} models, ${modelResults.families.length} families`);

  // Build comparison-matrix.json — add family display names
  const comparisonMatrix = buildComparisonMatrix();
  // Enrich family_pass_rates with display names from ontology
  const familyNameMap = {};
  for (const f of ontology.families) {
    familyNameMap[f.id] = f.name;
  }
  for (const entry of comparisonMatrix.family_pass_rates) {
    entry.family = familyNameMap[entry.family_id] || entry.family_id;
  }

  const comparisonMatrixPath = path.join(OUTPUT_DIR, 'comparison-matrix.json');
  fs.writeFileSync(comparisonMatrixPath, JSON.stringify(comparisonMatrix, null, 2));
  console.log(`  Generated: ${comparisonMatrixPath}`);
  console.log(`    ${comparisonMatrix.matrix.length} model rows, ${comparisonMatrix.family_pass_rates.length} family rows`);

  console.log('\nDone.');
}

main();
