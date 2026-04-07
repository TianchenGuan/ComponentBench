import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import yaml from 'js-yaml';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'data', 'tasklab_drafts');

export async function GET(
  _req: NextRequest,
  { params }: { params: { taskId: string } },
) {
  if (process.env.TASKLAB_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Task Lab is not enabled on this server' },
      { status: 403 },
    );
  }

  try {
    const { taskId } = params;
    const safeTaskId = String(taskId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);

    let content: string;
    try {
      content = await fs.readFile(yamlPath, 'utf-8');
    } catch {
      return NextResponse.json(
        { error: `Task not found: ${safeTaskId}` },
        { status: 404 },
      );
    }

    // Try to parse the YAML. If it's malformed, return the raw content
    // so the frontend can still show something useful. We purposely don't
    // return a 500 here — bad YAML shouldn't break the playground preview.
    let spec: Record<string, unknown> | null = null;
    let parseError: string | null = null;
    try {
      spec = yaml.load(content) as Record<string, unknown>;
    } catch (err) {
      parseError = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json({
      success: true,
      taskId: safeTaskId,
      spec,
      rawYaml: content,
      parseError,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
