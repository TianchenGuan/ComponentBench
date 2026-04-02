'use client';

/**
 * markdown_editor-external-T09: Write a one-line blockquote in compact mode
 *
 * Layout: isolated_card centered.
 * Spacing: compact (tighter padding and smaller line-height).
 * Component: one Markdown editor labeled "Reminder".
 * Configuration:
 *   - Standard toolbar present but not required.
 *   - Live preview is shown below.
 * Initial state: editor is empty.
 * Distractors: none.
 * Feedback: preview updates immediately.
 *
 * Success: Editor markdown value equals "> Note: Bring ID." after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = '> Note: Bring ID.';

export default function T09({ onSuccess }: TaskComponentProps) {
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
        padding: 16,
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e8e8e8',
        width: 450,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        lineHeight: 1.4,
      }}
      data-testid="md-editor-reminder"
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Reminder</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={180}
        data-color-mode="light"
      />
    </div>
  );
}
