'use client';

/**
 * markdown_editor-external-T25: Edit the correct editor among three instances
 *
 * Layout: dashboard with several cards (clutter medium).
 * Target area: a "Release blurb" card contains THREE Markdown editor instances stacked vertically:
 *   - "Summary"
 *   - "Details"        ← TARGET
 *   - "Internal notes"
 * Configuration:
 *   - All three editors share the same small toolbar and look nearly identical.
 *   - Each editor has its own preview under it.
 *   - No Save/Apply; live value is checked.
 * Initial state:
 *   - Summary contains: "Short summary goes here."
 *   - Details contains: "(empty)"
 *   - Internal notes contains: "For staff only."
 * Distractors:
 *   - Other dashboard cards (charts, lists) are present but irrelevant.
 * Feedback: the Details preview should show a subheading and a bullet list once filled.
 *
 * Success: Details editor markdown value equals the target AND Summary and Internal notes remain unchanged.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches, normalizeMarkdown } from '../types';

const SUMMARY_INITIAL = 'Short summary goes here.';
const DETAILS_INITIAL = '(empty)';
const INTERNAL_NOTES_INITIAL = 'For staff only.';

const DETAILS_TARGET = `## Details
The release includes:
- API is stable
- UI polish pending`;

function detailsMatchesFlexible(md: string): boolean {
  const n = normalizeMarkdown(md);
  const hasHeading = /^#{1,3}\s*Details\s*$/m.test(n);
  const hasIntro = /The release includes:?/i.test(n);
  const hasBullet1 = /[-*]\s*API is stable/i.test(n);
  const hasBullet2 = /[-*]\s*UI polish pending/i.test(n);
  return hasHeading && hasIntro && hasBullet1 && hasBullet2;
}

function summaryUnchanged(md: string): boolean {
  const n = normalizeMarkdown(md);
  return n === normalizeMarkdown(SUMMARY_INITIAL) || n === 'Short summary goes here';
}

function notesUnchanged(md: string): boolean {
  const n = normalizeMarkdown(md);
  return n === normalizeMarkdown(INTERNAL_NOTES_INITIAL) || n === 'For staff only';
}

export default function T25({ onSuccess }: TaskComponentProps) {
  const [summary, setSummary] = useState<string>(SUMMARY_INITIAL);
  const [details, setDetails] = useState<string>(DETAILS_INITIAL);
  const [internalNotes, setInternalNotes] = useState<string>(INTERNAL_NOTES_INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const detailsOk = markdownMatches(details, DETAILS_TARGET) || detailsMatchesFlexible(details);
    const summaryOk = summaryUnchanged(summary);
    const notesOk = notesUnchanged(internalNotes);
    if (detailsOk && summaryOk && notesOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [summary, details, internalNotes, onSuccess]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, width: 900 }}>
      {/* Left column: Distractors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Stats</h4>
          <div style={{ fontSize: 24, fontWeight: 600 }}>1,234</div>
          <div style={{ fontSize: 12, color: '#999' }}>Downloads</div>
        </div>

        <div
          style={{
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Activity</h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: '#666' }}>
            <li>Build passed</li>
            <li>Tests OK</li>
          </ul>
        </div>
      </div>

      {/* Right: Release blurb with 3 editors */}
      <div
        style={{
          padding: 20,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Release blurb</h3>

        {/* Summary editor */}
        <div style={{ marginBottom: 16 }} data-testid="md-editor-summary">
          <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#666' }}>Summary</h4>
          <MDEditor
            value={summary}
            onChange={(val) => setSummary(val || '')}
            preview="live"
            height={100}
            data-color-mode="light"
          />
        </div>

        {/* Details editor (TARGET) */}
        <div style={{ marginBottom: 16, background: '#fffbe6', padding: 12, borderRadius: 6 }} data-testid="md-editor-details">
          <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#666' }}>Details</h4>
          <MDEditor
            value={details}
            onChange={(val) => setDetails(val || '')}
            preview="live"
            height={140}
            data-color-mode="light"
          />
        </div>

        {/* Internal notes editor */}
        <div data-testid="md-editor-internal-notes">
          <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: '#666' }}>Internal notes</h4>
          <MDEditor
            value={internalNotes}
            onChange={(val) => setInternalNotes(val || '')}
            preview="live"
            height={100}
            data-color-mode="light"
          />
        </div>
      </div>
    </div>
  );
}
