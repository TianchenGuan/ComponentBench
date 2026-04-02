'use client';

/**
 * T05: Match the reference preview exactly and save
 *
 * Dashboard panel with "Article body" editor in Live mode and a read-only "Reference preview" card.
 * The reference shows: H2 "Setup", checked task, unchecked task, blockquote with inline code.
 * Initial source is a near-match: wrong heading level (H1) and plain text `config` (no backticks).
 * Success: Source matches reference source, "Save article" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# Setup
- [x] Install dependencies
- [ ] Run tests

> Use config.`;

const TARGET = `## Setup
- [x] Install dependencies
- [ ] Run tests

> Use \`config\`.`;

export default function T05({ onSuccess }: TaskComponentProps) {
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
    <div style={{ display: 'flex', gap: 20, width: 960 }}>
      <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ padding: '3px 8px', background: '#f6ffed', borderRadius: 10, fontSize: 11, color: '#52c41a' }}>
          Build passing
        </span>
        <span style={{ padding: '3px 8px', background: '#f0f5ff', borderRadius: 10, fontSize: 11, color: '#1677ff' }}>
          Coverage 87%
        </span>
        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Stats</div>
          <div style={{ fontSize: 12, color: '#999' }}>Commits today: 14</div>
          <div style={{ fontSize: 12, color: '#999' }}>Open PRs: 3</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Article body</div>
          <MDEditor
            value={value}
            onChange={(val) => { setSaved(false); setValue(val || ''); }}
            preview="live"
            height={280}
            data-color-mode="light"
          />
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
            Save article
          </button>
        </div>

        <div
          style={{ width: 260, padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #e8e8e8' }}
          data-testid="ref-article-setup"
        >
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#666' }}>
            Reference preview
          </div>
          <div style={{ padding: 12, background: '#fff', borderRadius: 4, border: '1px solid #eee', fontSize: 14 }}>
            <h2 style={{ fontSize: 18, margin: '0 0 8px 0' }}>Setup</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0' }}>
              <li>☑ Install dependencies</li>
              <li>☐ Run tests</li>
            </ul>
            <blockquote style={{ margin: 0, padding: '4px 12px', borderLeft: '3px solid #ddd', color: '#555' }}>
              Use <code style={{ background: '#f0f0f0', padding: '1px 4px', borderRadius: 3, fontSize: 13 }}>config</code>.
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
