/**
 * Prebuild script: Generate safe task index JSON for each benchmark version.
 *
 * Run with: node scripts/generate-task-index.mjs
 *
 * Generates:
 *   src/generated/task-index-v1.json   (from data/tasks_v1)
 *   src/generated/task-index-v2.json   (from data/tasks_v2)
 *   src/generated/task-index.json      (alias → v1, for backward compat)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.join(__dirname, '../../..');
const OUTPUT_DIR = path.join(__dirname, '../src/generated');

const VERSION_CONFIGS = {
  v1: {
    yamlDir: path.join(REPO_ROOT, 'data/tasks_v1'),
    canonicalTypeFromFilename: true,
  },
  v2: {
    yamlDir: path.join(REPO_ROOT, 'data/tasks_v2'),
    canonicalTypeFromFilename: false,
  },
};

function extractSafeTaskData(task, canonicalTypeOverride) {
  try {
    return {
      id: task.id,
      name: task.name,
      canonical_type: canonicalTypeOverride || task.canonical_type,
      implementation_source: task.implementation_source,
      implementation_variant: task.implementation_variant || null,
      task_template: task.task_template,
      secondary_template: task.secondary_template || null,
      difficulty_bucket: task.difficulty?.difficulty_bucket || 'medium',
      tier: task.difficulty?.tier || 'L1',
      scene_context: {
        theme: task.scene_context?.theme || 'light',
        spacing: task.scene_context?.spacing || 'comfortable',
        layout: task.scene_context?.layout || 'isolated_card',
        placement: task.scene_context?.placement || 'center',
        scale: task.scene_context?.scale || 'default',
        instances: task.scene_context?.instances || 1,
        guidance: task.scene_context?.guidance || 'text',
        clutter: task.scene_context?.clutter || 'none',
      },
    };
  } catch (e) {
    console.error(`Failed to extract safe data from task ${task?.id}:`, e);
    return null;
  }
}

function preprocessYaml(content) {
  const lines = content.split('\n');
  let inBlockScalar = false;
  let blockScalarIndent = 0;

  const processedLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^\s*[\w_]+:\s*[|>]-?\s*$/)) {
      inBlockScalar = true;
      const match = line.match(/^(\s*)/);
      blockScalarIndent = match ? match[1].length : 0;
      processedLines.push(line);
      i++;
      continue;
    }

    if (inBlockScalar) {
      const match = line.match(/^(\s*)/);
      const currentIndent = match ? match[1].length : 0;

      if (line.trim() && currentIndent <= blockScalarIndent && line.match(/^\s*[\w_-]+:/)) {
        inBlockScalar = false;
      } else {
        processedLines.push(line);
        i++;
        continue;
      }
    }

    const fieldMatch = line.match(/^(  )(expected_interaction_path|notes|justification|setup_description|browsergym_goal|ui_copy|factor_rationale):\s+(.*)$/);
    if (fieldMatch) {
      const [, indent, key, value] = fieldMatch;
      if (value.startsWith("'") || value.startsWith('"') || value.startsWith('|') || value.startsWith('>')) {
        processedLines.push(line);
        i++;
        continue;
      }

      let fullValue = value;
      while (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.match(/^    +[^-\s]/) && !nextLine.match(/^    +[\w_-]+:\s/)) {
          fullValue += ' ' + nextLine.trim();
          i++;
        } else {
          break;
        }
      }

      if (fullValue.includes(':') || fullValue.includes('#') || fullValue.includes("'")) {
        const escapedValue = fullValue.replace(/"/g, '\\"');
        processedLines.push(`${indent}${key}: "${escapedValue}"`);
      } else {
        processedLines.push(`${indent}${key}: ${fullValue}`);
      }
    } else {
      processedLines.push(line);
    }
    i++;
  }

  return processedLines.join('\n');
}

function generateForVersion(version, config) {
  const { yamlDir, canonicalTypeFromFilename } = config;

  console.log(`\n=== Generating task index for ${version} ===`);
  console.log(`  YAML dir: ${yamlDir}`);

  if (!fs.existsSync(yamlDir)) {
    console.log(`  Directory not found, generating empty index.`);
    return {
      generated_at: new Date().toISOString(),
      benchmark_version: version,
      total_tasks: 0,
      canonical_types: [],
      tasks: [],
      counts: { by_canonical_type: {}, by_library: {}, by_difficulty: {}, by_tier: {} },
    };
  }

  const allTasks = [];
  const canonicalTypes = new Set();
  const counts = {
    by_canonical_type: {},
    by_library: {},
    by_difficulty: {},
    by_tier: {},
  };

  const files = fs.readdirSync(yamlDir).filter(f => f.endsWith('.yaml'));
  console.log(`  Found ${files.length} YAML files`);

  for (const file of files) {
    const filePath = path.join(yamlDir, file);
    const filenameType = file.replace('.yaml', '');

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const preprocessed = preprocessYaml(content);
      const parsed = yaml.load(preprocessed);

      const tasks = Array.isArray(parsed) ? parsed : parsed?.tasks;

      if (!tasks || !Array.isArray(tasks)) {
        console.warn(`  ⚠️  No tasks array in ${file}`);
        continue;
      }

      for (const task of tasks) {
        const canonicalType = canonicalTypeFromFilename ? filenameType : task.canonical_type;
        const safeTask = extractSafeTaskData(task, canonicalTypeFromFilename ? filenameType : null);
        if (safeTask) {
          allTasks.push(safeTask);
          canonicalTypes.add(safeTask.canonical_type);

          counts.by_canonical_type[safeTask.canonical_type] =
            (counts.by_canonical_type[safeTask.canonical_type] || 0) + 1;
          counts.by_library[safeTask.implementation_source] =
            (counts.by_library[safeTask.implementation_source] || 0) + 1;
          counts.by_difficulty[safeTask.difficulty_bucket] =
            (counts.by_difficulty[safeTask.difficulty_bucket] || 0) + 1;
          counts.by_tier[safeTask.tier] =
            (counts.by_tier[safeTask.tier] || 0) + 1;
        }
      }

      console.log(`  ✅ ${file}: ${tasks.length} tasks`);
    } catch (e) {
      console.error(`  ❌ Failed to parse ${file}:`, e.message || e);
    }
  }

  return {
    generated_at: new Date().toISOString(),
    benchmark_version: version,
    total_tasks: allTasks.length,
    canonical_types: Array.from(canonicalTypes).sort(),
    tasks: allTasks,
    counts,
  };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const [version, config] of Object.entries(VERSION_CONFIGS)) {
    const index = generateForVersion(version, config);
    const outPath = path.join(OUTPUT_DIR, `task-index-${version}.json`);
    fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
    console.log(`  📊 ${version}: ${index.total_tasks} tasks, ${index.canonical_types.length} types`);
    console.log(`  ✨ Generated: ${outPath}`);
  }

  // Backward-compat alias: task-index.json → copy of v1
  const v1Path = path.join(OUTPUT_DIR, 'task-index-v1.json');
  const aliasPath = path.join(OUTPUT_DIR, 'task-index.json');
  fs.copyFileSync(v1Path, aliasPath);
  console.log(`\n  📋 Alias: task-index.json → task-index-v1.json`);

  console.log('\nDone.');
}

main().catch(console.error);
