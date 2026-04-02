'use client';

/**
 * toggle_button_group_multi-antd-T07: Match formatting toolbar to example
 *
 * Layout: isolated_card centered in the viewport.
 *
 * Two small cards are shown side-by-side:
 *
 * 1) Left card: "Formatting"
 *    - Contains a multi-select toggle button group styled as a toolbar.
 *    - Options are labeled: Bold, Italic, Underline, Strikethrough.
 *    - Buttons show both an icon (B/I/U/S) and a text label.
 *    - Initial state: only Italic is selected.
 *
 * 2) Right card: "Example"
 *    - A static preview row visually shows which of the four buttons should be active 
 *      (highlighted in the preview).
 *    - The preview is not interactive; it is only a reference.
 *
 * No Apply/Save button; changes apply instantly.
 * Clutter is low (only the reference card is additional content).
 *
 * Success: Selected options equal exactly: Bold, Italic, Underline
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const OPTIONS = [
  { label: 'Bold', icon: BoldOutlined, key: 'B' },
  { label: 'Italic', icon: ItalicOutlined, key: 'I' },
  { label: 'Underline', icon: UnderlineOutlined, key: 'U' },
  { label: 'Strikethrough', icon: StrikethroughOutlined, key: 'S' },
];
const TARGET_SET = new Set(['Bold', 'Italic', 'Underline']);
const EXAMPLE_SET = new Set(['Bold', 'Italic', 'Underline']);

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Italic']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Card title="Formatting" style={{ width: 350 }} data-testid="formatting-group">
        <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
          Match the Example (B, I, U on; S off).
        </div>
        <Checkbox.Group
          value={selected}
          onChange={(values) => setSelected(values as string[])}
          style={{ display: 'flex', gap: 8 }}
        >
          {OPTIONS.map(({ label, icon: Icon }) => (
            <Checkbox
              key={label}
              value={label}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                background: selected.includes(label) ? '#1677ff' : '#fff',
                color: selected.includes(label) ? '#fff' : '#333',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              data-testid={`format-${label.toLowerCase()}`}
            >
              <Icon />
              {label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Card>

      <Card title="Example" style={{ width: 250 }} data-testid="example-card">
        <div style={{ display: 'flex', gap: 8 }}>
          {OPTIONS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                background: EXAMPLE_SET.has(label) ? '#52c41a' : '#f0f0f0',
                color: EXAMPLE_SET.has(label) ? '#fff' : '#999',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Icon />
              {label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
          (Reference - not interactive)
        </div>
      </Card>
    </div>
  );
}
