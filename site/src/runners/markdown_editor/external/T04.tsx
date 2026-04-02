'use client';

/**
 * markdown_editor-external-T04: Clear a prefilled draft
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Draft".
 * Configuration:
 *   - Standard toolbar includes a clearly labeled "Clear" control (trash icon + text).
 *   - Clearing immediately sets the editor value to empty (no confirmation dialog).
 *   - Preview panel remains visible below (and becomes blank when cleared).
 * Initial state: editor starts with a short draft:
 *   - "This is a temporary draft."
 *   - "Delete it before publishing."
 * Distractors: none.
 * Feedback: the preview clears immediately; no toast.
 *
 * Success: Editor markdown value is empty after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { isMarkdownEmpty } from '../types';

const INITIAL_CONTENT = `This is a temporary draft.
Delete it before publishing.`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isMarkdownEmpty(value)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 550,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-draft"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Draft</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        data-color-mode="light"
      />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
          data-testid="clear-button"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}
