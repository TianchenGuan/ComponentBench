'use client';

/**
 * checkbox_tristate-antd-T02: Turn off beta access (Unchecked)
 *
 * Layout: a single centered card on a blank page.
 * Inside the card is one Ant Design tri-state checkbox labeled "Beta access".
 * Initial state: Checked (checkmark is visible).
 * A subtle helper caption under the label reads "This setting can be On, Off, or Partial."
 * A "Reset all" link is shown at the bottom of the card as a non-required distractor.
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Typography } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

const { Link } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('checked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 400 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Checkbox
          checked={state === 'checked'}
          indeterminate={state === 'indeterminate'}
          data-testid="beta-access-checkbox"
        >
          Beta access
        </Checkbox>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        This setting can be On, Off, or Partial.
      </div>
      <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        <Link style={{ fontSize: 12 }}>Reset all</Link>
      </div>
    </Card>
  );
}
