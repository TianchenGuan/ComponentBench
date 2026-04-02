'use client';

/**
 * checkbox-antd-T06: Match badge preview (visual reference)
 *
 * Layout: isolated card centered in the viewport titled "Badge indicator".
 * The card is split into two columns:
 *   - Left: an AntD Checkbox labeled "Enable badge" (initially unchecked).
 *   - Right: a non-interactive "Preview" box showing a small bell icon WITH a badge dot (the desired look).
 * There is no explicit text saying "on/off" in the preview—only the icon rendering changes. No Save/Apply button is present.
 * Distractors: none besides the preview graphic.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Badge indicator" style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          data-testid="cb-enable-badge"
        >
          Enable badge
        </Checkbox>
        <div 
          style={{ 
            padding: '12px 20px', 
            background: '#f5f5f5', 
            borderRadius: 6,
            textAlign: 'center',
          }}
          data-ref="bell-with-badge"
        >
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Preview</div>
          <Badge dot>
            <BellOutlined style={{ fontSize: 24, color: '#666' }} />
          </Badge>
        </div>
      </div>
    </Card>
  );
}
