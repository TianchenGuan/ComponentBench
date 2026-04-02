'use client';

/**
 * markdown_editor-external-T03: Create a shopping list
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Groceries".
 * Configuration:
 *   - Scale is set to small (smaller toolbar icons and tighter padding inside the card).
 *   - Standard toolbar is visible above the textarea.
 *   - Preview is shown below the editor.
 * Initial state: editor is empty.
 * Distractors: none.
 * Feedback: live preview; no Save/Apply.
 *
 * Success: Editor markdown value equals:
 *   ## Shopping list
 *   - Apples
 *   - Bread
 *   - Milk
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = `## Shopping list
- Apples
- Bread
- Milk`;

export default function T03({ onSuccess }: TaskComponentProps) {
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
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 450,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: 14,
      }}
      data-testid="md-editor-groceries"
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Groceries</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={200}
        data-color-mode="light"
      />
    </div>
  );
}
