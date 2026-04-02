'use client';

/**
 * markdown_editor-external-T02: Write a simple release note
 *
 * Layout: isolated_card anchored near the top-left of the viewport (not centered).
 * Component: one Markdown editor labeled "Release note".
 * Configuration:
 *   - Standard toolbar is present but not required (typing markdown is sufficient).
 *   - Editor height is medium; no internal scrolling is needed for this short content.
 *   - Preview is shown below the editor and updates as you type.
 * Initial state: editor contains a placeholder hint ("Write a release note…"), but the value is empty.
 * Distractors: none.
 * Feedback: preview updates immediately; no Save/Apply.
 *
 * Success: Editor markdown value equals:
 *   # Release notes
 *   Version 1.0 ships today.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = `# Release notes
Version 1.0 ships today.`;

export default function T02({ onSuccess }: TaskComponentProps) {
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
        width: 550,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-release-note"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Release note</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        textareaProps={{ placeholder: 'Write a release note…' }}
        data-color-mode="light"
      />
    </div>
  );
}
