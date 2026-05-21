'use client';

/**
 * markdown_editor-external-T20: Edit a small markdown editor inside a table cell
 *
 * Layout: table_cell — a releases table is shown with several rows and columns (clutter medium).
 * Target location: in the "Notes" column for the row labeled "Release 1.0", there is an inline Markdown editor (small scale) labeled "Notes (Release 1.0)".
 * Configuration:
 *   - The inline editor is always visible inside the cell (no popover), but it is small and requires precise clicking to focus.
 *   - Toolbar is minimized to a single row of icons; preview is hidden (edit-only) to conserve space.
 *   - No Save/Apply; live value is checked.
 * Initial state: the Notes editor contains "(none)".
 * Distractors:
 *   - Other rows have similar "Notes" cells (read-only text, not editors).
 *   - The table has sortable headers and pagination controls (not required).
 * Feedback: when focused, a caret appears and the textarea border highlights.
 *
 * Success: Editor markdown value equals "Ships on Friday." after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = 'Ships on Friday.';

const releases = [
  { version: 'Release 0.9', date: '2026-01-15', status: 'Released', notes: 'Beta release' },
  { version: 'Release 1.0', date: '2026-02-03', status: 'Pending', notes: null }, // TARGET row - editable
  { version: 'Release 1.1', date: '2026-03-01', status: 'Planned', notes: 'Bug fixes' },
];

export default function T20({ onSuccess }: TaskComponentProps) {
  const [editorValue, setEditorValue] = useState<string>('(none)');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(editorValue, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [editorValue, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 750,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Releases</h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>Version ↕</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>Date</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>Status</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8', width: 200 }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release, idx) => (
            <tr key={idx} style={{ background: idx === 1 ? '#fffbe6' : undefined }}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>{release.version}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>{release.date}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: release.status === 'Released' ? '#f6ffed' : release.status === 'Pending' ? '#fffbe6' : '#f0f0f0',
                    color: release.status === 'Released' ? '#52c41a' : release.status === 'Pending' ? '#faad14' : '#666',
                  }}
                >
                  {release.status}
                </span>
              </td>
              <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>
                {release.notes === null ? (
                  <div data-testid="md-editor-notes-release-1.0">
                    <MDEditor
                      value={editorValue}
                      onChange={(val) => setEditorValue(val || '')}
                      preview="edit"
                      height={60}
                      hideToolbar={true}
                      data-color-mode="light"
                    />
                  </div>
                ) : (
                  <span style={{ color: '#666' }}>{release.notes}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination (distractor) */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff' }}>←</button>
        <span style={{ padding: '4px 8px' }}>1 / 1</span>
        <button style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff' }}>→</button>
      </div>
    </div>
  );
}
