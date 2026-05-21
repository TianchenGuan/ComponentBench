'use client';

/**
 * markdown_editor-external-T27: Enable live split preview in a small editor
 *
 * Layout: isolated_card centered.
 * Scale: small (compact header + smaller mode toggle targets).
 * Component: one Markdown editor labeled "Live preview toggle".
 * Configuration:
 *   - Mode toggle group exists with three options (Edit / Live / Preview). In this task the toggle is rendered as icons, but each icon has an accessible label/tooltip.
 *   - Live mode displays split view: textarea left, preview right.
 * Initial state: editor is in Edit mode (textarea only; preview panel is hidden).
 * Content: a short markdown sentence is present so preview changes are obvious once enabled.
 * Distractors: none.
 * Feedback: switching to Live mode should show a visible vertical split with preview on the right.
 *
 * Success: Editor mode equals 'live' (split view) and the preview pane is visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps, EditorMode } from '../types';

const INITIAL_CONTENT = `**Hello!** This is a *sample* markdown text.

It has **bold** and *italic* formatting.`;

export default function T27({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const [mode, setMode] = useState<EditorMode>('edit');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (mode === 'live') {
      successFired.current = true;
      onSuccess();
    }
  }, [mode, onSuccess]);

  return (
    <div
      style={{
        padding: 14,
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e8e8e8',
        width: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: 13,
      }}
      data-testid="md-editor-live-preview-toggle"
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Live preview toggle</h3>
      
      {/* Mode toggle (small icons) */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 4 }}>
        {(['edit', 'live', 'preview'] as EditorMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '4px 10px',
              background: mode === m ? '#1677ff' : '#f5f5f5',
              color: mode === m ? '#fff' : '#333',
              border: mode === m ? '1px solid #1677ff' : '1px solid #d9d9d9',
              borderRadius: 3,
              cursor: 'pointer',
              fontSize: 11,
            }}
            aria-pressed={mode === m}
            title={m === 'edit' ? 'Edit only' : m === 'live' ? 'Live split' : 'Preview only'}
            data-testid={`mode-${m}`}
          >
            {m === 'edit' ? '✏️' : m === 'live' ? '👁️✏️' : '👁️'}
          </button>
        ))}
      </div>

      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview={mode === 'edit' ? 'edit' : mode === 'preview' ? 'preview' : 'live'}
        height={180}
        data-color-mode="light"
      />
    </div>
  );
}
