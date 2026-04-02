'use client';

/**
 * checkbox-antd-T03: Enable tooltips (top-right placement)
 *
 * Layout: a small isolated Ant Design card anchored near the top-right corner of the viewport.
 * The card title is "Display". It contains exactly one checkbox labeled "Show tooltips".
 * Initial state: unchecked. Toggling the checkbox immediately updates the state (no Apply button).
 * Distractors: none; only static text describing tooltips.
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Display" style={{ width: 320 }}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        data-testid="cb-show-tooltips"
      >
        Show tooltips
      </Checkbox>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Display helpful tooltips when hovering over elements.
      </div>
    </Card>
  );
}
