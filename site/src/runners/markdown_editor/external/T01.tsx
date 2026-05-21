'use client';

/**
 * markdown_editor-external-T01: Set a welcome sentence
 *
 * Layout: isolated_card centered in the viewport.
 * Component: a single Markdown editor labeled "Project note".
 * Configuration:
 *   - Standard toolbar (Bold, Italic, Link, Quote, Code, List, Preview toggle, Clear).
 *   - Live typing updates the editor value immediately (no Save/Apply button in this task).
 *   - A small rendered preview area is visible below the editor (read-only) but is not required.
 * Initial state: the editor is empty and focused only when clicked.
 * Distractors: none (only a title and the editor card).
 * Feedback: character counter updates as you type; no toasts.
 *
 * Success: Editor markdown value equals "Welcome to ComponentBench!" after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = 'Welcome to ComponentBench!';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-project-note"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Project note</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={300}
        data-color-mode="light"
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Characters: {value.length}
      </div>
    </div>
  );
}
