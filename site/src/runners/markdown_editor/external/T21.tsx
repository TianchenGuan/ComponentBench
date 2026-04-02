'use client';

/**
 * markdown_editor-external-T21: Create a 2×2 markdown table
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Inventory table".
 * Guidance (mixed):
 *   - Text instructions describe the required table content.
 *   - A small "Reference preview" panel shows what the rendered table should look like (but the source markdown is not shown).
 * Configuration:
 *   - Toolbar includes an "Insert table" control that inserts a 2×2 table skeleton in markdown.
 *   - Editor is in Live (split) mode so the preview updates alongside the textarea.
 * Initial state: editor is empty.
 * Distractors: none besides the reference panel.
 * Feedback: preview renders a table when markdown pipes and header separator are correct.
 *
 * Success: Editor markdown value equals:
 *   | Item | Qty |
 *   | --- | --- |
 *   | Apples | 3 |
 *   | Oranges | 2 |
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';

function parseTableCells(line: string): string[] {
  return line.split('|').map(c => c.trim()).filter(c => c.length > 0);
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every(c => /^-{2,}$/.test(c.replace(/:/g, '')));
}

function matchesTable(md: string): boolean {
  const lines = md.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const tableLines = lines.filter(l => l.includes('|'));
  if (tableLines.length < 3) return false;

  const headerIdx = tableLines.findIndex((_, i) =>
    i + 1 < tableLines.length && isSeparatorRow(parseTableCells(tableLines[i + 1]))
  );
  if (headerIdx === -1) return false;

  const header = parseTableCells(tableLines[headerIdx]);
  const dataRows = tableLines.slice(headerIdx + 2).map(parseTableCells);

  if (header.length !== 2) return false;
  if (header[0] !== 'Item' || header[1] !== 'Qty') return false;
  if (dataRows.length < 2) return false;

  const row0 = dataRows[0];
  const row1 = dataRows[1];
  return row0[0] === 'Apples' && row0[1] === '3' &&
         row1[0] === 'Oranges' && row1[1] === '2';
}

export default function T21({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (matchesTable(value)) {
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
        width: 750,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Create a markdown table</h3>
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Editor */}
        <div style={{ flex: 1 }} data-testid="md-editor-inventory-table">
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Inventory table</h4>
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
            width: 220,
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Reference</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Item</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Apples</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>3</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Oranges</td>
                <td style={{ padding: '8px' }}>2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
