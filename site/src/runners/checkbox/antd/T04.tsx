'use client';

/**
 * checkbox-antd-T04: Enable secondary alerts (two checkboxes on page)
 *
 * Layout: isolated card centered in the viewport titled "Alert channels".
 * Inside the card are two Ant Design Checkboxes stacked vertically:
 *   1) "Primary alerts" (initially checked)
 *   2) "Secondary alerts" (initially unchecked)
 * There are no other interactive controls and no Apply/Save button; toggles apply immediately.
 * The task targets the checkbox labeled "Secondary alerts", not the already-checked "Primary alerts".
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryChecked, setPrimaryChecked] = useState(true);
  const [secondaryChecked, setSecondaryChecked] = useState(false);

  const handleSecondaryChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setSecondaryChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Alert channels" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox
          checked={primaryChecked}
          onChange={(e) => setPrimaryChecked(e.target.checked)}
          data-testid="cb-primary-alerts"
        >
          Primary alerts
        </Checkbox>
        <Checkbox
          checked={secondaryChecked}
          onChange={handleSecondaryChange}
          data-testid="cb-secondary-alerts"
        >
          Secondary alerts
        </Checkbox>
      </div>
    </Card>
  );
}
