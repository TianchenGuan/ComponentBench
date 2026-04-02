'use client';

/**
 * checkbox-antd-T02: Turn off remember choice (dark theme)
 *
 * Layout: isolated card centered in the viewport, rendered in dark theme (dark background with light text).
 * The card title is "Sign-in". It contains one Ant Design Checkbox labeled "Remember this choice".
 * Initial state: checked (the checkmark is already visible). There is no Save/Apply button; the checkbox state is the committed state.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);

  const handleChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Sign-in" style={{ width: 400 }}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        data-testid="cb-remember-this-choice"
      >
        Remember this choice
      </Checkbox>
    </Card>
  );
}
