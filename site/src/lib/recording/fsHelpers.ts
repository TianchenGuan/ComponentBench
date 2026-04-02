/**
 * Filesystem helpers for recording API routes.
 * All writes are atomic (write-to-temp then rename) where data integrity matters.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getRecordRoot } from './config';

const SAFE_NAME = /^[a-zA-Z0-9_\-\.]+$/;

export function sanitize(name: string): string {
  if (!SAFE_NAME.test(name)) {
    throw new Error(`Unsafe name: ${name}`);
  }
  return name;
}

export function runDir(runId: string): string {
  return path.join(getRecordRoot(), sanitize(runId));
}

export function episodeDir(runId: string, taskId: string): string {
  return path.join(runDir(runId), 'episodes', sanitize(taskId));
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

/** Atomic JSON write: write to temp file then rename. */
export function atomicWriteJson(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  const tmp = path.join(dir, `.tmp_${process.pid}_${Date.now()}`);
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, filePath);
}

/** Append a JSON line to a file (create if missing). */
export function appendJsonLine(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  fs.appendFileSync(filePath, JSON.stringify(data) + '\n');
}

/** Read JSON file, return null if missing. */
export function readJsonSafe<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
