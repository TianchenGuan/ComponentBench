import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'data', 'tasklab_drafts');

export async function POST(req: NextRequest) {
  if (process.env.TASKLAB_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Task Lab is not enabled on this server' },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();

    const { instruction } = body;
    if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
      return NextResponse.json(
        { error: 'Missing required field: instruction' },
        { status: 400 },
      );
    }

    // Auto-generate taskId if missing
    const rawTaskId: string = body.taskId || `playground-${Date.now()}`;
    const safeTaskId = rawTaskId.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Only write fields the user actually provided. Empty/null/undefined
    // fields are skipped so GPT-5.4 knows it has free rein on them.
    const taskSpec: Record<string, unknown> = {
      task_id: safeTaskId,
      browsergym_goal: instruction,
    };
    if (body.title) taskSpec.title = body.title;
    if (body.canonicalType) taskSpec.canonical_type = body.canonicalType;
    if (body.library) taskSpec.library = body.library;
    if (body.taskTemplate) taskSpec.task_template = body.taskTemplate;
    if (body.setupDescription) taskSpec.setup_description = body.setupDescription;
    if (body.sceneContext && Object.keys(body.sceneContext).length > 0) {
      taskSpec.scene_context = body.sceneContext;
    }
    if (Array.isArray(body.successConditions) && body.successConditions.length > 0) {
      taskSpec.success_conditions = body.successConditions;
    }
    if (Array.isArray(body.negativeCases) && body.negativeCases.length > 0) {
      taskSpec.negative_cases = body.negativeCases;
    }
    if (body.difficultyBucket) taskSpec.difficulty_bucket = body.difficultyBucket;
    if (body.difficultyTier) taskSpec.difficulty_tier = body.difficultyTier;
    if (body.axesRatings && Object.keys(body.axesRatings).length > 0) {
      taskSpec.axes_ratings = body.axesRatings;
    }

    await fs.mkdir(DRAFTS_DIR, { recursive: true });

    const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);
    const yamlContent = yaml.dump(taskSpec, { lineWidth: 120, noRefs: true });
    await fs.writeFile(yamlPath, yamlContent, 'utf-8');

    const jsonPath = path.join(DRAFTS_DIR, `${safeTaskId}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(taskSpec, null, 2), 'utf-8');

    const relativePath = `data/tasklab_drafts/${safeTaskId}.yaml`;
    console.log(`[TaskLab] Draft saved: ${relativePath}`);

    return NextResponse.json({
      success: true,
      path: relativePath,
      taskId: safeTaskId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[TaskLab] save-draft error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
