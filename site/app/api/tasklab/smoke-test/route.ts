import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'data', 'tasklab_drafts');
const RUNNERS_DIR = path.join(process.cwd(), 'src', 'runners');

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

export async function POST(req: NextRequest) {
  if (process.env.TASKLAB_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Task Lab is not enabled on this server' },
      { status: 403 },
    );
  }

  try {
    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const checks: CheckResult[] = [];
    const safeTaskId = taskId.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Check 1: Draft exists
    const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);
    try {
      await fs.access(yamlPath);
      checks.push({ name: 'draft_exists', passed: true, detail: `Draft found at ${safeTaskId}.yaml` });
    } catch {
      checks.push({ name: 'draft_exists', passed: false, detail: 'Draft YAML not found' });
    }

    // Check 2: Component file exists
    // Parse taskId to find component path: "button-antd-T31" -> runners/button/antd/T31.tsx
    const parts = taskId.split('-');
    let componentExists = false;
    if (parts.length >= 3) {
      const canonicalType = parts[0];
      const library = parts[1];
      const suffix = parts.slice(2).join('-');
      const componentPath = path.join(RUNNERS_DIR, canonicalType, library, `${suffix}.tsx`);
      try {
        await fs.access(componentPath);
        checks.push({
          name: 'component_exists',
          passed: true,
          detail: `Component found at src/runners/${canonicalType}/${library}/${suffix}.tsx`,
        });
        componentExists = true;
      } catch {
        checks.push({
          name: 'component_exists',
          passed: false,
          detail: `Component not found at src/runners/${canonicalType}/${library}/${suffix}.tsx`,
        });
      }
    } else {
      checks.push({
        name: 'component_exists',
        passed: false,
        detail: `Cannot parse taskId "${taskId}" into canonical_type-library-suffix format`,
      });
    }

    // Check 3: Task page returns 200 (only if component exists)
    if (componentExists) {
      const taskUrl = `http://localhost:3002/task/${taskId}?mode=benchmark`;
      try {
        const resp = await fetch(taskUrl, {
          signal: AbortSignal.timeout(10000),
        });
        if (resp.ok) {
          checks.push({
            name: 'page_loads',
            passed: true,
            detail: `GET ${taskUrl} returned ${resp.status}`,
          });
        } else {
          checks.push({
            name: 'page_loads',
            passed: false,
            detail: `GET ${taskUrl} returned ${resp.status}`,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        checks.push({
          name: 'page_loads',
          passed: false,
          detail: `Failed to fetch ${taskUrl}: ${msg}`,
        });
      }
    } else {
      checks.push({
        name: 'page_loads',
        passed: false,
        detail: 'Skipped: component file does not exist',
      });
    }

    const allPassed = checks.every((c) => c.passed);
    console.log(`[TaskLab] Smoke test for ${taskId}: ${allPassed ? 'PASSED' : 'FAILED'}`);

    return NextResponse.json({
      success: allPassed,
      taskId,
      checks,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[TaskLab] smoke-test error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
