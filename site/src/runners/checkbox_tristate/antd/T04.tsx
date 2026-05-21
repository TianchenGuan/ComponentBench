'use client';

/**
 * checkbox_tristate-antd-T04: Dark theme: enable auto-archive (Checked)
 *
 * Layout: centered isolated card on a dark theme page (dark background, light text).
 * The card contains a single Ant Design tri-state checkbox labeled "Auto-archive completed items".
 * Initial state: Partially selected (indeterminate) — the box shows a horizontal dash.
 * A small inline status pill to the right of the checkbox reads "Partial", "On", or "Off"
 * and updates instantly with state changes (feedback only).
 * No other checkboxes are present; there are no required Apply/Save buttons.
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Tag } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue, tristateToDisplayString } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  const getStatusLabel = () => {
    switch (state) {
      case 'checked': return 'On';
      case 'unchecked': return 'Off';
      case 'indeterminate': return 'Partial';
    }
  };

  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={handleClick} style={{ cursor: 'pointer', flex: 1 }}>
          <Checkbox
            checked={state === 'checked'}
            indeterminate={state === 'indeterminate'}
            data-testid="auto-archive-checkbox"
          >
            Auto-archive completed items
          </Checkbox>
        </div>
        <Tag>{getStatusLabel()}</Tag>
      </div>
    </Card>
  );
}
