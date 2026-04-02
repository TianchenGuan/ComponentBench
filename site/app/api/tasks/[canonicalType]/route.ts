import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import type { TaskSpec, PublicTaskSpec, BenchmarkVersion } from '@/types';

const YAML_DIRS: Record<BenchmarkVersion, string> = {
  v1: path.resolve(process.cwd(), '..', '..', 'data', 'tasks_v1'),
  v2: path.resolve(process.cwd(), '..', '..', 'data', 'tasks_v2'),
};

function toPublicTaskSpec(task: TaskSpec): PublicTaskSpec {
  const {
    success_trigger,
    negative_cases,
    expected_interaction_path,
    notes,
    ...publicFields
  } = task;
  return publicFields;
}

function preprocessYaml(content: string): string {
  const lines = content.split('\n');
  let inBlockScalar = false;
  let blockScalarIndent = 0;

  const processedLines: string[] = [];
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

/**
 * For v1: one YAML file per canonical type (filename = canonical_type.yaml).
 * For v2: YAML files are named by unit; we scan all and filter by canonical_type.
 */
function loadTasksForType(canonicalType: string, version: BenchmarkVersion): TaskSpec[] | null {
  const yamlDir = YAML_DIRS[version];

  if (version === 'v1') {
    const yamlPath = path.join(yamlDir, `${canonicalType}.yaml`);
    if (!fs.existsSync(yamlPath)) return null;
    const content = fs.readFileSync(yamlPath, 'utf-8');
    const preprocessed = preprocessYaml(content);
    const tasks = yaml.load(preprocessed) as TaskSpec[];
    return Array.isArray(tasks) ? tasks : null;
  }

  // v2: scan all YAML files, collect tasks matching the canonical type
  if (!fs.existsSync(yamlDir)) return null;
  const files = fs.readdirSync(yamlDir).filter(f => f.endsWith('.yaml'));
  const matched: TaskSpec[] = [];

  for (const file of files) {
    const filePath = path.join(yamlDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const preprocessed = preprocessYaml(content);
    const parsed = yaml.load(preprocessed);
    const tasks = Array.isArray(parsed) ? parsed : (parsed as { tasks?: TaskSpec[] })?.tasks;
    if (!tasks || !Array.isArray(tasks)) continue;

    for (const task of tasks) {
      if (task.canonical_type === canonicalType) {
        matched.push(task as TaskSpec);
      }
    }
  }

  return matched.length > 0 ? matched : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ canonicalType: string }> }
) {
  const { canonicalType } = await params;
  const bench = (request.nextUrl.searchParams.get('bench') || 'v1') as BenchmarkVersion;
  const version: BenchmarkVersion = bench === 'v2' ? 'v2' : 'v1';

  try {
    const tasks = loadTasksForType(canonicalType, version);
    if (!tasks) {
      return NextResponse.json([], { status: 200 });
    }

    const shouldReturnFullSpecs = process.env.COMPONENTBENCH_FULL_SPECS === '1';
    const responseTasks = shouldReturnFullSpecs ? tasks : tasks.map(toPublicTaskSpec);

    return NextResponse.json(responseTasks);
  } catch (error) {
    console.error(`YAML parse error for ${canonicalType} (${version}):`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
