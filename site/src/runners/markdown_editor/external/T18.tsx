'use client';

/**
 * markdown_editor-external-T18: Match a callout reference in dark theme
 *
 * Layout: isolated_card centered, dark theme.
 * Component: one Markdown editor labeled "Callout".
 * Guidance:
 *   - A "Reference preview" card sits to the right of the editor and shows the target formatting visually.
 *   - Above the editor, helper text says: "Make your callout match the reference (blockquote with a bold label)."
 * Configuration:
 *   - Editor starts in Live (split) mode so you can see your own preview while editing.
 *   - Toolbar present.
 * Initial state: editor is empty.
 * Distractors: none.
 * Reference preview content: it renders a single blockquote line with bold "Note:" followed by "Doors close at 7pm."
 *
 * Success: Editor markdown value produces equivalent output (blockquote with bold Note:)
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatchesAny } from '../types';

const TARGET_VALUES = [
  '> **Note:** Doors close at 7pm.',
  '> __Note:__ Doors close at 7pm.',
  '> **Note:** Doors close at 7pm',
  '> __Note:__ Doors close at 7pm',
];

function matchesCallout(md: string): boolean {
  const trimmed = md.trim();
  if (!trimmed.startsWith('>')) return false;
  const content = trimmed.replace(/^>\s*/, '');
  const hasBoldNote = /(\*\*|__)Note:(\*\*|__)/.test(content);
  const hasDoorsClose = /Doors\s+close\s+at\s+7\s*pm\.?/i.test(content);
  return hasBoldNote && hasDoorsClose;
}

export default function T18({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatchesAny(value, TARGET_VALUES) || matchesCallout(value)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#1f1f1f',
        borderRadius: 8,
        border: '1px solid #444',
        width: 800,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        color: '#fff',
      }}
      data-color-mode="dark"
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Match the reference callout</h3>
      <p style={{ margin: '0 0 16px 0', color: '#aaa', fontSize: 14 }}>
        Make your callout match the reference (blockquote with a bold label).
      </p>
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Editor */}
        <div style={{ flex: 1 }} data-testid="md-editor-callout">
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#888' }}>Callout</h4>
          <div data-color-mode="dark">
            <MDEditor
              value={value}
              onChange={(val) => setValue(val || '')}
              preview="live"
              height={200}
            />
          </div>
        </div>

        {/* Right: Reference preview */}
        <div
          style={{
            flex: 1,
            padding: 16,
            background: '#2a2a2a',
            borderRadius: 8,
            border: '1px solid #444',
          }}
          data-testid="ref-note-callout"
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#888' }}>Reference preview</h4>
          <div
            style={{
              padding: 16,
              background: '#333',
              borderRadius: 4,
              borderLeft: '4px solid #666',
              fontSize: 15,
              color: '#ddd',
            }}
          >
            <strong>Note:</strong> Doors close at 7pm.
          </div>
        </div>
      </div>
    </div>
  );
}
