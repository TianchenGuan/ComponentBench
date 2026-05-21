'use client';

/**
 * checkbox_tristate-antd-T01: Enable email alerts (Checked)
 *
 * Layout: a single centered card on a blank page.
 * Inside the card is one Ant Design tri-state checkbox labeled "Email alerts".
 * The checkbox supports three states (Unchecked → Partially selected → Checked).
 * Initial state: Unchecked.
 * Below the checkbox, a small read-only line shows "Current state: Unchecked / Partial / Checked".
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue, tristateToDisplayString } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 400 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Checkbox
          checked={state === 'checked'}
          indeterminate={state === 'indeterminate'}
          data-testid="email-alerts-checkbox"
        >
          Email alerts
        </Checkbox>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
        Current state: {tristateToDisplayString(state)}
      </div>
    </Card>
  );
}
