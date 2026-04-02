'use client';

/**
 * markdown_editor-external-T05: Switch to edit mode in dark theme
 *
 * Layout: isolated_card centered.
 * Theme: dark mode (dark background, light text).
 * Component: one Markdown editor labeled "Policy".
 * Configuration:
 *   - The editor supports three view modes: Edit, Live (split), and Preview.
 *   - A mode toggle group is shown in the editor header/toolbar with accessible labels ("Edit", "Live", "Preview").
 * Initial state: the editor opens in Preview mode (textarea is read-only/disabled; preview is shown).
 * Content: a short markdown paragraph is already present.
 * Distractors: none.
 * Feedback: switching modes changes whether the textarea is editable and whether the split preview is shown.
 *
 * Success: Editor mode equals 'edit'.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps, EditorMode } from '../types';

const INITIAL_CONTENT = `# Policy Document

This document outlines the acceptable use policy.

Please review all sections carefully before proceeding.`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const [mode, setMode] = useState<EditorMode>('preview');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (mode === 'edit') {
      successFired.current = true;
      onSuccess();
    }
  }, [mode, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#1f1f1f',
        borderRadius: 8,
        border: '1px solid #444',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        color: '#fff',
      }}
      data-testid="md-editor-policy"
      data-color-mode="dark"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Policy</h3>

      {/* Mode toggle */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        {(['edit', 'live', 'preview'] as EditorMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 16px',
              background: mode === m ? '#1677ff' : '#333',
              color: mode === m ? '#fff' : '#ccc',
              border: mode === m ? '1px solid #1677ff' : '1px solid #555',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              textTransform: 'capitalize',
            }}
            aria-pressed={mode === m}
            data-testid={`mode-${m}`}
          >
            {m === 'live' ? 'Live' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div data-color-mode="dark">
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || '')}
          preview={mode === 'edit' ? 'edit' : mode === 'preview' ? 'preview' : 'live'}
          height={300}
        />
      </div>
    </div>
  );
}
