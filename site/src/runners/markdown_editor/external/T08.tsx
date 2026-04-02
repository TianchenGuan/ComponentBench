'use client';

/**
 * markdown_editor-external-T08: Match a simple reference preview
 *
 * Layout: isolated_card centered, split into two columns.
 * Left column: a single Markdown editor labeled "Answer".
 * Right column: a read-only "Reference preview" card that renders the target markdown visually (no source text is shown).
 * Configuration:
 *   - Editor is in Live (split) mode so you can see your own preview while editing.
 *   - Toolbar is present but optional; you can type markdown directly.
 * Initial state: the editor starts empty.
 * Distractors: none besides the reference preview card.
 * Feedback: your preview updates immediately; the reference preview is static.
 *
 * Reference preview content: it renders the phrase "Hello, world!" with the word "world" in bold.
 * 
 * Success: Editor markdown value produces equivalent output (Hello, **world**! or Hello, __world__!)
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatchesAny } from '../types';

const TARGET_VALUES = [
  'Hello, **world**!',
  'Hello, __world__!',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
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
        width: 800,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Match the reference preview</h3>
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Editor */}
        <div style={{ flex: 1 }} data-testid="md-editor-answer">
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Answer</h4>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            preview="live"
            height={250}
            data-color-mode="light"
          />
        </div>

        {/* Right: Reference preview */}
        <div
          style={{
            flex: 1,
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
          data-testid="ref-hello-bold"
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Reference preview</h4>
          <div
            style={{
              padding: 16,
              background: '#fff',
              borderRadius: 4,
              border: '1px solid #eee',
              fontSize: 16,
            }}
          >
            Hello, <strong>world</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}
