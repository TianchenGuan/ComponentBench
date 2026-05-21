'use client';

/**
 * segmented_control-antd-T08: Layout mode (icons) → match preview
 *
 * Layout: small isolated card anchored near the top-right of the viewport on a dark-themed page.
 * The card is titled "Layout".
 * It contains:
 * - A "Preview" panel showing three miniature layout thumbnails (List, Grid, Calendar). One thumbnail is highlighted with a bright outline.
 * - Below the preview is an Ant Design Segmented control labeled "Layout mode".
 *   The segmented items are ICON-ONLY (no text labels), corresponding to:
 *     • List icon
 *     • Grid icon
 *     • Calendar icon
 *   The control is rendered in `small` size and the page uses compact spacing.
 *
 * Initial state: the "List" icon segment is selected.
 * Selecting a different icon updates the selection immediately (no Apply button).
 *
 * Clutter (low): the only other element is a short note: "Choose a layout to change the preview."
 *
 * Success: The "Layout mode" segmented control selection matches the highlighted thumbnail in the Preview panel.
 * (The preview highlights "Grid")
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import { Segmented } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// The preview highlights Grid
const PREVIEW_HIGHLIGHT = 'Grid';

const options = [
  { value: 'List', icon: <UnorderedListOutlined /> },
  { value: 'Grid', icon: <AppstoreOutlined /> },
  { value: 'Calendar', icon: <CalendarOutlined /> },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('List');

  const handleChange = (value: string | number) => {
    const val = String(value);
    setSelected(val);
    if (val === PREVIEW_HIGHLIGHT) {
      onSuccess();
    }
  };

  return (
    <Card title="Layout" size="small" style={{ width: 280 }}>
      {/* Preview panel */}
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Preview</Text>
        <div style={{ display: 'flex', gap: 8 }} data-testid="preview-highlight-value" data-value={PREVIEW_HIGHLIGHT}>
          {options.map(opt => (
            <div
              key={opt.value}
              style={{
                width: 48,
                height: 36,
                border: opt.value === PREVIEW_HIGHLIGHT ? '2px solid #1677ff' : '1px solid #555',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#333',
                color: opt.value === PREVIEW_HIGHLIGHT ? '#1677ff' : '#888',
              }}
            >
              {opt.icon}
            </div>
          ))}
        </div>
      </div>

      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Layout mode</Text>
      <Segmented
        data-testid="layout-mode"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        size="small"
        options={options.map(opt => ({ value: opt.value, icon: opt.icon }))}
        value={selected}
        onChange={handleChange}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 11 }}>
        Choose a layout to change the preview.
      </Text>
    </Card>
  );
}
