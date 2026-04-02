'use client';

/**
 * markdown_editor-external-T11: Bold a single word
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Instruction line".
 * Configuration:
 *   - Standard toolbar includes Bold and Italic buttons.
 *   - Editor is in Edit mode (no split preview), but a small preview panel is visible below.
 * Initial state: the editor is prefilled with plain text (no markdown):
 *   - "Please read the instructions carefully."
 * Distractors: none.
 * Feedback: preview updates to show bold formatting once applied.
 *
 * Success: Editor markdown value, after normalization, matches one of:
 *   - Please read the **instructions** carefully.
 *   - Please read the __instructions__ carefully.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatchesAny } from '../types';

const INITIAL_CONTENT = 'Please read the instructions carefully.';

const TARGET_VALUES = [
  'Please read the **instructions** carefully.',
  'Please read the __instructions__ carefully.',
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatchesAny(value, TARGET_VALUES)) {
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
      data-testid="md-editor-instruction-line"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Instruction line</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        data-color-mode="light"
      />
    </div>
  );
}
