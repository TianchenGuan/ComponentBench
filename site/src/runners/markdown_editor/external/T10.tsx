'use client';

/**
 * markdown_editor-external-T10: Open the markdown cheatsheet popover
 *
 * Layout: isolated_card anchored near the top-right of the viewport.
 * Component: one Markdown editor labeled "Notes".
 * Configuration:
 *   - A "Help" icon/button (question mark) is part of the editor header.
 *   - Clicking Help opens a popover overlay titled "Markdown cheatsheet" with example syntax.
 *   - The popover stays open until dismissed (click outside or press Escape).
 * Initial state: cheatsheet popover is closed; editor contains a short note but it does not matter.
 * Distractors: none.
 * Feedback: opening the popover adds an overlay layer above the editor.
 *
 * Success: The editor's overlay 'markdown_cheatsheet' is open.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `# Quick Notes

- Remember to review the docs
- Check the API limits`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (cheatsheetOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [cheatsheetOpen, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 550,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
      data-testid="md-editor-notes"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Notes</h3>
        <button
          onClick={() => setCheatsheetOpen(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#f5f5f5',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Markdown cheatsheet"
          data-testid="help-button"
        >
          ?
        </button>
      </div>

      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        data-color-mode="light"
      />

      {/* Cheatsheet popover */}
      {cheatsheetOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 999,
            }}
            onClick={() => setCheatsheetOpen(false)}
          />
          {/* Popover */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              right: 24,
              width: 320,
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              zIndex: 1000,
              padding: 16,
            }}
            data-testid="markdown_cheatsheet"
            data-overlay-id="markdown_cheatsheet"
          >
            <h4 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Markdown cheatsheet</h4>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><code># Heading</code></td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>Heading 1</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><code>**bold**</code></td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><strong>bold</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><code>*italic*</code></td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><em>italic</em></td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><code>[link](url)</code></td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>Hyperlink</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}><code>- item</code></td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>Bullet list</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 8px' }}><code>&gt; quote</code></td>
                  <td style={{ padding: '4px 8px' }}>Blockquote</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
