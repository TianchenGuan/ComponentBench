'use client';

/**
 * checkbox_tristate-antd-T03: Match shipping checkbox to reference (Indeterminate)
 *
 * Layout: centered isolated card.
 * The card header reads "Shipping options".
 * On the left is the target Ant Design tri-state checkbox labeled "Allow partial shipments".
 * On the right side of the same row is a static reference preview: a non-clickable checkbox icon
 * with the caption "Desired state". The reference preview shows the dash (Partially selected / indeterminate).
 * Initial state of the target checkbox: Unchecked.
 * A small footer shows "Tip: you can cycle through states by clicking the checkbox."
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  return (
    <Card title="Shipping options" style={{ width: 500 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={state === 'checked'}
            indeterminate={state === 'indeterminate'}
            data-testid="allow-partial-shipments"
          >
            Allow partial shipments
          </Checkbox>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} aria-hidden="true">
          <Checkbox indeterminate disabled style={{ pointerEvents: 'none' }} />
          <span style={{ fontSize: 12, color: '#999' }}>Desired state</span>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 11, color: '#bbb', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        Tip: you can cycle through states by clicking the checkbox.
      </div>
    </Card>
  );
}
