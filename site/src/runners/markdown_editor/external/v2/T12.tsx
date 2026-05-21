'use client';

/**
 * T12: Guide source and preview must match target card
 *
 * Dashboard panel with high clutter (metrics rail, incidents list). "Migration guide"
 * editor in Edit mode with a live preview underneath. A read-only "Target guide" card
 * shows the target source (monospace) and rendered preview.
 * Initial: near-match — heading `## Migration`, missing ordered-list item 2, plain text note.
 * Target: `# Migration guide` (H1), two list items, blockquote.
 * Success: Source matches, "Save guide" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `## Migration
1. Back up the database
Test rollback before cutover.`;

const TARGET = `# Migration guide

1. Back up the database
2. Rotate the API keys

> Test rollback before cutover.`;

export default function T12({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && markdownMatches(value, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, width: 1000 }}>
      <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Metrics</div>
          {[['Uptime', '99.8%'], ['P95 latency', '142ms'], ['Error rate', '0.3%']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Recent incidents</div>
          <ul style={{ margin: 0, padding: '0 0 0 14px', fontSize: 12, color: '#666' }}>
            <li>DB failover — resolved</li>
            <li>Cache miss spike — investigating</li>
            <li>Deploy timeout — fixed</li>
          </ul>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Migration guide</div>
        <MDEditor
          value={value}
          onChange={(val) => { setSaved(false); setValue(val || ''); }}
          preview="edit"
          height={200}
          data-color-mode="light"
        />
        <div
          style={{
            marginTop: 8,
            padding: 12,
            background: '#fafafa',
            borderRadius: 4,
            border: '1px solid #eee',
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Live preview</div>
          <MDEditor.Markdown source={value} />
        </div>
        <button
          onClick={() => setSaved(true)}
          style={{
            marginTop: 12,
            padding: '8px 20px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Save guide
        </button>
      </div>

      <div
        style={{ width: 280, padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #e8e8e8' }}
        data-testid="ref-migration-guide"
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#666' }}>Target guide</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#999', marginBottom: 4 }}>Source</div>
          <pre
            style={{
              margin: 0,
              padding: 8,
              background: '#fff',
              borderRadius: 4,
              border: '1px solid #eee',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}
          >{`# Migration guide

1. Back up the database
2. Rotate the API keys

> Test rollback before cutover.`}</pre>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#999', marginBottom: 4 }}>Preview</div>
          <div style={{ padding: 8, background: '#fff', borderRadius: 4, border: '1px solid #eee', fontSize: 14 }}>
            <h1 style={{ fontSize: 20, margin: '0 0 8px 0' }}>Migration guide</h1>
            <ol style={{ margin: '0 0 8px 0', paddingLeft: 20 }}>
              <li>Back up the database</li>
              <li>Rotate the API keys</li>
            </ol>
            <blockquote style={{ margin: 0, padding: '4px 12px', borderLeft: '3px solid #ddd', color: '#555' }}>
              Test rollback before cutover.
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
