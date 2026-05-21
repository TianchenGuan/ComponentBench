'use client';

/**
 * checkbox-antd-T05: Enable compact density mode (compact + small)
 *
 * Layout: isolated card centered in the viewport titled "Layout density".
 * Spacing mode is compact and the checkbox is rendered in a smaller size tier (tighter padding and a smaller square box).
 * The card contains one checkbox labeled "Compact density mode" with a short description below it.
 * Initial state: unchecked. No Save/Apply button; the checkbox state is committed immediately.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Checkbox, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            controlInteractiveSize: 14,
          },
        },
      }}
    >
      <Card 
        title="Layout density" 
        style={{ width: 360 }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <Checkbox
          checked={checked}
          onChange={handleChange}
          data-testid="cb-compact-density-mode"
          style={{ fontSize: 13 }}
        >
          Compact density mode
        </Checkbox>
        <div style={{ marginTop: 6, fontSize: 11, color: '#999' }}>
          Reduce spacing between elements for a denser layout.
        </div>
      </Card>
    </ConfigProvider>
  );
}
