'use client';

/**
 * markdown_editor-external-T15: Reset the editor to a default template
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Weekly update".
 * Configuration:
 *   - Standard toolbar + an extra footer control labeled "Reset to template".
 *   - Clicking "Reset to template" replaces the entire editor value with a predefined template.
 *   - Preview updates live.
 * Initial state: editor contains a modified note (not matching the template), e.g. "Random thoughts…".
 * Distractors: none.
 * Feedback: reset immediately changes the textarea value and preview; no confirmation dialog.
 * Template content:
 *   # Weekly update
 *   - Wins:
 *   - Risks:
 *   - Next:
 *
 * Success: Editor markdown value equals the template after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const INITIAL_CONTENT = `Random thoughts…

Some ideas I had:
- Think about goals
- Review last week`;

const TEMPLATE = `# Weekly update
- Wins:
- Risks:
- Next:`;

export default function T15({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TEMPLATE)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue(TEMPLATE);
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
      data-testid="md-editor-weekly-update"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Weekly update</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        data-color-mode="light"
      />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            background: '#fff',
            color: '#333',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
          data-testid="reset-button"
        >
          Reset to template
        </button>
      </div>
    </div>
  );
}
