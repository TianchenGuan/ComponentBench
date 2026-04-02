'use client';

/**
 * markdown_editor-external-T06: Show preview-only mode
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Meeting minutes".
 * Configuration:
 *   - Mode toggle group (Edit / Live / Preview) is shown in the editor header.
 *   - In Live mode, the editor is split: textarea on the left and preview on the right.
 *   - In Preview mode, only the rendered preview is shown and typing is disabled.
 * Initial state: the editor starts in Live (split) mode with a short markdown note already entered.
 * Distractors: none.
 * Feedback: switching to Preview collapses the textarea and leaves only the rendered preview visible.
 *
 * Success: Editor mode equals 'preview'.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps, EditorMode } from '../types';

const INITIAL_CONTENT = `# Meeting Minutes

**Date:** February 3, 2026

## Attendees
- Alice
- Bob
- Charlie

## Action Items
1. Review proposal
2. Submit feedback`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const [mode, setMode] = useState<EditorMode>('live');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (mode === 'preview') {
      successFired.current = true;
      onSuccess();
    }
  }, [mode, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 650,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-meeting-minutes"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Meeting minutes</h3>

      {/* Mode toggle */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        {(['edit', 'live', 'preview'] as EditorMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 16px',
              background: mode === m ? '#1677ff' : '#f5f5f5',
              color: mode === m ? '#fff' : '#333',
              border: mode === m ? '1px solid #1677ff' : '1px solid #d9d9d9',
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

      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview={mode === 'edit' ? 'edit' : mode === 'preview' ? 'preview' : 'live'}
        height={350}
        data-color-mode="light"
      />
    </div>
  );
}
