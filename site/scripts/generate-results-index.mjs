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

// Table 3 + Appendix H: Family pass rates (averaged across models, excluding UI-TARS)
// Keyed by family id
const FAMILY_PASS_RATES = {
  command_navigation:       { bu: 98.0, ax: 96.1, som: 89.9, pixel: 83.1, avg: 91.5 },
  disclosure_progressive:   { bu: 83.2, ax: 76.0, som: 64.1, pixel: 68.3, avg: 72.5 },
  text_entry:               { bu: 90.5, ax: 82.7, som: 73.0, pixel: 65.8, avg: 78.0 },
  discrete_choice:          { bu: 97.9, ax: 85.7, som: 83.3, pixel: 79.0, avg: 86.0 },
  list_selection:           { bu: 88.2, ax: 78.6, som: 66.8, pixel: 62.4, avg: 74.0 },
  combobox_autocomplete:    { bu: 87.5, ax: 77.3, som: 65.2, pixel: 62.0, avg: 73.0 },
  hierarchical_navigation:  { bu: 84.0, ax: 74.8, som: 61.2, pixel: 60.0, avg: 70.0 },
  continuous_precision:     { bu: 77.4, ax: 53.8, som: 53.9, pixel: 56.2, avg: 59.6 },
  datetime:                 { bu: 84.9, ax: 76.2, som: 65.8, pixel: 59.4, avg: 71.0 },
  overlays_transient:       { bu: 97.2, ax: 91.0, som: 88.6, pixel: 80.7, avg: 89.0 },
  structured_data:          { bu: 89.0, ax: 79.5, som: 69.0, pixel: 62.5, avg: 75.0 },
  files_clipboard:          { bu: 86.8, ax: 76.2, som: 64.0, pixel: 61.0, avg: 72.0 },
  dragdrop_workspace:       { bu: 34.2, ax: 72.1, som: 31.8, pixel: 57.4, avg: 49.5 },
  advanced_editors:         { bu: 87.7, ax: 67.8, som: 49.7, pixel: 46.4, avg: 61.8 },
};

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
    return { name: m.name, id: m.id, modes };
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

  return { models, families: familiesOut, highlights };
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
