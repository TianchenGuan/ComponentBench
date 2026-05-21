'use client';

/**
 * markdown_editor-external-T26: Match a complex visual reference
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport.
 * Component: one Markdown editor labeled "Snippet".
 * Guidance: a large "Reference preview" panel shows the target rendered markdown (no source text shown).
 * Configuration:
 *   - Editor is in Live (split) mode so your preview is visible while editing.
 *   - Toolbar present (Bold/Italic/Code/List/Quote/Task list).
 * Initial state: editor is empty.
 * Distractors: none besides the reference preview.
 * Reference preview content: a multi-line snippet containing:
 *   - A level-2 heading "Setup"
 *   - A task list with two items, where the first is checked and the second is unchecked
 *   - A blockquote line that includes inline code around the word `config`
 *
 * Success: Editor markdown value produces equivalent output.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatchesAny, normalizeMarkdown } from '../types';

const TARGET_VALUES = [
  `## Setup
- [x] Install dependencies
- [ ] Run tests
> Edit the \`config\` file to continue.`,
  `## Setup
- [x] Install dependencies
- [ ] Run tests
> Edit the \`config\` file to continue`,
];

function matchesFlexible(md: string): boolean {
  const n = normalizeMarkdown(md);
  const hasHeading = /^#{1,3}\s*Setup\s*$/m.test(n);
  const hasChecked = /- \[x\]\s*Install dependencies/i.test(n);
  const hasUnchecked = /- \[ \]\s*Run tests/i.test(n);
  const hasBlockquote = />\s*Edit the\s*`config`\s*file to continue\.?/i.test(n);
  return hasHeading && hasChecked && hasUnchecked && hasBlockquote;
}

export default function T26({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatchesAny(value, TARGET_VALUES) || matchesFlexible(value)) {
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
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Match the complex reference</h3>
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Editor */}
        <div style={{ flex: 1 }} data-testid="md-editor-snippet">
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Snippet</h4>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            preview="live"
            height={280}
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
          data-testid="ref-complex-snippet"
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Reference preview</h4>
          <div
            style={{
              padding: 16,
              background: '#fff',
              borderRadius: 4,
              border: '1px solid #eee',
              fontSize: 15,
            }}
          >
            <h2 style={{ margin: '0 0 12px 0', fontSize: 18 }}>Setup</h2>
            <ul style={{ margin: '0 0 12px 0', padding: '0 0 0 20px', listStyle: 'none' }}>
              <li style={{ marginBottom: 6 }}>
                <input type="checkbox" checked readOnly style={{ marginRight: 8 }} />
                Install dependencies
              </li>
              <li>
                <input type="checkbox" readOnly style={{ marginRight: 8 }} />
                Run tests
              </li>
            </ul>
            <blockquote style={{ margin: 0, padding: '8px 12px', borderLeft: '4px solid #ddd', background: '#f9f9f9', fontSize: 14 }}>
              Edit the <code style={{ background: '#f0f0f0', padding: '1px 4px', borderRadius: 3 }}>config</code> file to continue.
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
