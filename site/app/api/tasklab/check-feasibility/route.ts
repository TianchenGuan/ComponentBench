import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'data', 'tasklab_drafts');
const CODEX_PATH = '/home/users/tg295/.nvm/versions/node/v22.22.0/bin/codex';

interface FeasibilityResult {
  feasible: boolean;
  reason?: string;
  suggestions?: string[];
}

function extractJson(text: string): FeasibilityResult | null {
  // Find the last line that looks like a JSON object
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        return JSON.parse(line) as FeasibilityResult;
      } catch {
        // continue
      }
    }
  }
  // Fallback: try to find first { ... } block
  const match = text.match(/\{[^{}]*"feasible"[^{}]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as FeasibilityResult;
    } catch {
      return null;
    }
  }
  return null;
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

    const safeTaskId = String(taskId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);

    let yamlContent: string;
    try {
      yamlContent = await fs.readFile(yamlPath, 'utf-8');
    } catch {
      return NextResponse.json(
        { error: `Draft not found: ${safeTaskId}.yaml. Save a draft first.` },
        { status: 404 },
      );
    }

    // Extract instruction from YAML (simple parse)
    let instruction = '';
    for (const line of yamlContent.split('\n')) {
      if (line.startsWith('browsergym_goal:')) {
        instruction = line.substring('browsergym_goal:'.length).trim().replace(/^['"]|['"]$/g, '');
        break;
      }
    }

    const prompt = `You are evaluating whether a ComponentBench task is feasible to implement as a single React page.

Task instruction: "${instruction}"
Advanced spec (if provided):
${yamlContent}

Determine:
1. Is this task achievable as a self-contained React page?
2. Are there internal contradictions? (e.g., "drag and drop on a code editor" — these don't fit)
3. Is the scope reasonable? (a button = yes, building Stripe = no)
4. Could a human verify success in a deterministic way?

Respond ONLY with a JSON object on a single line, nothing else:
{ "feasible": true/false, "reason": "...", "suggestions": ["...", "..."] }

If feasible, set reason to "" and suggestions to []. If not, explain why and offer alternative phrasings.`;

    const child = spawn(
      CODEX_PATH,
      [
        'exec',
        '-c', 'approval_policy="never"',
        '-c', 'model="gpt-5.4-mini"',
        '-c', 'model_reasoning_effort="low"',
        prompt,
      ],
      {
        cwd: PROJECT_ROOT,
        env: { ...process.env, HOME: '/home/users/tg295' },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d: Buffer) => (stdout += d.toString()));
    child.stderr.on('data', (d: Buffer) => (stderr += d.toString()));

    const exitCode: number | null = await new Promise((resolve) => {
      child.on('close', (code) => resolve(code));
      child.on('error', () => resolve(-1));
    });

    if (exitCode !== 0) {
      return NextResponse.json(
        { error: `Codex exited with code ${exitCode}: ${stderr || stdout}` },
        { status: 500 },
      );
    }

    const result = extractJson(stdout);
    if (!result) {
      return NextResponse.json(
        {
          error: 'Could not parse feasibility JSON from Codex output',
          raw: stdout,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      feasible: !!result.feasible,
      reason: result.reason ?? '',
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[TaskLab] check-feasibility error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
