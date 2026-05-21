'use client';

/**
 * switch-antd-T04: Match reference: Auto-sync
 *
 * Layout: isolated_card with two side-by-side panels centered in the viewport.
 * Left panel: "Desired state" shows a small, non-interactive preview of a switch (visual reference) and the caption "Desired state".
 * Right panel: "Your setting" contains the interactive Ant Design Switch labeled "Auto-sync".
 * Initial state: the interactive "Auto-sync" switch starts in the opposite state from the preview (preview is ON; interactive switch is OFF).
 * There are no additional inputs; the intent is to use the visual preview to decide whether the switch should be ON or OFF.
 * Feedback: the interactive switch updates immediately when toggled.
 */

import React, { useState } from 'react';
import { Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);
  const referenceState = true; // Preview is ON

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (newChecked === referenceState) {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Card title="Desired state" style={{ width: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Switch
            checked={referenceState}
            disabled
            data-state={referenceState ? 'on' : 'off'}
            aria-checked={referenceState}
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#999' }}>
          Reference
        </div>
      </Card>
      <Card title="Your setting" style={{ width: 250 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Auto-sync</span>
          <Switch
            checked={checked}
            onChange={handleChange}
            data-testid="auto-sync-switch"
            aria-checked={checked}
          />
        </div>
      </Card>
    </div>
  );
}
