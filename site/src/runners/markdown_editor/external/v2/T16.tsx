'use client';

/**
 * T16: Preview-verified troubleshooting correction
 *
 * Inline surface: editor "Troubleshooting note" sits inside a troubleshooting card
 * with an incidents table and two nearby filter dropdowns.
 * Initial: near-match — `## Troubleshooting` (H2), plain text "Logs attached",
 * and the final note is plain text instead of a blockquote.
 * Target: `### Troubleshooting` (H3), `- Logs attached` (bullet), blockquote for final note.
 * Success: Source matches target, "Save note" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `## Troubleshooting
Logs attached
Restart the worker if retries stall.`;

const TARGET = `### Troubleshooting
- Logs attached

> Restart the worker if retries stall.`;

export default function T16({ onSuccess }: TaskComponentProps) {
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
    <div style={{ width: 800, padding: 20, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Troubleshooting</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 13 }}>
          <option>Severity: All</option>
          <option>Severity: Critical</option>
          <option>Severity: Warning</option>
        </select>
        <select style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 13 }}>
          <option>Status: All</option>
          <option>Status: Open</option>
          <option>Status: Resolved</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ padding: '6px 12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', color: '#999', fontSize: 12 }}>ID</th>
            <th style={{ padding: '6px 12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', color: '#999', fontSize: 12 }}>Issue</th>
            <th style={{ padding: '6px 12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', color: '#999', fontSize: 12 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>INC-201</td>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>Worker timeout</td>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#fa8c16' }}>Investigating</span>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>INC-200</td>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>Cache miss spike</td>
            <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#52c41a' }}>Resolved</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Troubleshooting note</div>
      <MDEditor
        value={value}
        onChange={(val) => { setSaved(false); setValue(val || ''); }}
        preview="live"
        height={180}
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
        Save note
      </button>
    </div>
  );
}
