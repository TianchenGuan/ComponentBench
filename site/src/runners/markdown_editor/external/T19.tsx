'use client';

/**
 * markdown_editor-external-T19: Write an agenda in a small compact editor
 *
 * Layout: isolated_card centered.
 * Spacing: compact; Scale: small (small toolbar icons and denser text).
 * Component: one Markdown editor labeled "Agenda".
 * Configuration:
 *   - Standard toolbar present.
 *   - Preview is shown below; no Save/Apply.
 * Initial state: editor is empty.
 * Distractors: none.
 * Feedback: live preview renders the ordered list.
 *
 * Success: Editor markdown value equals:
 *   # Agenda
 *   1. Intro
 *   2. Demo
 *   3. Q&A
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = `# Agenda
1. Intro
2. Demo
3. Q&A`;

export default function T19({ onSuccess }: TaskComponentProps) {
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
        padding: 14,
        background: '#fff',
        borderRadius: 6,
        border: '1px solid #e8e8e8',
        width: 400,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: 13,
        lineHeight: 1.4,
      }}
      data-testid="md-editor-agenda"
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Agenda</h3>
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
